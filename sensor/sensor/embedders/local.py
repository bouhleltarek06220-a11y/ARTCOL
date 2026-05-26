"""Embeddings locaux via sentence-transformers (mode souveraineté).

Les documents du client ne quittent jamais la machine : la vectorisation est
exécutée en local par un modèle multilingue. Adapté au RGPD et au mode 100 %
local par défaut de SENSOR.
"""

from __future__ import annotations

import threading

from loguru import logger

from sensor.embedders.base import BaseEmbedder

#: Modèle multilingue léger et de bonne qualité (384 dimensions).
MODELE_DEFAUT = "paraphrase-multilingual-MiniLM-L12-v2"


class LocalEmbedder(BaseEmbedder):
    """Embedder s'appuyant sur un modèle sentence-transformers chargé en mémoire.

    Le chargement du modèle (téléchargé au premier usage puis mis en cache) est
    paresseux et thread-safe : on ne paie le coût mémoire/CPU qu'au premier appel.
    """

    def __init__(self, modele: str | None = None) -> None:
        self.nom_modele = modele or MODELE_DEFAUT
        self._modele = None  # chargé paresseusement
        self._verrou = threading.Lock()
        # Dimension connue d'avance pour le modèle par défaut ; sinon déterminée
        # au premier chargement.
        self.dimension = 384 if self.nom_modele == MODELE_DEFAUT else 0

    def _charger(self):
        if self._modele is None:
            with self._verrou:
                if self._modele is None:
                    logger.info("Chargement du modèle d'embeddings local : {}", self.nom_modele)
                    # Import local : la dépendance n'est requise que pour ce backend.
                    from sentence_transformers import SentenceTransformer

                    self._modele = SentenceTransformer(self.nom_modele)
                    self.dimension = int(self._modele.get_sentence_embedding_dimension())
                    logger.info("Modèle chargé (dimension={}).", self.dimension)
        return self._modele

    def embed_documents(self, textes: list[str]) -> list[list[float]]:
        if not textes:
            return []
        modele = self._charger()
        vecteurs = modele.encode(
            textes,
            batch_size=32,
            show_progress_bar=False,
            convert_to_numpy=True,
            normalize_embeddings=False,  # la normalisation est gérée par le vectorstore
        )
        return [v.astype("float32").tolist() for v in vecteurs]

    def embed_query(self, texte: str) -> list[float]:
        modele = self._charger()
        vecteur = modele.encode(
            [texte], convert_to_numpy=True, normalize_embeddings=False
        )[0]
        return vecteur.astype("float32").tolist()
