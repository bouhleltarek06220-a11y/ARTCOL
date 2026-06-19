"""Tests de normalisation et de vérification locale (sans réseau)."""

from reflexe.pipeline.clean import (
    deviner_email,
    normaliser_naf,
    normaliser_nom,
    normaliser_telephone,
    verifier_syntaxe_email,
)


def test_normaliser_telephone():
    assert normaliser_telephone("+33 6 12 34 56 78") == "06 12 34 56 78"
    assert normaliser_telephone("0612345678") == "06 12 34 56 78"
    assert normaliser_telephone("0033612345678") == "06 12 34 56 78"


def test_normaliser_naf():
    assert normaliser_naf("6201Z") == "62.01Z"
    assert normaliser_naf("62.01Z") == "62.01Z"


def test_normaliser_nom():
    assert normaliser_nom("  jean   dupont ") == "Jean Dupont"


def test_deviner_email_sans_accents():
    assert deviner_email("Jean", "Dupont", "acme.fr") == "jean.dupont@acme.fr"
    assert deviner_email("Élodie", "Léa", "acme.fr") == "elodie.lea@acme.fr"
    assert deviner_email("", "Dupont", "acme.fr") == ""


def test_verifier_syntaxe_email():
    assert verifier_syntaxe_email("contact@acme.fr") is True
    assert verifier_syntaxe_email("pas-un-email") is False
    assert verifier_syntaxe_email("a@@b") is False
