"""Découpage de texte en chunks avec chevauchement et métadonnées de section.

Principes :
- On respecte les frontières de phrases (pas de coupe en plein milieu).
- On suit les titres de section (lignes Markdown `#`) pour étiqueter chaque chunk.
- Un chevauchement (overlap) en caractères assure la continuité du contexte
  entre deux chunks consécutifs.
"""

from __future__ import annotations

import re

from sensor.models import Chunk, ChunkMetadata, Document

#: Découpe naïve mais robuste en phrases (français/anglais), conserve la ponctuation.
_REGEX_PHRASES = re.compile(r"[^.!?\n]+[.!?]?", re.UNICODE)
_REGEX_TITRE = re.compile(r"^#{1,6}\s+(.*)$")


def _decouper_en_phrases(texte: str) -> list[str]:
    phrases = [p.strip() for p in _REGEX_PHRASES.findall(texte) if p.strip()]
    return phrases


def chunker_texte(
    document: Document,
    texte: str,
    taille_max: int = 1200,
    overlap: int = 150,
) -> list[Chunk]:
    """Transforme le texte d'un document en une liste de chunks prêts à vectoriser.

    `taille_max` et `overlap` sont en caractères. Les titres de section détectés
    (`# ...`) sont propagés dans les métadonnées des chunks suivants.
    """
    if taille_max <= 0:
        raise ValueError("taille_max doit être strictement positif.")
    if overlap < 0 or overlap >= taille_max:
        raise ValueError("overlap doit être >= 0 et strictement inférieur à taille_max.")

    chunks: list[Chunk] = []
    section_courante: str | None = None
    tampon: list[str] = []
    longueur_tampon = 0
    position = 0

    def vider_tampon() -> None:
        nonlocal tampon, longueur_tampon, position
        if not tampon:
            return
        contenu = " ".join(tampon).strip()
        if contenu:
            chunks.append(_construire_chunk(document, contenu, position, section_courante))
            position += 1
        # Chevauchement : on conserve la fin du tampon pour le prochain chunk.
        if overlap > 0 and contenu:
            queue = contenu[-overlap:]
            tampon = [queue]
            longueur_tampon = len(queue)
        else:
            tampon = []
            longueur_tampon = 0

    for ligne in texte.split("\n"):
        ligne = ligne.strip()
        if not ligne:
            continue
        match = _REGEX_TITRE.match(ligne)
        if match:
            # Nouveau titre : on clôt le chunk courant et on change de section.
            vider_tampon()
            tampon = []
            longueur_tampon = 0
            section_courante = match.group(1).strip() or section_courante
            continue

        for phrase in _decouper_en_phrases(ligne):
            if longueur_tampon + len(phrase) + 1 > taille_max and tampon:
                vider_tampon()
            tampon.append(phrase)
            longueur_tampon += len(phrase) + 1

    vider_tampon()
    # Le dernier vidage peut laisser uniquement le chevauchement résiduel : on le
    # supprime s'il duplique la fin du chunk précédent sans rien ajouter.
    if len(chunks) >= 2 and chunks[-1].texte and chunks[-1].texte in chunks[-2].texte:
        chunks.pop()
    return chunks


def _construire_chunk(
    document: Document, contenu: str, position: int, section: str | None
) -> Chunk:
    return Chunk(
        id=f"{document.id}-{position:05d}",
        id_document=document.id,
        id_client=document.id_client,
        texte=contenu,
        position=position,
        metadata=ChunkMetadata(
            titre_document=document.titre,
            source=document.source,
            type=document.type,
            section=section,
        ),
    )
