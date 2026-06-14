---
name: redesign-chirurgien
description: "Refactorisation visuelle CSS-ONLY sans toucher au HTML ni au JS : protocole chirurgical (aucune classe CSS supprimée, aucun script modifié, aucune feature cassée, sauvegarde immuable + rapport de validation), adapté aux CRM, dashboards et fichiers de production avec APIs live (Supabase, Leaflet, Chart.js, etc.) comme PlayAzur. Utiliser pour : relooker un dashboard sans risquer les fonctionnalités, appliquer la charte ARTCOL sur du HTML existant, corriger le CSS d'une page complexe sans regression, séparer la couche style de la couche logique, livrer un CSS override propre. Mots-clés : refactorisation, CSS only, override, chirurgical, sans régression, dashboard, CRM, PlayAzur, production, Supabase, Leaflet, refactor, reskin, thème, couche style, cascade, spécificité, backup, validation."
---

# Redesign Chirurgien — CSS-only, zéro régression

Pour revoir l'apparence d'un fichier **sans jamais toucher au HTML ni au JS**. Règle d'or : **le comportement ne change pas, seul le visuel change.**

## Quand l'activer
Relooker un CRM/dashboard de production (PlayAzur, Supabase…), appliquer la charte ARTCOL sur du code existant, corriger du CSS sans risquer les APIs / Leaflet / scripts tiers.

---

## Protocole en 5 étapes

### 1. Audit avant intervention

Avant d'écrire une ligne, cartographier :
```
- Quels frameworks CSS sont actifs ? (Bootstrap, Tailwind, custom…)
- Quelles dépendances JS utilisent des classes CSS ? (Leaflet → .leaflet-*, Chart.js → .chartjs-*)
- Quelles classes sont générées dynamiquement (state classes) ?
- Y a-t-il des styles inline (`style=""`) sur les éléments cibles ?
```
Lister les **zones intouchables** : tout ce qui est généré par une lib (Leaflet, Flatpickr, Select2…).

### 2. Sauvegarde immuable

```bash
# Avant toute modification
cp fichier.html fichier.BACKUP.html
# ou créer un fichier CSS séparé (méthode préférée)
touch redesign-override.css
```
La méthode **fichier CSS séparé** est la plus sûre : `<link rel="stylesheet" href="redesign-override.css">` en **dernier** dans le `<head>` → cascade maximale sans toucher au fichier source.

### 3. Périmètre d'intervention

**CSS autorisé** :
- Variables CSS (`--token: value`) pour centraliser les overrides
- Sélecteurs de classes existantes (`.card`, `.btn`, `.nav-item`)
- Pseudo-classes (`:hover`, `:focus`, `:not()`)
- Media queries responsive
- Pseudo-éléments (`::before`, `::after`) pour décoration
- `@font-face` ou Google Fonts import

**CSS interdit** :
- `!important` en masse (signe de désordre — utiliser la spécificité)
- Renommer ou supprimer des classes existantes
- Surcharger `.leaflet-*` / `.chartjs-*` / toute classe de lib tierce
- Changer la structure grid/flex si elle conditionne le JS (ex. tableaux Supabase)

### 4. Pattern d'override ARTCOL

```css
/* redesign-override.css */
/* ===== TOKENS ARTCOL ===== */
:root {
  --bg-base:       #080b10;
  --bg-surface:    #0f1319;
  --bg-elevated:   #16202e;
  --accent-lime:   #c8f53a;
  --accent-violet: #7b61ff;
  --accent-cyan:   #5fd4f5;
  --text-primary:  #f0f4f8;
  --text-secondary:#8a9ab5;
  --border-subtle: rgba(255,255,255,0.06);
  --border-active: rgba(200,245,58,0.35);
  --radius-md:     12px;
  --font-display:  'Space Grotesk', sans-serif;
  --font-text:     'Inter', sans-serif;
  --font-code:     'JetBrains Mono', monospace;
}

/* ===== RESET FOND ===== */
body, .app-wrapper, .main-content {
  background-color: var(--bg-base) !important; /* !important légitime ici : override bootstrap/app */
  color: var(--text-primary);
  font-family: var(--font-text);
}

/* ===== CARTES / PANNEAUX ===== */
.card, .panel, .widget, [class*="card-"] {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
}

/* ===== NAVIGATION ===== */
.sidebar, .nav, .navbar {
  background: var(--bg-surface);
  border-right: 1px solid var(--border-subtle);
}
.nav-item.active, .nav-link.active {
  color: var(--accent-lime);
  background: rgba(200,245,58,0.08);
}

/* ===== BOUTONS ===== */
.btn-primary, button[type="submit"] {
  background: var(--accent-lime);
  color: var(--bg-base);
  font-weight: 600;
  border: none;
  border-radius: 6px;
}
.btn-secondary {
  background: transparent;
  border: 1px solid var(--border-active);
  color: var(--accent-lime);
}

/* ===== TABLEAUX ===== */
table thead { background: var(--bg-elevated); color: var(--text-secondary); font-size: 0.75rem; text-transform: uppercase; }
table tbody tr:hover { background: rgba(255,255,255,0.03); }
table tbody td { border-bottom: 1px solid var(--border-subtle); color: var(--text-primary); }

/* ===== INPUTS ===== */
input, select, textarea {
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
  border-radius: 6px;
}
input:focus, select:focus {
  border-color: var(--accent-lime);
  outline: none;
  box-shadow: 0 0 0 3px rgba(200,245,58,0.15);
}

/* ===== DONNÉES / KPI (Mono) ===== */
.kpi-value, .metric, .stat-number, [class*="count"] {
  font-family: var(--font-code);
  color: var(--accent-lime);
}
```

### 5. Rapport de validation

Après chaque session de redesign, produire :

```
## Rapport de redesign — [fichier] — [date]

### Périmètre modifié
- Fichier(s) CSS créés/modifiés : [liste]
- Classes HTML touchées : [liste]
- Classes HTML préservées intactes : [confirmation]

### Fonctionnalités testées
- [ ] Navigation / routing : OK
- [ ] APIs / fetch : OK
- [ ] Carte Leaflet : OK (si présente)
- [ ] Charts : OK (si présents)
- [ ] Formulaires / soumission : OK
- [ ] Auth / sessions : OK

### Anomalies détectées
[liste ou "aucune"]

### Backup disponible
fichier.BACKUP.html — [chemin]
```

---

## Anti-patterns à éviter absolument

| Ne jamais faire | Pourquoi |
|-----------------|---------|
| Modifier les classes Leaflet/Chart.js | Casse la lib (le JS cherche ces classes) |
| Supprimer des classes HTML pour "nettoyer" | Supprime les hooks JS |
| `display: none` sur des éléments fonctionnels | Peut casser des event listeners |
| Changer des `z-index` de Leaflet (`z-index > 400`) | Désaligne les couches de carte |
| Modifier les `<script>` "juste un peu" | Hors périmètre — créer une PR séparée |

---

## Cas PlayAzur (CRM Supabase + Leaflet)

Zones sensibles : `.leaflet-container`, `.leaflet-popup`, `.leaflet-control`, classes générées par Supabase Auth UI. Override autorisé : fonds, typographie, sidebar, cartes de données, tableaux. Tester systématiquement : rendu de la carte, popups, authentification, filtres de données.

> Skills sœurs : `artcol-design-system` (tokens à appliquer), `css-master` (techniques CSS avancées), `visual-qa` (validation après redesign).
