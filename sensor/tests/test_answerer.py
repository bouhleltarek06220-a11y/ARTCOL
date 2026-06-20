"""Test du garde-fou anti-hallucination de l'answerer.

Vérifie que :
- quand le contexte ne contient pas la réponse (retriever hors-scope), SENSOR
  renvoie le message de repli SANS appeler Claude ;
- quand Claude renvoie le jeton hors-scope, la réponse bascule sur le repli ;
- quand Claude répond avec des citations [n], les sources sont extraites.
"""

from __future__ import annotations

from types import SimpleNamespace

import pytest

from sensor.generation.answerer import Answerer, estimer_cout
from sensor.generation.prompts import JETON_HORS_SCOPE
from sensor.models import Chunk, ChunkMetadata, ChunkResultat, ClientConfig, TypeDocument
from sensor.retrieval.retriever import ResultatRecherche


def _config() -> ClientConfig:
    return ClientConfig(
        id_client="c",
        nom_entreprise="ACME",
        message_hors_scope="Désolé, je n'ai pas l'information.",
    )


def _passage(texte: str = "Le check-in est à 15h.") -> ChunkResultat:
    return ChunkResultat(
        chunk=Chunk(
            id="x",
            id_document="d",
            id_client="c",
            texte=texte,
            position=0,
            metadata=ChunkMetadata(
                titre_document="Conditions", source="cond.pdf", type=TypeDocument.PDF,
                section="Arrivée",
            ),
        ),
        score=0.82,
    )


class _FakeMessages:
    """Faux endpoint messages.create renvoyant un texte prédéfini."""

    def __init__(self, texte: str):
        self._texte = texte

    def create(self, **_kwargs):
        return SimpleNamespace(
            content=[SimpleNamespace(type="text", text=self._texte)],
            usage=SimpleNamespace(input_tokens=120, output_tokens=30),
        )


def _answerer_avec_reponse(texte: str) -> Answerer:
    ans = Answerer(_config(), anthropic_api_key="cle-factice")
    # On remplace le vrai client Anthropic par une doublure (aucun appel réseau).
    ans._client = SimpleNamespace(messages=_FakeMessages(texte))
    return ans


def test_repli_sans_appel_quand_retriever_hors_scope():
    # Si le retriever a déjà tranché hors-scope, Claude ne doit pas être appelé.
    ans = Answerer(_config(), anthropic_api_key="cle-factice")

    def _interdit(**_):
        raise AssertionError("Claude ne doit pas être appelé en cas de hors-scope amont.")

    ans._client = SimpleNamespace(messages=SimpleNamespace(create=_interdit))
    recherche = ResultatRecherche(passages=[], hors_scope=True, meilleur_score=0.1)

    rep = ans.repondre("question hors base", recherche)
    assert rep.hors_scope is True
    assert "n'ai pas l'information" in rep.texte
    assert rep.sources == []


def test_jeton_hors_scope_bascule_sur_repli():
    ans = _answerer_avec_reponse(JETON_HORS_SCOPE)
    recherche = ResultatRecherche(passages=[_passage()], hors_scope=False, meilleur_score=0.8)
    rep = ans.repondre("Quelle est la capitale de la France ?", recherche)
    assert rep.hors_scope is True
    assert "n'ai pas l'information" in rep.texte
    # Le jeton interne ne doit jamais fuiter dans la réponse utilisateur.
    assert JETON_HORS_SCOPE not in rep.texte


def test_reponse_normale_extrait_les_sources_citees():
    ans = _answerer_avec_reponse("Le check-in est à 15h [1].")
    recherche = ResultatRecherche(passages=[_passage()], hors_scope=False, meilleur_score=0.8)
    rep = ans.repondre("À quelle heure le check-in ?", recherche)
    assert rep.hors_scope is False
    assert "15h" in rep.texte
    assert len(rep.sources) == 1
    assert rep.sources[0].titre_document == "Conditions"
    assert rep.sources[0].section == "Arrivée"
    assert rep.tokens_input == 120 and rep.tokens_output == 30


def test_estimer_cout_est_coherent():
    cout = estimer_cout("claude-sonnet-4-6", 1_000_000, 1_000_000)
    assert cout == pytest.approx(3.0 + 15.0)
