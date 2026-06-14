---
name: web3d-effects-cookbook
description: "Recettes d'effets 3D web reproductibles pour une présentation ou expérience navigable (soutenance, portfolio, monde par étages/salles) : vue éclatée pilotée à la souris (GSAP + Blender Separate by Loose Parts), fracture de mesh (Cell Fracture), portail vers un autre monde (MeshTransmissionMaterial + stencil mask), navigation cinématique par scroll avec slides intégrées (ScrollTrigger + Lenis + drei Html), configurateur 3D (react-spring). Utiliser pour : construire une présentation 3D navigable, un objet qui explose et se rassemble, une porte/portail vers une autre scène, des slides dans des salles virtuelles, un configurateur produit 3D. Mots-clés : vue éclatée, exploded view, fracture, cell fracture, portail, portal, MeshTransmissionMaterial, stencil, navigation 3D, salle, étage, scroll caméra, slides 3D, drei Html, ScrollTrigger, GSAP, react-spring, configurateur, blender loose parts, PartCrafter."
---

# Recettes d'effets 3D web pour une expérience navigable

Pour la soutenance / présentation 3D de Tarek : monde par **étages/salles**, **porte vers un autre monde**, **objet qui explose puis se rassemble**, **slides embarquées dans les salles**. Chaque recette est un bloc indépendant et réutilisable.

## Quand l'activer
Présentation 3D navigable, portfolio immersif, monde à explorer, effet d'éclatement/fracture, portail, slides intégrées dans une scène.

---

## 1. Vue éclatée — l'objet qui explose et se rassemble

### Préparation dans Blender
1. Sélectionner l'objet (une voiture, un modèle de présentation, etc.).
2. **`Ctrl+P → Clear and Keep Transformation`** pour dissocier du parent éventuel.
3. **`Mesh → Separate → By Loose Parts`** : chaque pièce devient un objet.
4. Pour chaque pièce : **`Object → Set Origin → Origin to Center of Mass (Volume)`** — l'origine est au centroïde géométrique de la pièce.
5. Exporter en **GLB unique** (`File → Export → glTF 2.0`, cocher *Selected Objects* si besoin).

### En R3F (GSAP, pilotage souris/scroll)
```js
// Charger le GLB — chaque pièce = node distinct
const { nodes } = useGLTF('/exploded-model.glb')

// Stocker la position d'origine de chaque pièce au mount
const origins = useRef({})
useEffect(() => {
  Object.entries(nodes).forEach(([name, mesh]) => {
    origins.current[name] = mesh.position.clone()
  })
}, [nodes])

// Pilotage par la souris (magnitude 0→1)
const magnitude = useRef(0)
useEffect(() => {
  const onMove = (e) => {
    magnitude.current = e.clientX / window.innerWidth // 0 gauche → 1 droite
  }
  window.addEventListener('mousemove', onMove)
  return () => window.removeEventListener('mousemove', onMove)
}, [])

// Dans useFrame : GSAP.to pour chaque pièce selon distance à l'épicentre
useFrame(() => {
  Object.entries(nodes).forEach(([name, mesh]) => {
    const origin = origins.current[name]
    if (!origin) return
    const dir = origin.clone().normalize()   // direction depuis le centre
    const dist = origin.length()              // distance native = amplitude relative
    gsap.to(mesh.position, {
      x: origin.x + dir.x * dist * magnitude.current * 3,
      y: origin.y + dir.y * dist * magnitude.current * 3,
      z: origin.z + dir.z * dist * magnitude.current * 3,
      duration: 0.6, ease: 'power2.out', overwrite: true,
    })
  })
})
```
→ **Réassemblage** = ramener magnitude à 0 (ex. `gsap.to(magnitude, { current: 0 })`).
→ Pour un scroll-driven : remplacer `magnitude.current` par `scrollProgress` (useScroll / ScrollTrigger).

### PartCrafter (décomposition sémantique par IA)
**PartCrafter** (2025, Microsoft) décompose automatiquement un mesh 3D en parties sémantiques sans intervention Blender. API expérimentale ; sortie = meshes séparés avec labels. Utile quand le modèle source n'est pas riggé en loose parts.

---

## 2. Fracture de mesh (Cell Fracture) — explosion physique

### Dans Blender
1. Activer l'addon : **Preferences → Add-ons → Cell Fracture**.
2. Sélectionner l'objet → **`Object → Quick Effects → Cell Fracture`** (ou via le menu Add-ons).
3. Régler le nombre de fragments (~50–100 selon la complexité).
4. Résultat : N objets fils. Appliquer **Origin to Center of Mass** sur chacun.
5. Exporter en GLB (chaque fragment = node).

### Animation dans R3F
```js
// Même logique que la vue éclatée,
// mais avec une vélocité initiale aléatoire par fragment
const velocities = useRef({})
useEffect(() => {
  Object.keys(nodes).forEach(name => {
    velocities.current[name] = {
      x: (Math.random() - 0.5) * 8,
      y: Math.random() * 6,
      z: (Math.random() - 0.5) * 8,
    }
  })
}, [nodes])

// Déclencher l'explosion sur un event (clic, scroll threshold)
const explode = () => {
  Object.entries(nodes).forEach(([name, mesh]) => {
    const v = velocities.current[name]
    gsap.to(mesh.position, { x: `+=${v.x}`, y: `+=${v.y}`, z: `+=${v.z}`,
      duration: 1.2, ease: 'power3.out' })
    gsap.to(mesh.rotation, { x: Math.random()*Math.PI, z: Math.random()*Math.PI,
      duration: 1.2, ease: 'power3.out' })
  })
}
```
Réf. : tutoriel **Wawa Sensei** (Blender Cell Fracture + Three.js).

