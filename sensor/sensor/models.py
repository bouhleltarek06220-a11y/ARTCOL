"""Modèles de données SENSOR (pydantic v2).

Tous les objets manipulés par le pipeline d'ingestion, la récupération, la
génération et l'API sont décrits ici. La validation stricte évite les états
incohérents et fournit des messages d'erreur lisibles au démarrage.
"""

from __future__ import annotations

import hashlib
from datetime import datetime, timezone
from enum import Enum
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator


def _now() -> datetime:
    """Horodatage UTC timezone-aware (évite les comparaisons naïves)."""
    return datetime.now(timezone.utc)


# ---------------------------------------------------------------------------
# Configuration client (un fichier YAML par tenant)
# ---------------------------------------------------------------------------

class CouleursWidget(BaseModel):
    """Palette du widget embarquable. Défaut : sombre / néon (charte AMAVYA)."""

    primaire: str = Field(default="#c8f53a", description="Couleur d'accent (boutons, liens).")
    fond: str = Field(default="#080b10", description="Couleur de fond du panneau de chat.")
    texte: str = Field(default="#e8edf2", description="Couleur du texte principal.")
    secondaire: str = Field(default="#7b61ff", description="Couleur secondaire (badges, focus).")

    @field_validator("primaire", "fond", "texte", "secondaire")
    @classmethod
    def _valider_hex(cls, v: str) -> str:
        v = v.strip()
        if not (v.startswith("#") and len(v) in (4, 7)):
            raise ValueError(f"Couleur hexadécimale invalide : {v!r} (attendu #rgb ou #rrggbb).")
        return v


class ActionRepli(BaseModel):
    """Action proposée à l'utilisateur quand l'information n'existe pas dans la base."""

    label: str = Field(default="Contacter notre équipe", description="Texte du bouton/lien de repli.")
    email: str | None = Field(default=None, description="Adresse de contact proposée.")
    url: str | None = Field(default=None, description="URL de prise de RDV ou page de support.")


class ClientConfig(BaseModel):
    """Configuration complète d'un client (tenant). Chargée depuis `clients/<id>.yaml`."""

    model_config = ConfigDict(extra="forbid")

    id_client: str = Field(description="Identifiant unique du client (slug, ex: 'hotel-azur').")
    nom_entreprise: str = Field(description="Nom affiché de l'entreprise.")
    langue: str = Field(default="fr", description="Code langue principal (fr, en, ...).")
    ton: str = Field(
        default="professionnel, chaleureux et concis",
        description="Instructions de style appliquées aux réponses.",
    )
    sujets_autorises: list[str] = Field(
        default_factory=list,
        description="Liste optionnelle de sujets pour borner le scope. Vide = pas de restriction explicite.",
    )
    message_accueil: str = Field(
        default="Bonjour ! Je suis l'assistant IA de l'entreprise. Comment puis-je vous aider ?",
        description="Message affiché à l'ouverture du widget.",
    )
    message_hors_scope: str = Field(
        default=(
            "Je n'ai pas trouvé l'information dans notre documentation. "
            "Je préfère ne pas inventer de réponse."
        ),
        description="Texte de repli quand l'info n'est pas dans la base.",
    )
    action_repli: ActionRepli = Field(default_factory=ActionRepli)
    couleurs_widget: CouleursWidget = Field(default_factory=CouleursWidget)

    # Paramètres de récupération
    top_k: int = Field(default=5, ge=1, le=20, description="Nombre de passages récupérés.")
    seuil_similarite_min: float = Field(
        default=0.35,
        ge=0.0,
        le=1.0,
        description="En dessous de ce score de similarité, la question est considérée hors-scope.",
    )
    recherche_hybride: bool = Field(
        default=False, description="Active la recherche hybride sémantique + mot-clé."
    )

    # Conformité / rétention
    retention_jours_conversations: int = Field(
        default=90, ge=1, le=3650, description="Durée de conservation des conversations (RGPD)."
    )

    # Modèles Claude
    modele_reponse: str = Field(
        default="claude-sonnet-4-6", description="Modèle pour la génération des réponses."
    )
    modele_leger: str = Field(
        default="claude-haiku-4-5",
        description="Modèle pour les tâches légères (reformulation, classification).",
    )
    max_tokens_reponse: int = Field(default=1024, ge=128, le=8192)

    # Infrastructure
    embedder: Literal["local", "api"] = Field(default="local")
    embedder_modele: str | None = Field(
        default=None,
        description="Surcharge du modèle d'embeddings (sinon valeur par défaut du backend).",
    )
    vectorstore: Literal["sqlite", "supabase"] = Field(default="sqlite")

    # CORS : domaines autorisés à appeler l'API pour ce client.
    domaines_autorises: list[str] = Field(
        default_factory=list,
        description="Origines CORS autorisées (ex: 'https://www.client.fr'). Vide = pas d'origine ajoutée.",
    )

    @field_validator("id_client")
    @classmethod
    def _slug_valide(cls, v: str) -> str:
        v = v.strip()
        if not v or not all(c.isalnum() or c in "-_" for c in v):
            raise ValueError(
                "id_client doit être un slug alphanumérique (tirets/underscores autorisés)."
            )
        return v


