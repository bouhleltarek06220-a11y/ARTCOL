"""Tests des sources avec réponses HTTP simulées (aucun appel réseau réel)."""

from reflexe.config import Settings
from reflexe.models import FiltresMission, Mission
from reflexe.sources.pappers import SourcePappers
from reflexe.sources.recherche_entreprises import SourceRechercheEntreprises
from reflexe.sources.website import _extraire, _filtrer_emails


class FakeResponse:
    def __init__(self, status_code, data=None, text="", content_type="application/json"):
        self.status_code = status_code
        self._data = data or {}
        self.text = text
        self.headers = {"content-type": content_type}

    def json(self):
        return self._data


class FakeClient:
    """Stub de ClientPoli : renvoie des réponses préprogrammées, sans réseau."""

    def __init__(self, reponses):
        self.reponses = list(reponses)
        self.urls = []

    async def fetch(self, url, *, methode="GET", respecter_robots=True, **kwargs):
        self.urls.append(url)
        return self.reponses.pop(0) if self.reponses else None


async def test_collecte_recherche_entreprises_parse_correctement():
    resultat = {
        "siren": "552100554",
        "nom_complet": "ACME SAS",
        "activite_principale": "62.01Z",
        "siege": {
            "siret": "55210055400013",
            "adresse": "1 RUE X 06000 NICE",
            "code_postal": "06000",
            "libelle_commune": "NICE",
            "departement": "06",
        },
        "tranche_effectif_salarie": "12",
        "date_creation": "2010-01-01",
        "etat_administratif": "A",
        "dirigeants": [
            {
                "type_dirigeant": "personne physique",
                "nom": "DUPONT",
                "prenoms": "Jean",
                "qualite": "Président",
            }
        ],
    }
    data = {"results": [resultat], "total_pages": 1, "total_results": 1}
    client = FakeClient([FakeResponse(200, data)])
    source = SourceRechercheEntreprises(Settings())
    mission = Mission(
        nom="test",
        filtres=FiltresMission(naf=["6201Z"], zones=["06"]),
        limite_prospects=10,
    )

    prospects = await source.collecter(mission, client)

    assert len(prospects) == 1
    p = prospects[0]
    assert p.entreprise.siren == "552100554"
    assert p.entreprise.raison_sociale == "ACME SAS"
    assert p.entreprise.naf == "62.01Z"
    assert p.entreprise.ville == "NICE"
    assert p.entreprise.tranche_effectif == "20 à 49 salariés"
    assert p.nom_dirigeant == "DUPONT"
    assert p.prenom == "Jean"
    assert p.id  # id stable assigné


async def test_collecte_gere_reponse_erreur():
    client = FakeClient([FakeResponse(429, {})])
    source = SourceRechercheEntreprises(Settings())
    mission = Mission(nom="t", filtres=FiltresMission(naf=["6201Z"]))
    prospects = await source.collecter(mission, client)
    assert prospects == []


def test_pappers_saute_sans_cle():
    source = SourcePappers(Settings())
    assert source.est_configuree() is False
    assert "PAPPERS_API_KEY" in source.raison_indisponible()
    source_avec_cle = SourcePappers(Settings(pappers_api_key="xxx"))
    assert source_avec_cle.est_configuree() is True


def test_extraction_emails_et_filtrage():
    html = """
    <html><body>
      <a href="mailto:contact@acme.fr">écrire</a>
      <a href="tel:+33612345678">appeler</a>
      <a href="https://www.linkedin.com/company/acme">LinkedIn</a>
      Logo : logo@2x.png — noreply@acme.fr
    </body></html>
    """
    emails, tels, linkedin = _extraire(html, "https://acme.fr")
    propres = _filtrer_emails(emails, "acme.fr")
    assert "contact@acme.fr" in propres
    assert all(not e.endswith(".png") for e in propres)
    assert propres[0] == "contact@acme.fr"  # adresse pro du domaine en tête
    assert "linkedin.com" in linkedin
    assert any("612345678" in t.replace(" ", "") for t in tels)
