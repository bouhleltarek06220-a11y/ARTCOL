"""Orchestrateur : enchaîne tout le pipeline de prospection.

collecte → nettoyage → déduplication → enrichissement → scoring → personnalisation
→ sélection → export → push Brevo. Chaque étape écrit un checkpoint en base
(statut par prospect) pour permettre la reprise (`reprendre`). Une source qui
échoue est journalisée mais n'interrompt pas le job.
"""

from __future__ import annotations

import re
from collections.abc import Callable
from datetime import datetime, timezone

from loguru import logger

from reflexe.config import Settings
from reflexe.db import Database
from reflexe.llm import ClaudeLLM
from reflexe.models import JobLog, Mission, NiveauLog, Prospect, SourceType, StatutPipeline
from reflexe.outputs import brevo as brevo_out
from reflexe.outputs import export as export_out
from reflexe.pipeline import clean as clean_step
from reflexe.pipeline import dedupe as dedupe_step
from reflexe.pipeline import enrich as enrich_step
from reflexe.pipeline import personalize as perso_step
from reflexe.pipeline import score as score_step
from reflexe.ratelimit import ClientPoli
from reflexe.sources import (
    SourcePappers,
    SourceRechercheEntreprises,
    SourceWebsite,
)
from reflexe.sources.base import BaseSource

_FABRIQUES: dict[SourceType, type[BaseSource]] = {
    SourceType.RECHERCHE_ENTREPRISES: SourceRechercheEntreprises,
    SourceType.PAPPERS: SourcePappers,
    SourceType.WEBSITE: SourceWebsite,
}

_ORDRE_STATUT = {
    StatutPipeline.COLLECTE: 0,
    StatutPipeline.NETTOYE: 1,
    StatutPipeline.ENRICHI: 2,
    StatutPipeline.SCORE: 3,
    StatutPipeline.PERSONNALISE: 4,
    StatutPipeline.PRET_ENVOI: 5,
    StatutPipeline.POUSSE_BREVO: 6,
}

Reporter = Callable[[str, str], None]


