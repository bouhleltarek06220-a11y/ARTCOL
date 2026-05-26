"""Fixtures et doublures de test partagées."""

from __future__ import annotations

from pathlib import Path

import pytest

from sensor.embedders.base import BaseEmbedder
from sensor.models import ClientConfig


class FakeEmbedder(BaseEmbedder):
    """Embedder déterministe sans modèle : compte des mots-clés d'un vocabulaire fixe.

    Deux textes partageant des mots-clés auront une forte similarité cosinus, ce
    qui suffit pour tester le retriever sans charger de modèle lourd.
    """

    def __init__(self, vocabulaire: list[str]) -> None:
        self.vocabulaire = vocabulaire
        self.dimension = len(vocabulaire)
        self.nom_modele = "fake-test-embedder"

    def _vectoriser(self, texte: str) -> list[float]:
        t = texte.lower()
        return [float(t.count(mot)) for mot in self.vocabulaire]

    def embed_documents(self, textes: list[str]) -> list[list[float]]:
        return [self._vectoriser(t) for t in textes]

    def embed_query(self, texte: str) -> list[float]:
        return self._vectoriser(texte)


@pytest.fixture
def vocabulaire() -> list[str]:
    return ["remboursement", "livraison", "garantie", "horaires", "paiement", "retour"]


@pytest.fixture
def fake_embedder(vocabulaire: list[str]) -> FakeEmbedder:
    return FakeEmbedder(vocabulaire)


@pytest.fixture
def config_test() -> ClientConfig:
    return ClientConfig(
        id_client="client_test",
        nom_entreprise="Société de Test",
        seuil_similarite_min=0.35,
        top_k=3,
    )


@pytest.fixture
def chemin_db(tmp_path: Path) -> Path:
    return tmp_path / "vectors_test.db"
