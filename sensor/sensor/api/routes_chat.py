"""Routes publiques de conversation (appelées par le widget embarquable)."""

from __future__ import annotations

import json

from fastapi import APIRouter, HTTPException, Request, status
from fastapi.responses import StreamingResponse

from sensor.api.deps import get_engine, limiter
from sensor.config import charger_config_client
from sensor.models import ChatRequest, ChatResponse

router = APIRouter(tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
@limiter.limit("20/minute")
def chat(request: Request, corps: ChatRequest) -> ChatResponse:
    """Reçoit une question, exécute récupération → génération, renvoie réponse + sources."""
    engine = get_engine(corps.id_client)
    return engine.traiter(corps.message, corps.id_session)


@router.post("/chat/stream")
@limiter.limit("20/minute")
def chat_stream(request: Request, corps: ChatRequest) -> StreamingResponse:
    """Variante streaming (Server-Sent Events) : tokens en direct puis évènement final.

    Évènements émis :
    - `data: {"type":"delta","texte":"..."}` pour chaque fragment de réponse ;
    - `data: {"type":"final", ...ChatResponse...}` à la fin (sources, session, coût).
    """
    engine = get_engine(corps.id_client)

    def generer():
        try:
            for type_evt, payload in engine.traiter_stream(corps.message, corps.id_session):
                if type_evt == "delta":
                    bloc = {"type": "delta", "texte": payload}
                else:
                    final: ChatResponse = payload  # type: ignore[assignment]
                    bloc = {"type": "final", **final.model_dump(mode="json")}
                yield f"data: {json.dumps(bloc, ensure_ascii=False)}\n\n"
        except Exception as exc:  # noqa: BLE001 — on ferme proprement le flux SSE
            erreur = {"type": "error", "message": str(exc)}
            yield f"data: {json.dumps(erreur, ensure_ascii=False)}\n\n"

    return StreamingResponse(
        generer(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.get("/client/{id_client}/config")
def config_publique(id_client: str) -> dict:
    """Configuration publique d'un client pour personnaliser le widget (sans secret).

    N'instancie pas le moteur (ni l'embedder ni la clé Anthropic) : le widget
    appelle cette route au chargement, avant toute conversation.
    """
    try:
        cfg = charger_config_client(id_client)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    return {
        "id_client": cfg.id_client,
        "nom_entreprise": cfg.nom_entreprise,
        "langue": cfg.langue,
        "message_accueil": cfg.message_accueil,
        "couleurs": cfg.couleurs_widget.model_dump(),
        "action_repli": cfg.action_repli.model_dump(),
    }
