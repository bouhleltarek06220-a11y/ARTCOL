"""Tests des modèles : id stable, validation SIREN, exclusions, mission."""

import pytest
from pydantic import ValidationError

from reflexe.models import Entreprise, ExclusionsMission, Mission, Prospect


def test_id_prospect_stable_et_idempotent():
    a = Prospect.calculer_id("552100554", "jean@acme.fr")
    b = Prospect.calculer_id("552 100 554", "JEAN@acme.fr")  # espaces + casse
    assert a == b
    assert len(a) == 16


def test_siren_normalise():
    e = Entreprise(siren="552 100 554")
    assert e.siren == "552100554"


def test_siren_invalide_rejete():
    with pytest.raises(ValidationError):
        Entreprise(siren="12")


def test_exclusions_email_et_domaine():
    excl = ExclusionsMission(domaines=["concurrent.fr"], emails=["non@merci.fr"])
    assert excl.est_exclu("non@merci.fr") is True
    assert excl.est_exclu("contact@concurrent.fr") is True
    assert excl.est_exclu("ok@autre.fr") is False
    assert excl.est_exclu("") is False


def test_mission_nom_obligatoire():
    with pytest.raises(ValidationError):
        Mission(nom="   ")


def test_assigner_id_depuis_siren():
    e = Entreprise(siren="123456789")
    p = Prospect(entreprise=e, email="a@b.fr").assigner_id()
    assert p.id == Prospect.calculer_id("123456789", "a@b.fr")
