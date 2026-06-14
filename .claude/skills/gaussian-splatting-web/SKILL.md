---
name: gaussian-splatting-web
description: "Capturer, nettoyer et afficher des lieux réels en photoréalisme via Gaussian Splatting (3DGS) sur le web : capture avec Luma AI ou Polycam (iOS/Android), export .ply/.splat, nettoyage dans SuperSplat (superspl.at, crop, floaters, compression), affichage en R3F avec drei Splat ou GaussianSplats3D, effet portail avec MeshTransmissionMaterial + stencil mask, intégration Spark (World Labs) ; limites connues (ombres dynamiques, transparence, poids fichiers, support mobile). Utiliser pour : numériser un lieu réel (cave, château, studio) pour une scène immersive, créer un portail Gaussian Splat dans une scène R3F (type Lost Chapter), obtenir un arrière-plan photoréaliste sans modélisation. Mots-clés : gaussian splatting, 3DGS, splat, nerf, luma AI, polycam, supersplat, PlayCanvas, GaussianSplats3D, drei splat, R3F, portail 3D, stencil, MeshTransmissionMaterial, photoréalisme, scan 3D, ply, splat file, world labs, spark."
---

# Gaussian Splatting web — lieux réels en photoréalisme

Le Gaussian Splatting (3DGS) permet de numériser un lieu réel en quelques minutes et de l'afficher en temps réel dans une scène web. Résultat : un photoréalisme impossible à atteindre avec des assets modélisés, à un coût de capture quasi nul.

## Quand l'activer
- Numériser un lieu physique (cave, château, studio, galerie) pour une expérience immersive.
- Créer un **effet portail** où l'utilisateur regarde à travers un cadre dans un espace réel.
- Utiliser un environnement photoréaliste comme décor d'une scène R3F (fond de Lost Chapter).
- Explorer l'intégration Spark (World Labs) pour des scènes spatiales interactives.

---

## Pipeline complet

### 1. Capture — iOS/Android

**Luma AI** (recommandé pour débutants) :
- App iOS/Android gratuite.
- Marcher autour du sujet en spirale : bas → milieu → haut.
- 100–300 photos suffisent pour une pièce.
- Processing cloud (~10–20 min) → exporter en **.splat** ou **.ply**.
- Luma AI propose aussi une API pour l'automatisation.

**Polycam** (meilleur contrôle) :
- Mode Gaussian Splat dédié depuis la version 5.x.
- Export **.ply** (plus universel, plus lourd) ou **.splat** (compressé, plus rapide à charger).
- Polycam LiDAR (iPhone Pro) : ajoute un mesh de profondeur pour les collisions.

**Conseils de capture :**
- Éclairage **uniforme et stable** (pas de soleil direct changeant, pas de néons clignotants).
- Éviter les surfaces très réfléchissantes (miroirs → artefacts).
- Capturer les zones de transition (portes, rebords) avec des passes dédiées.
- Min. 60 photos par face pour une qualité acceptable.

---

### 2. Nettoyage — SuperSplat

