# SENSOR

**Assistant client conversationnel RAG, zéro-hallucination, multi-tenant et embarquable.**

SENSOR répond aux visiteurs d'un site web **uniquement à partir de la base
documentaire validée par l'entreprise** (FAQ, brochures, fiches produit,
conditions générales, pages de support). S'il ne trouve pas l'information, il
le dit clairement et propose une action de repli — il **n'invente jamais**.

C'est un produit multi-client : un fichier de configuration par client + ses
documents = un nouvel assistant, sans toucher au code.

> Produit de la gamme AMAVYA (offre flagship « assistant client RAG »).

---

## Sommaire
1. [Architecture](#architecture)
2. [Prérequis](#prérequis)
3. [Installation](#installation)
4. [Configuration du `.env`](#configuration-du-env)
5. [Créer un client](#créer-un-client)
6. [Ingérer des documents et un site](#ingérer-des-documents-et-un-site)
7. [Lancer l'API](#lancer-lapi)
8. [Tester de bout en bout (widget)](#tester-de-bout-en-bout-widget)
9. [Intégrer le widget sur un vrai site](#intégrer-le-widget-sur-un-vrai-site)
10. [Statistiques et administration](#statistiques-et-administration)
11. [Déploiement Docker](#déploiement-docker)
12. [Option Supabase pgvector](#option-supabase-pgvector)
13. [Conformité](#conformité)
14. [Tests](#tests)

---

## Architecture

```
Documents client ──▶ Ingestion (load → chunk → embed → store)
                              │
                       Base vectorielle (SQLite local | Supabase pgvector)
                              │
Question visiteur ──▶ Retrieval top-k + seuil ──▶ hors-scope ? ─oui▶ message de repli
                              │ non
                              ▼
                     Génération Claude (contexte sourcé, anti-injection)
                              │
                     Réponse + sources citées  ──▶  Widget JS / API
```

- **Embeddings** : `local` (sentence-transformers, souverain, par défaut) ou
  `api` (Voyage AI). Abstraits derrière `BaseEmbedder`.
- **Base vectorielle** : `sqlite` (local, par défaut, accélérée par `sqlite-vec`
  avec repli numpy) ou `supabase` (pgvector). Abstraites derrière `BaseVectorStore`.
- **Génération** : Claude (Sonnet par défaut pour la fidélité, Haiku pour les
  tâches légères), via le SDK Anthropic officiel.

---

## Prérequis

- **Python 3.11+**
- Une **clé API Anthropic** (génération des réponses) — https://console.anthropic.com/
- (Optionnel) une clé **Voyage AI** si vous choisissez les embeddings API.
- (Optionnel) un projet **Supabase** si vous choisissez pgvector.

Le mode par défaut est **100 % local** (embeddings locaux + SQLite) : aucune
dépendance à un service tiers autre qu'Anthropic pour la génération.

---

## Installation

```bash
cd sensor
python3 -m venv .venv
source .venv/bin/activate        # Windows : .venv\Scripts\activate
pip install -r requirements.txt
```

> Le premier lancement en mode local télécharge le modèle d'embeddings
> multilingue (~120 Mo, mis en cache ensuite).

---

## Configuration du `.env`

```bash
cp .env.example .env
```

Variables à renseigner :

| Variable | Obligatoire | Où l'obtenir / valeur |
|---|---|---|
| `ANTHROPIC_API_KEY` | **Oui** | console.anthropic.com → Settings → API Keys |
| `SENSOR_ADMIN_KEY` | **Oui** | Générez-la : `python -c "import secrets;print(secrets.token_urlsafe(32))"` |
| `VOYAGE_API_KEY` | Si `embedder: api` | voyageai.com (dashboard) |
| `SUPABASE_URL` / `SUPABASE_KEY` | Si `vectorstore: supabase` | Supabase → Settings → API (clé `service_role`, côté serveur) |
| `SENSOR_DATA_DIR` / `SENSOR_LOGS_DIR` / `SENSOR_CLIENTS_DIR` | Non | Chemins runtime (défauts adaptés) |
| `SENSOR_HOST` / `SENSOR_PORT` / `SENSOR_LOG_LEVEL` | Non | Paramètres serveur |

⚠️ Le `.env` n'est **jamais** committé (voir `.gitignore`). Aucune clé n'est loggée.

---

## Créer un client

```bash
sensor init-client --id demo --nom "Hôtel Démo" --email-contact contact@hotel-demo.fr
```

Cela crée `clients/demo.yaml` à partir du modèle commenté
(`clients/exemple_client.yaml`). Ajustez-y le ton, le `seuil_similarite_min`, le
`message_hors_scope`, les `domaines_autorises` (CORS), les couleurs du widget, etc.

Options : `--embedder local|api`, `--vectorstore sqlite|supabase`, `--langue`.

---

## Ingérer des documents et un site

**Documents locaux** (PDF, DOCX, TXT, MD, HTML — fichier ou dossier récursif) :

```bash
sensor ingest --client demo --path ./mes_documents/
sensor ingest --client demo --path ./faq.pdf
```

**Site public du client** (crawl poli, respect du `robots.txt`) :

```bash
sensor ingest --client demo --url https://www.hotel-demo.fr --profondeur 2 --max-pages 50
```

L'ingestion est **idempotente** : réingérer un document inchangé est ignoré ;
un document modifié voit ses anciens chunks remplacés (détection par hash).

Reconstruire entièrement la base (après changement d'embedder/chunking) :

```bash
sensor reindex --client demo
```

**Tester une question en console** (bout en bout, nécessite `ANTHROPIC_API_KEY`) :

```bash
sensor ask --client demo "Quels sont les horaires du petit-déjeuner ?"
```

---

## Lancer l'API

```bash
sensor serve            # ou : uvicorn sensor.api.main:app --port 8000
```

- Documentation interactive : http://localhost:8000/docs
- Santé : `GET /health`
- Conversation : `POST /chat` `{ "id_client": "demo", "message": "…", "id_session": null }`
- Streaming (SSE) : `POST /chat/stream`
- Config publique du widget : `GET /client/demo/config`
- Widget servi par l'API : `GET /sensor-widget.js`

---

## Tester de bout en bout (widget)

1. Démarrez l'API : `sensor serve`
2. Ouvrez `widget/demo.html` dans un navigateur.
3. Renseignez l'URL de l'API (`http://localhost:8000`) et l'`id_client` (`demo`),
   cliquez sur **Charger le widget**.
4. La bulle de chat apparaît en bas à droite. Posez vos questions.

Le widget affiche la réponse, les **sources citées**, un indicateur de frappe,
et persiste la session (`sessionStorage`). La mention « Assistant IA » est
toujours visible (transparence AI Act).

---

## Intégrer le widget sur un vrai site

Une seule balise `<script>` à coller avant `</body>` :

```html
<script
  src="https://votre-api.fr/sensor-widget.js"
  data-client="demo"
  data-api="https://votre-api.fr">
</script>
```

Personnalisation optionnelle par attributs : `data-titre`, `data-primaire`,
`data-fond`, `data-texte`, `data-secondaire`. Sinon, les couleurs et le message
d'accueil proviennent de la config du client (`GET /client/<id>/config`).

> Pensez à ajouter le domaine du site dans `domaines_autorises` de la config
> client (CORS).

---

## Statistiques et administration

Les routes `/admin/*` sont protégées par l'en-tête `X-Admin-Key`
(valeur = `SENSOR_ADMIN_KEY`).

```bash
# Statistiques (taux de réponse, hors-scope, coûts, top questions sans réponse)
curl -H "X-Admin-Key: $SENSOR_ADMIN_KEY" http://localhost:8000/admin/stats/demo

# Santé d'un client (base prête, nb documents/chunks)
curl -H "X-Admin-Key: $SENSOR_ADMIN_KEY" http://localhost:8000/admin/health/demo

# Ingestion via API
curl -X POST -H "X-Admin-Key: $SENSOR_ADMIN_KEY" -H "Content-Type: application/json" \
     -d '{"id_client":"demo","path":"./faq.pdf"}' http://localhost:8000/admin/ingest/path

# Purge RGPD des conversations expirées
curl -X POST -H "X-Admin-Key: $SENSOR_ADMIN_KEY" http://localhost:8000/admin/purge/demo
```

En console (table `rich`) :

```bash
sensor stats --client demo
sensor purge --client demo
```

Le **top des questions sans réponse** est l'indicateur clé pour enrichir la base
et démontrer la valeur au client.

---

## Déploiement Docker

```bash
docker build -t sensor-api .
docker run -p 8000:8000 \
  --env-file .env \
  -v "$(pwd)/data:/app/data" \
  -v "$(pwd)/logs:/app/logs" \
  -v "$(pwd)/clients:/app/clients" \
  sensor-api
```

Montez `data/`, `logs/` et `clients/` en volumes pour persister les bases et
configurations. En production, hébergez les volumes en UE (OVHcloud/Scaleway)
pour la souveraineté des données.

---

## Option Supabase pgvector

1. Dans la config client : `vectorstore: supabase` (et `embedder` au choix).
2. Renseignez `SUPABASE_URL` / `SUPABASE_KEY` dans `.env`.
3. Installez le schéma SQL une fois (adaptez la dimension : 384 local, 1024 Voyage) :

```bash
sensor supabase-sql --dim 384
# Copiez le SQL affiché dans l'éditeur SQL de Supabase et exécutez-le.
```

Cela crée les tables `sensor_documents` / `sensor_chunks`, l'index pgvector et la
fonction `sensor_match_chunks` (recherche cosinus filtrée par client).

---

## Conformité

- **Zéro hallucination.** Le prompt système impose de répondre uniquement à
  partir du `<contexte>` fourni ; un seuil de similarité minimal court-circuite
  la génération quand rien de pertinent n'est trouvé (message de repli, sans
  appeler Claude). Chaque réponse cite ses sources.
- **Données du client uniquement.** Seuls les documents fournis et le contenu
  public du propre site du client (avec respect du `robots.txt` et délai poli
  entre requêtes) sont ingérés. Jamais de scraping de sites tiers.
- **Transparence IA (AI Act art. 50).** Le widget indique en permanence qu'il
  s'agit d'un assistant IA.
- **RGPD.** Rétention configurable des conversations
  (`retention_jours_conversations`, défaut 90 j) avec purge automatique
  (`sensor purge` ou `POST /admin/purge/<id>`). Aucune donnée sensible
  collectée. Les clés et secrets ne sont jamais loggés.
- **Protection contre la prompt injection.** Séparation stricte des rôles :
  instructions dans le system prompt, passages récupérés injectés dans des
  balises `<contexte>` avec consigne explicite de n'exécuter aucune instruction
  qu'ils contiendraient. Le jeton interne hors-scope n'est jamais diffusé.
- **Sécurité.** Clés API côté serveur uniquement ; le widget appelle votre API,
  jamais Anthropic directement. Rate limiting par IP (slowapi). Validation
  stricte des entrées (pydantic). Routes admin protégées par clé dédiée.
- **Souveraineté (option).** Embeddings exécutables 100 % en local : les
  documents ne transitent par aucun service tiers pour la vectorisation.

---

## Tests

```bash
pip install pytest pytest-asyncio
pytest
```

Le test `tests/test_answerer.py` vérifie le **garde-fou anti-hallucination** :
quand le contexte ne contient pas la réponse, SENSOR refuse et renvoie le
message de repli (sans appeler Claude, et sans fuiter le jeton interne).
`tests/test_retriever.py` couvre la récupération et le signal hors-scope ;
`tests/test_chunker.py` le découpage ; `tests/test_api.py` l'API (moteur mocké).

---

## Structure du projet

```
sensor/
├── sensor/
│   ├── config.py / models.py
│   ├── embedders/   (base, local, api)
│   ├── vectorstore/ (base, sqlite_store, supabase_store)
│   ├── ingestion/   (loaders, crawler, chunker, pipeline)
│   ├── retrieval/   (retriever)
│   ├── generation/  (prompts, answerer)
│   ├── api/         (main, routes_chat, routes_admin, deps)
│   ├── storage/     (conversations)
│   ├── analytics/   (logger)
│   └── cli.py
├── widget/          (sensor-widget.js, demo.html)
├── clients/         (exemple_client.yaml)
├── tests/
├── requirements.txt / pyproject.toml / Dockerfile / .env.example
```
