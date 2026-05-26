"""Interface commune des bases vectorielles.

Abstraire derrière `BaseVectorStore` permet de déployer en local (SQLite,
simple et souverain) ou en mutualisé (Supabase pgvector) sans changer le code
d'ingestion ni de récupération.
"""

from __future__ import annotations

import abc

from sensor.config import Settings
from sensor.models import Chunk, ChunkResultat, ClientConfig, Document


class BaseVectorStore(abc.ABC):
    """Contrat d'une base vectorielle mono-tenant (une instance par client)."""

    @abc.abstractmethod
    def add_chunks(self, chunks: list[Chunk], embeddings: list[list[float]]) -> None:
        """Ajoute des chunks et leurs vecteurs. `len(chunks) == len(embeddings)`."""

    @abc.abstractmethod
    def search(
        self, embedding_requete: list[float], top_k: int, requete_texte: str | None = None
    ) -> list[ChunkResultat]:
        """Recherche les `top_k` chunks les plus proches (score cosinus décroissant).

        `requete_texte` est fourni pour permettre une recherche hybride
        (sémantique + mot-clé) si le backend le supporte.
        """

    @abc.abstractmethod
    def upsert_document(self, document: Document) -> None:
        """Enregistre/actualise les métadonnées d'un document."""

    @abc.abstractmethod
    def get_document_hash(self, id_document: str) -> str | None:
        """Retourne le hash connu d'un document (None s'il n'a jamais été ingéré)."""

    @abc.abstractmethod
    def delete_document(self, id_document: str) -> int:
        """Supprime un document et tous ses chunks. Retourne le nb de chunks supprimés."""

    @abc.abstractmethod
    def list_documents(self) -> list[Document]:
        """Liste les documents ingérés pour ce client."""

    @abc.abstractmethod
    def count_chunks(self) -> int:
        """Nombre total de chunks indexés."""

    @abc.abstractmethod
    def reset(self) -> None:
        """Vide entièrement la base vectorielle du client (réindexation complète)."""

    def close(self) -> None:
        """Libère les ressources (connexions). Surchargé si nécessaire."""


def construire_vectorstore(
    config: ClientConfig, settings: Settings, dimension: int
) -> BaseVectorStore:
    """Fabrique la base vectorielle adaptée à la configuration du client."""
    if config.vectorstore == "sqlite":
        from sensor.vectorstore.sqlite_store import SQLiteVectorStore

        return SQLiteVectorStore(
            chemin=settings.chemin_base_vectorielle(config.id_client),
            id_client=config.id_client,
            dimension=dimension,
        )
    if config.vectorstore == "supabase":
        from sensor.vectorstore.supabase_store import SupabaseVectorStore

        return SupabaseVectorStore(
            url=settings.supabase_url,
            key=settings.supabase_key,
            id_client=config.id_client,
            dimension=dimension,
        )
    raise ValueError(f"Backend de base vectorielle inconnu : {config.vectorstore!r}")
