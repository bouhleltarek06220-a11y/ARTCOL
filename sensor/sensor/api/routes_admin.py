"""Routes d'administration (protégées par la clé admin `.env`).

Permettent de déclencher une ingestion/réindexation, de consulter les
statistiques d'usage, l'état de santé d'un client, et de purger les
conversations expirées (RGPD).
"""

from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from sensor.api.deps import get_engine, reinitialiser_cache_engine, verifier_cle_admin
from sensor.config import charger_config_client, get_settings, lister_clients
from sensor.ingestion.pipeline import SensorPipeline

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(verifier_cle_admin)])


class IngestionPath(BaseModel):
    id_client: str
    path: str = Field(description="Chemin d'un fichier ou dossier accessible au serveur.")


class IngestionUrl(BaseModel):
    id_client: str
    url: str
    profondeur_max: int = Field(default=2, ge=0, le=5)
    max_pages: int = Field(default=50, ge=1, le=500)


@router.get("/clients")
def clients() -> dict:
    """Liste les clients configurés."""
    return {"clients": lister_clients()}


@router.get("/stats/{id_client}")
def stats(id_client: str) -> dict:
    """Statistiques d'usage d'un client (taux de réponse, hors-scope, coûts, top sans réponse)."""
    engine = get_engine(id_client)
    stats = engine.analytics.statistiques()
    stats["nb_conversations"] = engine.conversations.compter_conversations()
    stats["nb_documents"] = len(engine.store.list_documents())
    stats["nb_chunks"] = engine.store.count_chunks()
    return stats


@router.get("/health/{id_client}")
def health(id_client: str) -> dict:
    """État de santé d'un client : config chargée, base vectorielle, embedder."""
    engine = get_engine(id_client)
    return {
        "id_client": id_client,
        "statut": "ok",
        "embedder": engine.embedder.nom_modele,
        "dimension": engine.embedder.dimension,
        "vectorstore": engine.config.vectorstore,
        "nb_documents": len(engine.store.list_documents()),
        "nb_chunks": engine.store.count_chunks(),
        "base_prete": engine.store.count_chunks() > 0,
    }


@router.get("/documents/{id_client}")
def documents(id_client: str) -> dict:
    """Liste les documents ingérés pour un client."""
    engine = get_engine(id_client)
    return {
        "documents": [
            {
                "id": d.id,
                "titre": d.titre,
                "type": d.type.value,
                "source": d.source,
                "nb_chunks": d.nb_chunks,
                "date_ingestion": d.date_ingestion.isoformat()
                if hasattr(d.date_ingestion, "isoformat")
                else str(d.date_ingestion),
            }
            for d in engine.store.list_documents()
        ]
    }


@router.post("/ingest/path")
def ingest_path(corps: IngestionPath) -> dict:
    """Ingère un fichier ou un dossier local accessible au serveur."""
    settings = get_settings()
    config = charger_config_client(corps.id_client, settings)
    chemin = Path(corps.path)
    if not chemin.exists():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=f"Chemin introuvable : {corps.path}"
        )
    pipeline = SensorPipeline(config, settings)
    try:
        resultats = pipeline.ingerer_chemin(chemin)
    finally:
        pipeline.close()
    # La base a changé : on invalide le moteur en cache pour ce client.
    reinitialiser_cache_engine(corps.id_client)
    return {"resultats": [r.__dict__ for r in resultats]}


@router.post("/ingest/url")
def ingest_url(corps: IngestionUrl) -> dict:
    """Crawl et ingère le site public d'un client."""
    settings = get_settings()
    config = charger_config_client(corps.id_client, settings)
    pipeline = SensorPipeline(config, settings)
    try:
        resultats = pipeline.ingerer_url(
            corps.url, profondeur_max=corps.profondeur_max, max_pages=corps.max_pages
        )
    finally:
        pipeline.close()
    reinitialiser_cache_engine(corps.id_client)
    return {"resultats": [r.__dict__ for r in resultats]}


@router.post("/reindex/{id_client}")
def reindex(id_client: str) -> dict:
    """Reconstruit la base vectorielle d'un client à partir des sources connues."""
    settings = get_settings()
    config = charger_config_client(id_client, settings)
    pipeline = SensorPipeline(config, settings)
    try:
        resultats = pipeline.reindexer()
    finally:
        pipeline.close()
    reinitialiser_cache_engine(id_client)
    return {"resultats": [r.__dict__ for r in resultats]}


@router.post("/purge/{id_client}")
def purge(id_client: str) -> dict:
    """Purge les conversations expirées d'un client (RGPD)."""
    engine = get_engine(id_client)
    nb = engine.conversations.purger_expirees()
    return {"id_client": id_client, "conversations_purgees": nb}
