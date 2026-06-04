---
name: gltf-optimization-pipeline
description: "Pipeline complet d'optimisation d'assets 3D pour le web (glTF/GLB) : gltfjsx (--transform), glTF-Transform (SDK/CLI), gltfpack/meshopt, compression Draco, textures KTX2/Basis (UASTC/ETC1S), quantization, simplification, export Blender, chargement R3F (useGLTF), hébergement des décodeurs + CSP. Utiliser pour : réduire le poids d'un GLB, convertir un modèle en composant JSX typé, accélérer un chargement 3D trop lourd, préparer des assets pour la prod (type Sponza / KayKit / Lost Chapter). Mots-clés : gltf, glb, optimisation, compression, draco, meshopt, ktx2, basis, gltfjsx, gltf-transform, gltfpack, texture, VRAM, poids, taille, blender, R3F, three.js."
---

# Pipeline d'optimisation d'assets 3D (glTF/GLB)

But : des assets **les plus légers et au décodage le plus rapide possible**, sans perte visuelle perceptible. Un GLB mal optimisé = chargement lent + VRAM saturée + jank.

## Quand l'activer
Préparer/optimiser un modèle pour le web, réduire un GLB lourd, convertir en JSX R3F, débugger un chargement 3D lent.

## Le raccourci qui règle 80 % des cas
```bash
npx gltfjsx model.glb --transform
```
→ produit un **composant JSX typé** + un `.glb` optimisé (Draco + textures WebP redimensionnées ~1024px). **−70 à −90 %** de poids en une commande. Idéal pour R3F.

## Le pipeline complet (l'ORDRE compte)
Avec **glTF-Transform** (CLI `gltf-transform` ou SDK) — toujours dans cet ordre :
```
dedup → prune → simplify → weld → quantize → (meshopt | draco) → textureCompress (KTX2)
```
⚠️ Compresser **après** dedup/prune, sinon on compresse des données dupliquées.
```bash
gltf-transform dedup in.glb a.glb
gltf-transform prune a.glb b.glb
gltf-transform weld b.glb c.glb
gltf-transform simplify c.glb d.glb --ratio 0.75 --error 0.001
gltf-transform meshopt d.glb e.glb            # ou: gltf-transform draco
gltf-transform uastc e.glb out.glb --level 4  # textures KTX2 (ou: etc1s)
```
Alternative tout-en-un **gltfpack** (meshopt + KTX2) :
```bash
gltfpack -i in.glb -o out.glb -cc -tc
```

## Géométrie : Draco vs Meshopt
- **Draco** : plus petit sur le disque, **décodage CPU plus lent**.
- **Meshopt** (`EXT_meshopt_compression`) : **décodage GPU bien plus rapide**, compresse aussi **animations + morph targets**.
- 👉 **Préférer meshopt** pour de l'interactif temps réel ; Draco si la priorité absolue est le poids de téléchargement.

## Textures : KTX2 / Basis Universal (pas du PNG/JPG !)
- KTX2 se décompresse en format **GPU-natif** (BC7/ETC/RGTC) → **4 à 6× moins de VRAM** que PNG/JPG.
- **UASTC** = haute qualité (normal maps, hero assets) ; **ETC1S** = compression max (textures décoratives).
- **Textures en puissance de 2** (256/512/1024/2048) : sinon mipmaps désactivées = perf qui s'effondre silencieusement.

## Chargement dans R3F
```js
const { nodes, materials } = useGLTF('/model.glb')
useGLTF.preload('/model.glb')           // précharger les assets clés
// décodeurs : self-host de préférence
dracoLoader.setDecoderPath('/draco/')
ktx2Loader.setTranscoderPath('/basis/')
```

## ⚠️ Décodeurs + CSP (sinon page noire en prod)
Draco/KTX2 = **WASM + workers (blob:)**. Self-host les décodeurs (`/draco/`, `/basis/`) pour ne dépendre d'aucun CDN ; et sur les routes 3D, la CSP doit autoriser :
`script-src 'wasm-unsafe-eval'` · `worker-src 'self' blob:` · (`https://www.gstatic.com` si décodeur Draco via CDN).
→ détails dans la skill **`web3d-threejs`**.

## Vérifier le résultat
- Poids final du GLB (viser quelques Mo max pour un asset principal).
- Draw calls / VRAM via **r3f-perf** (`<Perf />`).
- Rendu identique à l'original (pas d'artefact de simplification/quantization).

> Outils : `gltfjsx`, `@gltf-transform/cli`, `gltfpack` (meshoptimizer), `r3f-perf`. Réf. : gltf-transform.dev, meshoptimizer.org/gltf.
