---
name: data-scraping-ethique
description: "Scraping intelligent et RESPONSABLE pour la prospection B2B : privilégier systématiquement les API officielles (Apollo, Pappers, Societe.com) sur le scraping brut, ne récupérer que des données publiques légitimes, respecter robots.txt, conditions d'utilisation des plateformes, rate limits et RGPD ; pipeline complet cible → champs nécessaires → sources → extraction → nettoyage → déduplication → enrichissement → export CSV/Sheets/CRM + log de traçabilité ; outillage concret (Apollo, BrightData, Pappers/Societe.com, LinkedIn Sales Navigator) ; stratégies anti-ban raisonnées et légales. Utiliser pour : construire une liste de prospects qualifiés depuis zéro, récupérer des données publiques sur des créateurs/lieux/sponsors, automatiser une veille concurrentielle, alimenter un pipeline sans acheter de bases douteuses. Mots-clés : scraping, web scraping, extraction de données, BrightData, Apollo, Pappers, Societe.com, LinkedIn, robots.txt, RGPD, légal, éthique, rate limit, anti-ban, pipeline données, CSV, prospection, lead generation, données publiques."
---

# Data Scraping Éthique — extraction responsable de données B2B

**Principe fondateur** : scraper = collecter des données que quelqu'un a publiées. Ce n'est pas un blanc-seing. La légalité dépend de la source, de l'usage et du traitement. Cette skill pose le cadre avant d'outiller.

## Quand l'activer
Construire une liste de prospection depuis zéro, récupérer des données publiques sur des créateurs / lieux / sponsors, automatiser une veille, sourcer des leads sans acheter de bases de données opaques.

---

## Règle des priorités — choisir la bonne source

```
1. API officielle        → toujours préférer (Pappers, INSEE, Apollo, YouTube Data API)
2. Export natif          → télécharger ce que la plateforme propose déjà
3. Outil spécialisé B2B  → BrightData, PhantomBuster sur périmètre autorisé
4. Scraping custom       → dernier recours, avec robots.txt + ToS vérifiés
```

Ne jamais aller à l'étape N+1 si l'étape N suffit.

---

## Checklist légale & éthique (avant tout scraping)

- [ ] **robots.txt** vérifié : les chemins visés sont-ils autorisés (`Allow:` ou absence de `Disallow:`) ?
- [ ] **Conditions d'utilisation (ToS)** lues : scraping interdit explicitement ? (ex. LinkedIn ToS = interdit sans autorisation).
- [ ] **Données à caractère personnel** ? → base légale RGPD identifiée (intérêt légitime B2B, consentement...).
- [ ] **Rate limit** défini : max 1 req/s par défaut, adapter selon indications de la plateforme.
- [ ] **Log de collecte** créé : date, source, URL, nombre d'enregistrements — traçabilité RGPD.
- [ ] **Durée de conservation** définie avant de commencer (max 3 ans sans interaction).

---

## Pipeline en 6 étapes

### 1. Définir la cible & les champs
Avant d'extraire quoi que ce soit, lister les champs **strictement nécessaires** (minimisation des données, Art. 5 RGPD) :
```
Cible : créateurs YouTube gaming FR, 50k–500k subs
Champs : chaîne, prénom/nom public, email contact, niche, dernière vidéo, subs_count
Champs à NE PAS collecter : données personnelles hors contexte pro, mineurs
```

### 2. Identifier les sources par ordre de priorité
| Besoin | Source recommandée | Alternative |
|--------|-------------------|-------------|
| SIREN / infos légales entreprise FR | **Pappers.fr API** (gratuit 400 req/j) | Societe.com |
| Emails pro + enrichissement B2B | **Apollo.io** (API ou export) | Hunter.io |
| Données LinkedIn entreprises/personnes | **BrightData** LinkedIn Dataset | PhantomBuster (respect ToS) |
| Créateurs YouTube / Twitch | YouTube Data API v3 (officiel) | Social Blade public data |
| Lieux / venues | Google Places API, Pages Jaunes | Scraping manuel ciblé |

### 3. Extraction

**Via API Pappers (exemple) :**
```python
import requests

url = "https://api.pappers.fr/v2/recherche"
params = {
    "q": "esport",
    "precision": "aproximative",
    "par_page": 50,
    "api_token": "TON_TOKEN"
}
r = requests.get(url, params=params)
data = r.json()["resultats"]
```
Toujours : `time.sleep(0.5)` entre les appels ; logger chaque batch.

**Via BrightData (Scraping Browser) :**
- Utiliser via leur SDK ou proxy rotatif.
- Définir un `user-agent` réaliste, randomiser les délais (1–3s).
- Ne jamais dépasser la fréquence d'un humain normal.

**Via PhantomBuster / Apollo Export :**
- Préférer les exports CSV natifs aux scrapers quand disponibles.
- Apollo : "Export to CSV" depuis les listes filtrées → direct, légal, propre.

### 4. Nettoyage immédiat
```python
import pandas as pd

df = pd.read_csv("raw_leads.csv")
df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")
df["email"] = df["email"].str.lower().str.strip()
df = df.dropna(subset=["email", "company"])          # champs obligatoires
df = df[df["email"].str.contains(r"@.+\..+", na=False)]  # format email basique
df.to_csv("cleaned_leads.csv", index=False)
```

### 5. Déduplication
- Clé de dédup : `email` en priorité, sinon `(prénom + nom + entreprise)`.
- Dans pandas : `df.drop_duplicates(subset=["email"], keep="first")`.
- Dans Clay ou Apollo : la dédup est gérée nativement par SIREN ou domaine.
- Toujours garder un log avant/après avec comptage.

### 6. Export & intégration CRM
- Format de sortie standard : CSV UTF-8, headers en snake_case.
- Colonnes minimales : `first_name`, `last_name`, `email`, `company`, `source`, `collected_date`.
- Push vers CRM : via API (lemlist, HubSpot, CRM custom) ou import CSV manuel.
- Ajouter un **tag source** (`scraping_pappers_2024-01`) pour traçabilité.

---

## Stratégies anti-ban raisonnées (légales)

- **Rotation de user-agent** : bibliothèque `fake-useragent`.
- **Délais aléatoires** : `time.sleep(random.uniform(1, 3))` — simuler un humain.
- **Sessions** : utiliser des sessions requests avec cookies si nécessaire.
- **Proxy rotatif** (BrightData, Oxylabs) : uniquement si la plateforme ne l'interdit pas.
- ❌ **Ne jamais** contourner un CAPTCHA ou un mécanisme de protection explicite — c'est illégal (CFAA/CJUE).

---

## Ce qu'il ne faut PAS faire

- ❌ Scraper LinkedIn sans BrightData ou outil autorisé (arrêt LinkedIn vs. hiQ Labs, 2022).
- ❌ Collecter des données de personnes physiques sans base légale RGPD.
- ❌ Ignorer un `Disallow: /` dans robots.txt.
- ❌ Revendre ou partager des données scrapées sans vérifier les droits.
- ❌ Créer de faux comptes pour accéder à du contenu réservé.

---

## Livrables typiques

- Script Python d'extraction API (Pappers, YouTube, Apollo)
- Pipeline nettoyage + dédup CSV
- Checklist légale complète avant démarrage
- Log de collecte conforme RGPD
- Mapping champs source → schéma CRM cible

> **Skills sœurs** : `data-enrichment-b2b` (étape suivante : enrichir et scorer les données récupérées), `cold-email-outreach` (utiliser la liste pour prospecter), `abm-meddic` (ciblage des comptes stratégiques).