**[superspl.at](https://superspl.at)** — outil gratuit en ligne par PlayCanvas.

Interface : vue 3D interactive + panneau de sélection/suppression de gaussiennes.

Opérations essentielles :
```
1. Ouvrir le .ply ou .splat
2. Crop (boîte de découpe) : éliminer le hors-champ, le plafond non voulu, le sol instable
3. Select by opacity < 0.1 → Delete (supprime les "floaters" fantômes)
4. Select outliers (gaussiennes isolées loin du centre) → Delete
5. File → Export → .splat (compressé, ~3–8x plus léger que .ply)
```

**Objectif poids :** viser **< 5–10 Mo** après crop+compression pour un usage web. Un splat de pièce entière non nettoyé peut atteindre 200 Mo+.

Commande CLI alternative (si vous avez un .ply large à compresser) :
```bash
# gsplat-tools (npm)
npx gsplat-tools convert input.ply output.splat --compress
```

---

### 3. Affichage en R3F

#### Option A — drei `<Splat>` (le plus simple)
```tsx
import { Splat } from '@react-three/drei'

function Scene() {
  return (
    <Splat
      src="/assets/dungeon.splat"
      position={[0, 0, -5]}
      scale={1}
      alphaTest={0.1}        // coupe les gaussiennes trop transparentes
      chunkSize={25000}      // streaming progressif
    />
  )
}
```
Requiert drei >= 9.100. Le composant gère le streaming et le tri automatique.

#### Option B — GaussianSplats3D (plus de contrôle)
```bash
npm install @mkkellogg/gaussian-splats-3d
```
```tsx
import { Viewer } from '@mkkellogg/gaussian-splats-3d'
// Compatible three.js vanilla et R3F via useEffect
```
Avantages : tri asynchrone worker, support KSPLAT (format haute performance), anti-pop dynamique.

#### Option C — Spark (World Labs)
API web pour scènes spatiales génératives. Encore en accès limité (2026) — voir [worldlabs.ai](https://worldlabs.ai).

---

### 4. Effet Portail — technique Codrops

Un portail montre la scène Gaussian Splat **à travers un cadre** (arcane, miroir, déchirure spatiale) en utilisant le **stencil buffer**.

```tsx
import { MeshTransmissionMaterial } from '@react-three/drei'

function Portal() {
  return (
    <>
      {/* 1. Masque stencil : la forme du portail */}
      <mesh renderOrder={1}>
        <circleGeometry args={[2, 64]} />
        <meshBasicMaterial
          colorWrite={false}
          stencilWrite={true}
          stencilRef={1}
          stencilFunc={THREE.AlwaysStencilFunc}
          stencilZPass={THREE.ReplaceStencilOp}
        />
      </mesh>

      {/* 2. Le splat ne s'affiche que là où stencil === 1 */}
      <Splat
        src="/assets/cave.splat"
        renderOrder={2}
        // @ts-ignore — accès au material natif
        onUpdate={(self) => {
          self.material.stencilWrite = true
          self.material.stencilRef = 1
          self.material.stencilFunc = THREE.EqualStencilFunc
        }}
      />

      {/* 3. Cadre du portail (verre) par-dessus */}
      <mesh renderOrder={3}>
        <torusGeometry args={[2, 0.08, 16, 100]} />
        <MeshTransmissionMaterial
          backside thickness={0.3} roughness={0.05}
          transmission={0.95} ior={1.5}
          chromaticAberration={0.05}
        />
      </mesh>
    </>
  )
}
```

**Variante avec texture de masque** (forme irrégulière) : utiliser `alphaMap` sur un `PlaneGeometry` + stencil.

---

## Limites et contraintes — à connaître absolument

**Ce que le Gaussian Splatting ne fait PAS :**
- Les splats ne **reçoivent pas les ombres dynamiques** de la scène three.js (pas de shadow map).
- Les splats ne **projettent pas d'ombres** sur la géométrie.
- Mélange difficile avec la **géométrie transparente** (alpha sorting conflictuel).
- **Pas de collisions physiques** (pas de mesh → pas de raycasting natif).

**Performance :**
- Tri GPU des gaussiennes = coûteux. Limiter à **1 splat actif** par scène sur mobile.
- Sur mobile/intégré : tester sur iPhone 12+ / Android mid-range. Splat > 3M gaussiennes = lag.
- Utiliser `frameloop="demand"` en R3F quand la caméra est statique.

**Format :**
- `.splat` : compact, chargement rapide, moins de précision.
- `.ply` : universel, compatible avec tous les outils, très lourd.
- `.ksplat` (GaussianSplats3D) : meilleur compromis performance/qualité, format propriétaire.

**Droits :**
- Numériser des espaces publics ou privés → vérifier les droits à l'image et la propriété.
- Les captures de lieux contenant des personnes → flouter avant export (SuperSplat : select + delete gaussiennes).

---

## Checklist déploiement

```
[ ] Fichier .splat < 10 Mo (après crop SuperSplat)
[ ] MIME type configuré côté serveur : "model/splat" ou "application/octet-stream"
[ ] CORS headers si splat sur CDN différent du domaine
[ ] Test sur iOS Safari (WebGL2 requis, vérifié iPhone 12+)
[ ] frameloop="demand" si splat statique (économie GPU)
[ ] Preload avec <Suspense fallback={<Loader />}> en R3F
[ ] Vérifier absence de z-fighting avec le sol/decor de la scène
```

---

> Voir aussi : **`web3d-threejs`** (R3F, post-FX, IBL pour habiller la scène autour du splat), **`ai-visual-workflow`** (si le lieu n'existe pas encore : générer un fond via Skybox AI ou Higgsfield), **`glsl-shaders`** (effets custom sur le portail : distorsion, vignette, chromatic aberration).
