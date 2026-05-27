"""Push des prospects validés vers Brevo (création/màj de contact + ajout liste).

Ne pousse QUE les prospects au statut `prêt_envoi` (au-dessus du seuil de score,
email présent, jamais en liste d'exclusion). Le mode `dry_run` simule sans rien
envoyer et indique ce qui serait poussé.
"""

from __future__ import annotations

import httpx
from loguru import logger
from tenacity import retry, retry_if_exception_type, stop_after_attempt, wait_exponential

from reflexe.models import Prospect, StatutPipeline

_API_CONTACTS = "https://api.brevo.com/v3/contacts"


class BrevoClient:
    """Client minimal de l'API Brevo (contacts)."""

    def __init__(self, api_key: str, list_ids: list[int] | None = None) -> None:
        self.api_key = api_key
        self.list_ids = list_ids or []
        self._client = httpx.AsyncClient(
            timeout=20.0,
            headers={
                "api-key": api_key,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        )

    async def aclose(self) -> None:
        await self._client.aclose()

    async def __aenter__(self) -> "BrevoClient":
        return self

    async def __aexit__(self, *exc: object) -> None:
        await self.aclose()

    @staticmethod
    def _payload(prospect: Prospect, list_ids: list[int]) -> dict:
        e = prospect.entreprise
        attributs = {
            "PRENOM": prospect.prenom,
            "NOM": prospect.nom_dirigeant,
            "ENTREPRISE": e.raison_sociale,
            "VILLE": e.ville,
            "SCORE_ICP": prospect.score_icp,
            "MESSAGE_REFLEXE": prospect.message_genere,
        }
        attributs = {k: v for k, v in attributs.items() if v not in ("", None)}
        payload: dict = {
            "email": prospect.email,
            "attributes": attributs,
            "updateEnabled": True,  # met à jour si le contact existe déjà
        }
        if list_ids:
            payload["listIds"] = list_ids
        return payload

    @retry(
        retry=retry_if_exception_type((httpx.TransportError, httpx.TimeoutException)),
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=1, max=8),
        reraise=True,
    )
    async def _post(self, payload: dict) -> httpx.Response:
        return await self._client.post(_API_CONTACTS, json=payload)

    async def upsert_contact(self, prospect: Prospect, list_ids: list[int]) -> str:
        """Crée ou met à jour le contact. Renvoie un statut court."""
        try:
            reponse = await self._post(self._payload(prospect, list_ids))
        except Exception as exc:  # noqa: BLE001
            logger.warning("Brevo : échec réseau pour {} : {}", prospect.email, exc)
            return "erreur"
        if reponse.status_code in (200, 201):
            return "créé"
        if reponse.status_code == 204:
            return "mis_à_jour"
        logger.warning(
            "Brevo : HTTP {} pour {} — {}",
            reponse.status_code,
            prospect.email,
            reponse.text[:200],
        )
        return "erreur"


def _eligibles(prospects: list[Prospect]) -> list[Prospect]:
    return [
        p
        for p in prospects
        if p.statut_pipeline == StatutPipeline.PRET_ENVOI and p.email
    ]


async def pousser_prospects(
    prospects: list[Prospect],
    api_key: str,
    list_ids: list[int],
    dry_run: bool = False,
) -> dict[str, int]:
    """Pousse les prospects `prêt_envoi` vers Brevo (ou simule si dry_run)."""
    cibles = _eligibles(prospects)
    stats = {"eligibles": len(cibles), "pousses": 0, "erreurs": 0, "simules": 0}

    if dry_run:
        stats["simules"] = len(cibles)
        for p in cibles:
            logger.info(
                "[dry-run] Brevo : pousserait {} ({} — score {})",
                p.email,
                p.entreprise.raison_sociale,
                p.score_icp,
            )
        return stats

    if not api_key:
        logger.warning("BREVO_API_KEY absente : push Brevo ignoré.")
        return stats

    async with BrevoClient(api_key, list_ids) as brevo:
        for p in cibles:
            resultat = await brevo.upsert_contact(p, list_ids)
            if resultat in ("créé", "mis_à_jour"):
                p.statut_pipeline = StatutPipeline.POUSSE_BREVO
                stats["pousses"] += 1
            else:
                stats["erreurs"] += 1
    return stats
