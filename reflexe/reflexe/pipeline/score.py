"""Scoring ICP des prospects via Claude (modèle léger/rapide).

Chaque prospect reçoit un score 0-100 d'adéquation au profil client idéal et une
justification courte. Un échec de scoring d'un prospect n'arrête pas les autres
(le LLM renvoie alors un score 0 explicite).
"""

from __future__ import annotations

import asyncio

from reflexe.llm import ClaudeLLM
from reflexe.models import Mission, Prospect, StatutPipeline


async def scorer(prospects: list[Prospect], mission: Mission, llm: ClaudeLLM) -> None:
    """Note tous les prospects non exclus (concurrence bornée par le client LLM)."""
    cibles = [p for p in prospects if p.statut_pipeline != StatutPipeline.EXCLU]

    async def _un(p: Prospect) -> None:
        score, justification = await llm.scorer_prospect(p, mission.description_icp)
        p.score_icp = score
        p.justification_score = justification
        p.statut_pipeline = StatutPipeline.SCORE

    await asyncio.gather(*(_un(p) for p in cibles))