# ---------------------------------------------------------------------------
# Documents et chunks
# ---------------------------------------------------------------------------

class TypeDocument(str, Enum):
    PDF = "pdf"
    DOCX = "docx"
    TXT = "txt"
    MD = "md"
    HTML = "html"
    WEB = "web"  # page crawlée


class Document(BaseModel):
    """Un document source ingéré pour un client."""

    id: str = Field(description="Identifiant stable (hash de id_client + source).")
    id_client: str
    titre: str
    type: TypeDocument
    source: str = Field(description="Chemin de fichier ou URL d'origine.")
    date_ingestion: datetime = Field(default_factory=_now)
    hash: str = Field(description="Hash du contenu, pour détecter les changements (idempotence).")
    nb_chunks: int = Field(default=0, ge=0)

    @staticmethod
    def calculer_id(id_client: str, source: str) -> str:
        """ID stable d'un document : dépend du client et de la source, pas du contenu."""
        brut = f"{id_client}::{source}".encode("utf-8")
        return hashlib.sha256(brut).hexdigest()[:24]

    @staticmethod
    def calculer_hash(contenu: str) -> str:
        """Hash du contenu textuel, pour détecter une mise à jour du document."""
        return hashlib.sha256(contenu.encode("utf-8")).hexdigest()


class ChunkMetadata(BaseModel):
    """Métadonnées de provenance portées par chaque chunk (pour la citation)."""

    titre_document: str
    source: str
    type: TypeDocument
    section: str | None = Field(default=None, description="Titre de section/sous-titre si détecté.")


class Chunk(BaseModel):
    """Un fragment de texte vectorisable, avec ses métadonnées de provenance."""

    id: str = Field(description="Identifiant unique du chunk.")
    id_document: str
    id_client: str
    texte: str
    position: int = Field(ge=0, description="Index du chunk dans le document.")
    metadata: ChunkMetadata


class ChunkResultat(BaseModel):
    """Un chunk renvoyé par la recherche, accompagné de son score de similarité."""

    chunk: Chunk
    score: float = Field(description="Score de similarité (cosinus, 0..1).")


# ---------------------------------------------------------------------------
# Sources citées et conversations
# ---------------------------------------------------------------------------

class Source(BaseModel):
    """Source citée dans une réponse (présentée à l'utilisateur)."""

    titre_document: str
    source: str
    section: str | None = None
    extrait: str = Field(description="Court extrait du passage utilisé.")
    score: float


class RoleMessage(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"


class Message(BaseModel):
    """Un message dans une conversation."""

    role: RoleMessage
    contenu: str
    sources_citees: list[Source] = Field(default_factory=list)
    hors_scope: bool = Field(default=False)
    horodatage: datetime = Field(default_factory=_now)
    tokens_input: int = Field(default=0, ge=0)
    tokens_output: int = Field(default=0, ge=0)
    cout_estime_usd: float = Field(default=0.0, ge=0.0)


class Conversation(BaseModel):
    """Une session de conversation, persistée pour l'historique et l'audit."""

    id_session: str
    id_client: str
    date_debut: datetime = Field(default_factory=_now)
    date_derniere_activite: datetime = Field(default_factory=_now)
    messages: list[Message] = Field(default_factory=list)


# ---------------------------------------------------------------------------
# Requête / réponse API
# ---------------------------------------------------------------------------

class ChatRequest(BaseModel):
    """Corps de la requête POST /chat."""

    id_client: str = Field(min_length=1, max_length=128)
    message: str = Field(min_length=1, max_length=4000)
    id_session: str | None = Field(
        default=None, description="Session existante à poursuivre ; généré si absent."
    )


class ChatResponse(BaseModel):
    """Réponse renvoyée par POST /chat."""

    reponse: str
    sources: list[Source] = Field(default_factory=list)
    hors_scope: bool = False
    id_session: str
    tokens_input: int = 0
    tokens_output: int = 0
    cout_estime_usd: float = 0.0


class ReponseGeneree(BaseModel):
    """Résultat interne de l'answerer (avant transformation en ChatResponse)."""

    texte: str
    sources: list[Source] = Field(default_factory=list)
    hors_scope: bool = False
    tokens_input: int = 0
    tokens_output: int = 0
    cout_estime_usd: float = 0.0
