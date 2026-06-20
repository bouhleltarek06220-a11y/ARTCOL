"""Base vectorielle locale sur SQLite (déploiement simple, souverain).

Stratégie de recherche :
- Si l'extension `sqlite-vec` se charge, on l'utilise pour une recherche KNN
  rapide (table virtuelle vec0).
- Sinon, on retombe sur une recherche exhaustive en numpy (cosinus), 100 %
  fiable et largement suffisante à l'échelle d'une base documentaire de PME.

Les vecteurs sont normalisés (norme L2 = 1) avant stockage : la distance L2 de
sqlite-vec devient alors monotone avec la similarité cosinus, et le fallback
numpy se réduit à un simple produit scalaire.
"""

from __future__ import annotations

import json
import sqlite3
import struct
from pathlib import Path

import numpy as np
from loguru import logger

from sensor.models import (
    Chunk,
    ChunkMetadata,
    ChunkResultat,
    Document,
    TypeDocument,
)
from sensor.vectorstore.base import BaseVectorStore


def _normaliser(vecteur: list[float]) -> np.ndarray:
    v = np.asarray(vecteur, dtype=np.float32)
    norme = np.linalg.norm(v)
    if norme > 0:
        v = v / norme
    return v


def _to_blob(vecteur: np.ndarray) -> bytes:
    return struct.pack(f"{len(vecteur)}f", *vecteur.tolist())


def _from_blob(blob: bytes) -> np.ndarray:
    n = len(blob) // 4
    return np.asarray(struct.unpack(f"{n}f", blob), dtype=np.float32)


