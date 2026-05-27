"""Modèles de données REFLEXE (pydantic v2).

Tous les objets manipulés par le pipeline : entreprises et prospects collectés,
configuration de mission, traçabilité de provenance et journal de job. Chaque
donnée collectée conserve sa source d'origine et un score de confiance.
"""

from __future__ import annotations

import hashlib
import re
from datetime import datetime, timezone
from enum import Enum

from pydantic import BaseModel, Field, field_validator


def _maintenant() -> datetime:
    """Horodatage UTC (les datetimes sont toujours stockés en UTC)."""
    return datetime.now(timezone.utc)


class SourceType(str, Enum):
    """Origine d'une donnée collectée."""

    RECHERCHE_ENTREPRISES = "recherche_entreprises"
    PAPPERS = "pappers"
    WEBSITE = "website"
    EMAIL_PATTERN = "email_pattern"
    MANUAL = "manual"


class StatutPipeline(str, Enum):
    """Étape atteinte par un prospect dans le pipeline (sert aux checkpoints)."""

    COLLECTE = "collecté"
    NETTOYE = "nettoyé"
    ENRICHI = "enrichi"
    SCORE = "scoré"
    PERSONNALISE = "personnalisé"
    PRET_ENVOI = "prêt_envoi"
    POUSSE_BREVO = "poussé_brevo"
    EXCLU = "exclu"


class NiveauLog(str, Enum):
    DEBUG = "DEBUG"
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"


class Source(BaseModel):
    """Provenance d'une information : d'où elle vient et à quel point on s'y fie."""

    type: SourceType
    reference: str = ""  # URL, SIREN, endpoint API… selon la source
    date_collecte: datetime = Field(default_factory=_maintenant)
    score_confiance: float = Field(default=0.5, ge=0.0, le=1.0)


class Entreprise(BaseModel):
    """Entreprise issue des sources officielles/publiques."""

    siren: str
    siret: str = ""
    raison_sociale: str = ""
    naf: str = ""
    libelle_naf: str = ""
    adresse: str = ""
    code_postal: str = ""
    ville: str = ""
    departement: str = ""
    tranche_effectif: str = ""
    date_creation: str = ""
    site_web: str = ""
    telephone: str = ""
    statut_actif: bool = True
    source: SourceType = SourceType.RECHERCHE_ENTREPRISES
    date_collecte: datetime = Field(default_factory=_maintenant)
    score_confiance: float = Field(default=0.7, ge=0.0, le=1.0)

    @field_validator("siren")
    @classmethod
    def _siren_valide(cls, v: str) -> str:
        v = re.sub(r"\D", "", v or "")
        if len(v) != 9:
            raise ValueError("Le SIREN doit comporter 9 chiffres.")
        return v


class Prospect(BaseModel):
    """Prospect = contact rattaché à une entreprise, enrichi tout au long du pipeline."""

    id: str = ""  # stable, dérivé de siren+email (voir calculer_id)
    entreprise: Entreprise
    nom_dirigeant: str = ""
    prenom: str = ""
    role: str = ""
    email: str = ""
    email_verifie: bool = False
    email_source: str = ""
    telephone: str = ""
    # Lien réseau social trouvé UNIQUEMENT sur le site public de l'entreprise.
    # Jamais scrapé sur LinkedIn lui-même (interdit par les CGU).
    linkedin_entreprise_public: str = ""
    score_icp: int = Field(default=0, ge=0, le=100)
    justification_score: str = ""
    message_genere: str = ""
    statut_pipeline: StatutPipeline = StatutPipeline.COLLECTE
    tags: list[str] = Field(default_factory=list)
    # Provenance par champ : nom_du_champ -> libellé de source.
    provenance: dict[str, str] = Field(default_factory=dict)
    date_maj: datetime = Field(default_factory=_maintenant)

    @staticmethod
    def calculer_id(siren: str, email: str) -> str:
        """ID stable et idempotent dérivé de (siren, email).

        Permet de relancer un job sans créer de doublons : le même prospect
        retombe toujours sur le même identifiant.
        """
        siren = re.sub(r"\D", "", siren or "")
        cle = f"{siren}:{(email or '').strip().lower()}"
        return hashlib.sha1(cle.encode("utf-8")).hexdigest()[:16]

    def assigner_id(self) -> "Prospect":
        """Recalcule et fixe l'id à partir du SIREN et de l'email courants."""
        self.id = self.calculer_id(self.entreprise.siren, self.email)
        return self


class FiltresMission(BaseModel):
    """Critères de ciblage transmis aux sources de collecte."""

    naf: list[str] = Field(default_factory=list)
    zones: list[str] = Field(default_factory=list)  # codes postaux ou départements
    effectif_min: int = 0
    effectif_max: int = 100_000
    mots_cles: list[str] = Field(default_factory=list)


class ExclusionsMission(BaseModel):
    """Liste noire : domaines et emails à ne jamais contacter (opt-out / RGPD)."""

    domaines: list[str] = Field(default_factory=list)
    emails: list[str] = Field(default_factory=list)

    def est_exclu(self, email: str) -> bool:
        email = (email or "").strip().lower()
        if not email:
            return False
        if email in {e.strip().lower() for e in self.emails}:
            return True
        domaine = email.split("@")[-1] if "@" in email else ""
        return domaine in {d.strip().lower().lstrip("@") for d in self.domaines}


class Mission(BaseModel):
    """Configuration d'une mission de prospection (un fichier YAML par mission)."""

    nom: str
    sources_actives: list[SourceType] = Field(
        default_factory=lambda: [SourceType.RECHERCHE_ENTREPRISES, SourceType.WEBSITE]
    )
    filtres: FiltresMission = Field(default_factory=FiltresMission)
    description_icp: str = ""
    seuil_score_min: int = Field(default=60, ge=0, le=100)
    modele_message: str = ""
    limite_prospects: int = Field(default=100, ge=1)
    exclusions: ExclusionsMission = Field(default_factory=ExclusionsMission)

    @field_validator("nom")
    @classmethod
    def _nom_non_vide(cls, v: str) -> str:
        if not (v or "").strip():
            raise ValueError("Le nom de la mission est obligatoire.")
        return v.strip()


class JobLog(BaseModel):
    """Entrée du journal de job (traçabilité complète : qui/quoi/quand/résultats)."""

    job_id: str
    mission: str
    source: str = ""
    horodatage: datetime = Field(default_factory=_maintenant)
    niveau: NiveauLog = NiveauLog.INFO
    message: str = ""
    lignes_trouvees: int = 0
    erreurs: int = 0
    refus: int = 0
    champs_manquants: int = 0
