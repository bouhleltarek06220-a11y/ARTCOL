"""Embeddings via API Voyage AI (mode qualité supérieure).

Voyage AI est recommandé par Anthropic pour la qualité des embeddings. Les
textes sont envoyés au service ; à n'utiliser que si la souveraineté n'est pas
une contrainte pour le client.
"""

from __future__ import annotations

import httpx
from loguru import logger
from tenacity import (
    retry,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

from sensor.embedders.base import BaseEmbedder

#: Dimensions connues des principaux modèles Voyage (évite un appel sonde).
_DIMENSIONS_VOYAGE = {
    "voyage-3": 1024,
    "voyage-3-lite": 512,
    "voyage-3.5": 1024,
    "voyage-3.5-lite": 1024,
    "voyage-multilingual-2": 1024,
    "voyage-2": 1024,
}

_URL = "https://api.voyageai.com/v1/embeddings"


class VoyageEmbedder(BaseEmbedder):
    """Embedder appelant l'API Voyage AI."""

    def __init__(self, api_key: str, modele: str = "voyage-3") -> None:
        if not api_key:
            raise ValueError(
                "VOYAGE_API_KEY manquante : requise pour un client configuré avec embedder: api. "
                "Renseignez-la dans .env ou basculez le client en embedder: local."
            )
        self._api_key = api_key
        self.nom_modele = modele
        self.dimension = _DIMENSIONS_VOYAGE.get(modele, 1024)
        self._client = httpx.Client(timeout=30.0)

    @retry(
        reraise=True,
        stop=stop_after_attempt(4),
        wait=wait_exponential(multiplier=1, min=2, max=16),
        retry=retry_if_exception_type((httpx.TransportError, httpx.HTTPStatusError)),
    )
    def _appeler(self, textes: list[str], input_type: str) -> list[list[float]]:
        reponse = self._client.post(
            _URL,
            headers={"Authorization": f"Bearer {self._api_key}"},
            json={"input": textes, "model": self.nom_modele, "input_type": input_type},
        )
        # 429/5xx : on relance (tenacity) ; 4xx autres : erreur définitive.
        if reponse.status_code == 429 or reponse.status_code >= 500:
            reponse.raise_for_status()
        if reponse.status_code >= 400:
            raise ValueError(
                f"Voyage AI a refusé la requête ({reponse.status_code}) : {reponse.text[:300]}"
            )
        data = reponse.json()["data"]
        # L'API renvoie les vecteurs dans l'ordre des entrées (champ "index").
        data.sort(key=lambda d: d["index"])
        vecteurs = [d["embedding"] for d in data]
        if vecteurs:
            self.dimension = len(vecteurs[0])
        return vecteurs

    def embed_documents(self, textes: list[str]) -> list[list[float]]:
        if not textes:
            return []
        # Voyage limite la taille des lots ; on découpe pour rester sous la limite.
        resultats: list[list[float]] = []
        lot = 96
        for i in range(0, len(textes), lot):
            resultats.extend(self._appeler(textes[i : i + lot], input_type="document"))
        logger.debug("Voyage : {} documents vectorisés.", len(resultats))
        return resultats

    def embed_query(self, texte: str) -> list[float]:
        return self._appeler([texte], input_type="query")[0]
