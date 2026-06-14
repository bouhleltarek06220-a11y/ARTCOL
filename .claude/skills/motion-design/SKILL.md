---
name: motion-design
description: "Animations web performantes et accessibles : micro-interactions (boutons, toggles, feedbacks), révélations au scroll (stagger, fade-in, slide), états de chargement (squelettes, spinners, shimmer), transitions de page et de modal, motion narratif/signature ; stack CSS transitions / Web Animations API / GSAP / Framer Motion / Lottie ; respect obligatoire de prefers-reduced-motion. Utiliser pour : animer un composant UI, créer des transitions fluides, concevoir un skeleton loader, orchestrer un stagger de liste, ajouter du motion narratif à une landing, déboguer une animation saccadée ou qui bloque le fil principal. Mots-clés : animation, micro-interaction, transition, stagger, fade, slide, skeleton, loader, spinner, shimmer, Framer Motion, GSAP, Web Animations API, CSS animation, keyframes, easing, spring, reduced-motion, accessibilité, performance, jank, will-change."
---

# Motion Design Web

Les animations ne sont pas décoratives : elles **guident l'attention, confirment les actions et créent la sensation de qualité**. Elles doivent rester à 60 fps et ne jamais gêner.

## Quand l'activer
Ajouter/déboguer une animation, un loader, une transition, un stagger, du motion narratif sur un hero ou une landing.

---

## Règle fondamentale : prefers-reduced-motion (non négociable)

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
En JS (Framer Motion) :
```js
const { prefersReducedMotion } = useReducedMotion()
const variants = prefersReducedMotion ? {} : myVariants
```

---

## Stack & quand choisir

| Outil | Quand | Coût bundle |
|-------|-------|-------------|
| **CSS transitions/keyframes** | Micro-interactions simples, hovers | 0 |
| **Web Animations API** | Animations JS légères, contrôle programmatique | 0 |
| **Framer Motion** | React, orchestration, spring, layout, page transitions | ~35 ko |
| **GSAP** | Séquences complexes, ScrollTrigger, timeline (non-React) | ~25 ko core |
| **Lottie** | Illustrations animées (JSON After Effects) | ~60 ko |

→ **Ne pas mélanger GSAP et Framer Motion** sur le même composant.

---

## Micro-interactions (CSS)

```css
/* Hover bouton — transform seul, jamais width/height */
.btn {
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.2s ease;
}
.btn:hover  { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(200,245,58,0.25); }
.btn:active { transform: translateY(0) scale(0.97); }

/* Toggle fluide */
.toggle { transition: background 0.2s ease; }
.toggle-thumb { transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1); } /* spring */
```

**Durées de référence** :
- Hover / focus : 120–180 ms
- Feedback (click, toggle) : 150–250 ms
- Ouverture modal / drawer : 250–350 ms
- Transition de page : 350–500 ms

---

## Stagger de liste (Framer Motion)

```jsx
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } }
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22,1,0.36,1] } }
}

<motion.ul variants={container} initial="hidden" animate="show">
  {items.map(i => <motion.li key={i.id} variants={item}>{i.label}</motion.li>)}
</motion.ul>
```

**Scroll-triggered reveal** (Framer Motion) :
```jsx
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-80px" }}
  transition={{ duration: 0.5, ease: [0.22,1,0.36,1] }}
/>
```

---

## Skeleton loaders (shimmer)

```css
.skeleton {
  background: linear-gradient(90deg,
    var(--bg-surface) 25%,
    var(--bg-elevated) 50%,
    var(--bg-surface) 75%
  );
  background-size: 200% 100%;
  border-radius: var(--radius-sm);
  animation: shimmer 1.4s infinite ease-in-out;
}
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```
Règle : **montrer le skeleton dès >100 ms d'attente** ; le supprimer avec un fondu (opacity 1→0, 150 ms) quand les données arrivent.

---

## Transitions de page / modal

**Modal (Framer Motion)** :
```jsx
// Overlay
<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.2}} />
// Panel
<motion.div
  initial={{ opacity:0, scale:0.97, y:8 }}
  animate={{ opacity:1, scale:1,    y:0 }}
  exit={{    opacity:0, scale:0.97, y:8 }}
  transition={{ duration:0.25, ease:[0.22,1,0.36,1] }}
/>
```
Toujours utiliser `<AnimatePresence mode="wait">` pour les montages/démontages.

**Transition de page Next.js** :
```jsx
// layout.tsx
<AnimatePresence mode="wait">
  <motion.main key={pathname}
    initial={{ opacity:0, y:12 }}
    animate={{ opacity:1, y:0 }}
    exit={{    opacity:0, y:-8 }}
    transition={{ duration:0.3 }}
  />
</AnimatePresence>
```

---

## Motion narratif / signature ARTCOL

- **Easing signature** : `cubic-bezier(0.22, 1, 0.36, 1)` — décélération express → landing douce.
- **Spring** : `type:"spring", stiffness:260, damping:20` — pour les interactions manuelles (drag, toggle).
- **Reveal héro** : texte en stagger (mots ou lignes), délai 0.05–0.08s/élément, `y: 30→0 + opacity`.
- **Entrée de section** : `whileInView` + `once: true` + margin négative (éviter trigger trop tôt).
- **Couleur** : animer `color` ou `background-color` via CSS, pas JS (cheaper). Exception : GSAP `to({color})`.

---

## Performance (ne jamais bloquer le fil principal)

- Animer **uniquement** `transform` et `opacity` → composite layer, zéro reflow.
- `will-change: transform` sur les éléments animés en continu **uniquement** (pas en masse).
- Éviter `box-shadow` animée sur mobile → remplacer par `pseudo-element` opacity.
- GSAP : `force3D: true` sur les tweens de translation longue durée.
- Mesurer avec DevTools > Performance > frame drops (cible : 0 frame > 16 ms sur desktop).

---

## Debug animation saccadée

1. Paint flashing actif → identifier les éléments qui re-peignent.
2. Vérifier qu'aucun `width/height/top/left` n'est animé.
3. Chercher `transform: translateZ(0)` manquant sur les canvas superposés.
4. `will-change` trop large → supprimer après animation (`will-change: auto`).

> Skills sœurs : `cinematic-scroll` (scroll-as-timeline GSAP), `artcol-design-system` (tokens couleur/easing), `ui-ux-pro-max` (durées et règles UX), `glsl-shaders` (effets GPU).
