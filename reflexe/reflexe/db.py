"""Couche de persistance SQLite.

Stocke les prospects (upsert idempotent sur l'id stable), le journal des jobs et
l'état des jobs pour permettre la reprise (`resume`) et la déduplication entre
exécutions. Volontairement synchrone : les écritures sont rapides et locales,
seules les I/O réseau du pipeline sont asynchrones.
"""

from __future__ import annotations

import sqlite3
from datetime import datetime, timezone
from pathlib import Path

from reflexe.models import JobLog, Prospect, StatutPipeline

_SCHEMA = """
CREATE TABLE IF NOT EXISTS prospects (
    id          TEXT PRIMARY KEY,
    job_id      TEXT NOT NULL,
    siren       TEXT,
    email       TEXT,
    statut      TEXT,
    score       INTEGER DEFAULT 0,
    data        TEXT NOT NULL,
    date_maj    TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_prospects_job   ON prospects(job_id);
CREATE INDEX IF NOT EXISTS idx_prospects_email ON prospects(email);
CREATE INDEX IF NOT EXISTS idx_prospects_statut ON prospects(statut);

CREATE TABLE IF NOT EXISTS jobs (
    job_id       TEXT PRIMARY KEY,
    mission_nom  TEXT,
    mission_path TEXT,
    statut       TEXT,
    date_debut   TEXT,
    date_fin     TEXT
);

CREATE TABLE IF NOT EXISTS job_logs (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id           TEXT,
    mission          TEXT,
    source           TEXT,
    horodatage       TEXT,
    niveau           TEXT,
    message          TEXT,
    lignes_trouvees  INTEGER DEFAULT 0,
    erreurs          INTEGER DEFAULT 0,
    refus            INTEGER DEFAULT 0,
    champs_manquants INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_logs_job ON job_logs(job_id);
"""


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class Database:
    """Accès SQLite. Instancier avec le chemin du fichier de base."""

    def __init__(self, chemin: str | Path) -> None:
        self.chemin = Path(chemin)
        self.chemin.parent.mkdir(parents=True, exist_ok=True)
        self.conn = sqlite3.connect(str(self.chemin))
        self.conn.row_factory = sqlite3.Row
        self.conn.execute("PRAGMA journal_mode=WAL;")
        self.conn.executescript(_SCHEMA)
        self.conn.commit()

    def close(self) -> None:
        self.conn.close()

    def __enter__(self) -> "Database":
        return self

    def __exit__(self, *exc: object) -> None:
        self.close()

    # ----------------------------------------------------------------- jobs --
    def creer_job(self, job_id: str, mission_nom: str, mission_path: str) -> None:
        self.conn.execute(
            "INSERT OR REPLACE INTO jobs(job_id, mission_nom, mission_path, statut, "
            "date_debut, date_fin) VALUES (?,?,?,?,?,NULL)",
            (job_id, mission_nom, mission_path, "en_cours", _now_iso()),
        )
        self.conn.commit()

    def terminer_job(self, job_id: str, statut: str = "terminé") -> None:
        self.conn.execute(
            "UPDATE jobs SET statut=?, date_fin=? WHERE job_id=?",
            (statut, _now_iso(), job_id),
        )
        self.conn.commit()

    def get_job(self, job_id: str) -> sqlite3.Row | None:
        cur = self.conn.execute("SELECT * FROM jobs WHERE job_id=?", (job_id,))
        return cur.fetchone()

    def lister_jobs(self, limite: int = 20) -> list[sqlite3.Row]:
        cur = self.conn.execute(
            "SELECT * FROM jobs ORDER BY date_debut DESC LIMIT ?", (limite,)
        )
        return cur.fetchall()

    # ------------------------------------------------------------ prospects --
    def upsert_prospect(self, prospect: Prospect, job_id: str) -> None:
        """Insère ou met à jour un prospect (idempotent sur son id stable)."""
        if not prospect.id:
            prospect.assigner_id()
        prospect.date_maj = datetime.now(timezone.utc)
        self.conn.execute(
            "INSERT INTO prospects(id, job_id, siren, email, statut, score, data, date_maj) "
            "VALUES (?,?,?,?,?,?,?,?) "
            "ON CONFLICT(id) DO UPDATE SET job_id=excluded.job_id, siren=excluded.siren, "
            "email=excluded.email, statut=excluded.statut, score=excluded.score, "
            "data=excluded.data, date_maj=excluded.date_maj",
            (
                prospect.id,
                job_id,
                prospect.entreprise.siren,
                prospect.email,
                prospect.statut_pipeline.value,
                prospect.score_icp,
                prospect.model_dump_json(),
                prospect.date_maj.isoformat(),
            ),
        )
        self.conn.commit()

    def upsert_plusieurs(self, prospects: list[Prospect], job_id: str) -> None:
        for p in prospects:
            self.upsert_prospect(p, job_id)

    def get_prospect(self, prospect_id: str) -> Prospect | None:
        cur = self.conn.execute(
            "SELECT data FROM prospects WHERE id=?", (prospect_id,)
        )
        row = cur.fetchone()
        return Prospect.model_validate_json(row["data"]) if row else None

    def get_prospects(
        self, job_id: str, statut: StatutPipeline | None = None
    ) -> list[Prospect]:
        if statut is not None:
            cur = self.conn.execute(
                "SELECT data FROM prospects WHERE job_id=? AND statut=?",
                (job_id, statut.value),
            )
        else:
            cur = self.conn.execute(
                "SELECT data FROM prospects WHERE job_id=?", (job_id,)
            )
        return [Prospect.model_validate_json(r["data"]) for r in cur.fetchall()]

    def compter_par_statut(self, job_id: str) -> dict[str, int]:
        cur = self.conn.execute(
            "SELECT statut, COUNT(*) AS n FROM prospects WHERE job_id=? GROUP BY statut",
            (job_id,),
        )
        return {r["statut"]: r["n"] for r in cur.fetchall()}

    def email_deja_collecte(self, email: str, hors_job: str | None = None) -> bool:
        """Déduplication inter-exécutions : cet email a-t-il déjà été collecté ?"""
        email = (email or "").strip().lower()
        if not email:
            return False
        if hors_job:
            cur = self.conn.execute(
                "SELECT 1 FROM prospects WHERE lower(email)=? AND job_id<>? LIMIT 1",
                (email, hors_job),
            )
        else:
            cur = self.conn.execute(
                "SELECT 1 FROM prospects WHERE lower(email)=? LIMIT 1", (email,)
            )
        return cur.fetchone() is not None

    # ----------------------------------------------------------------- logs --
    def ajouter_log(self, entree: JobLog) -> None:
        self.conn.execute(
            "INSERT INTO job_logs(job_id, mission, source, horodatage, niveau, message, "
            "lignes_trouvees, erreurs, refus, champs_manquants) VALUES (?,?,?,?,?,?,?,?,?,?)",
            (
                entree.job_id,
                entree.mission,
                entree.source,
                entree.horodatage.isoformat(),
                entree.niveau.value,
                entree.message,
                entree.lignes_trouvees,
                entree.erreurs,
                entree.refus,
                entree.champs_manquants,
            ),
        )
        self.conn.commit()

    def get_logs(self, job_id: str) -> list[sqlite3.Row]:
        cur = self.conn.execute(
            "SELECT * FROM job_logs WHERE job_id=? ORDER BY id ASC", (job_id,)
        )
        return cur.fetchall()
