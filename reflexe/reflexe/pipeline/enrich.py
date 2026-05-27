"""Enrichissement croisé des prospects.

Exécute les sources d'enrichissement configurées (Pappers d'abord — il peut
fournir le site web —, puis le site public), déduit un email probable
`prenom.nom@domaine` si nécessaire, et vérifie chaque email (syntaxe + MX).
Une source défaillante n'interrompt jamais le traitement des autres prospects.
"""

from __future__ import annotations

import asyncio
from urllib.parse import urlparse

from loguru import logger

from reflexe.models import Prospect, SourceType, StatutPipeline
from reflexe.pipeline.clean import deviner_email, verifier_email, verifier_syntaxe_email
from reflexe.ratelimit import ClientPoli
from reflexe.sources.base import BaseSource

# Pappers avant Website : Pappers peut révéler le site web qu'on scrapera ensuite.
_ORDRE = {SourceType.PAPPERS: 0, SourceType.WEBSITE: 1}


def _domaine_site(site_web: str) -> str:
    if not site_web:
        return ""
    if not site_web.startswith(("http://", "https://")):
        site_web = "https://" + site_web
    return urlparse(site_web).netloc.lower().removeprefix("www.")


async def _verifier_async(email: str) -> bool:
    return await asyncio.to_thread(verifier_email, email)


async def _enrichir_un(
    prospect: Prospect, sources: list[BaseSource], client: ClientPoli
) -> None:
    for source in sources:
        try:
            await source.enrichir(prospect, client)
        except Exception as exc:  # noqa: BLE001 — robustesse : on continue
            logger.warning(
                "Enrichissement {} échoué pour {} : {}",
                source.type.value,
                prospect.entreprise.siren,
                exc,
            )

    # Déduction d'email par pattern si toujours rien.
    if not prospect.email and prospect.prenom and prospect.nom_dirigeant:
        domaine = _domaine_site(prospect.entreprise.site_web)
        if domaine:
            devine = deviner_email(prospect.prenom, prospect.nom_dirigeant, domaine)
            if devine and verifier_syntaxe_email(devine) and await _verifier_async(devine):
                prospect.email = devine
                prospect.email_verifie = True
                prospect.email_source = SourceType.EMAIL_PATTERN.value
                prospect.provenance["email"] = SourceType.EMAIL_PATTERN.value

    # Vérification de l'email existant (MX).
    if prospect.email and not prospect.email_verifie:
        prospect.email_verifie = await _verifier_async(prospect.email)

    if prospect.statut_pipeline == StatutPipeline.NETTOYE:
        prospect.statut_pipeline = StatutPipeline.ENRICHI


async def enrichir_prospects(
    prospects: list[Prospect],
    sources_enrichissement: list[BaseSource],
    client: ClientPoli,
) -> dict[str, int]:
    """Enrichit tous les prospects (concurrence bornée par le ClientPoli)."""
    sources = sorted(
        sources_enrichissement, key=lambda s: _ORDRE.get(s.type, 99)
    )
    await asyncio.gather(*(_enrichir_un(p, sources, client) for p in prospects))

    avec_email = sum(1 for p in prospects if p.email)
    verifies = sum(1 for p in prospects if p.email_verifie)
    return {
        "emails_trouves": avec_email,
        "emails_verifies": verifies,
        "non_verifiables": avec_email - verifies,
    }
