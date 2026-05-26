"""Journalisation analytique et statistiques d'usage.

Pour chaque question traitée, on enregistre : le texte, le statut (répondu /
hors-scope), les sources citées, les tokens consommés, le coût estimé et la
durée. Ces données alimentent la route admin de statistiques. Le top des
questions sans réponse est l'indicateur clé d'amélioration de la base.

Aucune donnée secrète n'est journalisée ; seules les questions et métriques.
"""

from __future__ import annotations

import sqlite3
from datetime import datetime, timezone
from pathlib import Path

from loguru import logger


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


class AnalyticsLogger:
    """Écrit et agrège les événements analytiques d'un client (même base que les conversations)."""

    def __init__(self, chemin: Path, id_client: str) -> None:
        self.chemin = Path(chemin)
        self.id_client = id_client
        self.chemin.parent.mkdir(parents=True, exist_ok=True)
        self._conn = sqlite3.connect(str(self.chemin), check_same_thread=False)
        self._conn.row_factory = sqlite3.Row
        self._init_schema()

    def _init_schema(self) -> None:
        self._conn.execute(
            """
            CREATE TABLE IF NOT EXISTS analytics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                id_client TEXT NOT NULL,
                id_session TEXT NOT NULL,
                question TEXT NOT NULL,
                hors_scope INTEGER NOT NULL,
                nb_sources INTEGER NOT NULL DEFAULT 0,
                meilleur_score REAL NOT NULL DEFAULT 0.0,
                tokens_input INTEGER NOT NULL DEFAULT 0,
                tokens_output INTEGER NOT NULL DEFAULT 0,
                cout_estime_usd REAL NOT NULL DEFAULT 0.0,
                duree_ms INTEGER NOT NULL DEFAULT 0,
                horodatage TEXT NOT NULL
            )
            """
        )
        self._conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_analytics_client ON analytics(id_client)"
        )
        self._conn.commit()

    def enregistrer(
        self,
        id_session: str,
        question: str,
        hors_scope: bool,
        nb_sources: int,
        meilleur_score: float,
        tokens_input: int,
        tokens_output: int,
        cout_estime_usd: float,
        duree_ms: int,
    ) -> None:
        self._conn.execute(
            """
            INSERT INTO analytics
                (id_client, id_session, question, hors_scope, nb_sources, meilleur_score,
                 tokens_input, tokens_output, cout_estime_usd, duree_ms, horodatage)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                self.id_client,
                id_session,
                question,
                int(hors_scope),
                nb_sources,
                round(meilleur_score, 4),
                tokens_input,
                tokens_output,
                cout_estime_usd,
                duree_ms,
                _now(),
            ),
        )
        self._conn.commit()
        logger.debug(
            "Analytics : question enregistrée (hors_scope={}, coût={:.5f}$).",
            hors_scope,
            cout_estime_usd,
        )

    def statistiques(self, top_n: int = 10) -> dict:
        """Agrège les statistiques d'usage pour la route admin."""
        cur = self._conn.cursor()
        total = cur.execute(
            "SELECT COUNT(*) AS n FROM analytics WHERE id_client = ?", (self.id_client,)
        ).fetchone()["n"]
        hors_scope = cur.execute(
            "SELECT COUNT(*) AS n FROM analytics WHERE id_client = ? AND hors_scope = 1",
            (self.id_client,),
        ).fetchone()["n"]
        agregats = cur.execute(
            """
            SELECT COALESCE(SUM(cout_estime_usd), 0) AS cout,
                   COALESCE(SUM(tokens_input), 0) AS t_in,
                   COALESCE(SUM(tokens_output), 0) AS t_out,
                   COALESCE(AVG(duree_ms), 0) AS duree
            FROM analytics WHERE id_client = ?
            """,
            (self.id_client,),
        ).fetchone()
        repondu = total - hors_scope
        taux_reponse = (repondu / total) if total else 0.0
        taux_hors_scope = (hors_scope / total) if total else 0.0

        top_sans_reponse = [
            {"question": r["question"], "occurrences": r["n"]}
            for r in cur.execute(
                """
                SELECT question, COUNT(*) AS n
                FROM analytics
                WHERE id_client = ? AND hors_scope = 1
                GROUP BY lower(trim(question))
                ORDER BY n DESC, MAX(horodatage) DESC
                LIMIT ?
                """,
                (self.id_client, top_n),
            ).fetchall()
        ]

        return {
            "id_client": self.id_client,
            "nb_questions": total,
            "nb_repondues": repondu,
            "nb_hors_scope": hors_scope,
            "taux_reponse": round(taux_reponse, 4),
            "taux_hors_scope": round(taux_hors_scope, 4),
            "cout_total_usd": round(agregats["cout"], 4),
            "tokens_input_total": agregats["t_in"],
            "tokens_output_total": agregats["t_out"],
            "duree_moyenne_ms": round(agregats["duree"], 1),
            "top_questions_sans_reponse": top_sans_reponse,
        }

    def close(self) -> None:
        self._conn.close()
