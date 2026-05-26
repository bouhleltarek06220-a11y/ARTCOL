"""Chargement de la configuration SENSOR.

Deux niveaux :
1. `Settings` : secrets et chemins globaux, lus depuis l'environnement / `.env`.
2. `ClientConfig` : configuration par tenant, lue depuis `clients/<id_client>.yaml`.

Les deux sont validés par pydantic ; toute incohérence lève une erreur lisible
au démarrage plutôt qu'un comportement silencieux en production.
"""

from __future__ import annotations

import functools
from pathlib import Path

import yaml
from loguru import logger
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

from sensor.models import ClientConfig


class Settings(BaseSettings):
    """Secrets et paramètres globaux (jamais committés, lus depuis `.env`)."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    # Anthropic (génération)
    anthropic_api_key: str = Field(default="", alias="ANTHROPIC_API_KEY")

    # Sécurité API
    sensor_admin_key: str = Field(default="", alias="SENSOR_ADMIN_KEY")

    # Embeddings API (Voyage)
    voyage_api_key: str = Field(default="", alias="VOYAGE_API_KEY")
    voyage_model: str = Field(default="voyage-3", alias="VOYAGE_MODEL")

    # Supabase (option pgvector)
    supabase_url: str = Field(default="", alias="SUPABASE_URL")
    supabase_key: str = Field(default="", alias="SUPABASE_KEY")

    # Chemins
    data_dir: Path = Field(default=Path("data"), alias="SENSOR_DATA_DIR")
    logs_dir: Path = Field(default=Path("logs"), alias="SENSOR_LOGS_DIR")
    clients_dir: Path = Field(default=Path("clients"), alias="SENSOR_CLIENTS_DIR")

    # Serveur
    host: str = Field(default="0.0.0.0", alias="SENSOR_HOST")
    port: int = Field(default=8000, alias="SENSOR_PORT")
    log_level: str = Field(default="INFO", alias="SENSOR_LOG_LEVEL")

    def assurer_repertoires(self) -> None:
        """Crée les répertoires runtime s'ils n'existent pas."""
        for d in (self.data_dir, self.logs_dir, self.clients_dir):
            d.mkdir(parents=True, exist_ok=True)

    def chemin_base_vectorielle(self, id_client: str) -> Path:
        """Chemin du fichier SQLite de la base vectorielle d'un client."""
        return self.data_dir / f"{id_client}_vectors.db"

    def chemin_conversations(self, id_client: str) -> Path:
        """Chemin du fichier SQLite des conversations + analytics d'un client."""
        return self.data_dir / f"{id_client}_conversations.db"

    def chemin_config_client(self, id_client: str) -> Path:
        return self.clients_dir / f"{id_client}.yaml"


@functools.lru_cache
def get_settings() -> Settings:
    """Singleton des settings (mis en cache pour éviter de relire `.env` partout)."""
    settings = Settings()
    settings.assurer_repertoires()
    return settings


def charger_config_client(id_client: str, settings: Settings | None = None) -> ClientConfig:
    """Charge et valide la configuration YAML d'un client.

    Lève FileNotFoundError si la config n'existe pas, et ValueError (via pydantic)
    si elle est invalide.
    """
    settings = settings or get_settings()
    chemin = settings.chemin_config_client(id_client)
    if not chemin.exists():
        raise FileNotFoundError(
            f"Configuration introuvable pour le client {id_client!r} : {chemin}. "
            f"Créez-la avec `sensor init-client --id {id_client} --nom \"...\"`."
        )
    with chemin.open("r", encoding="utf-8") as f:
        donnees = yaml.safe_load(f) or {}
    config = ClientConfig.model_validate(donnees)
    if config.id_client != id_client:
        raise ValueError(
            f"Incohérence : le fichier {chemin.name} déclare id_client={config.id_client!r} "
            f"mais a été chargé pour {id_client!r}."
        )
    return config


def lister_clients(settings: Settings | None = None) -> list[str]:
    """Liste les identifiants de clients disponibles (fichiers YAML présents)."""
    settings = settings or get_settings()
    if not settings.clients_dir.exists():
        return []
    return sorted(
        p.stem
        for p in settings.clients_dir.glob("*.yaml")
        if p.stem != "exemple_client"
    )


def sauvegarder_config_client(config: ClientConfig, settings: Settings | None = None) -> Path:
    """Écrit une configuration client sur disque au format YAML."""
    settings = settings or get_settings()
    settings.assurer_repertoires()
    chemin = settings.chemin_config_client(config.id_client)
    donnees = config.model_dump(mode="json")
    with chemin.open("w", encoding="utf-8") as f:
        yaml.safe_dump(donnees, f, allow_unicode=True, sort_keys=False)
    logger.info("Configuration client écrite : {}", chemin)
    return chemin
