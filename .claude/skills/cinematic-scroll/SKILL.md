---
name: cinematic-scroll
description: "Sites web immersifs pilotés au scroll (cinématiques, « award-winning ») : Lenis (smooth scroll), GSAP ScrollTrigger, le pattern scroll-as-timeline (scrub), architecture canvas WebGL fixe + DOM superposé, easings narratifs custom, chapitres/scrollytelling, révélations de texte (SplitText), sound design (Howler.js), parallaxe, budgets perf, prefers-reduced-motion. Utiliser pour : construire un site immersif/cinématique, une expérience narrative au scroll, un hero avec caméra pilotée au scroll, une landing premium. Mots-clés : scroll, immersif, cinématique, lenis, gsap, scrolltrigger, scrollytelling, parallax, smooth scroll, splittext, storytelling, awwwards, hero, narration."
---

# Sites immersifs pilotés au scroll

Pour des expériences web **cinématiques** où le scroll *raconte* (type Awwwards / Lost Chapter). Le scroll n'est pas un déclencheur : c'est la **tête de lecture d'un film**.

## Quand l'activer
Construire un site immersif/narratif, un hero avec caméra au scroll, une landing premium, du scrollytelling.

## Le setup canonique (Lenis + GSAP)
```js
const lenis = new Lenis()
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((t) => lenis.raf(t * 1000))
gsap.ticker.lagSmoothing(0)
```
→ inertie fluide **sans jank**, parfaitement synchronisée avec les timelines GSAP.

## Principes
- **Scroll = timeline** : mapper `scrollProgress` sur une timeline GSAP en `scrub` (l'utilisateur *scrubbe* la scène comme un montage), plutôt qu'un simple seuil de trigger.
- **Canvas WebGL fixe + DOM au-dessus** : `position: fixed` pour le canvas 3D en fond, contenu HTML qui scrolle par-dessus → **profondeur réelle** sans coût de compositing.
- **Easing = ton narratif** : des courbes custom nommées (CustomEase, « cinematicSilk »…) donnent le *feel*. Lent et intentionnel > rapide et agité.
- **Texte comme chorégraphie** : SplitText + ScrollTrigger pour animer lettres/mots (police variable = poids/vélocité).
- **Chapitres / beats** : structurer l'expérience comme un récit (pacing éditorial façon NYT/NatGeo). Pin + scrub par section.
- **Son** : Howler.js (ambiance + sfx UI). ⚠️ Autoplay bloqué → prévoir un **unmute déclenché par l'utilisateur**.

## Budget performance (sites lourds)
- JS < ~3 Mo, **`frameloop="demand"`** (R3F), draw calls < 200, assets 3D en **Draco + KTX2** (voir `gltf-optimization-pipeline`), lazy/Suspense, images responsives.
- Mesurer INP/CLS (les animations scroll dégradent vite ces métriques).

## Accessibilité (non négociable)
- `window.matchMedia('(prefers-reduced-motion: reduce)')` à l'init → remplacer parallaxe/motion liée au scroll par des **fondus/coupures** ; fournir un **contrôle pause** (WCAG 2.2.2) ; éviter les déclencheurs vestibulaires (gros mouvements continus).

## Stack & réfs
Lenis · GSAP (ScrollTrigger, SplitText, CustomEase, ScrollSmoother) · R3F (optionnel) · Howler.js. Inspiration/tutos : **Codrops/Tympanus**, Bruno Simon, Maxime Heckel. Skills sœurs : `web3d-threejs`, `art-direction-brief`, `motion-design`.
