"""Interface commune des fournisseurs d'embeddings.

Abstraire derrière `BaseEmbedder` permet de basculer entre embeddings locaux
(souveraineté) et embeddings via API (qualité) sans toucher au reste du code.
"""

from __future__ import annotations

import abc

from sensor.config import Settings
from sensor.models import ClientConfig


class BaseEmbedder(abc.ABC):
    """Contrat minimal que tout fournisseur d'embeddings doit respecter."""

    #: Dimension des vecteurs produits (doit être stable pour un même backend/modèle).
    dimension: int
    #: Nom du modèle effectivement utilisé (pour les logs et le diagnostic).
    nom_modele: str

    @abc.abstractmethod
    def embed_documents(self, textes: list[str]) -> list[list[float]]:
        """Vectorise une liste de passages (ingestion). Retourne un vecteur par texte."""

    @abc.abstractmethod
    def embed_query(self, texte: str) -> list[float]:
        """Vectorise une requête utilisateur (recherche)."""


def construire_embedder(config: ClientConfig, settings: Settings) -> BaseEmbedder:
    """Fabrique l'embedder adapté à la configuration du client.

    Import paresseux des backends : on ne charge sentence-transformers (lourd)
    que si le client utilise le mode local, et on n'exige la clé Voyage que pour
    le mode api.
    """
    if config.embedder == "local":
        from sensor.embedders.local import LocalEmbedder

        return LocalEmbedder(modele=config.embedder_modele)
    if config.embedder == "api":
        from sensor.embedders.api import VoyageEmbedder

        return VoyageEmbedder(
            api_key=settings.voyage_api_key,
            modele=config.embedder_modele or settings.voyage_model,
        )
    raise ValueError(f"Backend d'embeddings inconnu : {config.embedder!r}")
