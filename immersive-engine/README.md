# NEXUS — Moteur d'expérience web 3D immersive

Un site où l'on **ne descend pas une page** : on **avance dans un univers** en profondeur (axe Z), sur un rail de caméra cinématique. Base générique et réutilisable (agence IA, auto, luxe, immobilier… = juste un autre fichier de données).

## Stack
Next.js 16 · React 19 · TypeScript · Three.js · React Three Fiber · drei · @react-three/postprocessing · GSAP · Framer Motion · Tailwind CSS v4 · Zustand · Lenis.

## Concept — « The Continuum »
Un seul monde 3D persistant. La caméra suit une courbe (spline) qui passe par chaque **Station** (= une section posée dans l'espace). Le scroll/clavier/clic/tactile pilotent une seule variable `t ∈ [0..1]` = la position sur le rail.

## Architecture
```
src/
├─ app/                   page (client) + layout + SEO + styles
├─ components/
│  ├─ 3d/                 Experience (Canvas), CameraRig (rail), Environment (univers)
│  └─ ui/                 Hud (hologrammes, progression, navigation)
├─ data/experience.ts     ✦ TOUT le contenu éditable (stations, thème)
├─ hooks/useNavigation     inputs → déplacement caméra (4 modes)
├─ lib/path.ts             le rail (CatmullRom) calculé depuis les stations
└─ stores/useExperience    état global (t, target, station active, qualité)
```

## Navigation (4 modes)
molette/trackpad · flèches & Z/S/W · glisser (tactile) · clic sur les points (à droite) / boutons Précédent·Avancer.

## Démarrer
```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Personnaliser
Éditer **`src/data/experience.ts`** : ajouter/retirer des stations (position, côté, textes) et changer le thème (`THEME`). Le moteur s'adapte automatiquement (rail, navigation, HUD).

## Feuille de route
- [x] **Étape 1** — squelette navigable (rail caméra, environnement futuriste, HUD, 4 modes de nav)
- [ ] **Étape 2** — Stations + panneaux holographiques in-scene (`<Html>`)
- [ ] **Étape 3** — vrais modèles 3D (.glb) à gauche/droite + interactions → vue détaillée
- [ ] **Étape 4** — post-traitement avancé (DOF, particules), tiers de qualité, mobile, loaders
- [ ] **Étape 5** — déploiement en ligne
