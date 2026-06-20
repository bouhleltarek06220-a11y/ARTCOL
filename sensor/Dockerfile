# ============================================================================
# SENSOR — Image de déploiement de l'API
# ============================================================================
FROM python:3.11-slim AS base

# Variables d'environnement Python saines pour un conteneur.
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    # Cache des modèles sentence-transformers dans un volume persistant.
    HF_HOME=/app/models_cache \
    SENSOR_DATA_DIR=/app/data \
    SENSOR_LOGS_DIR=/app/logs \
    SENSOR_CLIENTS_DIR=/app/clients

WORKDIR /app

# Dépendances système minimales (build de quelques wheels).
RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential \
    && rm -rf /var/lib/apt/lists/*

# Installation des dépendances Python en couche séparée (cache Docker).
COPY requirements.txt ./
RUN pip install -r requirements.txt

# Code applicatif.
COPY sensor ./sensor
COPY clients ./clients
COPY widget ./widget
COPY pyproject.toml README.md ./

# Répertoires runtime (montés en volumes en production).
RUN mkdir -p /app/data /app/logs /app/models_cache

# Utilisateur non-root.
RUN useradd --create-home --uid 10001 sensor \
    && chown -R sensor:sensor /app
USER sensor

EXPOSE 8000

# L'API lit la config et les secrets depuis l'environnement / .env monté.
CMD ["uvicorn", "sensor.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
