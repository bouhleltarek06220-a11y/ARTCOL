"""Récupération des passages pertinents dans la base vectorielle du client.

Le retriever encapsule la logique du garde-fou amont : si le meilleur score de
similarité est inférieur au seuil configuré, la question est signalée
« hors-scope » et l'answerer répondra avec le message de repli sans solliciter
inutilement Claude.
"""

from __future__ import annotations

from dataclasses import dataclass

from loguru import logger

from sensor.embedders.base import BaseEmbedder
from sensor.models import ChunkResultat, ClientConfig
from sensor.vectorstore.base import BaseVectorStore


@dataclass
class ResultatRecherche:
    """Résultat d'une recherche : passages trouvés + verdict hors-scope."""

    passages: list[ChunkResultat]
    hors_scope: bool
    meilleur_score: float


class Retriever:
    """Recherche top-k avec application du seuil de similarité minimal."""

    def __init__(
        self,
        config: ClientConfig,
        embedder: BaseEmbedder,
        store: BaseVectorStore,
    ) -> None:
        self.config = config
        self.embedder = embedder
        self.store = store

    def rechercher(self, question: str) -> ResultatRecherche:
        """Vectorise la question, interroge la base et applique le seuil."""
        question = question.strip()
        if not question:
            return ResultatRecherche(passages=[], hors_scope=True, meilleur_score=0.0)

        vecteur = self.embedder.embed_query(question)
        passages = self.store.search(
            embedding_requete=vecteur,
            top_k=self.config.top_k,
            requete_texte=question if self.config.recherche_hybride else None,
        )

        if not passages:
            logger.debug("Aucun passage trouvé pour la question.")
            return ResultatRecherche(passages=[], hors_scope=True, meilleur_score=0.0)

        meilleur_score = max(p.score for p in passages)
        hors_scope = meilleur_score < self.config.seuil_similarite_min
        if hors_scope:
            logger.info(
                "Question hors-scope (meilleur score {:.3f} < seuil {:.3f}).",
                meilleur_score,
                self.config.seuil_similarite_min,
            )
            return ResultatRecherche(
                passages=passages, hors_scope=True, meilleur_score=meilleur_score
            )

        # On ne conserve que les passages au-dessus du seuil pour le contexte.
        pertinents = [
            p for p in passages if p.score >= self.config.seuil_similarite_min
        ]
        return ResultatRecherche(
            passages=pertinents or passages[:1],
            hors_scope=False,
            meilleur_score=meilleur_score,
        )
