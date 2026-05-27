"""Source d'enrichissement : site web public de l'entreprise.

Scrape uniquement les pages publiques (accueil, contact, mentions légales…) en
respectant le `robots.txt`. Extrait emails professionnels publics, téléphones et
liens réseaux sociaux affichés sur le site. N'accède JAMAIS à LinkedIn ou à un
réseau social : on ne fait que relever le lien s'il figure sur le site.
"""

from __future__ import annotations

import re
from urllib.parse import urljoin, urlparse

from loguru import logger
from selectolax.parser import HTMLParser

from reflexe.models import Prospect, SourceType
from reflexe.ratelimit import ClientPoli
from reflexe.sources.base import BaseSource

_RX_EMAIL = re.compile(r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}")
_RX_TEL = re.compile(r"(?:(?:\+33|0033|0)\s?[1-9])(?:[\s.\-]?\d{2}){4}")
_EXT_FICHIER = (".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".css", ".js")
_PREFIXES_PRO = ("contact", "info", "hello", "bonjour", "commercial", "accueil")
_PAGES_CANDIDATES = (
    "",
    "/contact",
    "/contactez-nous",
    "/nous-contacter",
    "/mentions-legales",
    "/a-propos",
    "/equipe",
)
_RESEAUX = ("linkedin.com", "facebook.com", "instagram.com", "twitter.com", "x.com", "youtube.com")
_MAX_PAGES = 6


def _normaliser_url(url: str) -> str:
    url = (url or "").strip()
    if not url:
        return ""
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
    return url


def _filtrer_emails(emails: set[str], domaine_site: str) -> list[str]:
    propres = []
    for e in emails:
        e = e.strip().strip(".").lower()
        if e.lower().endswith(_EXT_FICHIER):
            continue
        if "@" not in e or e.startswith("@"):
            continue
        if any(x in e for x in ("example.", "sentry.", "wixpress.", "@2x", ".png")):
            continue
        propres.append(e)
    # Tri : domaine du site d'abord, puis adresses « pro » génériques.
    def _cle(email: str) -> tuple[int, int]:
        meme_domaine = 0 if domaine_site and domaine_site in email else 1
        pro = 0 if email.split("@")[0] in _PREFIXES_PRO else 1
        return (meme_domaine, pro)

    return sorted(dict.fromkeys(propres), key=_cle)


def _extraire(html: str, base_url: str) -> tuple[set[str], set[str], str]:
    """Renvoie (emails, téléphones, lien_linkedin) trouvés dans une page."""
    emails: set[str] = set(_RX_EMAIL.findall(html))
    tels: set[str] = {t.strip() for t in _RX_TEL.findall(html)}
    linkedin = ""
    try:
        arbre = HTMLParser(html)
        for a in arbre.css("a[href]"):
            href = a.attributes.get("href") or ""
            if href.startswith("mailto:"):
                emails.add(href[len("mailto:") :].split("?")[0])
            elif href.startswith("tel:"):
                tels.add(href[len("tel:") :])
            else:
                lien = urljoin(base_url, href)
                if "linkedin.com" in lien and not linkedin:
                    linkedin = lien
    except Exception as exc:  # noqa: BLE001 — HTML cassé : on garde ce que la regex a trouvé
        logger.debug("Parsing HTML partiel pour {} : {}", base_url, exc)
    return emails, tels, linkedin


class SourceWebsite(BaseSource):
    type = SourceType.WEBSITE
    peut_collecter = False
    peut_enrichir = True

    async def enrichir(self, prospect: Prospect, client: ClientPoli) -> Prospect:
        base = _normaliser_url(prospect.entreprise.site_web)
        if not base:
            return prospect  # pas de site connu : rien à scraper
        domaine = urlparse(base).netloc.lower().lstrip("www.")

        emails: set[str] = set()
        tels: set[str] = set()
        linkedin = ""
        for chemin in _PAGES_CANDIDATES[:_MAX_PAGES]:
            url = urljoin(base, chemin) if chemin else base
            try:
                reponse = await client.fetch(url, respecter_robots=True)
            except Exception as exc:  # noqa: BLE001
                logger.debug("Page inaccessible {} : {}", url, exc)
                continue
            if reponse is None or reponse.status_code != 200:
                continue
            if "text/html" not in reponse.headers.get("content-type", "text/html"):
                continue
            e, t, li = _extraire(reponse.text, url)
            emails |= e
            tels |= t
            linkedin = linkedin or li

        emails_propres = _filtrer_emails(emails, domaine)
        if emails_propres and not prospect.email:
            prospect.email = emails_propres[0]
            prospect.email_source = SourceType.WEBSITE.value
            prospect.provenance["email"] = SourceType.WEBSITE.value
        if tels and not prospect.entreprise.telephone:
            prospect.entreprise.telephone = sorted(tels)[0]
            prospect.provenance["telephone"] = SourceType.WEBSITE.value
        if linkedin and not prospect.linkedin_entreprise_public:
            prospect.linkedin_entreprise_public = linkedin
            prospect.provenance["linkedin_entreprise_public"] = SourceType.WEBSITE.value
        return prospect
