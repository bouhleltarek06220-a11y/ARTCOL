---
name: artcol-design-system
description: "Système de design signature ARTCOL de Tarek : tokens exacts (couleurs, typographie, espacement), dark cyber-pro palette bg #080b10 / neon-lime #c8f53a / violet #7b61ff / cyan #5fd4f5, fontes Space Grotesk + Inter + JetBrains Mono, format single-file HTML préféré, conventions composants, naming, hiérarchie visuelle, variantes PlayAzur (CRM) et Lost Chapter (3D immersif). Utiliser pour : créer ou étendre un composant ARTCOL, vérifier la conformité d'un écran au design system, démarrer un nouveau fichier HTML dans la charte, appliquer les bons tokens couleur/typo/spacing. Mots-clés : ARTCOL, design system, tokens, couleurs, palette, dark mode, cyber, neon, lime, violet, cyan, Space Grotesk, Inter, JetBrains Mono, single-file, PlayAzur, Lost Chapter, charte graphique, composants, variables CSS."
---

# ARTCOL Design System

Référentiel **unique et autoritaire** des tokens visuels de Tarek. Toujours appliquer ces valeurs — jamais approximer, jamais substituer sans raison.

## Quand l'activer
Créer un fichier HTML/CSS, un composant UI, une page PlayAzur ou Lost Chapter ; vérifier la conformité d'un écran ; générer du CSS variables pour un nouveau projet.

---

## Tokens couleur (immuables)

```css
:root {
  /* Fonds */
  --bg-base:    #080b10;   /* fond principal, profond */
  --bg-surface: #0f1319;   /* cartes, panneaux */
  --bg-elevated:#16202e;   /* modales, dropdowns */

  /* Accents signature */
  --accent-lime:   #c8f53a; /* CTA principal, focus neon, tags actifs */
  --accent-violet: #7b61ff; /* état hover premium, badges, liens */
  --accent-cyan:   #5fd4f5; /* données live, sparklines, icônes info */

  /* Texte */
  --text-primary:  #f0f4f8; /* titres, labels */
  --text-secondary:#8a9ab5; /* sous-titres, métadonnées */
  --text-muted:    #4a5568; /* placeholders, disabled */

  /* Bordures */
  --border-subtle: rgba(255,255,255,0.06);
  --border-active: rgba(200,245,58,0.35); /* lime tamisé */

  /* États */
  --success: #34d399;
  --warning: #fbbf24;
  --danger:  #f87171;
}
```

**Règle hiérarchie** : `--accent-lime` = action / CTA / highlight principal. `--accent-violet` = état secondaire / interaction. `--accent-cyan` = données / info en temps réel.

---

## Tokens typographie

```css
:root {
  --font-display: 'Space Grotesk', sans-serif;  /* titres H1–H3, hero */
  --font-text:    'Inter', sans-serif;           /* corps, labels, nav */
  --font-code:    'JetBrains Mono', monospace;   /* code, données, KPI */
}
```

| Rôle            | Fonte          | Taille / Poids       |
|-----------------|----------------|----------------------|
| Hero H1         | Space Grotesk  | 3–5rem, 700          |
| Section H2      | Space Grotesk  | 1.75–2.25rem, 600    |
| Card title H3   | Space Grotesk  | 1.1–1.3rem, 600      |
| Corps p         | Inter          | 1rem, 400, lh 1.6    |
| Label/nav       | Inter          | 0.875rem, 500        |
| Donnée / KPI    | JetBrains Mono | 1.5–2rem, 700        |
| Code snippet    | JetBrains Mono | 0.875rem, 400        |

**Import Google Fonts** (en tête de chaque fichier) :
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
```

---

## Spacing & shape

```css
:root {
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --space-unit: 8px; /* base × 0.5 / 1 / 1.5 / 2 / 3 / 4 / 6 / 8 */
}
```
Échelle : 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64px.

---

## Format préféré : single-file HTML

Chaque livrable est un **seul fichier `.html`** auto-contenu : `<style>` inline avec les variables CSS, `<script>` inline ou bundle ES module. Avantages : portabilité totale, facile à envoyer/preview, pas de build step pour les démos.

Structure type :
```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ARTCOL — [Nom]</title>
  <!-- Google Fonts -->
  <style>
    /* Variables ARTCOL */
    :root { /* tokens ci-dessus */ }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--bg-base); color: var(--text-primary); font-family: var(--font-text); }
  </style>
</head>
<body>
  <!-- contenu -->
  <script type="module">/* JS ici */</script>
</body>
</html>
```

---

## Composants signature

**Bouton CTA primaire** :
```css
.btn-primary {
  background: var(--accent-lime);
  color: var(--bg-base);
  font-family: var(--font-text);
  font-weight: 600;
  padding: 10px 24px;
  border-radius: var(--radius-sm);
  border: none;
  cursor: pointer;
  transition: filter 0.2s ease;
}
.btn-primary:hover { filter: brightness(1.1); }
```

**Card surface** :
```css
.card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 24px;
  transition: border-color 0.2s;
}
.card:hover { border-color: var(--border-active); }
```

**Tag / Badge** :
```css
.tag { background: rgba(123,97,255,0.15); color: var(--accent-violet);
       padding: 3px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
.tag-lime { background: rgba(200,245,58,0.12); color: var(--accent-lime); }
```

---

## Variantes projet

| Projet       | Accent principal | Accent secondaire | Notes                              |
|--------------|------------------|-------------------|------------------------------------|
| **PlayAzur** | `--accent-lime`  | `--accent-cyan`   | Données KPI en Mono, tableaux dense|
| **Lost Chapter** | `--accent-violet` | `--accent-cyan` | Motion heavy, blend-mode overlay, 3D canvas sous le DOM |
| **Générique ARTCOL** | `--accent-lime` | `--accent-violet` | Défaut |

---

## Do / Don't

| Do | Don't |
|----|-------|
| `var(--accent-lime)` sur le CTA unique par page | Deux CTAs lime concurrents |
| Fond `--bg-base` strict (#080b10) | Fond "presque noir" différent (#111, #0a0a0a) |
| JetBrains Mono pour tous les chiffres/données | Inter pour les KPIs |
| Bordure `--border-subtle` + hover `--border-active` | Box-shadow colorée en permanence |
| Single-file HTML pour les démos | Multi-fichiers sans raison (projet complet = ok) |

> Skills sœurs : `art-direction-brief` (brief avant de coder), `ui-ux-pro-max` (patterns UX), `motion-design` (animations), `visual-qa` (conformité), `css-master` (implémentation).
