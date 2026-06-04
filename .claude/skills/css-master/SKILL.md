---
name: css-master
description: "Expert CSS pur et Tailwind : 3 modes (créer from scratch / refactoriser du CSS existant / déboguer un problème visuel), maîtrise Flexbox et Grid, responsive mobile-first, variables CSS custom properties, conversion bidirectionnelle CSS natif ↔ Tailwind, debug visuel (overflow, z-index, stacking context, reflow, spécificité). Utiliser pour : construire une mise en page complexe, convertir du CSS en classes Tailwind ou inversement, corriger un bug de layout (alignement cassé, overflow, chevauchement), optimiser la spécificité CSS, créer un système de grille, déboguer des problèmes de z-index ou de stacking context. Mots-clés : CSS, Tailwind, Flexbox, Grid, responsive, mobile-first, variables CSS, custom properties, spécificité, cascade, z-index, stacking context, overflow, layout, media query, breakpoint, conversion, refactor, debug, alignement, gap, columns, container queries."
---

# CSS Master

Trois modes d'intervention : **créer**, **refactoriser**, **déboguer**. Déclaration du mode en tête de réponse.

## Quand l'activer
Construire une mise en page, convertir CSS ↔ Tailwind, corriger un bug visuel, optimiser la spécificité.

---

## Mode 1 — Créer from scratch

### Flexbox vs Grid : choisir en 10 secondes

| Besoin | Outil |
|--------|-------|
| 1 axe (row OU column) | **Flexbox** |
| 2 axes simultanés | **Grid** |
| Distribuer espace entre items | Flexbox (`justify-content`, `gap`) |
| Aligner en grille rigoureuse | Grid (`grid-template-columns`) |
| Composant (bouton, nav, card) | Flexbox |
| Layout de page (header/sidebar/main) | Grid |
| Items de tailles inégales bien alignés | Grid |

### Flexbox patterns essentiels

```css
/* Centre parfait */
.center { display: flex; align-items: center; justify-content: center; }

/* Espacer avec gap (pas margin) */
.row { display: flex; gap: 16px; flex-wrap: wrap; }

/* Sidebar fixe + main fluid */
.layout { display: flex; }
.sidebar { width: 260px; flex-shrink: 0; }
.main { flex: 1; min-width: 0; } /* min-width:0 = évite overflow sur flex children */

/* Push dernier élément à droite */
.toolbar { display: flex; align-items: center; }
.toolbar .spacer { flex: 1; }
```

### Grid patterns essentiels

```css
/* Grille responsive sans media query */
.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

/* Layout page classic */
.page {
  display: grid;
  grid-template-columns: 260px 1fr;
  grid-template-rows: 60px 1fr;
  min-height: 100vh;
}
.header { grid-column: 1/-1; }

/* Superposer des éléments (même cellule) */
.hero > * { grid-area: 1/1; }
```

### Responsive mobile-first

```css
/* Toujours partir du mobile */
.container { padding: 16px; }
.grid { grid-template-columns: 1fr; }

@media (min-width: 768px) {
  .container { padding: 32px; }
  .grid { grid-template-columns: 1fr 1fr; }
}
@media (min-width: 1200px) {
  .container { max-width: 1200px; margin: auto; padding: 48px; }
  .grid { grid-template-columns: repeat(3, 1fr); }
}
```

Container Queries (moderne) :
```css
.card-container { container-type: inline-size; }
@container (min-width: 400px) {
  .card { flex-direction: row; }
}
```

---

## Mode 2 — Convertir CSS ↔ Tailwind

### CSS natif → Tailwind

| CSS | Tailwind |
|-----|----------|
| `display: flex; align-items: center; gap: 8px` | `flex items-center gap-2` |
| `grid-template-columns: repeat(3, 1fr); gap: 24px` | `grid grid-cols-3 gap-6` |
| `background: #080b10` | `bg-[#080b10]` (arbitraire) ou token personnalisé |
| `border-radius: 12px` | `rounded-xl` |
| `padding: 16px 24px` | `py-4 px-6` |
| `font-weight: 600; font-size: 0.875rem` | `font-semibold text-sm` |
| `transition: all 0.2s ease` | `transition-all duration-200 ease-in-out` |
| `opacity: 0; pointer-events: none` | `opacity-0 pointer-events-none` |
| `:hover { background: X }` | `hover:bg-[X]` |
| `@media (min-width: 768px)` | `md:` préfixe |

