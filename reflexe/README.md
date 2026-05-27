# REFLEXE

**Agent de prospection B2B automatisé — collecte légale, enrichissement, scoring IA, messages personnalisés, export Brevo.**

REFLEXE part d'un fichier de **mission** (YAML) que vous définissez, puis :
collecte des entreprises depuis des **sources publiques et légales**, nettoie et
déduplique les données, enrichit les fiches (site web, email pro public,
téléphone, dirigeants), **score** chaque prospect par rapport à votre client
idéal avec Claude, **rédige** un message personnalisé, exporte le tout
(CSV + JSON) et peut pousser les prospects validés vers **Brevo**.

C'est un outil en **ligne de commande** (pas d'interface web), pensé comme un
produit réutilisable. C'est l'un des trois produits de la gamme **AMAVYA**
(avec SENSOR, l'assistant client, et MEMOIRE, l'assistant interne).

> ⚠️ REFLEXE ne scrape **jamais** LinkedIn ni aucun réseau social fermé, ne
> contourne aucune protection, respecte le `robots.txt` et le RGPD. Voir la
> section [Conformité](#conformité).

---

## Sommaire
1. [Prérequis](#prérequis)
2. [Installation](#installation)
3. [Configuration du `.env`](#configuration-du-env)
4. [Définir une mission](#définir-une-mission)
5. [Lancer une prospection](#lancer-une-prospection)
6. [Reprendre, ré-exporter, suivre](#reprendre-ré-exporter-suivre)
7. [Sources de données](#sources-de-données)
8. [Conformité](#conformité)
9. [Tests](#tests)
10. [Structure du projet](#structure-du-projet)

---

## Prérequis

- **Python 3.11+**
- Une **clé API Anthropic** pour le scoring et la rédaction des messages —
  https://console.anthropic.com/ (sans elle, la collecte/enrichissement/export
  fonctionnent quand même ; seuls le scoring et les messages sont sautés).
- (Optionnel) une clé **Pappers** pour l'enrichissement légal.
- (Optionnel) une clé **Brevo** pour pousser les contacts en CRM.

La source principale (API Recherche d'entreprises du gouvernement) est
**gratuite et sans clé**.

---

## Installation

```bash
cd reflexe
python3 -m venv .venv
source .venv/bin/activate        # Windows : .venv\Scripts\activate
pip install -r requirements.txt
pip install -e .                 # installe la commande `reflexe`
```

---

## Configuration du `.env`

```bash
cp .env.example .env
```

| Variable | Obligatoire | Où l'obtenir |
|---|---|---|
| `ANTHROPIC_API_KEY` | Pour scoring + messages | console.anthropic.com → API Keys |
| `PAPPERS_API_KEY` | Non (enrichissement) | pappers.fr/api |
| `BREVO_API_KEY` | Non (push CRM) | app.brevo.com → SMTP & API → API Keys |
| `BREVO_LIST_IDS` | Non | ID(s) de liste Brevo, séparés par des virgules |
| `REFLEXE_DELAI_DOMAINE` | Non | Délai poli entre requêtes d'un même domaine (s) |
| `REFLEXE_CONCURRENCE_MAX` | Non | Requêtes HTTP concurrentes max |

⚠️ Le `.env` n'est **jamais** committé (voir `.gitignore`). Aucun secret n'est loggé.

> Pour stocker l'entreprise, le score et le message dans Brevo, créez au
> préalable les attributs de contact `ENTREPRISE`, `SCORE_ICP`,
> `MESSAGE_REFLEXE` dans votre compte Brevo (sinon ces champs sont ignorés).

---

## Définir une mission

Copiez le modèle commenté et personnalisez-le :

```bash
cp missions/exemple_mission.yaml missions/ma_mission.yaml
```

Renseignez les codes **NAF/APE** ciblés, les **zones** (départements ou codes
postaux), les bornes d'**effectif**, la **description de votre client idéal**
(utilisée par Claude pour scorer), le **seuil de score**, les **instructions de
rédaction** du message, et la **liste d'exclusion** (opt-out / RGPD).

---

## Lancer une prospection

```bash
reflexe init                                  # prépare data/, logs/, vérifie le .env
reflexe run --mission missions/ma_mission.yaml --dry-run --limit 10
```

- `--dry-run` : simule le push Brevo (n'envoie rien) — idéal pour un premier essai.
- `--limit N` : plafonne le nombre de prospects (utile pour tester sans coût).

Sans `--dry-run` et avec `BREVO_API_KEY`, les prospects au-dessus du seuil de
score (et non exclus) sont créés/mis à jour dans Brevo.

### Tester de bout en bout (3 commandes)

```bash
reflexe init
cp missions/exemple_mission.yaml missions/ma_mission.yaml   # puis éditez les filtres
reflexe run --mission missions/ma_mission.yaml --dry-run --limit 10
```

Les résultats sont exportés dans `data/exports/<job_id>.csv` et `.json`.

---

## Reprendre, ré-exporter, suivre

```bash
reflexe status                                # état des derniers jobs
reflexe resume --job <job_id> --dry-run       # reprend un job interrompu (checkpoints)
reflexe export --job <job_id> --format csv,json
```

La reprise se fait depuis le dernier **checkpoint** : chaque prospect porte son
statut (`collecté → nettoyé → enrichi → scoré → personnalisé → prêt_envoi →
poussé_brevo`), stocké en base SQLite (`data/reflexe.db`).

---

## Sources de données

| Source | Rôle | Clé requise |
|---|---|---|
| **API Recherche d'entreprises** (gouv.fr) | Liste cible (NAF, zone, effectif) | Non |
| **Site web public** | Emails pro, téléphone, liens réseaux (sur le site) | Non |
| **Pappers** | Dirigeants, site web déclaré, infos légales | Oui (optionnel) |
| **Vérification email** | Syntaxe + enregistrement MX du domaine | Non |

Les sources sont des **connecteurs interchangeables** (`reflexe/sources/`,
interface `BaseSource`) : en ajouter une = créer un fichier, sans toucher au reste.

---

## Conformité

- **Priorité aux API officielles.** L'API gouvernementale gratuite est la source primaire.
- **Sources publiques uniquement.** Aucune collecte derrière authentification, aucun contournement de protection.
- **PAS de scraping LinkedIn / réseaux sociaux fermés.** Les liens réseaux ne sont relevés que s'ils figurent sur le site public de l'entreprise ; REFLEXE n'accède jamais à LinkedIn. Pour des données LinkedIn, utilisez les outils officiels (export Sales Navigator, API partenaires).
- **Respect du `robots.txt`** et délai poli par domaine ; jamais de requêtes en rafale.
- **RGPD.** Uniquement des données professionnelles publiques. Chaque champ conserve sa **source** et un **score de confiance**. Liste noire (`exclusions`) d'emails et de domaines (opt-out).
- **Traçabilité.** Tout est journalisé (sources, lignes trouvées, erreurs, refus, champs manquants) dans `logs/` et en base. Aucun secret n'est loggé.

---

## Tests

```bash
pip install -e ".[dev]"
pytest
```

Les tests couvrent la normalisation (`test_clean`), la déduplication
(`test_dedupe`), les modèles (`test_models`) et la source primaire avec HTTP
simulé (`test_sources`) — aucun appel réseau réel, aucune clé requise.

---

## Structure du projet

```
reflexe/
├── reflexe/
│   ├── config.py / models.py / db.py / ratelimit.py / llm.py / orchestrator.py / cli.py
│   ├── sources/   (base, recherche_entreprises, pappers, website)
│   ├── pipeline/  (clean, dedupe, enrich, score, personalize)
│   └── outputs/   (export, brevo)
├── missions/      (exemple_mission.yaml)
├── tests/
├── requirements.txt / pyproject.toml / .env.example / README.md
```
