# Hermès · Perpétuelle — Immersive (Next.js + React Three Fiber)

Site immersif **scroll-driven** « comme L'Écrin » : le scroll pilote une
expérience WebGL (transitions plein écran entre scènes), avec smooth scroll
et révélations de texte. Construit comme **kit réutilisable** + une
**application Hermès** qui s'en sert.

## Stack
- **Next.js 16** (App Router) · **React 19**
- **three** · **@react-three/fiber** · **@react-three/drei** (WebGL / 3D)
- **GSAP + ScrollTrigger** (séquençage au scroll)
- **Lenis** (smooth scroll)

## Démarrer
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build production
```

## Architecture

```
app/
  layout.js        polices (Cormorant Garamond + Inter), métadonnées
  page.js          monte <SmoothScroll><Experience/></SmoothScroll>
  globals.css      styles (nav, scènes, titres, footer)
lib/
  scroll-store.js  état de scroll partagé (hors React, pour la perf)
components/
  kit/             ♻️ LE KIT RÉUTILISABLE
    SmoothScroll.jsx   Lenis ↔ GSAP ScrollTrigger + publie la progression
    ScrollScenes.jsx   Canvas WebGL fixe ; le scroll choisit/mélange les scènes
    sceneShader.js     shaders GLSL (cover-fit, wipe au bruit, RGB-shift, grain)
    Reveal.jsx         révélation de texte/titre à l'entrée (mots en cascade)
  hermes/
    Experience.jsx     l'application : données des scènes + composition du kit
public/assets/img/   textures (réutilisées du site Hermès)
```

## Le principe (« le scroll est responsable »)
1. **Lenis** lisse le défilement et publie `progress` (0→1) dans `scroll-store`.
2. **ScrollScenes** lit ce `progress` dans `useFrame` (60fps, sans re-render React)
   et le mappe sur un index de scène : `f = progress * (N-1)`.
3. Le **shader** mélange `texture[idx]` → `texture[idx+1]` selon la fraction,
   avec un wipe organique + décalage RGB proportionnel à la **vitesse** de scroll.
4. **GSAP/ScrollTrigger** révèle les titres/textes synchronisés.

## Réutiliser le kit ailleurs
```jsx
import SmoothScroll from "@/components/kit/SmoothScroll";
import ScrollScenes from "@/components/kit/ScrollScenes";
import Reveal from "@/components/kit/Reveal";

<SmoothScroll>
  <ScrollScenes images={["/a.jpg", "/b.jpg", "/c.jpg"]} />
  <main className="content">
    <section className="scene">
      <Reveal as="h1" className="title" split>Mon Titre</Reveal>
    </section>
    {/* ... une <section.scene> par image ... */}
  </main>
</SmoothScroll>
```

## Multiplateforme / performance
- `prefers-reduced-motion` respecté (smooth scroll + animations désactivés).
- `dpr` plafonné à 1.75, `antialias:false`, grain/Ken-Burns GPU légers.
- Textures en cover-fit (jamais déformées, tout ratio d'écran).
- Pistes : lazy-load des textures, fallback image si pas de WebGL, modèle 3D
  GLB (sac) avec caméra pilotée au scroll, transitions de pages (View
  Transitions API).
