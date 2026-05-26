"""Base vectorielle Supabase pgvector (déploiements mutualisés).

Implémentation via l'API PostgREST de Supabase (httpx), sans SDK lourd. La
recherche de similarité utilise une fonction RPC SQL `sensor_match_chunks` que
l'on installe une fois côté Supabase (le SQL est fourni dans `SQL_INSTALLATION`
et exposé par la CLI `sensor` pour faciliter le setup).

Multi-tenant : une seule paire de tables partagée, filtrée par `id_client`.
"""

from __future__ import annotations

import json

import httpx
import numpy as np
from loguru import logger
from tenacity import (
    retry,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

from sensor.models import (
    Chunk,
    ChunkMetadata,
    ChunkResultat,
    Document,
    TypeDocument,
)
from sensor.vectorstore.base import BaseVectorStore

#: SQL à exécuter une fois dans l'éditeur SQL Supabase pour préparer la base.
SQL_INSTALLATION = """
-- Extension pgvector
create extension if not exists vector;

-- Documents
create table if not exists sensor_documents (
    id text primary key,
    id_client text not null,
    titre text not null,
    type text not null,
    source text not null,
    date_ingestion timestamptz not null,
    hash text not null,
    nb_chunks integer not null default 0
);
create index if not exists idx_sensor_documents_client on sensor_documents(id_client);

-- Chunks (la dimension {DIM} doit correspondre à l'embedder configuré)
create table if not exists sensor_chunks (
    id text primary key,
    id_document text not null references sensor_documents(id) on delete cascade,
    id_client text not null,
    texte text not null,
    position integer not null,
    metadata jsonb not null,
    embedding vector({DIM})
);
create index if not exists idx_sensor_chunks_client on sensor_chunks(id_client);
create index if not exists idx_sensor_chunks_vec on sensor_chunks
    using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- Fonction de recherche par similarité cosinus, filtrée par client
create or replace function sensor_match_chunks(
    query_embedding vector({DIM}),
    match_count int,
    p_id_client text
) returns table (
    id text, id_document text, id_client text, texte text,
    position int, metadata jsonb, similarity float
) language sql stable as $$
    select c.id, c.id_document, c.id_client, c.texte, c.position, c.metadata,
           1 - (c.embedding <=> query_embedding) as similarity
    from sensor_chunks c
    where c.id_client = p_id_client
    order by c.embedding <=> query_embedding
    limit match_count;
$$;
"""


def _normaliser(vecteur: list[float]) -> list[float]:
    v = np.asarray(vecteur, dtype=np.float32)
    norme = np.linalg.norm(v)
    if norme > 0:
        v = v / norme
    return v.tolist()


class SupabaseVectorStore(BaseVectorStore):
    """Base vectorielle adossée à Supabase / Postgres + pgvector."""

    def __init__(self, url: str, key: str, id_client: str, dimension: int) -> None:
        if not url or not key:
            raise ValueError(
                "SUPABASE_URL et SUPABASE_KEY sont requis pour un client en vectorstore: supabase. "
                "Renseignez-les dans .env ou basculez le client en vectorstore: sqlite."
            )
        self.id_client = id_client
        self.dimension = dimension
        self._base = url.rstrip("/") + "/rest/v1"
        self._headers = {
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
        }
        self._client = httpx.Client(timeout=30.0, headers=self._headers)

    @retry(
        reraise=True,
        stop=stop_after_attempt(4),
        wait=wait_exponential(multiplier=1, min=2, max=16),
        retry=retry_if_exception_type(httpx.TransportError),
    )
    def _post(self, chemin: str, payload, params: dict | None = None) -> httpx.Response:
        rep = self._client.post(f"{self._base}{chemin}", json=payload, params=params or {})
        rep.raise_for_status()
        return rep

    def upsert_document(self, document: Document) -> None:
        payload = {
            "id": document.id,
            "id_client": document.id_client,
            "titre": document.titre,
            "type": document.type.value,
            "source": document.source,
            "date_ingestion": document.date_ingestion.isoformat(),
            "hash": document.hash,
            "nb_chunks": document.nb_chunks,
        }
        self._post("/sensor_documents", payload, params={"on_conflict": "id"})

    def get_document_hash(self, id_document: str) -> str | None:
        rep = self._client.get(
            f"{self._base}/sensor_documents",
            params={"id": f"eq.{id_document}", "select": "hash"},
        )
        rep.raise_for_status()
        data = rep.json()
        return data[0]["hash"] if data else None

    def add_chunks(self, chunks: list[Chunk], embeddings: list[list[float]]) -> None:
        if len(chunks) != len(embeddings):
            raise ValueError("add_chunks : nombre de chunks et d'embeddings différent.")
        lignes = [
            {
                "id": chunk.id,
                "id_document": chunk.id_document,
                "id_client": chunk.id_client,
                "texte": chunk.texte,
                "position": chunk.position,
                "metadata": json.loads(chunk.metadata.model_dump_json()),
                "embedding": _normaliser(emb),
            }
            for chunk, emb in zip(chunks, embeddings, strict=True)
        ]
        # Insertion par lots pour limiter la taille des requêtes.
        for i in range(0, len(lignes), 100):
            self._post(
                "/sensor_chunks",
                lignes[i : i + 100],
                params={"on_conflict": "id"},
            )

    def search(
        self, embedding_requete: list[float], top_k: int, requete_texte: str | None = None
    ) -> list[ChunkResultat]:
        # Requête sans signal (vecteur nul) : aucune correspondance pertinente
        # (et évite un comportement indéfini de l'opérateur de distance pgvector).
        if float(np.linalg.norm(np.asarray(embedding_requete, dtype=np.float32))) == 0.0:
            return []
        rep = self._post(
            "/rpc/sensor_match_chunks",
            {
                "query_embedding": _normaliser(embedding_requete),
                "match_count": top_k,
                "p_id_client": self.id_client,
            },
        )
        resultats: list[ChunkResultat] = []
        for row in rep.json():
            meta = row["metadata"]
            if isinstance(meta, str):
                meta = json.loads(meta)
            chunk = Chunk(
                id=row["id"],
                id_document=row["id_document"],
                id_client=row["id_client"],
                texte=row["texte"],
                position=row["position"],
                metadata=ChunkMetadata.model_validate(meta),
            )
            score = float(row["similarity"])
            resultats.append(ChunkResultat(chunk=chunk, score=max(0.0, min(1.0, score))))
        return resultats

    def delete_document(self, id_document: str) -> int:
        n = len(
            self._client.get(
                f"{self._base}/sensor_chunks",
                params={"id_document": f"eq.{id_document}", "select": "id"},
            ).json()
        )
        self._client.delete(
            f"{self._base}/sensor_chunks", params={"id_document": f"eq.{id_document}"}
        )
        self._client.delete(
            f"{self._base}/sensor_documents", params={"id": f"eq.{id_document}"}
        )
        return n

    def list_documents(self) -> list[Document]:
        rep = self._client.get(
            f"{self._base}/sensor_documents",
            params={
                "id_client": f"eq.{self.id_client}",
                "select": "*",
                "order": "date_ingestion.desc",
            },
        )
        rep.raise_for_status()
        return [
            Document(
                id=r["id"],
                id_client=r["id_client"],
                titre=r["titre"],
                type=TypeDocument(r["type"]),
                source=r["source"],
                date_ingestion=r["date_ingestion"],
                hash=r["hash"],
                nb_chunks=r["nb_chunks"],
            )
            for r in rep.json()
        ]

    def count_chunks(self) -> int:
        rep = self._client.get(
            f"{self._base}/sensor_chunks",
            params={"id_client": f"eq.{self.id_client}", "select": "id"},
            headers={**self._headers, "Prefer": "count=exact", "Range": "0-0"},
        )
        # PostgREST renvoie le total dans l'en-tête Content-Range : "0-0/<total>".
        content_range = rep.headers.get("content-range", "*/0")
        try:
            return int(content_range.split("/")[-1])
        except (ValueError, IndexError):
            return len(rep.json())

    def reset(self) -> None:
        self._client.delete(
            f"{self._base}/sensor_chunks", params={"id_client": f"eq.{self.id_client}"}
        )
        self._client.delete(
            f"{self._base}/sensor_documents", params={"id_client": f"eq.{self.id_client}"}
        )
        logger.info("Base Supabase réinitialisée pour le client {}.", self.id_client)

    def close(self) -> None:
        self._client.close()
