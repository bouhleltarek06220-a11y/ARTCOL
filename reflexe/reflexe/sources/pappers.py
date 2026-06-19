"""Source d'enrichissement : Pappers (API officielle, clé optionnelle).

Complète une fiche avec les dirigeants, le site web déclaré et les informations
légales. Sans clé `PAPPERS_API_KEY`, la source est sautée proprement.
"""

from __future__ import annotations

from loguru import logger

from reflexe.models import Prospect, SourceType
from reflexe.ratelimit import ClientPoli
from reflexe.sources.base import BaseSource

_API = "https://api.pappers.fr/v2/entreprise"


class SourcePappers(BaseSource):
    type = SourceType.PAPPERS
    peut_collecter = False
    peut_enrichir = True

    def est_configuree(self) -> bool:
        return bool(self.settings.pappers_api_key)

    def raison_indisponible(self) -> str:
        if not self.est_configuree():
            return "Clé PAPPERS_API_KEY absente : enrichissement Pappers ignoré."
        return ""

    async def enrichir(self, prospect: Prospect, client: ClientPoli) -> Prospect:
        if not self.est_configuree():
            return prospect
        params = {
            "api_token": self.settings.pappers_api_key,
            "siren": prospect.entreprise.siren,
        }
        try:
            reponse = await client.fetch(_API, params=params, respecter_robots=False)
        except Exception as exc:  # noqa: BLE001 — une source ne doit jamais tout casser
            logger.warning("Pappers indisponible pour {} : {}", prospect.entreprise.siren, exc)
            return prospect
        if reponse is None or reponse.status_code != 200:
            code = getattr(reponse, "status_code", "—")
            logger.debug("Pappers : HTTP {} pour {}.", code, prospect.entreprise.siren)
            return prospect

        data = reponse.json()

        site = data.get("site_web") or ""
        if site and not prospect.entreprise.site_web:
            prospect.entreprise.site_web = site
            prospect.provenance["site_web"] = SourceType.PAPPERS.value

        tel = data.get("telephone") or ""
        if tel and not prospect.entreprise.telephone:
            prospect.entreprise.telephone = tel
            prospect.provenance["telephone"] = SourceType.PAPPERS.value

        email = data.get("email") or ""
        if email and not prospect.email:
            prospect.email = email
            prospect.email_source = SourceType.PAPPERS.value
            prospect.provenance["email"] = SourceType.PAPPERS.value

        if not prospect.nom_dirigeant:
            for rep in data.get("representants") or []:
                if rep.get("personne_morale"):
                    continue
                nom = rep.get("nom", "") or ""
                if not nom:
                    continue
                prospect.nom_dirigeant = nom
                prospect.prenom = rep.get("prenom", "") or ""
                prospect.role = rep.get("qualite", "") or ""
                prospect.provenance["nom_dirigeant"] = SourceType.PAPPERS.value
                break

        prospect.entreprise.score_confiance = min(
            1.0, prospect.entreprise.score_confiance + 0.1
        )
        return prospect