---

## 3. Portail / porte vers un autre monde

L'effet « TikTok porte → galaxie » : regarder à travers une forme (cercle, rectangle, arche) et voir une scène complètement différente.

### Approche stencil mask (Three.js natif, recommandée)
```js
// 1. Rendu de la scène B (l'autre monde) dans un renderTarget
const rtB = useFBO()                   // drei useFBO
useFrame(({ gl, scene, camera }) => {
  gl.setRenderTarget(rtB)
  gl.render(worldB, camera)             // rendre l'autre scène
  gl.setRenderTarget(null)
})

// 2. La forme du portail (cercle/arche) écrit dans le stencil buffer
<mesh renderOrder={1}>
  <circleGeometry args={[1.2, 64]} />
  <meshBasicMaterial
    colorWrite={false} depthWrite={false}
    stencilWrite={true} stencilFunc={THREE.AlwaysStencilFunc}
    stencilZPass={THREE.ReplaceStencilOp} stencilRef={1}
  />
</mesh>

// 3. Le plan "fenêtre" ne se dessine que là où stencil = 1
<mesh renderOrder={2}>
  <planeGeometry args={[3, 3]} />
  <meshBasicMaterial
    map={rtB.texture}
    stencilWrite={false}
    stencilFunc={THREE.EqualStencilFunc} stencilRef={1}
  />
</mesh>
```

### Approche MeshTransmissionMaterial (verre + distorsion)
```js
import { MeshTransmissionMaterial } from '@react-three/drei'
// Pour un effet verre/cristal sur la porte
<mesh>
  <torusGeometry args={[1, 0.05, 16, 100]} />  // le cadre
  <MeshTransmissionMaterial
    transmission={1} roughness={0} thickness={0.5}
    chromaticAberration={0.1} distortionScale={0.3}
    temporalDistortion={0.1}
  />
</mesh>
```
Combiner les deux : stencil pour la fenêtre, `MeshTransmissionMaterial` pour le cadre verre du portail.
Réf. : **Codrops « 3D Glass Portal »** (Tympanus).

---

## 4. Navigation cinématique par scroll — étages / salles

Une caméra avec **1 keyframe par section**. Le scroll scrub la timeline : l'utilisateur *avance dans le monde* comme au cinéma.

```js
// Composant Camera pilotée au scroll (Lenis + GSAP ScrollTrigger)
const cameraPositions = [
  { pos: [0, 2, 10], target: [0, 0, 0] },   // Hall d'entrée
  { pos: [5, 4, 2],  target: [5, 2, 0] },   // Salle 1 (slide A)
  { pos: [-3, 6, -4], target: [-3, 4, -6] }, // Salle 2 (slide B)
  { pos: [0, 10, 0], target: [0, 8, -10] },  // Toit / climax
]

useEffect(() => {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: '#scroll-container', scrub: 1.5,
      start: 'top top', end: 'bottom bottom' }
  })
  cameraPositions.forEach((kf, i) => {
    tl.to(camera.position, { ...kf.pos.reduce((a,v,j)=>({...a,[['x','y','z'][j]]:v}),{}),
      ease: 'none' }, i / (cameraPositions.length - 1))
  })
}, [])
```

### Intégrer les slides de soutenance
**Option A — drei `<Html>`** (overlay DOM dans la scène 3D) :
```jsx
<Html position={[5, 2, -2]} transform occlude distanceFactor={1.5}>
  <div className="slide-panel">
    <h2>Architecture du projet</h2>
    <img src="/slides/slide-02.png" />
  </div>
</Html>
```
**Option B — PlaneGeometry + texture** (rendu 3D natif, plus immersif) :
```js
const tex = useTexture('/slides/slide-02.png')
<mesh position={[5, 2, -2]} rotation={[0, -0.3, 0]}>
  <planeGeometry args={[3.2, 1.8]} />
  <meshBasicMaterial map={tex} />
</mesh>
```
→ Option B recommandée pour l'effet "tableau dans une salle".

Réf. : **Codrops « Cinematic 3D Scroll with GSAP »**, `cinematic-scroll` skill.

---

## 5. Configurateur 3D (ouvrir une porte, allumer un phare)

```js
import { useSpring, animated } from '@react-spring/three'

function CarDoor({ open }) {
  const { rotation } = useSpring({
    rotation: open ? [0, -1.2, 0] : [0, 0, 0],
    config: { mass: 1.5, tension: 120, friction: 18 }
  })
  return (
    <animated.mesh rotation={rotation}>
      <primitive object={nodes.DoorLeft} />
    </animated.mesh>
  )
}
```
Réf. : démo GitHub **`adityakumar48/carshow`**.

---

## Checklist avant démo/soutenance
- [ ] Tester sur mobile (réduire post-FX, `dpr={[1,1.5]}`)
- [ ] `frameloop="demand"` + `invalidate()` sur les sections statiques
- [ ] Slides : vérifier lisibilité (contraste, taille fonte ≥ 20px en Html overlay)
- [ ] Portail : tester le renderTarget sur Safari (WebGL2 required)
- [ ] Fracture / explosion : limiter à ~80 fragments sur mobile

> Skills sœurs : `cinematic-scroll` (Lenis + ScrollTrigger setup), `web3d-threejs` (perf, CSP, pipeline R3F), `glsl-shaders` (effet portail custom), `gaussian-splatting-web` (scène "autre monde" en splat), `blender-mcp-pipeline` (préparer les pièces éclatées dans Blender).