class SQLiteVectorStore(BaseVectorStore):
    """Implémentation SQLite mono-fichier d'une base vectorielle par client."""

    def __init__(self, chemin: Path, id_client: str, dimension: int) -> None:
        self.chemin = Path(chemin)
        self.id_client = id_client
        self.dimension = dimension
        self.chemin.parent.mkdir(parents=True, exist_ok=True)
        self._conn = sqlite3.connect(str(self.chemin))
        self._conn.row_factory = sqlite3.Row
        self._vec_actif = self._tenter_charger_sqlite_vec()
        self._init_schema()

    # -- Initialisation ----------------------------------------------------

    def _tenter_charger_sqlite_vec(self) -> bool:
        try:
            import sqlite_vec

            self._conn.enable_load_extension(True)
            sqlite_vec.load(self._conn)
            self._conn.enable_load_extension(False)
            logger.debug("sqlite-vec chargé : recherche KNN accélérée active.")
            return True
        except Exception as exc:  # noqa: BLE001 — fallback volontaire et tracé
            logger.info(
                "sqlite-vec indisponible ({}) : recherche exhaustive numpy utilisée.", exc
            )
            return False

    def _init_schema(self) -> None:
        cur = self._conn.cursor()
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS documents (
                id TEXT PRIMARY KEY,
                id_client TEXT NOT NULL,
                titre TEXT NOT NULL,
                type TEXT NOT NULL,
                source TEXT NOT NULL,
                date_ingestion TEXT NOT NULL,
                hash TEXT NOT NULL,
                nb_chunks INTEGER NOT NULL DEFAULT 0
            )
            """
        )
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS chunks (
                id TEXT PRIMARY KEY,
                id_document TEXT NOT NULL,
                id_client TEXT NOT NULL,
                texte TEXT NOT NULL,
                position INTEGER NOT NULL,
                metadata TEXT NOT NULL,
                embedding BLOB NOT NULL,
                FOREIGN KEY (id_document) REFERENCES documents(id) ON DELETE CASCADE
            )
            """
        )
        cur.execute("CREATE INDEX IF NOT EXISTS idx_chunks_doc ON chunks(id_document)")
        if self._vec_actif:
            # rowid de vec_chunks = rowid de chunks (lien implicite via une table de mappage).
            cur.execute(
                f"""
                CREATE VIRTUAL TABLE IF NOT EXISTS vec_chunks USING vec0(
                    embedding float[{self.dimension}]
                )
                """
            )
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS vec_map (
                    vec_rowid INTEGER PRIMARY KEY,
                    chunk_id TEXT NOT NULL UNIQUE
                )
                """
            )
        self._conn.commit()

    # -- Écriture ----------------------------------------------------------

    def upsert_document(self, document: Document) -> None:
        self._conn.execute(
            """
            INSERT INTO documents (id, id_client, titre, type, source, date_ingestion, hash, nb_chunks)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                titre=excluded.titre, type=excluded.type, source=excluded.source,
                date_ingestion=excluded.date_ingestion, hash=excluded.hash,
                nb_chunks=excluded.nb_chunks
            """,
            (
                document.id,
                document.id_client,
                document.titre,
                document.type.value,
                document.source,
                document.date_ingestion.isoformat(),
                document.hash,
                document.nb_chunks,
            ),
        )
        self._conn.commit()

    def get_document_hash(self, id_document: str) -> str | None:
        row = self._conn.execute(
            "SELECT hash FROM documents WHERE id = ?", (id_document,)
        ).fetchone()
        return row["hash"] if row else None

    def add_chunks(self, chunks: list[Chunk], embeddings: list[list[float]]) -> None:
        if len(chunks) != len(embeddings):
            raise ValueError("add_chunks : nombre de chunks et d'embeddings différent.")
        cur = self._conn.cursor()
        for chunk, emb in zip(chunks, embeddings, strict=True):
            vec = _normaliser(emb)
            if len(vec) != self.dimension:
                raise ValueError(
                    f"Dimension d'embedding inattendue : {len(vec)} (attendu {self.dimension})."
                )
            cur.execute(
                """
                INSERT OR REPLACE INTO chunks
                    (id, id_document, id_client, texte, position, metadata, embedding)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    chunk.id,
                    chunk.id_document,
                    chunk.id_client,
                    chunk.texte,
                    chunk.position,
                    chunk.metadata.model_dump_json(),
                    _to_blob(vec),
                ),
            )
            if self._vec_actif:
                cur.execute(
                    "INSERT INTO vec_chunks (embedding) VALUES (?)",
                    (_to_blob(vec),),
                )
                cur.execute(
                    "INSERT OR REPLACE INTO vec_map (vec_rowid, chunk_id) VALUES (?, ?)",
                    (cur.lastrowid, chunk.id),
                )
        self._conn.commit()

    # -- Lecture / recherche ----------------------------------------------

    def search(
        self, embedding_requete: list[float], top_k: int, requete_texte: str | None = None
    ) -> list[ChunkResultat]:
        # Requête sans signal (vecteur nul) : aucune correspondance pertinente.
        if float(np.linalg.norm(np.asarray(embedding_requete, dtype=np.float32))) == 0.0:
            return []
        vec_req = _normaliser(embedding_requete)
        if self._vec_actif:
            resultats = self._search_vec(vec_req, top_k)
        else:
            resultats = self._search_numpy(vec_req, top_k)

        # Recherche hybride optionnelle : on remonte les chunks contenant les
        # mots-clés de la requête, en garantissant qu'ils ne soient pas écartés.
        if requete_texte:
            resultats = self._fusion_mots_cles(resultats, vec_req, requete_texte, top_k)
        return resultats

    def _search_vec(self, vec_req: np.ndarray, top_k: int) -> list[ChunkResultat]:
        rows = self._conn.execute(
            """
            SELECT m.chunk_id AS chunk_id, v.distance AS distance
            FROM vec_chunks v
            JOIN vec_map m ON m.vec_rowid = v.rowid
            WHERE v.embedding MATCH ? AND k = ?
            ORDER BY v.distance
            """,
            (_to_blob(vec_req), top_k),
        ).fetchall()
        resultats: list[ChunkResultat] = []
        for row in rows:
            chunk = self._charger_chunk(row["chunk_id"])
            if chunk is None:
                continue
            # Vecteurs normalisés -> cosinus = 1 - (L2^2)/2.
            similarite = 1.0 - (float(row["distance"]) ** 2) / 2.0
            resultats.append(ChunkResultat(chunk=chunk, score=max(0.0, min(1.0, similarite))))
        return resultats

    def _search_numpy(self, vec_req: np.ndarray, top_k: int) -> list[ChunkResultat]:
        rows = self._conn.execute("SELECT id, embedding FROM chunks").fetchall()
        if not rows:
            return []
        ids = [r["id"] for r in rows]
        matrice = np.stack([_from_blob(r["embedding"]) for r in rows])
        # Tous les vecteurs sont normalisés -> similarité = produit scalaire.
        scores = matrice @ vec_req
        meilleurs = np.argsort(-scores)[:top_k]
        resultats: list[ChunkResultat] = []
        for idx in meilleurs:
            chunk = self._charger_chunk(ids[idx])
            if chunk is not None:
                resultats.append(
                    ChunkResultat(chunk=chunk, score=float(max(0.0, min(1.0, scores[idx]))))
                )
        return resultats

    def _fusion_mots_cles(
        self,
        resultats: list[ChunkResultat],
        vec_req: np.ndarray,
        requete_texte: str,
        top_k: int,
    ) -> list[ChunkResultat]:
        """Ajoute les chunks pertinents par mot-clé non déjà présents (recherche hybride)."""
        mots = [m for m in requete_texte.lower().split() if len(m) > 3]
        if not mots:
            return resultats
        deja = {r.chunk.id for r in resultats}
        # LIKE simple sur chaque mot significatif (suffisant pour un complément lexical).
        clauses = " OR ".join(["lower(texte) LIKE ?"] * len(mots))
        params = [f"%{m}%" for m in mots]
        rows = self._conn.execute(
            f"SELECT id, embedding FROM chunks WHERE {clauses} LIMIT 50", params
        ).fetchall()
        for row in rows:
            if row["id"] in deja:
                continue
            score = float(_from_blob(row["embedding"]) @ vec_req)
            chunk = self._charger_chunk(row["id"])
            if chunk is not None:
                resultats.append(
                    ChunkResultat(chunk=chunk, score=max(0.0, min(1.0, score)))
                )
        resultats.sort(key=lambda r: r.score, reverse=True)
        return resultats[:top_k]

    def _charger_chunk(self, chunk_id: str) -> Chunk | None:
        row = self._conn.execute(
            "SELECT * FROM chunks WHERE id = ?", (chunk_id,)
        ).fetchone()
        if row is None:
            return None
        meta = json.loads(row["metadata"])
        return Chunk(
            id=row["id"],
            id_document=row["id_document"],
            id_client=row["id_client"],
            texte=row["texte"],
            position=row["position"],
            metadata=ChunkMetadata.model_validate(meta),
        )

    # -- Gestion documents -------------------------------------------------

    def delete_document(self, id_document: str) -> int:
        chunk_ids = [
            r["id"]
            for r in self._conn.execute(
                "SELECT id FROM chunks WHERE id_document = ?", (id_document,)
            ).fetchall()
        ]
        if self._vec_actif and chunk_ids:
            for cid in chunk_ids:
                row = self._conn.execute(
                    "SELECT vec_rowid FROM vec_map WHERE chunk_id = ?", (cid,)
                ).fetchone()
                if row:
                    self._conn.execute(
                        "DELETE FROM vec_chunks WHERE rowid = ?", (row["vec_rowid"],)
                    )
                    self._conn.execute(
                        "DELETE FROM vec_map WHERE chunk_id = ?", (cid,)
                    )
        self._conn.execute("DELETE FROM chunks WHERE id_document = ?", (id_document,))
        self._conn.execute("DELETE FROM documents WHERE id = ?", (id_document,))
        self._conn.commit()
        return len(chunk_ids)

    def list_documents(self) -> list[Document]:
        rows = self._conn.execute(
            "SELECT * FROM documents ORDER BY date_ingestion DESC"
        ).fetchall()
        documents: list[Document] = []
        for row in rows:
            documents.append(
                Document(
                    id=row["id"],
                    id_client=row["id_client"],
                    titre=row["titre"],
                    type=TypeDocument(row["type"]),
                    source=row["source"],
                    date_ingestion=row["date_ingestion"],
                    hash=row["hash"],
                    nb_chunks=row["nb_chunks"],
                )
            )
        return documents

    def count_chunks(self) -> int:
        row = self._conn.execute("SELECT COUNT(*) AS n FROM chunks").fetchone()
        return int(row["n"])

    def reset(self) -> None:
        self._conn.execute("DELETE FROM chunks")
        self._conn.execute("DELETE FROM documents")
        if self._vec_actif:
            self._conn.execute("DELETE FROM vec_chunks")
            self._conn.execute("DELETE FROM vec_map")
        self._conn.commit()
        logger.info("Base vectorielle réinitialisée pour le client {}.", self.id_client)

    def close(self) -> None:
        self._conn.close()
