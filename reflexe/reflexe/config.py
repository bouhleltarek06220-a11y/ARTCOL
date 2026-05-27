"""Chargement de la configuration : variables d'environnement (.env) et
fichiers de mission YAML. Validation stricte via pydantic, messages lisibles.
"""

from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path

import yaml
from dotenv import load_dotenv
from pydantic import BaseModel, Field, ValidationError

from reflexe.models import Mission

load_dotenv()


class Settings(BaseModel):
    """Paramètres runtime issus de l'environnement. Aucun secret en dur."""

    anthropic_api_key: str = ""
    pappers_api_key: str = ""
    brevo_api_key: str = ""
    brevo_list_ids: list[int] = Field(default_factory=list)
    email_verify_api_key: str = ""

    modele_scoring: str = "claude-haiku-4-5"
    modele_message: str = "claude-sonnet-4-6"

    delai_domaine: float = 1.5
    concurrence_max: int = 8
    user_agent: str = "ReflexeBot/0.1 (+prospection B2B; contact via site)"

    data_dir: Path = Path("data")
    logs_dir: Path = Path("logs")
    log_level: str = "INFO"

    @property
    def db_path(self) -> Path:
        return self.data_dir / "reflexe.db"

    def exiger_anthropic(self) -> str:
        """Renvoie la clé Anthropic ou lève une erreur explicite si absente."""
        if not self.anthropic_api_key:
            raise RuntimeError(
                "ANTHROPIC_API_KEY manquante. Renseignez-la dans le fichier .env "
                "(voir .env.example)."
            )
        return self.anthropic_api_key


def _parse_list_ids(brut: str) -> list[int]:
    ids: list[int] = []
    for morceau in (brut or "").replace(";", ",").split(","):
        morceau = morceau.strip()
        if morceau.isdigit():
            ids.append(int(morceau))
    return ids


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Construit (une seule fois) les Settings depuis l'environnement."""

    def _f(nom: str, defaut: float) -> float:
        try:
            return float(os.getenv(nom, "") or defaut)
        except ValueError:
            return defaut

    def _i(nom: str, defaut: int) -> int:
        try:
            return int(os.getenv(nom, "") or defaut)
        except ValueError:
            return defaut

    settings = Settings(
        anthropic_api_key=os.getenv("ANTHROPIC_API_KEY", ""),
        pappers_api_key=os.getenv("PAPPERS_API_KEY", ""),
        brevo_api_key=os.getenv("BREVO_API_KEY", ""),
        brevo_list_ids=_parse_list_ids(os.getenv("BREVO_LIST_IDS", "")),
        email_verify_api_key=os.getenv("EMAIL_VERIFY_API_KEY", ""),
        modele_scoring=os.getenv("REFLEXE_MODELE_SCORING", "") or "claude-haiku-4-5",
        modele_message=os.getenv("REFLEXE_MODELE_MESSAGE", "") or "claude-sonnet-4-6",
        delai_domaine=_f("REFLEXE_DELAI_DOMAINE", 1.5),
        concurrence_max=_i("REFLEXE_CONCURRENCE_MAX", 8),
        user_agent=os.getenv("REFLEXE_USER_AGENT", "")
        or "ReflexeBot/0.1 (+prospection B2B; contact via site)",
        data_dir=Path(os.getenv("REFLEXE_DATA_DIR", "data")),
        logs_dir=Path(os.getenv("REFLEXE_LOGS_DIR", "logs")),
        log_level=(os.getenv("REFLEXE_LOG_LEVEL", "INFO") or "INFO").upper(),
    )
    settings.data_dir.mkdir(parents=True, exist_ok=True)
    settings.logs_dir.mkdir(parents=True, exist_ok=True)
    return settings


def charger_mission(chemin: str | Path) -> Mission:
    """Charge et valide un fichier de mission YAML.

    Lève une erreur lisible si le fichier est introuvable ou invalide.
    """
    chemin = Path(chemin)
    if not chemin.exists():
        raise FileNotFoundError(f"Fichier de mission introuvable : {chemin}")
    try:
        brut = yaml.safe_load(chemin.read_text(encoding="utf-8")) or {}
    except yaml.YAMLError as exc:
        raise ValueError(f"YAML invalide dans {chemin} : {exc}") from exc
    if not isinstance(brut, dict):
        raise ValueError(f"Le fichier de mission {chemin} doit être un mapping YAML.")
    try:
        return Mission(**brut)
    except ValidationError as exc:
        raise ValueError(
            f"Mission invalide ({chemin}) :\n{exc}"
        ) from exc
