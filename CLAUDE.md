# CLAUDE.md — Projet « Site 3D navigable en profondeur » (façon jeu vidéo)

> Guide pour tout agent (Claude Code) travaillant sur le projet d'expérience 3D
> immersive et **navigable** d'AMAVYA : on ne « scrolle » pas une page, on
> **se déplace** dans un monde 3D (première personne ou caméra qui suit un
> personnage), avec **physique**, **collisions**, **transitions** et **effets**.

---

## 1. Objectif

Un monde 3D explorable, découpé en **zones/sanctuaires** reliés par des passages
(portails, couloirs, plongées). Le joueur **avance, regarde, entre dans des salles**,
déclenche l'apparition de contenu (les créations exposées). Référence d'ambiance :
sites Awwwards 3D, `kellydev.io`, et la galerie `immersive-engine/` déjà en place.

## 2. Stack & versions COMPATIBLES (à respecter)

Le « set moderne » prouvé et fonctionnel (cf. `immersive-engine/`) :

| Domaine | Lib | Version cible |
|---|---|---|
| Framework | Next.js + TypeScript | 16.x / React 19 |
| Rendu 3D | `three` | ^0.184 |
| React+3D | `@react-three/fiber` | ^9.6 |
| Helpers | `@react-three/drei` | ^10.7 |
| Physique | `@react-three/rapier` | ^2.x (compatible fiber 9) |
| Effets | `@react-three/postprocessing` + `postprocessing` | ^3.0 / ^6.36 |
| Animations | `@react-spring/three` (ressorts) + `gsap` (timelines) | ^9 / ^3 |
| État | `zustand` | ^5 |
| Modèles (dev) | `gltfjsx`, `leva`, `r3f-perf` | — |

> ⚠️ **Piège de compatibilité** : le fork `react-three-next` est en **v2 (R3F 8 /
> React 18 / Next 14)**. `drei` (latest) et `react-postprocessing@3` exigent **R3F 9 /
> React 19**. → Ne PAS mélanger. Utiliser le set moderne ci-dessus (comme
> `immersive-engine/`), pas le starter v2 tel quel. `racing-game` utilise
> `@react-three/cannon` + three 0.139 (ancien) : **référence de structure**, mais on
> utilise **rapier** (pas cannon).

## 3. Architecture des dossiers

```
src/
├─ app/                      # Next App Router (page client, layout, SEO)
├─ components/
│  ├─ 3d/
│  │  ├─ Experience.tsx      # <Canvas> + <Physics> + Suspense + post-process
│  │  ├─ World.tsx           # le décor statique (colliders trimesh)
│  │  ├─ Player.tsx          # personnage + CharacterController (rapier)
│  │  ├─ Zone.tsx            # une salle/sanctuaire (contenu + trigger)
│  │  ├─ Models/             # composants générés par gltfjsx
│  │  └─ effects/            # config post-processing + shaders GLSL
│  └─ ui/                    # Hud, Crosshair, Menu, Minimap, ZoneTitle
├─ game/                     # logique « jeu »
│  ├─ usePlayerController.ts # input -> mouvement (rapier)
│  ├─ useKeyboard.ts         # mapping touches -> store
│  ├─ useChaseCamera.ts      # caméra qui suit (3e personne) / FPS
│  └─ useZoneTriggers.ts     # capteurs rapier -> changement de zone
├─ stores/useGame.ts         # zustand : input, player, progression, UI, qualité
├─ data/zones.ts             # ✦ contenu éditable : zones, positions, créations
├─ systems/                  # quality tiers, physics config, postfx presets
├─ hooks/  lib/
└─ assets/ models/ textures/ audio/
```

## 4. Système de navigation (cœur du projet)

Deux modes (choisis dans le store) :

- **Première personne** : regard via `PointerLockControls` (drei) ; déplacement via
  un **CharacterController rapier** (capsule, gravité, collisions, marches).
- **Troisième personne** : personnage = `RigidBody` rapier ; **caméra qui suit**
  (`useChaseCamera`, lerp derrière le perso) ; rotation du perso vers la direction.

Entrée clavier/souris : `@react-three/drei` `<KeyboardControls>` **ou** `useKeyboard`
qui écrit dans le store/refs. Mobile : joystick virtuel + boutons.

