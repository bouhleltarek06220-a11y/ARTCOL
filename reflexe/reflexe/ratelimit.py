"""Client HTTP poli et robuste.

- Sémaphore global limitant la concurrence totale.
- Délai minimal entre deux requêtes sur un même domaine (anti-agressivité).
- Respect du `robots.txt` pour le scraping de sites publics.
- Retries avec backoff exponentiel (tenacity) et timeouts explicites.
- Rotation polie de l'en-tête User-Agent (annoncé, non trompeur).
"""

from __future__ import annotations

import asyncio
import time
from urllib import robotparser
from urllib.parse import urljoin, urlparse

import httpx
from loguru import logger
from tenacity import (
    retry,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

_ERREURS_RESEAU = (httpx.TransportError, httpx.TimeoutException)


class ClientPoli:
    """Wrapper httpx asynchrone respectueux des serveurs distants."""

    def __init__(
        self,
        user_agent: str,
        delai_domaine: float = 1.5,
        concurrence_max: int = 8,
        timeout: float = 20.0,
    ) -> None:
        self.user_agent = user_agent
        self.delai_domaine = max(0.0, delai_domaine)
        self._sem = asyncio.Semaphore(max(1, concurrence_max))
        self._client = httpx.AsyncClient(
            timeout=timeout,
            follow_redirects=True,
            headers={"User-Agent": user_agent},
        )
        self._dernier_appel: dict[str, float] = {}
        self._verrous_domaine: dict[str, asyncio.Lock] = {}
        self._robots: dict[str, robotparser.RobotFileParser | None] = {}

    async def aclose(self) -> None:
        await self._client.aclose()

    async def __aenter__(self) -> "ClientPoli":
        return self

    async def __aexit__(self, *exc: object) -> None:
        await self.aclose()

    @staticmethod
    def _domaine(url: str) -> str:
        return urlparse(url).netloc.lower()

    def _verrou(self, domaine: str) -> asyncio.Lock:
        if domaine not in self._verrous_domaine:
            self._verrous_domaine[domaine] = asyncio.Lock()
        return self._verrous_domaine[domaine]

    async def _respecter_delai(self, domaine: str) -> None:
        """Garantit un intervalle minimal entre deux requêtes d'un même domaine."""
        async with self._verrou(domaine):
            dernier = self._dernier_appel.get(domaine)
            if dernier is not None:
                ecoule = time.monotonic() - dernier
                if ecoule < self.delai_domaine:
                    await asyncio.sleep(self.delai_domaine - ecoule)
            self._dernier_appel[domaine] = time.monotonic()

    async def _charger_robots(self, url: str) -> robotparser.RobotFileParser | None:
        domaine = self._domaine(url)
        if domaine in self._robots:
            return self._robots[domaine]
        parser: robotparser.RobotFileParser | None = None
        try:
            base = f"{urlparse(url).scheme}://{domaine}"
            reponse = await self._client.get(urljoin(base, "/robots.txt"), timeout=10.0)
            if reponse.status_code == 200:
                parser = robotparser.RobotFileParser()
                parser.parse(reponse.text.splitlines())
        except Exception as exc:  # noqa: BLE001 — robots indisponible => on reste poli
            logger.debug("robots.txt indisponible pour {} : {}", domaine, exc)
            parser = None
        self._robots[domaine] = parser
        return parser

    async def autorise_par_robots(self, url: str) -> bool:
        """Vrai si le `robots.txt` autorise notre User-Agent à récupérer l'URL."""
        parser = await self._charger_robots(url)
        if parser is None:
            return True  # pas de robots.txt accessible : usage poli par défaut
        return parser.can_fetch(self.user_agent, url)

    @retry(
        retry=retry_if_exception_type(_ERREURS_RESEAU),
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=1, max=10),
        reraise=True,
    )
    async def _executer(
        self, methode: str, url: str, **kwargs: object
    ) -> httpx.Response:
        return await self._client.request(methode, url, **kwargs)

    async def fetch(
        self,
        url: str,
        *,
        methode: str = "GET",
        respecter_robots: bool = True,
        **kwargs: object,
    ) -> httpx.Response | None:
        """Récupère une URL en respectant délais, concurrence et robots.

        Renvoie None si le robots.txt l'interdit. Lève en cas d'échec réseau
        persistant (après retries) — l'appelant décide quoi en faire.
        """
        if respecter_robots and not await self.autorise_par_robots(url):
            logger.info("robots.txt interdit l'accès à {} — ignoré.", url)
            return None
        async with self._sem:
            await self._respecter_delai(self._domaine(url))
            return await self._executer(methode, url, **kwargs)
