---
name: webgpu-tsl
description: "Rendu WebGPU et shaders TSL (Three Shading Language) dans Three.js r171+ et React Three Fiber : WebGPURenderer avec fallback WebGL2 automatique, init async, gains de performance 2–10x (jusqu'à 100x sur nuages de points), couverture quasi universelle depuis Safari 26 (septembre 2025), TSL qui transpile un seul code JS vers WGSL (WebGPU) ou GLSL (WebGL), compute shaders pour particules et physique côté GPU, portage des ShaderMaterial custom, limitations actuelles (EffectComposer classique, cas expérimentaux). Utiliser pour : migrer une scène Three.js vers WebGPU, écrire des matériaux node-based portables, exploiter les compute shaders pour des milliers de particules, cibler les meilleures performances GPU sur Chrome et Safari 26+. Mots-clés : WebGPU, TSL, Three Shading Language, WGSL, WebGPURenderer, three.js r171, react-three-fiber, compute shader, particules GPU, node material, performance, Safari 26, fallback WebGL2, photoréalisme 2026."
---

# WebGPU + TSL — le tournant photoréalisme 2026

**WebGPU** est en production dans Three.js depuis la **r171** (septembre 2025). TSL (Three Shading Language) est le nouveau langage de shaders de Three.js : un seul code JS compile vers **WGSL (WebGPU) et GLSL (WebGL2)** — fini les deux codebases parallèles.

## Quand l'activer
- Scène Three.js/R3F avec beaucoup de particules, compute, ou matériaux complexes.
- Besoin de portabilité shader WebGL2 ↔ WebGPU sans dupliquer le code.
- Cibler les meilleures performances sur Chrome 113+ et Safari 26+ (2025).
- Nouveau projet post-2025 : partir sur WebGPU d'emblée plutôt que de migrer.

---

## Mise en place WebGPURenderer

### Vanilla Three.js
```js
import { WebGPURenderer } from 'three/webgpu'

const renderer = new WebGPURenderer({ antialias: true })
// ⚠️ OBLIGATOIRE : l'init est async (WebGPU API asynchrone)
await renderer.init()
document.body.appendChild(renderer.domElement)
```

### React Three Fiber
```jsx
import { Canvas } from '@react-three/fiber'
import { WebGPURenderer } from 'three/webgpu'

// Passer gl comme factory async
<Canvas
  gl={async (canvas) => {
    const renderer = new WebGPURenderer({ canvas, antialias: true })
    await renderer.init()
    return renderer
  }}
>
  {/* scène normale */}
</Canvas>
```

### Fallback WebGL2 automatique
Three.js détecte la disponibilité de WebGPU et bascule **automatiquement** sur WebGL2 si absent (navigateurs anciens, iframes restreintes). Le fallback est transparent pour le code applicatif ; TSL s'en charge.
```js
// Vérifier manuellement si besoin
import WebGPU from 'three/addons/capabilities/WebGPU.js'
if (!WebGPU.isAvailable()) console.warn('Fallback WebGL2 actif')
```

---

## Gains de performance

| Scénario | Gain approximatif |
|---|---|
| Scène classique / draw calls normaux | 2–4x |
| Millions de particules (InstancedMesh) | 5–10x |
| Nuages de points (cas Segments.ai) | ~100x |
| Compute shaders physique côté GPU | 10–50x vs JS CPU |

Safari 26 (juin 2025) a apporté le support WebGPU → couverture navigateurs ~95%+ sur les appareils récents. Plus besoin de stratégie "WebGPU seulement pour Chrome".

---

## TSL — Three Shading Language

TSL remplace GLSL custom. C'est du **JavaScript fonctionnel** qui décrit un graphe de nœuds et transpile vers WGSL ou GLSL selon le renderer.

### Syntaxe de base
```js
import { uniform, vec3, dot, pow, clamp, mix } from 'three/tsl'

// Uniform (mis à jour chaque frame)
const uTime  = uniform(0)       // float
const uColor = uniform(new THREE.Color('#ff4400'))  // color

// Fresnel / rim glow (équivalent du GLSL classique)
const fresnel = pow(
  clamp(1.0 - dot(normalWorld, positionViewDirection), 0.0, 1.0),
  uniform(3.0)
)
const finalColor = mix(uColor, vec3(1, 1, 1), fresnel)
```

