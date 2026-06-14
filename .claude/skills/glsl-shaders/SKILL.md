---
name: glsl-shaders
description: "Écriture de shaders GLSL pour three.js / React Three Fiber : ShaderMaterial vs RawShaderMaterial, vertex/fragment, uniforms (time, resolution, mouse), bibliothèque LYGIA, vite-plugin-glsl (#include), noise (value/simplex/FBM/voronoi), fresnel/rim glow, displacement, effet dissolve, gradients, SDF + raymarching de base, et note TSL/WebGPU. Utiliser pour : créer un matériau custom, un fond génératif, un effet visuel (eau, portail, hologramme, énergie, dissolve, glow), un dégradé animé, débugger un shader. Mots-clés : shader, glsl, fragment, vertex, ShaderMaterial, uniform, noise, fresnel, raymarching, SDF, lygia, generative, dégradé, dissolve, holographique, R3F, three.js."
---

# Shaders GLSL pour three.js / R3F

Quand les matériaux standards ne suffisent pas : **dégradés animés, dissolve, hologrammes, eau, portails, énergie, glow, fonds génératifs**. C'est le levier « imagination » pour des visuels signés.

## Quand l'activer
Créer/débugger un shader ou un matériau custom, un effet visuel procédural, un fond génératif.

## Bases
- **`ShaderMaterial`** : three.js injecte automatiquement les uniforms/attributes communs (projectionMatrix, modelViewMatrix, uv, normal…). **`RawShaderMaterial`** : rien d'injecté (tout à déclarer). → commencer par `ShaderMaterial`.
- R3F : `<shaderMaterial args={[{ uniforms, vertexShader, fragmentShader }]} />`, ou le helper **`shaderMaterial`** de drei (matériau déclaratif typé), ou **`onBeforeCompile`** pour patcher un matériau standard (garder le PBR + ajouter un effet).
- **Uniforms** clés : `uTime`, `uResolution`, `uMouse`, textures. Les mettre à jour dans `useFrame` :
```js
useFrame((_, dt) => { ref.current.uniforms.uTime.value += dt })
```

## Toolchain
- **vite-plugin-glsl** : importer des `.glsl/.frag/.vert` et utiliser `#include` (modulariser).
- **LYGIA** (lygia.xyz) : plus grande lib de shaders multi-langage (GLSL/WGSL…) — noise, SDF, lighting, filtres, raymarching, via `#include` (CDN ou local). Ne pas réinventer le noise.
- **The Book of Shaders** : pour maîtriser noise/patterns/cellular (fondamentaux).

## Techniques cœur
- **UV & gradients** : `mix(colA, colB, uv.y)`, bandes, masques radiaux (`length(uv-0.5)`).
- **Noise** : value/simplex/FBM (turbulence, nuages, fumée), **voronoi** (cellules, caustics). FBM = somme d'octaves de noise.
- **Fresnel / rim glow** : `pow(1.0 - dot(normal, viewDir), p)` → halo de bord, hologrammes, énergie.
- **Displacement** (vertex shader) : déplacer `position` le long de la normale via noise → vagues, terrain, pulsation.
- **Dissolve** : `step(noise, threshold)` + `discard` + ligne incandescente sur le bord → désintégration.
- **SDF + raymarching** (avancé) : distance fields pour formes/volumes procéduraux, brouillard volumétrique.
- **Post-processing fullscreen** : shader sur un quad plein écran (transitions, color grading, glitch).

## Perf
- `precision mediump float` quand possible ; **éviter les branches `if` et les boucles** dynamiques ; limiter les `texture()` (coûteuses) ; attention au mobile (raymarching = cher).

## WebGPU / TSL (note)
Pour des **nouveaux** matériaux node-based, **TSL** (Three Shading Language, three r171+) compile vers **WGSL (WebGPU) ET GLSL (WebGL)** depuis le même code JS — syntaxe fonctionnelle (`.add()`, `.mul()`), `uniform()` (scalaires/vecteurs) vs `texture()` (textures), et `useMemo` pour ne pas recréer les uniforms. À envisager si tu vises WebGPU.

## Debug (pas de console dans un shader)
Sortir une valeur **en couleur** pour la visualiser : `gl_FragColor = vec4(vec3(maValeur), 1.0)`. Géométrie noire/invisible ? → vérifier normales, `uv`, échelle, `side: DoubleSide`. Rien ne s'affiche ? → l'erreur de compilation est dans la console (numéro de ligne GLSL).

> Réf. : lygia.xyz · thebookofshaders.com · vite-plugin-glsl · exemples R3F (pmndrs). Skill sœur : `web3d-threejs`.
