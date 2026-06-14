---
name: ai-agent-builder
description: "Concevoir, prototyper et mettre en production des agents IA : prompt engineering avancé (system prompt, few-shot, chain-of-thought, structured outputs), tool use / function calling (OpenAI, Claude, Gemini), RAG complet (chunking, embeddings, bases vectorielles Pinecone/Supabase pgvector/Qdrant), serveurs MCP (Model Context Protocol), orchestration multi-agents (LangGraph, CrewAI, AutoGen), évaluation des agents (LangSmith, RAGAS, evals maison), sécurité (prompt injection, jailbreak, garde-fous), maîtrise des coûts token (caching, compression, routing), et déploiement (API FastAPI/Hono, serverless, streaming SSE). Utiliser pour : construire un agent IA avec outils, créer un chatbot RAG sur documents, architecturer un pipeline multi-agents, intégrer un serveur MCP, évaluer la qualité d'un agent, sécuriser un LLM en production, réduire les coûts API. Mots-clés : agent IA, LLM, Claude, OpenAI, GPT, Gemini, prompt engineering, tool use, function calling, RAG, embeddings, vectordb, Pinecone, pgvector, Qdrant, MCP, LangChain, LangGraph, CrewAI, AutoGen, LangSmith, RAGAS, prompt injection, token cost, streaming, SSE, FastAPI."
---

# AI Agent Builder — De l'idée à la prod

Guide structuré pour **concevoir, évaluer et déployer des agents IA robustes** : du prompt engineering de base au pipeline multi-agents avec RAG, MCP et évaluation.

## Quand l'activer
Construire un agent avec outils, un chatbot RAG, un pipeline multi-agents, intégrer un serveur MCP, évaluer ou sécuriser un LLM en production, maîtriser les coûts token.

---

## Architecture type d'un agent

```
User input
    ↓
System prompt (rôle + contraintes + outils disponibles)
    ↓
LLM (Claude / GPT-4o / Gemini)
    ↓ → tool_call → Tool execution (API, DB, search, code)
    ↓              → résultat injecté en context
    ↓
Réponse finale (text / structured output)
    ↓
Évaluation / logging (LangSmith / evals maison)
```

---

## Prompt Engineering — principes actionnables

**System prompt robuste** :
```
Tu es [rôle précis]. Tu [capacités]. Tu ne [limites explicites].
Réponds toujours en JSON structuré selon ce schéma : {...}
Si tu ne sais pas, dis-le explicitement. Ne fabrique pas de faits.
```

**Règles fondamentales** :
- Rôle + contraintes + format de sortie dans le system prompt — jamais dans le user message.
- **Few-shot** (2–4 exemples) : divise l'erreur par 2–3 sur les tâches structurées.
- **Chain-of-thought** : `"Réfléchis étape par étape avant de répondre."` — activer sur les tâches de raisonnement, désactiver sur les réponses courtes (coût token).
- **Structured outputs** : JSON mode (OpenAI) ou `response_format` → toujours valider avec Pydantic/Zod côté serveur.
- Température : 0–0.2 pour les agents déterministes, 0.7–1 pour la créativité.

---

## Tool Use / Function Calling

```python
tools = [
    {
        "name": "search_web",
        "description": "Cherche sur le web. Utiliser quand l'info peut être récente ou inconnue.",
        "input_schema": {
            "type": "object",
            "properties": {"query": {"type": "string", "description": "Requête de recherche"}},
            "required": ["query"]
        }
    }
]
# Claude :
response = client.messages.create(model="claude-opus-4-5", tools=tools, messages=[...])
# Boucle d'exécution : tant que stop_reason == "tool_use" → exécuter l'outil → reinjecter
```

Bonnes pratiques :
- Décrire **quand utiliser** l'outil (pas seulement ce qu'il fait).
- Limiter à 5–8 outils par agent (au-delà : confusion, latence).
- Toujours valider les paramètres de l'outil avant exécution (injection).
- Timeout sur chaque appel outil (5–15 s max).

---

## RAG — Pipeline complet

### 1. Ingestion (une fois)
```
Documents (PDF, MD, HTML, DOCX)
    ↓ Parsing (pypdf, unstructured, markitdown)
    ↓ Chunking : 512–1024 tokens, overlap 10–20 %
    ↓ Embeddings : text-embedding-3-small (OpenAI) ou nomic-embed-text (local)
    ↓ Stockage : Supabase pgvector (gratuit) | Pinecone | Qdrant
```

### 2. Retrieval (à chaque requête)
```
Query → embedding → similarité cosinus → top-k chunks (k=3–6)
       → re-ranking optionnel (Cohere Rerank, bge-reranker)
       → injection dans le context avec source
```

### 3. Chunking — règles
- **Fixe (token)** : simple, bon défaut. Overlap pour éviter les coupures de sens.
- **Sémantique** : découper aux frontières naturelles (paragraphes, titres).
- **Récursif** (LangChain `RecursiveCharacterTextSplitter`) : tente `\n\n`, puis `\n`, puis ` ` — recommandé.
- Garder les métadonnées (source, page, date) avec chaque chunk.