### NodeMaterial + TSL dans R3F
```jsx
import { MeshStandardNodeMaterial } from 'three/webgpu'
import { uniform, sin, time } from 'three/tsl'

function PulseMaterial() {
  const mat = useMemo(() => {
    const m = new MeshStandardNodeMaterial()
    // colorNode remplace fragmentShader
    m.colorNode = mix(
      color('#1a0a3e'),
      color('#ff6b35'),
      sin(time.mul(2.0)).mul(0.5).add(0.5)
    )
    return m
  }, [])           // ← useMemo OBLIGATOIRE (ne pas recréer chaque frame !)
  return <primitive object={mat} attach="material" />
}
```

### Uniforms TSL vs GLSL
```js
// GLSL classique (à NE PAS faire en TSL)
material.uniforms.uTime = { value: 0 }

// TSL — uniform() retourne un nœud vivant
const uTime = uniform(0)
// Mise à jour dans useFrame :
useFrame((_, dt) => { uTime.value += dt })
// Pas de .uniforms, pas de glsl string, pas de fragmentShader string
```

### Compute shaders (particules)
```js
import { compute, storage, instanceIndex } from 'three/tsl'

// Buffer GPU (float32, N particules × 3 composantes)
const posBuffer = storage(new THREE.StorageBufferAttribute(N * 3, 1), 'vec3', N)

// Nœud compute : s'exécute intégralement sur GPU
const updatePositions = compute(
  posBuffer.element(instanceIndex).add(vec3(0, 0.001, 0)), // déplacer vers le haut
  N
)

// Lancer chaque frame
renderer.computeAsync(updatePositions)
```
→ **Aucun transfert CPU↔GPU** : les particules vivent et bougent entièrement sur le GPU.

---

## Portage depuis ShaderMaterial custom → TSL

| Avant (GLSL) | Après (TSL) |
|---|---|
| `ShaderMaterial` + `vertexShader: '...'` | `MeshStandardNodeMaterial`, `positionNode` |
| `fragmentShader: '...'` | `colorNode`, `emissiveNode`, `opacityNode` |
| `uniforms.uFoo = { value: x }` | `const uFoo = uniform(x)` |
| `onBeforeCompile` patch | Nœuds TSL composés (`add`, `mul`, `mix`…) |

⚠️ Certains matériaux custom complexes (raymarching, SDF) nécessitent un portage complet. Voir `glsl-shaders` pour la logique GLSL → réécrire en chaîne de nœuds TSL.

---

## EffectComposer — la principale limitation actuelle

`@react-three/postprocessing` (basé sur `three/examples/jsm/postprocessing`) est **incompatible** avec WebGPURenderer. Alternatives :
```js
// Option A : PostProcessing de three/webgpu (expérimental)
import { PostProcessing } from 'three/webgpu'
import { bloom } from 'three/tsl'

const pp = new PostProcessing(renderer)
pp.outputNode = bloom(scenePass.getTextureNode(), 0.5, 0.35)

// Option B : garder WebGL2 pour les scènes post-FX lourdes (fallback assumé)
// Option C : attendre la lib @react-three/postprocessing v4 (WebGPU support annoncé)
```

---

## Checklist migration / nouveau projet WebGPU

- [ ] `import { WebGPURenderer } from 'three/webgpu'` (pas `three`)
- [ ] `await renderer.init()` (async obligatoire)
- [ ] Tester le fallback WebGL2 sur Firefox < 119 ou Safari < 26
- [ ] Remplacer `ShaderMaterial` custom par `MeshStandardNodeMaterial` + TSL
- [ ] `useMemo` sur tous les NodeMaterials dans R3F (jamais recréer en render)
- [ ] EffectComposer → `PostProcessing` WebGPU ou désactiver si non critique
- [ ] Valider les performances avec **r3f-perf** (GPU time, draw calls)
- [ ] Garder le fallback WebGL2 activé en prod

---

## Ressources clés
- **Three.js r171 changelog** : annonce production-ready WebGPU (sept 2025)
- **`three/tsl` source** : packages/three/src/nodes/tsl/
- **pmndrs/react-three-fiber** : PR/issues WebGPU tracker
- **WebGPU Fundamentals** (webgpufundamentals.org) : bases WGSL/compute
- **Segments.ai blog** : cas réel 100x sur nuages de points

> Skills sœurs : `web3d-threejs` (pipeline R3F complet, CSP, perf), `glsl-shaders` (shaders GLSL classiques à porter en TSL).
