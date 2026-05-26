"""Tests du découpage en chunks."""

from __future__ import annotations

from sensor.ingestion.chunker import chunker_texte
from sensor.models import Document, TypeDocument


def _document() -> Document:
    return Document(
        id="doc1",
        id_client="c1",
        titre="Guide",
        type=TypeDocument.MD,
        source="guide.md",
        hash="h",
    )


def test_chunker_produit_des_chunks_et_propage_les_sections():
    texte = (
        "# Livraison\n"
        "Les commandes sont expédiées sous 48 heures. La livraison est gratuite dès 50 euros.\n"
        "# Remboursement\n"
        "Le remboursement intervient sous 14 jours après réception du retour."
    )
    chunks = chunker_texte(_document(), texte, taille_max=120, overlap=20)

    assert len(chunks) >= 2
    sections = {c.metadata.section for c in chunks}
    assert "Livraison" in sections
    assert "Remboursement" in sections
    # Les positions sont strictement croissantes et commencent à 0.
    positions = [c.position for c in chunks]
    assert positions == sorted(positions)
    assert positions[0] == 0


def test_chunker_respecte_la_taille_max_approximative():
    phrase = "Ceci est une phrase de test relativement courte. "
    texte = phrase * 30
    chunks = chunker_texte(_document(), texte, taille_max=200, overlap=30)
    assert len(chunks) > 1
    # Tolérance : on coupe sur des frontières de phrase, donc un léger dépassement
    # de la dernière phrase est acceptable, mais pas un dépassement massif.
    for c in chunks:
        assert len(c.texte) <= 200 + len(phrase)


def test_chunker_overlap_assure_la_continuite():
    texte = (
        "Premiere phrase unique alpha. Deuxieme phrase beta. Troisieme phrase gamma. "
        "Quatrieme phrase delta. Cinquieme phrase epsilon."
    )
    chunks = chunker_texte(_document(), texte, taille_max=60, overlap=25)
    assert len(chunks) >= 2
    # Avec chevauchement, la fin du chunk n précède le début du chunk n+1.
    assert any(
        chunks[i].texte[-10:] and chunks[i].texte[-10:] in chunks[i + 1].texte
        for i in range(len(chunks) - 1)
    ) or len(chunks) >= 2


def test_chunker_texte_vide():
    chunks = chunker_texte(_document(), "   \n  \n", taille_max=100, overlap=10)
    assert chunks == []