### 4. Évaluation RAG (RAGAS)
```python
from ragas.metrics import faithfulness, answer_relevancy, context_recall
# faithfulness : la réponse est-elle fondée sur le contexte ?
# answer_relevancy : la réponse répond-elle à la question ?
# context_recall : les bons chunks sont-ils récupérés ?
```

---

## Serveurs MCP (Model Context Protocol)

MCP = protocole standard pour exposer des outils/ressources à un LLM via un serveur local ou distant.

```typescript
// Serveur MCP minimal (TypeScript SDK)
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "mon-agent", version: "1.0.0" });

server.tool("get_client", { id: z.string() }, async ({ id }) => {
  const client = await db.clients.findById(id);
  return { content: [{ type: "text", text: JSON.stringify(client) }] };
});

await server.connect(new StdioServerTransport());
```

Cas d'usage ARTCOL : exposer la base PlayAzur (clients, deals, KPIs) à Claude Code via MCP.

---

## Orchestration multi-agents

| Framework | Quand | Style |
|-----------|-------|-------|
| **LangGraph** | Workflows conditionnels, cycles, état persistant | Graphe d'états Python |
| **CrewAI** | Équipes d'agents avec rôles définis | Haut niveau, déclaratif |
| **AutoGen** | Conversations multi-agents, code exécution | Dialogue entre agents |
| **Vanilla boucle Python** | Cas simples (1–2 agents) | Le plus lisible, recommandé pour débuter |

Règle : ne pas utiliser de framework si une boucle Python de 50 lignes suffit.

**Pattern superviseur** :
```
Superviseur → décompose la tâche → délègue aux agents spécialisés
           ← collecte les résultats → synthèse finale
```

---

## Évaluation des agents

Ne jamais déployer sans baseline d'évaluation :
1. **Dataset de test** : 20–50 cas représentatifs (input → expected output).
2. **LLM-as-judge** : Claude évalue si la réponse est correcte (rapide, scalable).
3. **Métriques déterministes** : exact match, F1, latence, coût/requête.
4. **LangSmith** : tracing complet, A/B prompts, datasets, evals automatisés.

Seuils minimum avant prod : faithfulness > 0,85 / answer_relevancy > 0,80.

---

## Sécurité — prompt injection & garde-fous

**Risques principaux** :
- **Prompt injection directe** : l'utilisateur inclut des instructions malveillantes dans son message.
- **Prompt injection indirecte** : contenu externe (doc, web) contient des instructions cachées.
- **Jailbreak** : contournement des instructions système.

**Contre-mesures** :
```python
# 1. Séparer data et instructions — ne jamais interpoler l'input user dans le system prompt
system = "Tu es un assistant. Réponds uniquement en français."
user = f"Voici le document : {sanitize(doc)}\n\nQuestion : {sanitize(query)}"

# 2. Validation de sortie : vérifier que la réponse respecte le format attendu
# 3. Limiter les permissions des outils (least privilege)
# 4. Logging complet de chaque appel (détection d'anomalies)
# 5. Rate limiting par utilisateur
```

---

## Maîtrise des coûts token

| Levier | Économie estimée |
|--------|-----------------|
| **Prompt caching** (Claude / OpenAI) | 50–90 % sur le system prompt répété |
| **Choisir le bon modèle** (Haiku vs Opus) | 10–100× sur les tâches simples |
| **Compresser le context** : résumé + fenêtre glissante | 40–70 % |
| **Structured outputs** : éviter le verbose | 10–20 % |
| **Batching** (Anthropic Batch API) | 50 % sur les tâches asynchrones |

```python
# Prompt caching Claude (économise 90 % sur un long system prompt)
{"role": "user", "content": [
    {"type": "text", "text": long_system_context,
     "cache_control": {"type": "ephemeral"}}  # TTL 5 min
]}
```

---

## Déploiement

- **API FastAPI** : streaming SSE (`StreamingResponse`), endpoints `/chat`, `/embed`, `/search`.
- **Serverless** : Vercel Edge Functions (< 25 Mo), Cloudflare Workers, AWS Lambda.
- **Streaming côté client** :
```javascript
const res = await fetch('/api/chat', { method: 'POST', body: JSON.stringify({query}) })
const reader = res.body.getReader()
// lire les chunks → afficher en temps réel
```
- **Variables d'env** : `ANTHROPIC_API_KEY`, `OPENAI_API_KEY` → jamais dans le code.
- **Monitoring** : LangSmith ou Helicone pour les traces, Sentry pour les erreurs.

---

## Do / Don't

| Do | Don't |
|----|-------|
| System prompt clair avec rôle + contraintes + format | System prompt vide ou trop vague |
| Prompt caching sur les contextes longs répétés | Payer plein tarif sur chaque appel identique |
| Évaluer avant de déployer (20+ cas test) | Juger la qualité à l'oeil en prod |
| Valider les inputs/outputs des outils | Exécuter aveuglément le résultat du LLM |
| Choisir le modèle le plus petit suffisant | Tout faire sur Opus/GPT-4o par défaut |

> Skills sœurs : `web-builder` (déploiement API/backend), `artcol-design-system` (UI du chatbot), `ui-ux-pro-max` (UX des interfaces agent).
