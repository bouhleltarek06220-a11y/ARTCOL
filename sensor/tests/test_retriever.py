"""Tests du retriever et du signal hors-scope (avec embedder factice)."""

from __future__ import annotations

from pathlib import Path

import pytest

from sensor.models import Chunk, ChunkMetadata, Document, TypeDocument
from sensor.retrieval.retriever import Retriever
from sensor.vectorstore.sqlite_store import SQLiteVectorStore


def _peupler(store: SQLiteVectorStore, embedder) -> None:
    doc = Document(
        id="d1", id_client="client_test", titre="FAQ", type=TypeDocument.TXT,
        source="faq.txt", hash="h",
    )
    store.upsert_document(doc)
    textes = [
        "Notre politique de remboursement permet un remboursement sous 14 jours.",
        "La livraison est gratuite et la livraison s'effectue sous 48 heures.",
        "La garantie couvre les défauts pendant deux ans.",
    ]
    chunks = [
        Chunk(
            id=f"d1-{i}",
            id_document="d1",
            id_client="client_test",
            texte=t,
            position=i,
            metadata=ChunkMetadata(titre_document="FAQ", source="faq.txt", type=TypeDocument.TXT),
        )
        for i, t in enumerate(textes)
    ]
    store.add_chunks(chunks, embedder.embed_documents(textes))


@pytest.fixture
def store(chemin_db: Path, fake_embedder):
    s = SQLiteVectorStore(chemin=chemin_db, id_client="client_test", dimension=fake_embedder.dimension)
    _peupler(s, fake_embedder)
    yield s
    s.close()


def test_retriever_trouve_le_passage_pertinent(store, fake_embedder, config_test):
    retriever = Retriever(config_test, fake_embedder, store)
    res = retriever.rechercher("Quelle est la politique de remboursement ?")
    assert not res.hors_scope
    assert res.passages
    assert "remboursement" in res.passages[0].chunk.texte.lower()


def test_retriever_hors_scope_quand_aucune_correspondance(store, fake_embedder, config_test):
    retriever = Retriever(config_test, fake_embedder, store)
    # Question sans aucun mot du vocabulaire -> vecteur nul -> score sous le seuil.
    res = retriever.rechercher("Parlez-moi de la météo et des dauphins.")
    assert res.hors_scope is True
    assert res.meilleur_score < config_test.seuil_similarite_min


def test_recherche_directe_vectorstore_classe_par_score(store, fake_embedder):
    vec = fake_embedder.embed_query("livraison livraison")
    resultats = store.search(vec, top_k=3)
    assert resultats
    # Le passage le plus riche en "livraison" doit arriver en tête.
    assert "livraison" in resultats[0].chunk.texte.lower()
    scores = [r.score for r in resultats]
    assert scores == sorted(scores, reverse=True)