def _slug(texte: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", texte.lower()).strip("-") or "mission"


def _nouvel_id_job(mission_nom: str) -> str:
    horod = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
    return f"{_slug(mission_nom)}-{horod}"


class Orchestrateur:
    def __init__(self, settings: Settings, db: Database) -> None:
        self.settings = settings
        self.db = db

    # --------------------------------------------------------------- utils --
    def _journaliser(
        self,
        job_id: str,
        mission_nom: str,
        message: str,
        *,
        source: str = "",
        niveau: NiveauLog = NiveauLog.INFO,
        lignes: int = 0,
        erreurs: int = 0,
        refus: int = 0,
        champs_manquants: int = 0,
    ) -> None:
        self.db.ajouter_log(
            JobLog(
                job_id=job_id,
                mission=mission_nom,
                source=source,
                niveau=niveau,
                message=message,
                lignes_trouvees=lignes,
                erreurs=erreurs,
                refus=refus,
                champs_manquants=champs_manquants,
            )
        )
        logger.info("[{}] {}", job_id, message)

    def _instancier_sources(
        self, mission: Mission
    ) -> tuple[list[BaseSource], list[BaseSource]]:
        collecteurs: list[BaseSource] = []
        enrichisseurs: list[BaseSource] = []
        for type_source in mission.sources_actives:
            fabrique = _FABRIQUES.get(type_source)
            if fabrique is None:
                logger.warning("Source inconnue ignorée : {}", type_source)
                continue
            source = fabrique(self.settings)
            if not source.est_configuree():
                logger.info(source.raison_indisponible())
                continue
            if source.peut_collecter:
                collecteurs.append(source)
            if source.peut_enrichir:
                enrichisseurs.append(source)
        return collecteurs, enrichisseurs

    @staticmethod
    def _rapport(reporter: Reporter | None, etape: str, info: str) -> None:
        if reporter is not None:
            reporter(etape, info)

    # ------------------------------------------------------------- exécuter --
    async def executer(
        self,
        mission: Mission,
        mission_path: str,
        *,
        dry_run: bool = False,
        limite_override: int | None = None,
        reporter: Reporter | None = None,
    ) -> dict:
        if limite_override is not None:
            mission.limite_prospects = max(1, limite_override)

        job_id = _nouvel_id_job(mission.nom)
        self.db.creer_job(job_id, mission.nom, mission_path)
        self._journaliser(
            job_id, mission.nom, f"Démarrage du job (limite={mission.limite_prospects})."
        )

        collecteurs, enrichisseurs = self._instancier_sources(mission)
        if not collecteurs:
            self._journaliser(
                job_id,
                mission.nom,
                "Aucune source de collecte configurée — job vide.",
                niveau=NiveauLog.ERROR,
            )
            self.db.terminer_job(job_id, "échec")
            return {"job_id": job_id, "prospects": 0}

        # --- Collecte ---
        self._rapport(reporter, "collecte", "Collecte multi-sources…")
        prospects: list[Prospect] = []
        async with ClientPoli(
            self.settings.user_agent,
            self.settings.delai_domaine,
            self.settings.concurrence_max,
        ) as client:
            for source in collecteurs:
                try:
                    trouves = await source.collecter(mission, client)
                except Exception as exc:  # noqa: BLE001
                    self._journaliser(
                        job_id,
                        mission.nom,
                        f"Source {source.type.value} en échec : {exc}",
                        source=source.type.value,
                        niveau=NiveauLog.ERROR,
                        erreurs=1,
                    )
                    continue
                prospects.extend(trouves)
                self._journaliser(
                    job_id,
                    mission.nom,
                    f"Collecte sur {source.type.value} : {len(trouves)} entreprises trouvées.",
                    source=source.type.value,
                    lignes=len(trouves),
                )

            prospects = prospects[: mission.limite_prospects]
            for p in prospects:
                self.db.upsert_prospect(p, job_id)

            return await self._pipeline_depuis(
                prospects,
                mission,
                job_id,
                "clean",
                client=client,
                enrichisseurs=enrichisseurs,
                dry_run=dry_run,
                reporter=reporter,
            )

    # ------------------------------------------------------------- reprendre --
    async def reprendre(
        self,
        job_id: str,
        *,
        dry_run: bool = False,
        reporter: Reporter | None = None,
    ) -> dict:
        from reflexe.config import charger_mission

        job = self.db.get_job(job_id)
        if job is None:
            raise ValueError(f"Job introuvable : {job_id}")
        mission = charger_mission(job["mission_path"])
        prospects = self.db.get_prospects(job_id)
        if not prospects:
            raise ValueError(f"Aucun prospect enregistré pour le job {job_id}.")

        actifs = [p for p in prospects if p.statut_pipeline != StatutPipeline.EXCLU]
        min_ordre = min((_ORDRE_STATUT[p.statut_pipeline] for p in actifs), default=0)
        if min_ordre < 1:
            etape = "clean"
        elif min_ordre < 2:
            etape = "enrich"
        elif min_ordre < 3:
            etape = "score"
        elif min_ordre < 4:
            etape = "personalize"
        else:
            etape = "export"

        self._journaliser(
            job_id, mission.nom, f"Reprise du job à l'étape « {etape} »."
        )
        _, enrichisseurs = self._instancier_sources(mission)
        async with ClientPoli(
            self.settings.user_agent,
            self.settings.delai_domaine,
            self.settings.concurrence_max,
        ) as client:
            return await self._pipeline_depuis(
                prospects,
                mission,
                job_id,
                etape,
                client=client,
                enrichisseurs=enrichisseurs,
                dry_run=dry_run,
                reporter=reporter,
            )

    # ------------------------------------------------------- pipeline commun --
    async def _pipeline_depuis(
        self,
        prospects: list[Prospect],
        mission: Mission,
        job_id: str,
        etape_depart: str,
        *,
        client: ClientPoli,
        enrichisseurs: list[BaseSource],
        dry_run: bool,
        reporter: Reporter | None,
    ) -> dict:
        ordre = ["clean", "enrich", "score", "personalize", "export"]
        a_faire = ordre[ordre.index(etape_depart) :]

        if "clean" in a_faire:
            self._rapport(reporter, "nettoyage", "Nettoyage & déduplication…")
            for p in prospects:
                clean_step.nettoyer_prospect(p)
            prospects, fusions = dedupe_step.dedupliquer(prospects)
            for p in prospects:
                if p.statut_pipeline == StatutPipeline.COLLECTE:
                    p.statut_pipeline = StatutPipeline.NETTOYE
                self.db.upsert_prospect(p, job_id)
            self._journaliser(
                job_id, mission.nom, f"{fusions} doublons fusionnés.", lignes=len(prospects)
            )

        if "enrich" in a_faire:
            self._rapport(reporter, "enrichissement", "Enrichissement des fiches…")
            stats = await enrich_step.enrichir_prospects(prospects, enrichisseurs, client)
            self._appliquer_exclusions(prospects, mission, job_id)
            for p in prospects:
                self.db.upsert_prospect(p, job_id)
            self._journaliser(
                job_id,
                mission.nom,
                f"{stats['emails_trouves']} emails trouvés, "
                f"{stats['emails_verifies']} vérifiés, "
                f"{stats['non_verifiables']} non vérifiables.",
                champs_manquants=sum(1 for p in prospects if not p.email),
            )

        llm = self._creer_llm()

        if "score" in a_faire:
            self._rapport(reporter, "scoring", "Scoring ICP (Claude)…")
            if llm is not None:
                await score_step.scorer(prospects, mission, llm)
            else:
                self._journaliser(
                    job_id,
                    mission.nom,
                    "Scoring sauté : ANTHROPIC_API_KEY absente.",
                    niveau=NiveauLog.WARNING,
                )
            for p in prospects:
                self.db.upsert_prospect(p, job_id)

        if "personalize" in a_faire:
            self._rapport(reporter, "personnalisation", "Rédaction des messages (Claude)…")
            if llm is not None:
                nb = await perso_step.personnaliser(prospects, mission, llm)
                detail = f"{nb} messages générés. Coût LLM estimé : ${llm.cout_total:.4f}."
            else:
                nb = 0
                detail = "0 message généré (ANTHROPIC_API_KEY absente)."
            self._marquer_prets(prospects, mission)
            for p in prospects:
                self.db.upsert_prospect(p, job_id)
            self._journaliser(job_id, mission.nom, detail)

        # --- Export (toujours) ---
        self._rapport(reporter, "export", "Export CSV + JSON…")
        chemins = export_out.exporter(
            prospects, self.settings.data_dir / "exports", job_id, "csv,json"
        )
        self._journaliser(
            job_id,
            mission.nom,
            "Export : " + ", ".join(str(c) for c in chemins),
        )

        # --- Push Brevo ---
        self._rapport(reporter, "brevo", "Push Brevo…" if not dry_run else "Brevo (dry-run)…")
        list_ids = self.settings.brevo_list_ids
        stats_brevo = await brevo_out.pousser_prospects(
            prospects, self.settings.brevo_api_key, list_ids, dry_run=dry_run
        )
        for p in prospects:
            self.db.upsert_prospect(p, job_id)
        self._journaliser(
            job_id,
            mission.nom,
            f"Brevo : {stats_brevo['pousses']} poussés, {stats_brevo['simules']} simulés, "
            f"{stats_brevo['erreurs']} erreurs (sur {stats_brevo['eligibles']} éligibles).",
        )

        self.db.terminer_job(job_id, "terminé")
        repartition = self.db.compter_par_statut(job_id)
        return {
            "job_id": job_id,
            "prospects": len(prospects),
            "repartition": repartition,
            "brevo": stats_brevo,
            "cout_llm": round(llm.cout_total, 4) if llm else 0.0,
            "exports": [str(c) for c in chemins],
        }

    # ---------------------------------------------------------- sous-étapes --
    def _creer_llm(self) -> ClaudeLLM | None:
        if not self.settings.anthropic_api_key:
            return None
        return ClaudeLLM(
            self.settings.anthropic_api_key,
            self.settings.modele_scoring,
            self.settings.modele_message,
        )

    def _appliquer_exclusions(
        self, prospects: list[Prospect], mission: Mission, job_id: str
    ) -> None:
        exclus = 0
        for p in prospects:
            domaine_site = ""
            if p.entreprise.site_web:
                domaine_site = (
                    p.entreprise.site_web.split("//")[-1].split("/")[0].lstrip("www.")
                )
            if mission.exclusions.est_exclu(p.email) or (
                domaine_site
                and domaine_site.lower()
                in {d.strip().lower().lstrip("@") for d in mission.exclusions.domaines}
            ):
                p.statut_pipeline = StatutPipeline.EXCLU
                exclus += 1
        if exclus:
            self._journaliser(
                job_id, mission.nom, f"{exclus} prospects exclus (liste noire).", refus=exclus
            )

    @staticmethod
    def _marquer_prets(prospects: list[Prospect], mission: Mission) -> None:
        for p in prospects:
            if (
                p.statut_pipeline == StatutPipeline.PERSONNALISE
                and p.score_icp >= mission.seuil_score_min
                and p.email
            ):
                p.statut_pipeline = StatutPipeline.PRET_ENVOI
