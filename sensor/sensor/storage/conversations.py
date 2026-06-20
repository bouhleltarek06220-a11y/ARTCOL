"""Persistance des conversations + purge RGPD configurable.

Chaque client dispose de sa propre base SQLite de conversations. Une date de
purge est calculée à la création de chaque session (selon
`retention_jours_conversations`). La purge supprime définitivement les
conversations expirées.
"""

from __future__ import annotations

import json
import sqlite3
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path

from loguru import logger

from sensor.models import Conversation, Message, RoleMessage, Source


def _now() -> datetime:
    return datetime.now(timezone.utc)


class ConversationStore:
    """Accès SQLite aux conversations d'un client."""

    def __init__(self, chemin: Path, id_client: str, retention_jours: int = 90) -> None:
        self.chemin = Path(chemin)
        self.id_client = id_client
        self.retention_jours = retention_jours
        self.chemin.parent.mkdir(parents=True, exist_ok=True)
        self._conn = sqlite3.connect(str(self.chemin), check_same_thread=False)
        self._conn.row_factory = sqlite3.Row
        self._init_schema()

    def _init_schema(self) -> None:
        cur = self._conn.cursor()
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS conversations (
                id_session TEXT PRIMARY KEY,
                id_client TEXT NOT NULL,
                date_debut TEXT NOT NULL,
                date_derniere_activite TEXT NOT NULL,
                date_purge_prevue TEXT NOT NULL
            )
            """
        )
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                id_session TEXT NOT NULL,
                role TEXT NOT NULL,
                contenu TEXT NOT NULL,
                sources TEXT NOT NULL DEFAULT '[]',
                hors_scope INTEGER NOT NULL DEFAULT 0,
                horodatage TEXT NOT NULL,
                tokens_input INTEGER NOT NULL DEFAULT 0,
                tokens_output INTEGER NOT NULL DEFAULT 0,
                cout_estime_usd REAL NOT NULL DEFAULT 0.0,
                FOREIGN KEY (id_session) REFERENCES conversations(id_session) ON DELETE CASCADE
            )
            """
        )
        cur.execute("CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(id_session)")
        self._conn.commit()

    def creer_ou_recuperer(self, id_session: str | None) -> str:
        """Retourne une session existante ou en crée une nouvelle. Renvoie l'id_session."""
        if id_session:
            row = self._conn.execute(
                "SELECT id_session FROM conversations WHERE id_session = ?", (id_session,)
            ).fetchone()
            if row:
                return id_session
        nouvel_id = id_session or f"sess_{uuid.uuid4().hex[:16]}"
        maintenant = _now()
        purge = maintenant + timedelta(days=self.retention_jours)
        self._conn.execute(
            """
            INSERT OR IGNORE INTO conversations
                (id_session, id_client, date_debut, date_derniere_activite, date_purge_prevue)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                nouvel_id,
                self.id_client,
                maintenant.isoformat(),
                maintenant.isoformat(),
                purge.isoformat(),
            ),
        )
        self._conn.commit()
        return nouvel_id

    def ajouter_message(self, id_session: str, message: Message) -> None:
        sources_json = json.dumps(
            [s.model_dump(mode="json") for s in message.sources_citees], ensure_ascii=False
        )
        self._conn.execute(
            """
            INSERT INTO messages
                (id_session, role, contenu, sources, hors_scope, horodatage,
                 tokens_input, tokens_output, cout_estime_usd)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                id_session,
                message.role.value,
                message.contenu,
                sources_json,
                int(message.hors_scope),
                message.horodatage.isoformat(),
                message.tokens_input,
                message.tokens_output,
                message.cout_estime_usd,
            ),
        )
        self._conn.execute(
            "UPDATE conversations SET date_derniere_activite = ? WHERE id_session = ?",
            (_now().isoformat(), id_session),
        )
        self._conn.commit()

    def get_conversation(self, id_session: str) -> Conversation | None:
        conv = self._conn.execute(
            "SELECT * FROM conversations WHERE id_session = ?", (id_session,)
        ).fetchone()
        if conv is None:
            return None
        rows = self._conn.execute(
            "SELECT * FROM messages WHERE id_session = ? ORDER BY id ASC", (id_session,)
        ).fetchall()
        messages = [
            Message(
                role=RoleMessage(r["role"]),
                contenu=r["contenu"],
                sources_citees=[Source.model_validate(s) for s in json.loads(r["sources"])],
                hors_scope=bool(r["hors_scope"]),
                horodatage=r["horodatage"],
                tokens_input=r["tokens_input"],
                tokens_output=r["tokens_output"],
                cout_estime_usd=r["cout_estime_usd"],
            )
            for r in rows
        ]
        return Conversation(
            id_session=conv["id_session"],
            id_client=conv["id_client"],
            date_debut=conv["date_debut"],
            date_derniere_activite=conv["date_derniere_activite"],
            messages=messages,
        )

    def purger_expirees(self) -> int:
        """Supprime les conversations dont la date de purge est dépassée. Renvoie le nb supprimé."""
        maintenant = _now().isoformat()
        sessions = [
            r["id_session"]
            for r in self._conn.execute(
                "SELECT id_session FROM conversations WHERE date_purge_prevue < ?",
                (maintenant,),
            ).fetchall()
        ]
        if not sessions:
            return 0
        marqueurs = ",".join("?" * len(sessions))
        self._conn.execute(
            f"DELETE FROM messages WHERE id_session IN ({marqueurs})", sessions
        )
        self._conn.execute(
            f"DELETE FROM conversations WHERE id_session IN ({marqueurs})", sessions
        )
        self._conn.commit()
        logger.info("Purge RGPD : {} conversation(s) supprimée(s).", len(sessions))
        return len(sessions)

    def compter_conversations(self) -> int:
        row = self._conn.execute("SELECT COUNT(*) AS n FROM conversations").fetchone()
        return int(row["n"])

    def close(self) -> None:
        self._conn.close()