**Navigation en profondeur par zones** : le monde est découpé en zones placées dans
l'espace. Des **capteurs (sensors rapier)** aux entrées déclenchent
`useZoneTriggers` → met à jour `store.currentZone`, joue une **transition caméra**
(react-spring/gsap) et **charge** le contenu de la zone (Suspense + import dynamique).

## 5. Physique — `@react-three/rapier`

- Englober la scène dans `<Physics gravity={[0,-9.81,0]}>`.
- **Monde** : colliders `trimesh`/`cuboid` (statiques) générés depuis la géométrie.
- **Joueur** : `RigidBody` + `CapsuleCollider` + `useRapier().world.createCharacterController`
  (ou le hook helper) pour un déplacement propre (pentes, marches, anti-tunneling).
- **Triggers** : colliders `sensor` → `onIntersectionEnter` pour les portes/zones/objets.
- `debug` activable via le store (wireframe des colliders).

## 6. Post-processing & effets — `@react-three/postprocessing`

Pipeline par défaut (dans `Experience`) : `EffectComposer` →
`Bloom` (néons) · `N8AO`/`SSAO` (profondeur) · `DepthOfField` (cinéma) ·
`Vignette` · `ToneMapping` (ACES). Tone mapping ACES réglé sur le `gl`.
Théorie/recettes : voir le fork `3d-game-shaders-for-beginners`.
Régler l'intensité **selon le tier de qualité** (désactiver SSAO/DOF en « low »).

## 7. État — `zustand` (pattern de `racing-game`)

- **Un seul store** = source de vérité : `input` (touches), `player`
  (mode caméra, vie/énergie), `currentZone`, `progression`, `ui` (menu, aide,
  minimap), `quality`, et les **actions**.
- **Refs > state** pour les valeurs haute fréquence (position/rotation du perso) :
  on ne re-render pas React à 60 fps ; le store ne porte que l'état « UI ».
  (C'est ce que fait `racing-game` : `createRef` pour le chassis, `vehicleConfig`,
  `booleans` pour l'UI, `keys` pour l'input.)

## 8. Animations & transitions

- `@react-spring/three` : transitions à base de **ressorts** (caméra qui se pose,
  objets qui apparaissent, portails).
- `gsap` : timelines scriptées (séquence d'intro, plongée « grand-huit »).

## 9. Modèles 3D — workflow `gltfjsx`

1. Optimiser le `.glb` (DRACO/meshopt).
2. `npx gltfjsx model.glb -t -T` → composant `Model.tsx` typé + animations.
3. Charger via `useGLTF` (+ `useAnimations`), précharger `useGLTF.preload`.
   Modèles libres : three.js `examples/models`, Khronos `glTF-Sample-Assets`.

## 10. Performance (obligatoire)

- **Tiers de qualité** auto (détection device + FPS) : DPR, effets, ombres, densité.
- **Zones en lazy-load** : ne charger que la zone courante + voisines.
- `drei` : `<Bvh>` (raycast rapide), `<Instances>`, `<Detailed>` (LOD),
  `<AdaptiveDpr>`, `<PerformanceMonitor>`.
- `frameloop="demand"` pour les écrans statiques ; plafonner `dpr` à ~1.75.
- Fallback mobile + `prefers-reduced-motion`.

## 11. Commandes

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # validation TS + build
```

## 12. Conventions & pièges

- Tout composant utilisant R3F/hooks vit dans l'arbre **client** ; charger le
  `<Canvas>` via `next/dynamic` avec `ssr:false` (Next 16 : OK seulement dans un
  Client Component).
- Code **commenté**, **typé**, **data-driven** (`data/zones.ts`).
- Lire `node_modules/next/dist/docs/` avant d'utiliser une API Next 16 (breaking changes).
- Déploiement : Vercel (`vercel deploy --prod`), domaine via sous-domaine dédié.

## 13. Forks de référence (compte `bouhleltarek06220-a11y`)

Cœur : `three.js`, `react-three-fiber`, `drei`, `react-three-next`, `gltfjsx` ·
Jeu : `react-three-rapier`, `react-postprocessing`, `react-spring`, `zustand`,
`racing-game` · Appui : `project_3D_developer_portfolio`,
`3d-game-shaders-for-beginners` · Design/skills : `skills`,
`awesome-design-skills`, `awesome-design-md`, `open-design`.
