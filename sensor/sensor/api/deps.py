"""Dépendances FastAPI : résolution du tenant, sécurité, et moteur par client.

`EngineClient` assemble pour un client donné l'embedder, la base vectorielle,
le retriever, l'answerer, le store de conversations et le logger analytics. Les
moteurs sont mis en cache par `id_client` afin de ne pas recharger le modèle
d'embeddings (coûteux) à chaque requête.
"""

from __future__ import annotations

import time
from collections.abc import Iterator
from dataclasses import dataclass

from fastapi import Header, HTTPException, status
from loguru import logger
from slowapi import Limiter
from slowapi.util import get_remote_address

from sensor.analytics.logger import AnalyticsLogger
from sensor.config import Settings, charger_config_client, get_settings
from sensor.embedders.base import BaseEmbedder, construire_embedder
from sensor.generation.answerer import Answerer
from sensor.models import (
    ChatResponse,
    ClientConfig,
    Message,
    ReponseGeneree,
    RoleMessage,
)
from sensor.retrieval.retriever import Retriever
from sensor.storage.conversations import ConversationStore
from sensor.vectorstore.base import BaseVectorStore, construire_vectorstore


@dataclass
class EngineClient:
    """Pile complète d'un client, prête à traiter des questions."""

    config: ClientConfig
    embedder: BaseEmbedder
    store: BaseVectorStore
    retriever: Retriever
    answerer: Answerer
    conversations: ConversationStore
    analytics: AnalyticsLogger

    def traiter(self, question: str, id_session: str | None) -> ChatResponse:
        """Traite une question de bout en bout (récupération → génération → persistance)."""
        debut = time.monotonic()
        recherche = self.retriever.rechercher(question)
        reponse: ReponseGeneree = self.answerer.repondre(question, recherche)
        duree_ms = int((time.monotonic() - debut) * 1000)

        id_session = self._persister(question, reponse, id_session, recherche.meilleur_score, duree_ms)

        return ChatResponse(
            reponse=reponse.texte,
            sources=reponse.sources,
            hors_scope=reponse.hors_scope,
            id_session=id_session,
            tokens_input=reponse.tokens_input,
            tokens_output=reponse.tokens_output,
            cout_estime_usd=round(reponse.cout_estime_usd, 6),
        )

    def traiter_stream(
        self, question: str, id_session: str | None
    ) -> Iterator[tuple[str, object]]:
        """Variante streaming : yield ("delta", str) puis ("final", ChatResponse)."""
        debut = time.monotonic()
        recherche = self.retriever.rechercher(question)
        reponse_finale: ReponseGeneree | None = None
        for type_evt, payload in self.answerer.repondre_stream(question, recherche):
            if type_evt == "delta":
                yield ("delta", payload)
            else:
                reponse_finale = payload  # type: ignore[assignment]
        if reponse_finale is None:  # garde-fou : ne devrait pas arriver
            reponse_finale = ReponseGeneree(texte="", hors_scope=True)
        duree_ms = int((time.monotonic() - debut) * 1000)
        id_session = self._persister(
            question, reponse_finale, id_session, recherche.meilleur_score, duree_ms
        )
        yield (
            "final",
            ChatResponse(
                reponse=reponse_finale.texte,
                sources=reponse_finale.sources,
                hors_scope=reponse_finale.hors_scope,
                id_session=id_session,
                tokens_input=reponse_finale.tokens_input,
                tokens_output=reponse_finale.tokens_output,
                cout_estime_usd=round(reponse_finale.cout_estime_usd, 6),
            ),
        )

    def _persister(
        self,
        question: str,
        reponse: ReponseGeneree,
        id_session: str | None,
        meilleur_score: float,
        duree_ms: int,
    ) -> str:
        id_session = self.conversations.creer_ou_recuperer(id_session)
        self.conversations.ajouter_message(
            id_session, Message(role=RoleMessage.USER, contenu=question)
        )
        self.conversations.ajouter_message(
            id_session,
            Message(
                role=RoleMessage.ASSISTANT,
                contenu=reponse.texte,
                sources_citees=reponse.sources,
                hors_scope=reponse.hors_scope,
                tokens_input=reponse.tokens_input,
                tokens_output=reponse.tokens_output,
                cout_estime_usd=reponse.cout_estime_usd,
            ),
        )
        self.analytics.enregistrer(
            id_session=id_session,
            question=question,
            hors_scope=reponse.hors_scope,
            nb_sources=len(reponse.sources),
            meilleur_score=meilleur_score,
            tokens_input=reponse.tokens_input,
            tokens_output=reponse.tokens_output,
            cout_estime_usd=reponse.cout_estime_usd,
            duree_ms=duree_ms,
        )
        return id_session

    def close(self) -> None:
        self.store.close()
        self.conversations.close()
        self.analytics.close()


# --- Rate limiting (par IP) -----------------------------------------------

#: Limiteur partagé par l'app et les routes. Limite par défaut généreuse, les
#: routes sensibles (chat) appliquent une limite plus stricte.
limiter = Limiter(key_func=get_remote_address, default_limits=["120/minute"])


# --- Cache des moteurs par client -----------------------------------------

_ENGINES: dict[str, EngineClient] = {}


def construire_engine(id_client: str, settings: Settings | None = None) -> EngineClient:
    """Construit (sans cache) la pile complète d'un client."""
    settings = settings or get_settings()
    config = charger_config_client(id_client, settings)
    embedder = construire_embedder(config, settings)
    store = construire_vectorstore(config, settings, dimension=embedder.dimension)
    retriever = Retriever(config, embedder, store)
    answerer = Answerer(config, anthropic_api_key=settings.anthropic_api_key)
    conversations = ConversationStore(
        settings.chemin_conversations(id_client),
        id_client=id_client,
        retention_jours=config.retention_jours_conversations,
    )
    analytics = AnalyticsLogger(settings.chemin_conversations(id_client), id_client=id_client)
    logger.info("Moteur initialisé pour le client {}.", id_client)
    return EngineClient(
        config=config,
        embedder=embedder,
        store=store,
        retriever=retriever,
        answerer=answerer,
        conversations=conversations,
        analytics=analytics,
    )


def get_engine(id_client: str, settings: Settings | None = None) -> EngineClient:
    """Retourne le moteur d'un client (mis en cache après la première construction)."""
    if id_client not in _ENGINES:
        try:
            _ENGINES[id_client] = construire_engine(id_client, settings)
        except FileNotFoundError as exc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)
            ) from exc
        except Exception as exc:  # noqa: BLE001 — config invalide -> 400 lisible
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Impossible d'initialiser le client {id_client!r} : {exc}",
            ) from exc
    return _ENGINES[id_client]


def reinitialiser_cache_engine(id_client: str | None = None) -> None:
    """Vide le cache des moteurs (après réingestion ou changement de config)."""
    if id_client is None:
        for eng in _ENGINES.values():
            eng.close()
        _ENGINES.clear()
    elif id_client in _ENGINES:
        _ENGINES.pop(id_client).close()


# --- Sécurité : protection des routes admin -------------------------------

def verifier_cle_admin(x_admin_key: str = Header(default="")) -> None:
    """Dépendance FastAPI : exige l'en-tête X-Admin-Key valide sur les routes admin."""
    settings = get_settings()
    if not settings.sensor_admin_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="SENSOR_ADMIN_KEY non configurée côté serveur : routes admin désactivées.",
        )
    # Comparaison à temps constant pour éviter les attaques par timing.
    import hmac

    if not hmac.compare_digest(x_admin_key, settings.sensor_admin_key):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Clé d'administration invalide."
        )
