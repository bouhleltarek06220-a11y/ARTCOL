# Lost Chapter — Expérience 3D de soutenance · Proposition structure & stack

> Statut : **proposition à valider** (Étape 0). Le dossier est volontairement vide
> tant que tu n'as pas donné ton **OK** pour le scaffold (Étape 1).
> Univers : médiéval / dark fantasy. Effet signature : **armure de chevalier**
> qui se décompose / recompose au mouvement de souris (exploded view).

---

## 0. Constat repo (avant de coder)

- **Mono-dépôt multi-projets** : `src/` = ARTCOL (Vite + React 19 + Firebase + React Router 7),
  `amavya/` (Next.js), `mon-monde/`, `playazur-crm/`, et déjà un **`lostchapter-site/`** statique
  (HTML + assets dark fantasy : `hero-bg.webp`, `ambience.mp3`, `teaser-bg.mp4`…).
- ⚠️ **`RAPPORT-3D.md` et `CATALOGUE-SKILLS-Xiaomi.md` n'existent pas** dans le repo. Le prompt
  demandait de « lire d'abord » ces fichiers : impossible. → cf. §7 (point de décision).
- ⚠️ **Skills `web3d-threejs`, `web3d-effects-cookbook`, `cinematic-scroll`, `claude-3d-setup`,
  `artcol-design-system`, `motion-design`, `visual-qa` non chargés** dans cet environnement.
  Je m'appuie sur l'équivalent côté connaissances (R3F / drei / postprocessing / GSAP / Lenis).
- ⚠️ **Pas de MCP Meshy/Tripo ni Blender** ici → la génération du GLB et le découpage en pièces
  se font **hors-plateforme** (toi sur Meshy, puis dépôt du `.glb`). cf. §4.
- ✅ La **palette Lost Chapter** existe déjà dans le repo → réutilisée telle quelle (§6).

---

## 1. Stack proposé

| Domaine | Choix | Pourquoi |
|---|---|---|
| Build / framework | **Vite + React 19** *(recommandé)* — alt. Next.js via `pmndrs/react-three-next` | Vite = aligné sur la tooling ARTCOL existante, HMR rapide, déploiement Vercel trivial. SSR inutile pour une expérience scroll mono-page. cf. §7-Q1 |
| Moteur 3D | `three` + `@react-three/fiber` | Cœur R3F |
| Helpers | `@react-three/drei` | `<Environment>`, `useGLTF`, `<Html>`, `MeshTransmissionMaterial`, `Loader`, `AdaptiveDpr` |
| Post-processing | `@react-three/postprocessing` | Bloom, SSAO/N8AO, Vignette, ToneMapping → photoréalisme / torches |
| Scroll & anim | `gsap` + `ScrollTrigger` + `lenis` | Caméra pilotée au scroll, smooth scroll cinématique |
| Séquence complexe (option) | `theatre.js` (`@theatre/core` + `@theatre/studio`) | Seulement si la séquence caméra devient trop riche pour ScrollTrigger seul |
| Matériaux / ambiance | HDRI sombre via `<Environment>`, PBR, `MeshTransmissionMaterial` (portail) | Ambiance torches / château |
| Pipeline assets | `@gltf-transform/cli` + `npx gltfjsx model.glb -t -T` | Compression Draco/Meshopt + composant JSX typé |
| Debug perf (dev only) | `r3f-perf`, `leva` | Profiling FPS / tweak runtime, retirés du build prod |
| Déploiement | **Vercel** | cf. §8 (note mono-dépôt) |

---

## 2. Arborescence proposée (`lostchapter-3d/`)

```
lostchapter-3d/
├── public/
│   ├── models/            # GLB < 5 Mo (armure découpée, props). > 5 Mo → CDN (cf. §8)
│   ├── hdri/              # .hdr/.exr environnement sombre (torches)
│   ├── slides/            # images/textures des slides de soutenance
│   └── draco/             # décodeur draco (si compression Draco)
├── src/
│   ├── main.jsx
│   ├── App.jsx                     # layout DOM + <Canvas> + <Loader>
│   ├── styles.css
│   ├── canvas/
│   │   ├── Experience.jsx          # racine de la scène (scene graph)
│   │   ├── Lighting.jsx            # HDRI <Environment> + lumières torches
│   │   ├── PostFX.jsx              # <EffectComposer> (Bloom / SSAO / Vignette)
│   │   └── CameraRig.jsx           # caméra pilotée au scroll (étage → étage)
│   ├── components/
│   │   ├── armor/
│   │   │   ├── Armor.jsx           # généré par gltfjsx (pièces nommées)
│   │   │   └── ExplodedArmor.jsx   # logique exploded-view (souris) — EFFET SIGNATURE
│   │   ├── world/
│   │   │   ├── Rooms.jsx           # étages / salles navigables (sous-sol, RDC)
│   │   │   ├── Door.jsx            # porte de château / grimoire
│   │   │   └── Portal.jsx          # portail MeshTransmissionMaterial → autre monde
│   │   └── slides/
│   │       └── SlideBoard.jsx      # slides intégrées dans les salles (<Html> ou plane)
│   ├── hooks/
│   │   ├── useScrollCamera.js
│   │   └── usePointer.js           # pointeur normalisé pour l'exploded view
│   ├── scroll/
│   │   ├── lenis.js                # init smooth scroll
│   │   └── timeline.js             # setup GSAP ScrollTrigger
│   ├── config/
│   │   ├── rooms.js                # data : salles, positions, slides associées
│   │   └── theme.js                # tokens palette Lost Chapter (§6)
│   └── utils/
│       └── perf.js                 # helpers perf (dpr cap, preload)
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
└── README.md
```

