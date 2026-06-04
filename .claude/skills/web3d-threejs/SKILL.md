---
name: web3d-threejs
description: "Expert 3D web temps réel : three.js, React Three Fiber (R3F) + drei, WebGL/WebGPU, shaders GLSL, pipeline d'assets (glTF/GLB, Draco, KTX2/Basis, meshopt), éclairage IBL (HDRI/EXR), post-processing (bloom, god-rays, DOF), animation (useFrame, GSAP, ScrollControls), performance (instancing, LOD, frameloop on-demand, budgets) ET déploiement (CSP wasm-unsafe-eval + worker-src blob: pour les décodeurs, hébergement des assets). Utiliser pour : créer / optimiser / débugger une scène 3D web, une expérience immersive (type Lost Chapter), un donjon / château 3D, un hero 3D, un configurateur produit. Mots-clés : three.js, threejs, react-three-fiber, r3f, drei, webgl, webgpu, 3d, shader, glsl, gltf, glb, draco, ktx2, basis, hdri, sponza, kaykit, immersif, donjon, château."
---

# Web 3D temps réel — three.js / React Three Fiber

Guide expert pour **créer, optimiser et déployer** des expériences 3D web performantes et immersives (type *Lost Chapter* : donjon, château, hero 3D, configurateur).

## Quand l'activer
Toute scène 3D web : création, optimisation, debug, déploiement. (three.js, R3F, drei, WebGL/WebGPU, shader, glTF, donjon/château 3D, immersif.)

## Stack
- **Vanilla three.js** : contrôle total, scènes très sur-mesure.
- **React Three Fiber (R3F) + drei** : déclaratif, écosystème pmndrs (loaders, controls, helpers). **Défaut recommandé** dans une app React (ex. `lostchapter-experience`).
- Post-FX : `@react-three/postprocessing` (Bloom, GodRays, DepthOfField, Vignette, SSAO) — avec parcimonie (coût GPU).
- Animation : `useFrame` (boucle), **GSAP** (timelines), drei `useScroll`/`ScrollControls`, **Lenis** (smooth scroll).
- Physique si besoin : `@react-three/rapier`.

## Pipeline d'assets (le nerf de la guerre)
- **Modèles** : glTF/GLB uniquement. Optimiser avec **gltf-transform** ou **gltfpack** (meshopt).
- **Compression géométrie : Draco** (`draco_decoder.wasm`). ⚠️ Le décodeur se charge par défaut depuis `https://www.gstatic.com/draco/…` → voir CSP. **Le plus robuste = self-host** : copier le décodeur dans `/draco/` puis `dracoLoader.setDecoderPath('/draco/')`.
- **Textures : KTX2/Basis** (`.ktx2`) = GPU-compressées, bien plus légères en VRAM que PNG/JPG (transcoder `basis_transcoder.wasm`).
- **Environnement (IBL)** : HDRI `.hdr`/`.exr` via drei `<Environment files="…">`. ⚠️ Un `.exr` peut peser **20–25 Mo** → préférer un **`.hdr` compressé** en 1k/2k, sinon le chargement traîne.
- drei : `useGLTF(url)`, `useGLTF.preload(url)`, `<Bvh>` pour accélérer le raycast.

## ⚠️ Déploiement & CSP (leçon Lost Chapter — à ne jamais réoublier)
Une scène three.js avec Draco/KTX2 utilise **WebAssembly + Web Workers (blob:)**. Une CSP stricte la **casse silencieusement** (page blanche/noire, 0 erreur évidente). Sur les routes 3D, prévoir :
```
script-src  'self' 'unsafe-inline' 'wasm-unsafe-eval' https://www.gstatic.com;
worker-src  'self' blob:;
child-src   'self' blob:;
connect-src 'self' blob: data: https://www.gstatic.com;
img-src     'self' data: blob:;
media-src   'self' blob:;
```
→ **Garder la landing publique en CSP stricte ; n'assouplir QUE les routes 3D** (ex. `/experience-*`). Vérifier aussi : tous les `/assets/**` en **200** (HDRI inclus), `Cache-Control: immutable` sur les assets hashés.

## Performance (viser 60 fps)
- **Budget** : peu de draw calls (~<150), géométrie raisonnable, textures KTX2, VRAM mobile ~<512 Mo.
- **Instancing** (`InstancedMesh` / drei `<Instances>`) pour les objets répétés (colonnes, dalles, foule).
- **LOD**, frustum culling, fusion des géométries statiques.
- **On-demand rendering** : `frameloop="demand"` + `invalidate()` quand rien ne bouge (énorme gain CPU/batterie).
- Lumières : limiter lights dynamiques + ombres → **baked lighting**/lightmaps + env map ; idéalement **une seule** shadow-casting light.
- `dpr={[1, 2]}`, `gl={{ powerPreference: 'high-performance' }}`.
- Mesurer : **r3f-perf**, stats.js, Spector.js.

## UX de chargement & robustesse
- `<Suspense fallback={<Loader/>}>` (drei `useProgress`/`<Html>`), précharger les assets clés.
- Détecter WebGL → **fallback image/vidéo** si absent (cas Lost Chapter : poster/vidéo).
- **Mobile** : baisser qualité/post-FX ; respecter `prefers-reduced-motion` (couper auto-rotation/parallax).
- `dispose()` géométries/matériaux/textures au démontage (éviter les fuites mémoire).

## Direction artistique (rendre ça « premium »)
- **Lumière chaude + IBL (env map)** = clé du réalisme. **Bloom léger + DoF + vignette** = cinématique.
- `fog` pour la profondeur ; **god-rays** pour les vitraux ; poussière/particules subtiles.
- Color grading (LUT) en post. **Mouvement caméra lent** (push-in) > caméra agitée.

## Debug express
Écran noir ? → console (F12) : erreurs **CSP** (wasm/worker), **404** d'assets (HDRI, .glb), WebGL context lost. Modèle invisible ? → échelle/position/normales, matériau `side: DoubleSide`, caméra `near/far`, lumière présente.

> **Écosystème à connaître/explorer** : three.js · react-three-fiber · drei · three-stdlib · gltf-transform · gltfpack/meshopt · @react-three/postprocessing · @react-three/rapier · r3f-perf · lygia (shaders) · threejs-journey & Bruno Simon (référence pédagogique) · pmndrs.
