"""Source primaire : API Recherche d'entreprises (annuaire-entreprises, gouv.fr).

API officielle, gratuite, sans clé, exhaustive sur les entreprises françaises.
Permet de filtrer par code NAF/APE, zone (code postal / département), tranche
d'effectif et statut actif. Documentation : https://recherche-entreprises.api.gouv.fr
"""

from __future__ import annotations

import math
import re

from loguru import logger

from reflexe.models import Entreprise, Mission, Prospect, SourceType, StatutPipeline
from reflexe.ratelimit import ClientPoli
from reflexe.sources.base import BaseSource

_API = "https://recherche-entreprises.api.gouv.fr/search"
_PER_PAGE = 25  # maximum autorisé par l'API

# Tranches d'effectif INSEE : (code, libellé, borne_min, borne_max).
_TRANCHES = [
    ("00", "0 salarié", 0, 0),
    ("01", "1 ou 2 salariés", 1, 2),
    ("02", "3 à 5 salariés", 3, 5),
    ("03", "6 à 9 salariés", 6, 9),
    ("11", "10 à 19 salariés", 10, 19),
    ("12", "20 à 49 salariés", 20, 49),
    ("21", "50 à 99 salariés", 50, 99),
    ("22", "100 à 199 salariés", 100, 199),
    ("31", "200 à 249 salariés", 200, 249),
    ("32", "250 à 499 salariés", 250, 499),
    ("41", "500 à 999 salariés", 500, 999),
    ("42", "1 000 à 1 999 salariés", 1000, 1999),
    ("51", "2 000 à 4 999 salariés", 2000, 4999),
    ("52", "5 000 à 9 999 salariés", 5000, 9999),
    ("53", "10 000 salariés et plus", 10000, 10_000_000),
]
_LIBELLE_TRANCHE = {code: libelle for code, libelle, _, _ in _TRANCHES}


def _normaliser_naf(code: str) -> str:
    """Met un code NAF au format attendu par l'API (ex. 6201Z -> 62.01Z)."""
    code = (code or "").strip().upper()
    if re.fullmatch(r"\d{4}[A-Z]", code):
        return f"{code[:2]}.{code[2:4]}{code[4]}"
    return code


def _codes_effectif(emin: int, emax: int) -> list[str]:
    """Codes de tranches INSEE qui chevauchent l'intervalle [emin, emax]."""
    if emin <= 0 and emax >= 10000:
        return []  # plage totale : inutile de filtrer
    return [c for c, _, lo, hi in _TRANCHES if hi >= emin and lo <= emax]


def _separer_zones(zones: list[str]) -> tuple[list[str], list[str]]:
    """Sépare les zones en codes postaux (5 chiffres) et départements (le reste)."""
    code_postaux, departements = [], []
    for z in zones:
        z = (z or "").strip()
        if re.fullmatch(r"\d{5}", z):
            code_postaux.append(z)
        elif z:
            departements.append(z)
    return code_postaux, departements


class SourceRechercheEntreprises(BaseSource):
    type = SourceType.RECHERCHE_ENTREPRISES
    peut_collecter = True
    peut_enrichir = False

    def _construire_params(self, mission: Mission) -> dict:
        f = mission.filtres
        params: dict[str, str | int] = {
            "per_page": _PER_PAGE,
            "etat_administratif": "A",
        }
        naf = [_normaliser_naf(c) for c in f.naf if c.strip()]
        if naf:
            params["activite_principale"] = ",".join(naf)
        code_postaux, departements = _separer_zones(f.zones)
        if code_postaux:
            params["code_postal"] = ",".join(code_postaux)
        if departements:
            params["departement"] = ",".join(departements)
        codes_eff = _codes_effectif(f.effectif_min, f.effectif_max)
        if codes_eff:
            params["tranche_effectif_salarie"] = ",".join(codes_eff)
        if f.mots_cles:
            params["q"] = " ".join(f.mots_cles)
        return params

    def _result_vers_prospect(self, r: dict) -> Prospect | None:
        siege = r.get("siege") or {}
        try:
            entreprise = Entreprise(
                siren=r.get("siren", ""),
                siret=siege.get("siret", "") or "",
                raison_sociale=r.get("nom_complet")
                or r.get("nom_raison_sociale")
                or "",
                naf=r.get("activite_principale") or siege.get("activite_principale") or "",
                libelle_naf=r.get("libelle_activite_principale")
                or siege.get("libelle_activite_principale")
                or "",
                adresse=siege.get("adresse", "") or "",
                code_postal=siege.get("code_postal", "") or "",
                ville=siege.get("libelle_commune", "") or "",
                departement=siege.get("departement", "") or "",
                tranche_effectif=_LIBELLE_TRANCHE.get(
                    r.get("tranche_effectif_salarie", "") or "", ""
                ),
                date_creation=r.get("date_creation") or "",
                statut_actif=(r.get("etat_administratif", "A") == "A"),
                source=SourceType.RECHERCHE_ENTREPRISES,
                score_confiance=0.8,
            )
        except ValueError as exc:
            logger.debug("Résultat ignoré (SIREN invalide) : {}", exc)
            return None

        prenom = nom = role = ""
        for d in r.get("dirigeants") or []:
            if d.get("type_dirigeant") == "personne physique" or d.get("nom"):
                nom = d.get("nom", "") or ""
                prenom = d.get("prenoms", "") or ""
                role = d.get("qualite", "") or ""
                break

        prospect = Prospect(
            entreprise=entreprise,
            nom_dirigeant=nom,
            prenom=prenom,
            role=role,
            statut_pipeline=StatutPipeline.COLLECTE,
        )
        prospect.assigner_id()
        prospect.provenance["entreprise"] = SourceType.RECHERCHE_ENTREPRISES.value
        if nom:
            prospect.provenance["nom_dirigeant"] = SourceType.RECHERCHE_ENTREPRISES.value
        return prospect

    async def collecter(self, mission: Mission, client: ClientPoli) -> list[Prospect]:
        params = self._construire_params(mission)
        limite = mission.limite_prospects
        pages_max = math.ceil(limite / _PER_PAGE)
        prospects: list[Prospect] = []
        page = 1
        while len(prospects) < limite and page <= pages_max:
            params["page"] = page
            reponse = await client.fetch(_API, params=params, respecter_robots=False)
            if reponse is None:
                break
            if reponse.status_code != 200:
                logger.warning(
                    "API Recherche d'entreprises : HTTP {} (page {}). Arrêt.",
                    reponse.status_code,
                    page,
                )
                break
            data = reponse.json()
            resultats = data.get("results") or []
            if not resultats:
                break
            for r in resultats:
                prospect = self._result_vers_prospect(r)
                if prospect is not None:
                    prospects.append(prospect)
                    if len(prospects) >= limite:
                        break
            total_pages = int(data.get("total_pages") or page)
            if page >= total_pages:
                break
            page += 1
        logger.info(
            "Recherche d'entreprises : {} entreprises collectées.", len(prospects)
        )
        return prospects[:limite]
