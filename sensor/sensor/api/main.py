"""Application FastAPI SENSOR : CORS, rate limiting, routes, journalisation."""

from __future__ import annotations

import sys
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from loguru import logger
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from sensor.api.deps import limiter
from sensor.api.routes_admin import router as router_admin
from sensor.api.routes_chat import router as router_chat
from sensor.config import charger_config_client, get_settings, lister_clients


def _configurer_logs() -> None:
    """Console lisible + fichier rotatif. Jamais de secret journalisé."""
    settings = get_settings()
    logger.remove()
    logger.add(
        sys.stderr,
        level=settings.log_level,
        format="<green>{time:HH:mm:ss}</green> | <level>{level: <7}</level> | {message}",
    )
    logger.add(
        settings.logs_dir / "sensor_{time:YYYY-MM-DD}.log",
        rotation="10 MB",
        retention="30 days",
        level="DEBUG",
        encoding="utf-8",
        enqueue=True,
    )


def _origines_cors() -> list[str]:
    """Agrège les domaines autorisés déclarés par chaque client (CORS)."""
    settings = get_settings()
    origines: set[str] = set()
    for id_client in lister_clients(settings):
        try:
            cfg = charger_config_client(id_client, settings)
            origines.update(cfg.domaines_autorises)
        except Exception as exc:  # noqa: BLE001 — une config cassée ne bloque pas le boot
            logger.warning("Config client {} ignorée pour le CORS : {}", id_client, exc)
    return sorted(origines)


def creer_app() -> FastAPI:
    _configurer_logs()
    settings = get_settings()

    app = FastAPI(
        title="SENSOR",
        description="Assistant client RAG zéro-hallucination, multi-tenant et embarquable.",
        version="0.1.0",
    )

    # Rate limiting (slowapi).
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
    app.add_middleware(SlowAPIMiddleware)

    # CORS : domaines clients + localhost (démo/tests). On n'utilise pas "*"
    # avec credentials ; ici pas de cookies, donc origines explicites suffisent.
    origines = _origines_cors() + [
        "http://localhost",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:5500",
        "null",  # ouverture directe d'un fichier demo.html (origine "null")
    ]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origines,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["Content-Type", "X-Admin-Key"],
    )

    app.include_router(router_chat)
    app.include_router(router_admin)

    @app.get("/", tags=["meta"])
    def racine() -> dict:
        return {
            "service": "SENSOR",
            "version": "0.1.0",
            "statut": "ok",
            "clients_configures": lister_clients(settings),
        }

    @app.get("/health", tags=["meta"])
    def health() -> dict:
        return {"statut": "ok"}

    @app.get("/sensor-widget.js", tags=["meta"])
    def widget_js() -> FileResponse:
        """Sert le widget embarquable (pratique : data-api pointe directement ici)."""
        # widget/sensor-widget.js à la racine du projet (parents[2] depuis ce fichier),
        # avec repli sur l'emplacement Docker /app/widget.
        candidats = [
            Path(__file__).resolve().parents[2] / "widget" / "sensor-widget.js",
            Path("/app/widget/sensor-widget.js"),
            Path("widget/sensor-widget.js"),
        ]
        for chemin in candidats:
            if chemin.exists():
                return FileResponse(
                    chemin,
                    media_type="application/javascript",
                    headers={"Cache-Control": "public, max-age=300"},
                )
        raise HTTPException(status_code=404, detail="Widget introuvable côté serveur.")

    @app.exception_handler(Exception)
    async def _erreur_generique(request: Request, exc: Exception) -> JSONResponse:
        # Repli propre : on ne fuit jamais de stacktrace au client.
        logger.exception("Erreur non gérée sur {} : {}", request.url.path, exc)
        return JSONResponse(
            status_code=500,
            content={"detail": "Erreur interne. L'incident a été journalisé."},
        )

    logger.info("Application SENSOR initialisée (clients: {}).", lister_clients(settings))
    return app


app = creer_app()
