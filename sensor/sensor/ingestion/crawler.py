"""Crawl poli et respectueux du site public d'un client.

Garde-fous de conformité :
- Respect strict du `robots.txt` (chaque URL est vérifiée avant requête).
- Délai configurable entre requêtes vers un même domaine.
- Restriction au domaine de départ (pas de scraping de sites tiers).
- Profondeur limitée et plafond du nombre de pages.
- User-Agent identifiable.
"""

from __future__ import annotations

import asyncio
from dataclasses import dataclass, field
from urllib.parse import urldefrag, urljoin, urlparse
from urllib.robotparser import RobotFileParser

import httpx
from loguru import logger

from sensor.ingestion.loaders import extraire_texte_html

USER_AGENT = "SensorBot/0.1 (+assistant IA documentaire ; respecte robots.txt)"


@dataclass
class PageCrawlee:
    url: str
    titre: str
    texte: str


@dataclass
class _Etat:
    visitees: set[str] = field(default_factory=set)
    a_visiter: list[tuple[str, int]] = field(default_factory=list)


class Crawler:
    """Crawler asynchrone borné à un domaine."""

    def __init__(
        self,
        url_depart: str,
        profondeur_max: int = 2,
        max_pages: int = 50,
        delai_secondes: float = 1.0,
        timeout: float = 15.0,
    ) -> None:
        self.url_depart = url_depart
        self.profondeur_max = profondeur_max
        self.max_pages = max_pages
        self.delai_secondes = delai_secondes
        self.timeout = timeout
        parse = urlparse(url_depart)
        if parse.scheme not in ("http", "https") or not parse.netloc:
            raise ValueError(f"URL de départ invalide : {url_depart!r}")
        self.domaine = parse.netloc
        self.base_scheme = parse.scheme
        self._robots = RobotFileParser()
        self._robots_charge = False

    async def _charger_robots(self, client: httpx.AsyncClient) -> None:
        url_robots = f"{self.base_scheme}://{self.domaine}/robots.txt"
        try:
            rep = await client.get(url_robots)
            if rep.status_code == 200:
                self._robots.parse(rep.text.splitlines())
            else:
                # Pas de robots.txt accessible : on autorise par défaut, prudemment.
                self._robots.allow_all = True
        except httpx.HTTPError:
            self._robots.allow_all = True
        self._robots_charge = True
        logger.debug("robots.txt traité pour {}", self.domaine)

    def _autorise(self, url: str) -> bool:
        if not self._robots_charge:
            return True
        try:
            return self._robots.can_fetch(USER_AGENT, url)
        except Exception:  # noqa: BLE001 — robotparser peut lever sur des entrées exotiques
            return True

    def _meme_domaine(self, url: str) -> bool:
        return urlparse(url).netloc == self.domaine

    async def _recuperer_sitemap(self, client: httpx.AsyncClient) -> list[str]:
        """Récupère les URLs du sitemap.xml si présent (amorçage de file)."""
        urls: list[str] = []
        for chemin in ("/sitemap.xml", "/sitemap_index.xml"):
            try:
                rep = await client.get(f"{self.base_scheme}://{self.domaine}{chemin}")
                if rep.status_code != 200:
                    continue
                from bs4 import BeautifulSoup

                soup = BeautifulSoup(rep.text, "html.parser")
                for loc in soup.find_all("loc"):
                    u = (loc.text or "").strip()
                    if u and self._meme_domaine(u):
                        urls.append(u)
            except httpx.HTTPError:
                continue
        return urls[: self.max_pages]

    async def crawl(self) -> list[PageCrawlee]:
        """Lance le crawl et renvoie les pages collectées (texte extrait)."""
        pages: list[PageCrawlee] = []
        etat = _Etat()
        async with httpx.AsyncClient(
            headers={"User-Agent": USER_AGENT},
            timeout=self.timeout,
            follow_redirects=True,
        ) as client:
            await self._charger_robots(client)

            # Amorçage : sitemap si dispo, sinon l'URL de départ.
            amorces = await self._recuperer_sitemap(client)
            if amorces:
                etat.a_visiter.extend((u, 0) for u in amorces)
            etat.a_visiter.append((self.url_depart, 0))

            while etat.a_visiter and len(pages) < self.max_pages:
                url, profondeur = etat.a_visiter.pop(0)
                url, _ = urldefrag(url)
                if url in etat.visitees:
                    continue
                etat.visitees.add(url)

                if not self._meme_domaine(url) or not self._autorise(url):
                    logger.debug("Ignorée (hors domaine ou robots.txt) : {}", url)
                    continue

                page = await self._recuperer_page(client, url, profondeur, etat)
                if page is not None:
                    pages.append(page)
                # Délai poli entre deux requêtes vers le même domaine.
                await asyncio.sleep(self.delai_secondes)

        logger.info("Crawl terminé : {} pages collectées sur {}.", len(pages), self.domaine)
        return pages

    async def _recuperer_page(
        self, client: httpx.AsyncClient, url: str, profondeur: int, etat: _Etat
    ) -> PageCrawlee | None:
        try:
            rep = await client.get(url)
        except httpx.HTTPError as exc:
            logger.warning("Échec de récupération de {} : {}", url, exc)
            return None
        if rep.status_code != 200:
            return None
        content_type = rep.headers.get("content-type", "")
        if "text/html" not in content_type:
            return None

        html = rep.text
        texte = extraire_texte_html(html)

        # Découverte des liens internes pour les niveaux suivants.
        if profondeur < self.profondeur_max:
            from bs4 import BeautifulSoup

            soup = BeautifulSoup(html, "html.parser")
            for a in soup.find_all("a", href=True):
                lien = urljoin(url, a["href"])
                lien, _ = urldefrag(lien)
                if self._meme_domaine(lien) and lien not in etat.visitees:
                    etat.a_visiter.append((lien, profondeur + 1))

        titre = ""
        if texte.startswith("# "):
            titre = texte.split("\n", 1)[0][2:].strip()
        return PageCrawlee(url=url, titre=titre or url, texte=texte)


def crawler_site(
    url: str,
    profondeur_max: int = 2,
    max_pages: int = 50,
    delai_secondes: float = 1.0,
) -> list[PageCrawlee]:
    """Wrapper synchrone du crawler (pratique pour la CLI et le pipeline)."""
    crawler = Crawler(
        url_depart=url,
        profondeur_max=profondeur_max,
        max_pages=max_pages,
        delai_secondes=delai_secondes,
    )
    return asyncio.run(crawler.crawl())
