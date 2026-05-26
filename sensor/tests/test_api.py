"""Tests de l'API FastAPI (moteur client mocké, aucune dépendance lourde)."""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from sensor.models import ChatResponse, Source


@pytest.fixture
def client(monkeypatch):
    # On construit l'app après avoir importé le module routes_chat pour monkeypatcher.
    from sensor.api import main, routes_chat

    class _FakeEngine:
        def __init__(self):
            from sensor.models import ClientConfig

            self.config = ClientConfig(id_client="demo", nom_entreprise="Démo")

        def traiter(self, message: str, id_session):
            return ChatResponse(
                reponse=f"Réponse à : {message}",
                sources=[
                    Source(
                        titre_document="FAQ",
                        source="faq.txt",
                        section=None,
                        extrait="extrait",
                        score=0.9,
                    )
                ],
                hors_scope=False,
                id_session=id_session or "sess_test",
            )

    fake = _FakeEngine()
    monkeypatch.setattr(routes_chat, "get_engine", lambda _id: fake)
    # La route /config lit la config client : on la mocke pour rester isolé.
    monkeypatch.setattr(routes_chat, "charger_config_client", lambda _id: fake.config)

    app = main.creer_app()
    return TestClient(app)


def test_racine_et_health(client):
    assert client.get("/").json()["service"] == "SENSOR"
    assert client.get("/health").json()["statut"] == "ok"


def test_chat_renvoie_reponse_et_sources(client):
    rep = client.post(
        "/chat", json={"id_client": "demo", "message": "Bonjour ?", "id_session": None}
    )
    assert rep.status_code == 200
    data = rep.json()
    assert data["reponse"].startswith("Réponse à : Bonjour ?")
    assert data["hors_scope"] is False
    assert data["sources"][0]["titre_document"] == "FAQ"
    assert data["id_session"] == "sess_test"


def test_chat_valide_les_entrees(client):
    # message vide -> 422 (validation pydantic).
    rep = client.post("/chat", json={"id_client": "demo", "message": ""})
    assert rep.status_code == 422


def test_config_publique(client):
    rep = client.get("/client/demo/config")
    assert rep.status_code == 200
    data = rep.json()
    assert data["nom_entreprise"] == "Démo"
    assert "couleurs" in data


def test_admin_protege_sans_cle(client):
    # Sans SENSOR_ADMIN_KEY configurée, l'accès admin est refusé (503) ;
    # avec une clé configurée mais absente de la requête, ce serait 401.
    rep = client.get("/admin/clients")
    assert rep.status_code in (401, 503)
