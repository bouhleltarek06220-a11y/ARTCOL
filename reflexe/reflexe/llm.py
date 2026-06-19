"""Wrapper Anthropic : scoring ICP et rédaction de messages personnalisés.

- `claude-haiku-4-5` (rapide/économique) pour le scoring.
- `claude-sonnet-4-6` (qualité) pour la rédaction.
- Réponses de scoring strictement en JSON, parsées de façon robuste.
- Les messages ne doivent jamais inventer de faits sur le prospect.
- Retries (tenacity), concurrence limitée, estimation et cumul du coût token.
"""

from __future__ import annotations

import asyncio
import json
import re

import anthropic
from loguru import logger
from tenacity import (
    retry,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

from reflexe.models import Prospect

# Tarifs indicatifs en USD par million de tokens (input, output). Sert uniquement
# à estimer un coût ; ajustable sans impact fonctionnel.
_TARIFS = {
    "claude-haiku-4-5": (1.0, 5.0),
    "claude-sonnet-4-6": (3.0, 15.0),
}
_TARIF_DEFAUT = (3.0, 15.0)

_ERREURS_API = (
    anthropic.APITimeoutError,
    anthropic.APIConnectionError,
    anthropic.RateLimitError,
    anthropic.InternalServerError,
)


def _cout(modele: str, tokens_in: int, tokens_out: int) -> float:
    pin, pout = _TARIFS.get(modele, _TARIF_DEFAUT)
    return (tokens_in / 1_000_000) * pin + (tokens_out / 1_000_000) * pout


def _extraire_json(texte: str) -> dict:
    """Parse un objet JSON même entouré de ``` ou de texte parasite."""
    texte = texte.strip()
    texte = re.sub(r"^```(?:json)?", "", texte).strip()
    texte = re.sub(r"```$", "", texte).strip()
    try:
        return json.loads(texte)
    except json.JSONDecodeError:
        debut, fin = texte.find("{"), texte.rfind("}")
        if debut != -1 and fin != -1 and fin > debut:
            return json.loads(texte[debut : fin + 1])
        raise


class ClaudeLLM:
    """Client Claude pour le scoring et la personnalisation."""

    def __init__(
        self,
        api_key: str,
        modele_scoring: str = "claude-haiku-4-5",
        modele_message: str = "claude-sonnet-4-6",
        concurrence: int = 4,
    ) -> None:
        self.client = anthropic.AsyncAnthropic(api_key=api_key)
        self.modele_scoring = modele_scoring
        self.modele_message = modele_message
        self._sem = asyncio.Semaphore(max(1, concurrence))
        self.cout_total: float = 0.0
        self.tokens_in_total: int = 0
        self.tokens_out_total: int = 0

    @retry(
        retry=retry_if_exception_type(_ERREURS_API),
        stop=stop_after_attempt(4),
        wait=wait_exponential(multiplier=1, min=2, max=30),
        reraise=True,
    )
    async def _appeler(
        self, modele: str, system: str, user: str, max_tokens: int
    ) -> str:
        async with self._sem:
            reponse = await self.client.messages.create(
                model=modele,
                max_tokens=max_tokens,
                system=system,
                messages=[{"role": "user", "content": user}],
            )
        usage = reponse.usage
        self.tokens_in_total += usage.input_tokens
        self.tokens_out_total += usage.output_tokens
        self.cout_total += _cout(modele, usage.input_tokens, usage.output_tokens)
        return "".join(
            bloc.text for bloc in reponse.content if getattr(bloc, "type", "") == "text"
        )

    def _resume_prospect(self, p: Prospect) -> str:
        e = p.entreprise
        lignes = [
            f"Entreprise : {e.raison_sociale or 'inconnue'}",
            f"Secteur (NAF {e.naf}) : {e.libelle_naf or 'inconnu'}",
            f"Localisation : {e.ville} ({e.code_postal}, dépt {e.departement})",
            f"Effectif : {e.tranche_effectif or 'inconnu'}",
            f"Site web : {e.site_web or 'inconnu'}",
        ]
        if p.nom_dirigeant or p.prenom:
            lignes.append(
                f"Contact : {p.prenom} {p.nom_dirigeant} ({p.role or 'rôle inconnu'})"
            )
        return "\n".join(lignes)

    async def scorer_prospect(
        self, prospect: Prospect, description_icp: str
    ) -> tuple[int, str]:
        """Note la pertinence du prospect (0-100) selon l'ICP + justification courte."""
        system = (
            "Tu es un analyste commercial B2B. Tu évalues la pertinence d'un prospect "
            "par rapport au profil de client idéal (ICP) fourni. Tu réponds STRICTEMENT "
            "par un objet JSON valide, sans texte autour, au format exact : "
            '{"score": <entier 0-100>, "justification": "<une phrase concise>"}. '
            "Le score reflète l'adéquation avec l'ICP. Ne te base que sur les données "
            "fournies ; n'invente aucune information sur le prospect."
        )
        user = (
            f"<icp>\n{description_icp.strip() or 'Aucun ICP précisé.'}\n</icp>\n\n"
            f"<prospect>\n{self._resume_prospect(prospect)}\n</prospect>\n\n"
            "Donne le score d'adéquation et sa justification (JSON uniquement)."
        )
        try:
            brut = await self._appeler(self.modele_scoring, system, user, max_tokens=300)
            data = _extraire_json(brut)
            score = int(data.get("score", 0))
            score = max(0, min(100, score))
            justification = str(data.get("justification", "")).strip()
            return score, justification
        except Exception as exc:  # noqa: BLE001 — un échec de scoring n'arrête pas le job
            logger.warning("Scoring échoué pour {} : {}", prospect.id, exc)
            return 0, f"Scoring indisponible ({type(exc).__name__})."

    async def generer_message(self, prospect: Prospect, modele_message: str) -> str:
        """Rédige un message de prospection personnalisé (français), sans rien inventer."""
        system = (
            "Tu es un expert de la prospection B2B francophone. Tu rédiges un message "
            "court, personnalisé et professionnel, en français. Règles absolues : "
            "n'invente AUCUN fait sur le prospect ou son entreprise — utilise uniquement "
            "les données fournies ; reste sobre et respectueux ; pas de promesses "
            "mensongères. Réponds uniquement par le texte du message, sans préambule "
            "ni guillemets."
        )
        consignes = modele_message.strip() or (
            "Ton professionnel et chaleureux, 4 à 6 phrases, une accroche liée à "
            "l'activité du prospect, une proposition de valeur claire et un appel à "
            "l'action léger (proposer un échange)."
        )
        user = (
            f"<consignes_redaction>\n{consignes}\n</consignes_redaction>\n\n"
            f"<donnees_prospect>\n{self._resume_prospect(prospect)}\n</donnees_prospect>\n\n"
            "Rédige le message de prospection."
        )
        try:
            return (
                await self._appeler(self.modele_message, system, user, max_tokens=600)
            ).strip()
        except Exception as exc:  # noqa: BLE001
            logger.warning("Génération de message échouée pour {} : {}", prospect.id, exc)
            return ""
