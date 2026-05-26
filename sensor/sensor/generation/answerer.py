"""Génération de la réponse finale avec Claude (garde-fou anti-hallucination).

Flux :
1. Si le retriever a déjà classé la question hors-scope, on renvoie directement
   le message de repli — sans appeler Claude (économie de tokens).
2. Sinon, on assemble le contexte et on interroge Claude (Sonnet par défaut).
3. On détecte le cas hors-scope renvoyé par le modèle (jeton dédié), on extrait
   les sources réellement citées, et on journalise tokens + coût.

Toute erreur API est gérée proprement (retries tenacity puis repli gracieux) :
l'appelant ne reçoit jamais d'exception non maîtrisée.
"""

from __future__ import annotations

import re
from collections.abc import Iterator

from loguru import logger
from tenacity import (
    retry,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

from sensor.generation.prompts import (
    JETON_HORS_SCOPE,
    construire_message_utilisateur,
    construire_prompt_systeme,
)
from sensor.models import ChunkResultat, ClientConfig, ReponseGeneree, Source
from sensor.retrieval.retriever import ResultatRecherche

#: Tarifs Anthropic (USD par million de tokens) — input, output.
#: Source : tarification publique Claude 4.x.
TARIFS = {
    "claude-sonnet-4-6": (3.0, 15.0),
    "claude-haiku-4-5": (1.0, 5.0),
    "claude-opus-4-7": (15.0, 75.0),
}
_TARIF_DEFAUT = (3.0, 15.0)

_REGEX_CITATION = re.compile(r"\[(\d+)\]")


def estimer_cout(modele: str, tokens_input: int, tokens_output: int) -> float:
    """Estime le coût USD d'un appel à partir du nombre de tokens."""
    prix_in, prix_out = TARIFS.get(modele, _TARIF_DEFAUT)
    return (tokens_input / 1_000_000) * prix_in + (tokens_output / 1_000_000) * prix_out


class Answerer:
    """Génère une réponse sourcée et fidèle à partir des passages récupérés."""

    def __init__(self, config: ClientConfig, anthropic_api_key: str) -> None:
        self.config = config
        if not anthropic_api_key:
            raise ValueError(
                "ANTHROPIC_API_KEY manquante : indispensable pour générer des réponses."
            )
        # Import local : la dépendance n'est requise que pour la génération.
        import anthropic

        self._anthropic = anthropic
        self._client = anthropic.Anthropic(api_key=anthropic_api_key, timeout=30.0)
        self._prompt_systeme = construire_prompt_systeme(config)

    def repondre(self, question: str, recherche: ResultatRecherche) -> ReponseGeneree:
        """Produit la réponse finale pour une question et ses passages récupérés."""
        if recherche.hors_scope or not recherche.passages:
            return self._reponse_repli()

        message = construire_message_utilisateur(question, recherche.passages)
        try:
            texte_brut, tokens_in, tokens_out = self._appeler_claude(message)
        except Exception as exc:  # noqa: BLE001 — repli gracieux obligatoire
            logger.error("Échec de l'appel Claude après retries : {}", exc)
            return ReponseGeneree(
                texte=(
                    "Je rencontre une difficulté technique momentanée et ne peux pas répondre "
                    f"à l'instant. {self._texte_repli_action()}"
                ),
                hors_scope=True,
            )

        cout = estimer_cout(self.config.modele_reponse, tokens_in, tokens_out)

        # Le modèle signale lui-même l'absence d'information dans le contexte.
        if JETON_HORS_SCOPE in texte_brut:
            repli = self._reponse_repli()
            repli.tokens_input = tokens_in
            repli.tokens_output = tokens_out
            repli.cout_estime_usd = cout
            return repli

        texte_final, sources = self._extraire_sources(texte_brut, recherche.passages)
        return ReponseGeneree(
            texte=texte_final,
            sources=sources,
            hors_scope=False,
            tokens_input=tokens_in,
            tokens_output=tokens_out,
            cout_estime_usd=cout,
        )

    def repondre_stream(
        self, question: str, recherche: ResultatRecherche
    ) -> Iterator[tuple[str, object]]:
        """Variante streaming : produit des tuples ("delta", str) puis ("final", ReponseGeneree).

        Le cas hors-scope est détecté en bufferisant le début de la réponse, de
        sorte que le jeton interne ne soit jamais diffusé au client.
        """
        if recherche.hors_scope or not recherche.passages:
            repli = self._reponse_repli()
            yield ("delta", repli.texte)
            yield ("final", repli)
            return

        message = construire_message_utilisateur(question, recherche.passages)
        texte = ""
        buffer_initial = ""
        en_attente = True  # tant qu'on n'a pas écarté le jeton hors-scope
        tokens_in = tokens_out = 0
        try:
            with self._client.messages.stream(
                model=self.config.modele_reponse,
                max_tokens=self.config.max_tokens_reponse,
                system=self._prompt_systeme,
                messages=[{"role": "user", "content": message}],
            ) as flux:
                for delta in flux.text_stream:
                    texte += delta
                    if en_attente:
                        buffer_initial += delta
                        # On attend assez de caractères pour trancher.
                        if len(buffer_initial) < len(JETON_HORS_SCOPE):
                            continue
                        if buffer_initial.lstrip().startswith(JETON_HORS_SCOPE):
                            break  # hors-scope : on arrête et on bascule sur le repli
                        en_attente = False
                        yield ("delta", buffer_initial)
                    else:
                        yield ("delta", delta)
                message_final = flux.get_final_message()
            tokens_in = message_final.usage.input_tokens
            tokens_out = message_final.usage.output_tokens
        except Exception as exc:  # noqa: BLE001 — repli gracieux obligatoire
            logger.error("Échec du streaming Claude : {}", exc)
            msg = (
                "Je rencontre une difficulté technique momentanée. "
                f"{self._texte_repli_action()}"
            )
            if en_attente:
                yield ("delta", msg)
            yield ("final", ReponseGeneree(texte=msg, hors_scope=True))
            return

        cout = estimer_cout(self.config.modele_reponse, tokens_in, tokens_out)
        if JETON_HORS_SCOPE in texte:
            repli = self._reponse_repli()
            repli.tokens_input, repli.tokens_output, repli.cout_estime_usd = (
                tokens_in,
                tokens_out,
                cout,
            )
            yield ("delta", repli.texte)
            yield ("final", repli)
            return

        _, sources = self._extraire_sources(texte, recherche.passages)
        yield (
            "final",
            ReponseGeneree(
                texte=texte,
                sources=sources,
                hors_scope=False,
                tokens_input=tokens_in,
                tokens_output=tokens_out,
                cout_estime_usd=cout,
            ),
        )

    # -- Appel modèle ------------------------------------------------------

    def _exceptions_reseau(self):
        a = self._anthropic
        return (
            a.APITimeoutError,
            a.APIConnectionError,
            a.RateLimitError,
            a.InternalServerError,
        )

    def _appeler_claude(self, message_utilisateur: str) -> tuple[str, int, int]:
        @retry(
            reraise=True,
            stop=stop_after_attempt(3),
            wait=wait_exponential(multiplier=1, min=2, max=10),
            retry=retry_if_exception_type(self._exceptions_reseau()),
        )
        def _appel() -> tuple[str, int, int]:
            reponse = self._client.messages.create(
                model=self.config.modele_reponse,
                max_tokens=self.config.max_tokens_reponse,
                system=self._prompt_systeme,
                messages=[{"role": "user", "content": message_utilisateur}],
            )
            texte = "".join(
                bloc.text for bloc in reponse.content if getattr(bloc, "type", "") == "text"
            ).strip()
            return texte, reponse.usage.input_tokens, reponse.usage.output_tokens

        return _appel()

    # -- Post-traitement ---------------------------------------------------

    def _extraire_sources(
        self, texte: str, passages: list[ChunkResultat]
    ) -> tuple[str, list[Source]]:
        """Associe les citations [n] du texte aux passages, et construit les Source."""
        indices_cites = {int(m) for m in _REGEX_CITATION.findall(texte)}
        sources: list[Source] = []
        for i, resultat in enumerate(passages, start=1):
            if indices_cites and i not in indices_cites:
                continue
            meta = resultat.chunk.metadata
            extrait = resultat.chunk.texte
            if len(extrait) > 280:
                extrait = extrait[:277].rstrip() + "…"
            sources.append(
                Source(
                    titre_document=meta.titre_document,
                    source=meta.source,
                    section=meta.section,
                    extrait=extrait,
                    score=round(resultat.score, 4),
                )
            )
        # Si le modèle a répondu sans citer (rare), on rattache le meilleur passage
        # pour garantir qu'une réponse reste toujours traçable.
        if not sources and passages:
            meilleur = passages[0]
            meta = meilleur.chunk.metadata
            extrait = meilleur.chunk.texte[:277].rstrip()
            sources.append(
                Source(
                    titre_document=meta.titre_document,
                    source=meta.source,
                    section=meta.section,
                    extrait=extrait + ("…" if len(meilleur.chunk.texte) > 280 else ""),
                    score=round(meilleur.score, 4),
                )
            )
        return texte, sources

    def _reponse_repli(self) -> ReponseGeneree:
        texte = f"{self.config.message_hors_scope} {self._texte_repli_action()}".strip()
        return ReponseGeneree(texte=texte, sources=[], hors_scope=True)

    def _texte_repli_action(self) -> str:
        action = self.config.action_repli
        elements: list[str] = []
        if action.email:
            elements.append(f"écrire à {action.email}")
        if action.url:
            elements.append(f"consulter {action.url}")
        if elements:
            return f"Vous pouvez {', ou '.join(elements)}."
        return action.label + "." if action.label and not action.label.endswith(".") else action.label
