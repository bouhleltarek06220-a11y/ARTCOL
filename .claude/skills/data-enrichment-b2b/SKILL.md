---
name: data-enrichment-b2b
description: "Enrichissement et hygiène de données B2B pour la prospection : construction de listes ICP précises, enrichissement multi-sources (Apollo, Clay, Pappers : SIREN, emails professionnels vérifiés, signaux d'intention), normalisation et conversion de fichiers hétérogènes (CSV bruts, exports Excel, listes LinkedIn, exports Apollo collés) vers un schéma propre et exploitable, déduplication rigoureuse, scoring de leads, push vers CRM ou outil d'outreach. Utiliser pour : transformer une liste brute en base de prospection prête à l'envoi, enrichir des contacts sans email, scorer et prioriser un pipeline, nettoyer et normaliser un import CSV/Excel chaotique, construire un ICP depuis des critères métier. Mots-clés : enrichissement, data enrichment, ICP, Apollo, Clay, Pappers, Societe.com, SIREN, email vérifié, normalisation, déduplication, scoring, lead scoring, CSV, Excel, LinkedIn, CRM, pipeline, hygiène données, prospection B2B, PlayAzur, créateurs, venues, sponsors."
---

# Data Enrichment B2B — de la liste brute au pipeline propre

**Objectif** : transformer n'importe quelle liste (copiée-collée, scrapée, achetée, exportée LinkedIn) en une base de prospects propre, enrichie, scorée et directement utilisable dans lemlist, Brevo ou le CRM. La qualité des données est le premier facteur de conversion en prospection.

## Quand l'activer
Construire une liste ICP depuis zéro, enrichir des contacts sans email, nettoyer un import CSV chaotique, scorer et prioriser un pipeline, préparer une liste avant envoi de campagne.

---

## Étape 1 — Définir le schéma cible (avant tout traitement)

Fixer le schéma de sortie **avant** de commencer. Colonnes minimales :

| Colonne | Type | Obligatoire | Exemple |
|---------|------|-------------|---------|
| `first_name` | string | oui | Julien |
| `last_name` | string | oui | Martin |
| `email` | string | oui | julien@agence.fr |
| `email_status` | enum | oui | valid / risky / invalid |
| `company` | string | oui | Agence Studio Z |
| `siren` | string | si dispo | 123456789 |
| `job_title` | string | conseillé | Directeur Marketing |
| `linkedin_url` | string | conseillé | linkedin.com/in/... |
| `segment` | string | oui | créateur / venue / sponsor |
| `source` | string | oui | apollo_export_2024-06 |
| `score` | int | oui | 0–100 |
| `enriched_date` | date | oui | 2024-06-04 |

---

## Étape 2 — Sources d'enrichissement par cas d'usage

### Cas 1 : j'ai un nom + entreprise, je cherche l'email
- **Apollo.io** : "People search" → filtrer par nom + société → export email vérifié.
- **Clay** : waterfall enrichment (Apollo → Hunter → Clearbit en cascade, prend le premier résultat valide).
- **Hunter.io** : domain search pour récupérer le pattern email de l'entreprise.

### Cas 2 : j'ai un SIREN, je veux les infos légales + dirigeants
- **Pappers API** : `/v2/entreprise?siren=XXX` → raison sociale, NAF, CA, effectifs, dirigeants.
- **Societe.com** : complément pour avis clients, actualités judiciaires.
```python
import requests
r = requests.get(
    "https://api.pappers.fr/v2/entreprise",
    params={"siren": "123456789", "api_token": "TOKEN"}
)
dirigeants = r.json().get("dirigeants", [])
```

### Cas 3 : j'ai une URL LinkedIn, je cherche l'email pro
- Apollo **Chrome Extension** sur le profil → export direct.
- **Clay + Apollo connector** : en bulk depuis une colonne `linkedin_url`.
- PhantomBuster "LinkedIn Profile Scraper" (dans les limites des ToS).

### Cas 4 : créateurs YouTube / Twitch (contexte PlayAzur)
- **YouTube Data API v3** : `channels?forUsername=XXX` → email dans `about` si public.
- **Social Blade** : données publiques subs/views pour qualifier la taille.
- **BrightData** : datasets YouTube/Twitch pré-enrichis (légal, données publiques).

---

## Étape 3 — Normalisation d'un fichier hétérogène

Script de normalisation Python pour un CSV "sale" :

