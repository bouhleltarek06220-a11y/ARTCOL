"""Interface commune à toutes les sources.

Deux capacités possibles, déclarées par des drapeaux :
- `peut_collecter` : la source constitue la liste cible (renvoie des prospects).
- `peut_enrichir`  : la source complète un prospect existant.

Ajouter une source = créer une sous-classe dans `sources/` sans toucher au reste.
"""

from __future__ import annotations

from abc import ABC

from reflexe.config import Settings
from reflexe.models import Mission, Prospect, SourceType
from reflexe.ratelimit import ClientPoli


class BaseSource(ABC):
    """Classe de base d'un connecteur de source."""

    type: SourceType
    peut_collecter: bool = False
    peut_enrichir: bool = False

    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    def est_configuree(self) -> bool:
        """Vrai si la source dispose de ce qu'il lui faut (clé API, etc.).

        Par défaut : toujours configurée (sources publiques sans clé).
        """
        return True

    def raison_indisponible(self) -> str:
        """Message expliquant pourquoi la source est sautée, le cas échéant."""
        return ""

    async def collecter(self, mission: Mission, client: ClientPoli) -> list[Prospect]:
        """Constitue une liste de prospects à partir des filtres de la mission."""
        return []

    async def enrichir(self, prospect: Prospect, client: ClientPoli) -> Prospect:
        """Complète un prospect (email, téléphone, dirigeant, site…) sur place."""
        return prospect
