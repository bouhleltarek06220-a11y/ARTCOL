"""Rédaction des messages de prospection personnalisés via Claude (modèle qualité).

Seuls les prospects au-dessus du seuil de score de la mission sont personnalisés.
Le message s'appuie uniquement sur les données réelles du prospect (zéro invention).
"""

from __future__ import annotations

import asyncio

from reflexe.llm import ClaudeLLM
from reflexe.models import Mission, Prospect, StatutPipeline


async def personnaliser(
    prospects: list[Prospect], mission: Mission, llm: ClaudeLLM
) -> int:
    """Génère un message pour chaque prospect retenu. Renvoie le nombre traité."""
    cibles = [
        p
        for p in prospects
        if p.statut_pipeline == StatutPipeline.SCORE
        and p.score_icp >= mission.seuil_score_min
    ]

    async def _un(p: Prospect) -> None:
        message = await llm.generer_message(p, mission.modele_message)
        if message:
            p.message_genere = message
        p.statut_pipeline = StatutPipeline.PERSONNALISE

    await asyncio.gather(*(_un(p) for p in cibles))
    return len(cibles)
