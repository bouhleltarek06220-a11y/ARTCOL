"""Tests de déduplication : fusion par SIREN et par email, complétude des champs."""

from reflexe.models import Entreprise, Prospect
from reflexe.pipeline.dedupe import dedupliquer


def _prospect(siren="123456789", email="", telephone="", site=""):
    e = Entreprise(siren=siren, site_web=site)
    return Prospect(entreprise=e, email=email, telephone=telephone).assigner_id()


def test_fusion_par_siren_complete_les_champs():
    a = _prospect(email="contact@acme.fr")
    b = _prospect(telephone="06 12 34 56 78", site="https://acme.fr")
    resultat, fusions = dedupliquer([a, b])
    assert fusions == 1
    assert len(resultat) == 1
    fusionne = resultat[0]
    assert fusionne.email == "contact@acme.fr"
    assert fusionne.telephone == "06 12 34 56 78"
    assert fusionne.entreprise.site_web == "https://acme.fr"


def test_fusion_par_email_meme_si_siren_different():
    a = _prospect(siren="111111111", email="x@partage.fr")
    b = _prospect(siren="222222222", email="x@partage.fr")
    resultat, fusions = dedupliquer([a, b])
    assert fusions == 1
    assert len(resultat) == 1


def test_pas_de_fusion_si_distincts():
    a = _prospect(siren="111111111", email="a@un.fr")
    b = _prospect(siren="222222222", email="b@deux.fr")
    resultat, fusions = dedupliquer([a, b])
    assert fusions == 0
    assert len(resultat) == 2