### Tailwind → CSS natif (pour les overrides)

Utiliser `@apply` dans un fichier CSS :
```css
.btn-primary {
  @apply flex items-center gap-2 px-6 py-3 bg-[#c8f53a] text-[#080b10] font-semibold rounded-md transition-all duration-200 hover:brightness-110;
}
```

### Tokens ARTCOL dans Tailwind (tailwind.config.js)

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        'bg-base':    '#080b10',
        'bg-surface': '#0f1319',
        'lime':       '#c8f53a',
        'violet':     '#7b61ff',
        'cyan-art':   '#5fd4f5',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      }
    }
  }
}
```

---

## Mode 3 — Déboguer un problème visuel

### Overflow / scroll horizontal inattendu

```css
/* Diagnostic rapide : outline tout */
* { outline: 1px solid red !important; }

/* Trouver l'élément fautif */
* { max-width: 100%; } /* temporaire pour voir si ça disparaît */
```
Causes fréquentes : image sans `max-width: 100%`, `white-space: nowrap` sur du texte long, `translate()` en dehors du viewport, `width: 100vw` avec scrollbar.

### Z-index / chevauchement

Un z-index ne fonctionne que sur un élément **positionné** (`position: relative/absolute/fixed/sticky`).

**Stacking context** : créé par `transform`, `opacity < 1`, `filter`, `will-change`, `isolation: isolate`. Un z-index **à l'intérieur** d'un stacking context ne peut jamais dépasser son parent.

```css
/* Solution propre : créer un contexte isolé */
.modal-wrapper { isolation: isolate; z-index: 50; position: fixed; }
```

Échelle recommandée :
```css
:root {
  --z-base:    1;
  --z-dropdown: 10;
  --z-sticky:   20;
  --z-overlay:  40;
  --z-modal:    50;
  --z-toast:    60;
}
```

### Spécificité trop haute (impossible à surcharger)

```
Ordre de spécificité : inline style > ID > class/attr > element
Calculateur : (0, 0, 0) → (1, 0, 0) = ID gagne toujours
```

Solutions sans `!important` :
```css
/* Augmenter la spécificité proprement */
.parent .child.active { }          /* ajouter un parent */
.component:where(.variant) { }    /* :where() = spécificité 0 → facile à surcharger */
@layer utilities { .override { } } /* couches CSS : utilities > base */
```

### Flexbox items qui ne s'alignent pas

```css
/* Items de hauteurs différentes qui ne remplissent pas */
.flex-container { align-items: stretch; } /* défaut mais vérifier */

/* Flex item qui dépasse son conteneur */
.flex-item { min-width: 0; min-height: 0; } /* TOUJOURS ajouter sur les flex children problématiques */

/* Flex item qui ne rétrécit pas */
.flex-item { flex-shrink: 1; overflow: hidden; }
```

---

## Patterns avancés

**Aspect ratio** :
```css
.thumbnail { aspect-ratio: 16/9; object-fit: cover; width: 100%; }
```

**Clamp responsive (fluid typography)** :
```css
h1 { font-size: clamp(1.5rem, 4vw, 3.5rem); }
.container { padding: clamp(16px, 4vw, 64px); }
```

**CSS Grid areas nommées** :
```css
.layout {
  display: grid;
  grid-template-areas: "header header" "sidebar main" "footer footer";
  grid-template-columns: 260px 1fr;
}
.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
```

**Custom scrollbar (ARTCOL)** :
```css
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg-base); }
::-webkit-scrollbar-thumb { background: var(--border-active); border-radius: 3px; }
```

> Skills sœurs : `artcol-design-system` (tokens à utiliser), `redesign-chirurgien` (contexte d'application CSS-only), `visual-qa` (valider le résultat), `motion-design` (transitions et animations CSS).