> Mappe 1:1 vers `pmndrs/react-three-next` si on bascule sur Next (§7-Q1) :
> `src/canvas/*` → `src/components/canvas/*`, `App.jsx` → `pages/index.jsx`.

---

## 3. Plan en 6 étapes (gates « OK » à chaque fin)

Pour chaque étape : **j'annonce les outils utilisés et pourquoi avant de coder**, et **je
ne passe JAMAIS à la suivante sans ton OK**.

| # | Étape | Outils clés | Livrable |
|---|---|---|---|
| 1 | **Scaffold** | Vite+R3F (ou react-three-next), drei | Build local OK, `<Canvas>` vide qui tourne |
| 2 | **Effet signature** | `useGLTF`, `usePointer`, lerp dans `useFrame` | Armure éclatée/recomposée à la souris |
| 3 | **Monde navigable** | GSAP ScrollTrigger + Lenis, `CameraRig` | Salles = étages, caméra pilotée au scroll |
| 4 | **Porte / portail + slides** | `MeshTransmissionMaterial`, drei `<Html>` | Porte→portail + slides dans les salles |
| 5 | **Photoréalisme** | `<Environment>` HDRI, PBR, postprocessing | Bloom/SSAO, ambiance torches |
| 6 | **Déploiement** | gltfjsx/gltf-transform, Vercel | Live + assets compressés |

---

## 4. Pipeline assets (armure générée par IA)

1. **Génère sur Meshy** (toi) → GLB + PBR. Prompt armure (déjà fourni) :
   > *A detailed medieval knight full plate armor, standing empty (no body inside), ornate gothic
   > style, weathered steel with brass trim, battle-worn, PBR textures, game-ready, neutral pose,
   > full body: helmet, breastplate, pauldrons, gauntlets, greaves, sabatons clearly separated.*
2. **Découpe en pièces dans Blender** (heaume, plastron, pauldrons, gantelets, jambières, sabatons),
   **origine de chaque pièce sur son centre de masse** (indispensable pour l'exploded view propre).
3. **Compresse** : `npx gltfjsx armor.glb -t -T` → composant `Armor.jsx` + GLB Draco/Meshopt.
4. **Dépose** : `< 5 Mo` → `public/models/` ; `> 5 Mo` → **CDN** (pas le repo).

> Quand un modèle manque, je te fournis un **prompt Meshy** avant de coder (props médiévaux :
> torches, table, grimoire, porte de château…).
> **Bonus dispo ici** : un MCP de génération **image/vidéo** — utilisable pour fonds de slides,
> textures d'appoint, ou un **teaser** d'intro (pas de génération de mesh 3D / GLB cependant).

---

## 5. Règles de perf (non négociables)

- ❌ **Jamais de `setState` dans `useFrame`** → mutation directe de refs + `lerp`.
- 📉 **`devicePixelRatio` plafonné** (`dpr={[1, 2]}` + `AdaptiveDpr`).
- ⏳ **`<Suspense>` + `useGLTF.preload`**, lazy-load des modèles lourds.
- ☁️ **GLB > 5 Mo servis depuis un CDN**, pas le repo.
- 🧹 `r3f-perf` / `leva` **dev only**, exclus du build prod.

---

## 6. Thème — palette Lost Chapter (déjà dans le repo, réutilisée)

```js
// src/config/theme.js
export const lostChapter = {
  brown:      '#1A0F08', // fond profond (background scène / fog)
  brown2:     '#241509',
  brown3:     '#3D2418',
  gold:       '#C99B5C', // accent principal (métal/brass de l'armure)
  goldBright: '#E5C788', // highlights / bloom torches
  goldDeep:   '#A07840',
  cream:      '#F2E6D0', // texte slides
  ember:      '#D96A4E', // braise / lumière de torche (danger d'origine)
  // accents portails déjà présents sur lostchapter-site :
  portal: { communes:'#9BD17A', sponsors:'#E5C788', createurs:'#C997FF', public:'#FFC857' },
}
```

> Cohérence bonus : les **portails colorés** existent déjà sur `lostchapter-site`
> → on peut réutiliser ce code couleur pour le portail « autre monde ».

---

## 7. Points de décision (j'attends ta réponse)

- **Q1 — Scaffold** : **Vite + R3F** (recommandé, aligné repo) **vs** Next.js
  (`pmndrs/react-three-next`, comme écrit littéralement dans ton prompt) ?
- **Q2 — `RAPPORT-3D.md`** : je le **crée** (référence canonique outils/pipelines) /
  tu me le **fournis** / on **s'en passe** ?
- **Q3 — Nom du dossier** : `lostchapter-3d/` (aligné sur `lostchapter-site/`). OK ou autre ?

---

## 8. Note déploiement (mono-dépôt)

Le `vercel.json` racine pointe `outputDirectory: playazur-crm`. La nouvelle app aura besoin
de **son propre projet Vercel** (root directory = `lostchapter-3d/`) **ou** d'un `vercel.json`
dédié dans le sous-dossier. À cadrer à l'Étape 6 — aucune incidence avant.
