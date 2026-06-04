# RAPPORT-3D — Référence technique (Lost Chapter, expérience 3D de soutenance)

> Référence canonique des **outils, librairies et pipelines** du projet 3D.
> Chaque étape du plan s'y réfère (« quels outils du RAPPORT-3D.md et pourquoi »).
> App : `lostchapter-3d/` · Univers médiéval / dark fantasy.

---

## 1. Stack retenue

| Domaine | Librairie | Rôle | Choisi à l'étape |
|---|---|---|---|
| Build | **Vite** + `@vitejs/plugin-react` | Bundler, HMR, build prod | 1 |
| UI | **React 19** | Composants, état | 1 |
| Renderer 3D | **`@react-three/fiber`** (R3F) | three.js déclaratif en React | 1 |
| Moteur | **`three`** | Cœur WebGL | 1 |
| Helpers | **`@react-three/drei`** | `useGLTF`, `<Environment>`, `<Html>`, `MeshTransmissionMaterial`, `<Loader>`, `AdaptiveDpr`, `OrbitControls` | 1→ |
| Post-FX | **`@react-three/postprocessing`** | Bloom, SSAO/N8AO, Vignette, ToneMapping | 5 |
| Scroll/anim | **`gsap`** + `ScrollTrigger` + **`lenis`** | Caméra pilotée au scroll, smooth scroll | 3 |
| Séquence (option) | **`theatre.js`** | Si la séquence caméra dépasse ScrollTrigger | 3+ |
| Compression GLB | **`@gltf-transform/cli`**, `gltfjsx` | Draco/Meshopt + composant JSX typé | 6 |
| Debug (dev) | **`r3f-perf`**, `leva` | FPS / tweak runtime — exclus du build prod | dev |

---

## 2. Pipeline assets (armure & props générés par IA)

```
Meshy (GLB + PBR)  ->  Blender (découpe en pièces, origines = centre de masse)
   ->  npx gltfjsx model.glb -t -T  (Draco/Meshopt + Model.jsx)
   ->  public/models/ (< 5 Mo)  |  CDN (> 5 Mo)
```

- **Génération** : Meshy/Tripo (hors plateforme). Prompt armure de référence :
  *medieval knight full plate armor, standing empty, gothic, weathered steel + brass,
  PBR, game-ready — helmet, breastplate, pauldrons, gauntlets, greaves, sabatons separated.*
- **Découpe Blender** : chaque pièce = mesh nommé, **origine sur son centre de masse**
  (condition d'un exploded view propre : la pièce s'écarte le long de sa normale).
- **Compression** : `npx gltfjsx armor.glb -t -T` → `Armor.jsx` (nœuds typés) + `.glb` compressé.
- **Hébergement** : `< 5 Mo` dans `public/models/` ; `> 5 Mo` sur CDN (jamais dans le repo git).

---

## 3. Recettes d'effets

### 3.1 Exploded view (armure — effet signature, étape 2)
- Chaque pièce a une position de repos `rest` et une direction d'éclatement `dir` (normale/centre de masse).
- Au pointeur : cible `target = rest + dir * amount(pointer)`.
- Dans `useFrame` : `mesh.position.lerp(target, k)` — **mutation directe du ref, aucun `setState`**.

### 3.2 Portail (étape 4)
- `MeshTransmissionMaterial` (drei) sur le plan/cadre du portail : transmission, roughness,
  thickness, chromaticAberration → effet « fenêtre vers un autre monde ».
- Option avancée : rendu d'une seconde scène dans une render target (portail-monde).

### 3.3 Caméra au scroll (étape 3)
- `lenis` pour le smooth scroll ; `ScrollTrigger` mappe `progress (0→1)` → keyframes caméra.
- Mise à jour caméra dans `useFrame` (lerp position/lookAt), jamais via state React.

### 3.4 Photoréalisme (étape 5)
- `<Environment>` HDRI sombre (torches) pour l'éclairage PBR diffus/spéculaire.
- `<EffectComposer>` : `Bloom` (halos de torches), `N8AO`/`SSAO` (contact), `Vignette`, `ToneMapping` ACES.
- Lumières ponctuelles « torches » animées (flicker via `useFrame`, sans state).

---

## 4. Règles de performance (non négociables)

1. **Jamais de `setState` dans `useFrame`** → mutation de refs + `lerp`.
2. **`dpr` plafonné** : `<Canvas dpr={[1, 2]}>` + `AdaptiveDpr`.
3. **`<Suspense>` + `useGLTF.preload(url)`** ; lazy-load des modèles lourds.
4. **GLB > 5 Mo → CDN**, pas le repo.
5. **`r3f-perf` / `leva` en dev uniquement**, retirés du build prod.
6. **Instancing** pour les éléments répétés (torches, pierres) ; `frustumCulled` par défaut.

---

## 5. Arborescence (`lostchapter-3d/`)

```
public/{models,hdri,slides,draco}
src/
  main.jsx · App.jsx · styles.css
  canvas/      Experience · Lighting · PostFX · CameraRig
  components/  armor/{Armor,ExplodedArmor} · world/{Rooms,Door,Portal} · slides/SlideBoard
  hooks/       useScrollCamera · usePointer
  scroll/      lenis · timeline
  config/      rooms · theme (palette Lost Chapter)
  utils/       perf
```

---

## 6. Plan en 6 étapes (gates « OK »)

| # | Étape | Outils (de ce rapport) |
|---|---|---|
| 1 | Scaffold, build local OK | Vite, R3F, drei |
| 2 | Armure exploded view (souris) | `useGLTF`, `usePointer`, `useFrame`+lerp (§3.1) |
| 3 | Monde navigable au scroll | `gsap`/`ScrollTrigger`, `lenis`, `CameraRig` (§3.3) |
| 4 | Porte/portail + slides | `MeshTransmissionMaterial`, drei `<Html>` (§3.2) |
| 5 | Photoréalisme | `<Environment>` HDRI, `@react-three/postprocessing` (§3.4) |
| 6 | Déploiement Vercel | gltfjsx/gltf-transform, Vercel (§2) |

---

## 7. Palette Lost Chapter (réutilisée du repo)

`#1A0F08` brun-noir (fond) · `#241509` · `#3D2418` · `#C99B5C`/`#E5C788`/`#A07840` ors ·
`#F2E6D0` crème (texte) · `#D96A4E` braise (torche) · portails `#9BD17A` `#E5C788` `#C997FF` `#FFC857`.

---

## 8. Déploiement

Mono-dépôt : le `vercel.json` racine pointe `playazur-crm`. L'app 3D aura **son propre projet Vercel**
(root = `lostchapter-3d/`) ou un `vercel.json` dédié. Build : `npm run build` → `dist/`. (Étape 6.)