```python
import pandas as pd
import re

df = pd.read_csv("raw_list.csv", encoding="utf-8-sig")

# Nommer les colonnes proprement
df.columns = (df.columns
    .str.strip()
    .str.lower()
    .str.replace(r"[\s\-/]+", "_", regex=True)
    .str.replace(r"[^\w]", "", regex=True))

# Normaliser les champs texte
for col in ["first_name", "last_name", "company"]:
    if col in df.columns:
        df[col] = df[col].str.strip().str.title()

# Email : lowercase + strip
if "email" in df.columns:
    df["email"] = df["email"].str.lower().str.strip()
    # Valider le format basique
    pattern = r"^[\w\.\+\-]+@[\w\-]+\.[a-z]{2,}$"
    df["email_valid_format"] = df["email"].str.match(pattern, na=False)

# Téléphone : retirer les espaces et formater
if "phone" in df.columns:
    df["phone"] = df["phone"].str.replace(r"[\s\.\-]", "", regex=True)

# Supprimer les lignes sans email ni nom
df = df.dropna(subset=["email"])
df = df[df["email"] != ""]

df.to_csv("normalized_list.csv", index=False, encoding="utf-8-sig")
print(f"{len(df)} enregistrements après normalisation")
```

---

## Étape 4 — Vérification des emails

Ne jamais envoyer sans vérification : chaque bounce abîme la réputation du domaine.

| Outil | Gratuit | Volume | Recommandé pour |
|-------|---------|--------|----------------|
| Apollo built-in | oui (limité) | < 500/j | listes Apollo |
| ZeroBounce | non | illimité | grandes listes |
| NeverBounce | non | illimité | grandes listes |
| Hunter verify | oui (25/j) | limité | tests ponctuels |

Statuts à connaître :
- `valid` → envoyer.
- `risky` / `catch-all` → envoyer prudemment (volume réduit).
- `invalid` / `unknown` → supprimer avant envoi.

---

## Étape 5 — Déduplication

```python
# Dédup sur email (le plus fiable)
before = len(df)
df = df.sort_values("enriched_date", ascending=False)  # garder le plus récent
df = df.drop_duplicates(subset=["email"], keep="first")

# Dédup sur (prénom + nom + entreprise) pour les lignes sans email
df_no_email = df[df["email"].isna()]
df_no_email = df_no_email.drop_duplicates(
    subset=["first_name", "last_name", "company"], keep="first"
)

after = len(df)
print(f"Dédup : {before - after} doublons supprimés")
```

Dans **Clay** : utiliser la fonction "Deduplicate" sur le champ `email` ou `linkedin_url`.
Dans **Apollo** : la dédup est automatique par domaine + nom.

---

## Étape 6 — Scoring de leads

### Modèle simple (0–100 pts) adapté PlayAzur

```
+20 pts  email vérifié (status = valid)
+15 pts  rôle décideur (Directeur, CEO, Fondateur, Manager)
+15 pts  segment cœur (créateur gaming FR OU venue esport)
+10 pts  taille audience / CA dans la cible
+10 pts  signal récent (post < 30j, recrutement, levée de fonds)
+10 pts  LinkedIn URL présente
+10 pts  SIREN renseigné (France uniquement)
+10 pts  numéro de téléphone présent
- 20 pts  email risky ou catch-all
- 30 pts  email invalid
```

Segmenter la liste en sortie :
- **Score ≥ 70** → priorité A (séquence personnalisée, outreach direct)
- **Score 40–69** → priorité B (séquence standard)
- **Score < 40** → nurturing / à ré-enrichir

---

## Étape 7 — Push vers CRM / outil d'outreach

### Vers lemlist
- Import CSV → mapper les colonnes vers les variables de personnalisation.
- Vérifier que `email` et `firstName` sont présents.
- Ajouter tag `source` + `score_bucket` (A/B/C).

### Vers CRM custom / Brevo
- API REST ou import CSV natif.
- Toujours vérifier l'absence de doublons côté CRM avant import (chercher par email).
- Logger l'import : date, nombre de lignes, source.

### Vers Apollo (enrichissement depuis CRM)
- "Import contacts" → Apollo enrichit automatiquement les champs manquants.
- Utiliser les séquences Apollo pour les priorités B/C.

---

## Anti-patterns à éviter

- ❌ Envoyer sans vérification email préalable.
- ❌ Enrichir 10 000 contacts en une fois sans tester sur 100 d'abord.
- ❌ Ignorer le champ `source` — impossible de savoir d'où viennent les leads 6 mois après.
- ❌ Merger des listes sans dédup — des prospects reçoivent 2 fois le même email.
- ❌ Scorer sans mettre à jour le score au fil du temps (les données vieillissent).

---

## Livrables typiques

- Script Python normalisation + dédup + scoring d'un CSV
- Schéma de données B2B standard (CSV template)
- Pipeline Clay complet (waterfall enrichment + scoring)
- Checklist de qualité avant import CRM/lemlist
- Mapping champs export Apollo → schéma CRM

> **Skills sœurs** : `data-scraping-ethique` (étape amont : sourcer les données brutes), `cold-email-outreach` (étape aval : utiliser la liste propre pour prospecter), `abm-meddic` (enrichissement ciblé sur les comptes stratégiques), `vente-4c` (qualifier les leads enrichis en RDV).
