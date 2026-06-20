# CLAUDE.md

> Guide pour Claude (et l'équipe) lors du travail sur ce projet.
> Pour les notes spécifiques à la version de Next.js, voir aussi `AGENTS.md`.

## Projet

Site web **3D interactif**. L'objectif est de créer des expériences web
immersives avec des scènes 3D **performantes** et **accessibles**.

## Stack technique

- **Framework** : Next.js 16 (App Router) + React 19 + TypeScript
- **Rendu 3D** : Three.js via React Three Fiber (`@react-three/fiber`)
- **Aides 3D** : drei (`@react-three/drei`) — caméras, contrôles, loaders,
  environnements, helpers (`Html`, `useProgress`, `ContactShadows`…)
- **Modèles 3D** : fichiers GLTF/GLB, convertis en composants avec `gltfjsx`
- **Styles 2D** : Tailwind CSS v4

## Commandes

| Action                | Commande                                  |
| --------------------- | ----------------------------------------- |
| Installer             | `npm install`                             |
| Lancer en dev         | `npm run dev`                             |
| Build de production   | `npm run build`                           |
| Lint                  | `npm run lint`                            |
| Convertir un modèle   | `npx gltfjsx public/models/mon-modele.glb --types` |

> Toutes les commandes se lancent depuis ce dossier (`artcol-3d/`), qui est la
> racine de ce projet au sein du monorepo ARTCOL.

## Structure des dossiers

```
artcol-3d/
├── app/                  # Routes Next.js (App Router) + layout + styles globaux
├── components/
│   ├── 3d/               # Scènes, meshes, modèles (tout ce qui touche au Canvas)
│   │   ├── Scene.tsx     # Wrapper client du <Canvas> (point d'entrée 3D)
│   │   ├── SpinningKnot.tsx  # Mesh animé via useFrame
│   │   ├── CanvasLoader.tsx  # Fallback <Suspense> dans le Canvas (drei Html)
│   │   └── Model.tsx     # Exemple useGLTF + useGLTF.preload
│   └── ui/               # Interface 2D classique (Tailwind), composants serveur
│       └── SceneFallback.tsx # Alternative sans 3D (pas de WebGL)
├── hooks/                # Hooks réutilisables
│   ├── usePrefersReducedMotion.ts
│   └── useHasWebGL.ts
└── public/
    └── models/           # Fichiers GLTF/GLB (compressés)
```

## Conventions de code

- **Composants fonctionnels + hooks uniquement**, en TypeScript.
- Les scènes 3D vivent dans `components/3d/` ; l'UI 2D dans `components/ui/`.
- **Toujours encapsuler le `<Canvas>` dans un composant client** (`"use client"`).
- **Privilégier les composants drei** plutôt que du Three.js impératif quand
  c'est possible (`OrbitControls`, `Environment`, `ContactShadows`, `Html`…).
- **Charger les modèles avec `useGLTF`** et **précharger avec `useGLTF.preload`**.
- `useFrame` ne peut être appelé qu'à l'intérieur d'un `<Canvas>`.
- Import alias : `@/` pointe vers la racine du projet (ex. `@/hooks/...`).

## Performance (critique en 3D)

- **Réutiliser géométries et matériaux** ; ne pas les recréer à chaque rendu.
  Pour des objets répétés, créer la géométrie/le matériau une seule fois
  (`useMemo`) et les partager, ou utiliser l'instancing (`<Instances>` de drei).
- **`<Suspense>`** pour le chargement asynchrone des modèles, textures,
  environnements ; fournir un fallback (voir `CanvasLoader`).
- **Limiter les re-rendus React** : l'animation passe par `useFrame` (mutation
  directe des refs), **jamais** par le state React.
- **Compresser** les modèles (**Draco** / meshopt) et les textures
  (**KTX2** / WebP). Préférer des géométries à faible nombre de polygones.
- Régler le `dpr` du Canvas (ex. `dpr={[1, 2]}`) pour limiter le coût sur les
  écrans haute densité ; activer `frameloop="demand"` si la scène est statique.
- **Tester la fluidité sur mobile** et prévoir un fallback si WebGL est
  indisponible (voir `useHasWebGL` + `SceneFallback`).

## Accessibilité

- Fournir une **alternative texte/contenu** pour les utilisateurs sans 3D :
  le `<Canvas>` est marqué `aria-hidden` (purement décoratif) et le contenu
  équivalent est exposé hors-canvas dans l'UI 2D + `SceneFallback`.
- Respecter **`prefers-reduced-motion`** : réduire ou couper les animations
  (voir `usePrefersReducedMotion`, utilisé dans `SpinningKnot`).
- Garder le focus clavier et le contenu sémantique dans la couche 2D, pas
  dans le Canvas.

## Ce qu'il faut éviter

- ❌ Mettre de la **logique lourde dans `useFrame`** (allocations, fetch, setState).
- ❌ Charger d'**énormes modèles non compressés**.
- ❌ **Manipuler le DOM directement** à l'intérieur du Canvas (utiliser drei `Html`).
- ❌ Recréer géométries/matériaux/textures à chaque rendu.
- ❌ Piloter une animation via le **state React** plutôt que `useFrame`.
- ❌ Oublier d'**encapsuler le Canvas dans un composant client**.

## Ajouter un modèle 3D (workflow)

1. Déposer `mon-modele.glb` (compressé) dans `public/models/`.
2. `npx gltfjsx public/models/mon-modele.glb --types` → composant typé.
3. Placer le composant dans `components/3d/`, le monter sous `<Suspense>`.
4. Ajouter `useGLTF.preload("/models/mon-modele.glb")` au niveau module.
