# TOOLS.md — Inventaire & veille des forks (mémoire entre sessions)

> **Compte GitHub** : `bouhleltarek06220-a11y`
> **Rejouer la veille** : dis « **vérifie mes forks** » → je relis ce fichier, je
> compare via MCP, je n'analyse que le **nouveau/modifié**, puis je mets à jour.
>
> ⚠️ Le connecteur MCP GitHub est **verrouillé sur `artcol`** : l'INVENTAIRE passe par
> `search_repositories` (global), l'ANALYSE lit les fichiers via **raw GitHub** (réseau).

**Dernière exécution** : 2026-06-19 · **19 forks suivis** (3 nouveaux ce run : `lamina`, `three-nebula`, `glTF-Sample-Models`).

## Cœur 3D
| Dépôt | Rôle | Dernier commit analysé | Comment l'utiliser |
|---|---|---|---|
| `three.js` | Moteur WebGL/WebGPU bas niveau | 2026-06-19 | `import * as THREE` — base de tout (Scene/Camera/Material/GLSL) |
| `react-three-fiber` | three.js en JSX React | 2026-06-19 | `<Canvas>`, `useFrame`, `useThree`. **v9↔React19, v8↔React18** |
| `drei` | Helpers R3F | 2026-06-19 | `KeyboardControls`, `PointerLockControls`, `useGLTF`, `Html`, `Instances`… |
| `react-three-next` | Starter Next+R3F | 2026-06-19 | ⚠️ Fork **v2 = R3F8/React18 (ancien)** : s'en inspirer, ne pas l'utiliser tel quel |
| `gltfjsx` | `.glb` → composant JSX | 2026-06-19 | `npx gltfjsx model.glb -t -T` (typé + animations + DRACO) |

## Immersion / Jeu
| Dépôt | Rôle | Dernier commit analysé | Comment l'utiliser |
|---|---|---|---|
| `react-three-rapier` | Physique (collisions, gravité) | 2026-06-19 | `<Physics>`, `<RigidBody>`, **CharacterController**, **sensors=triggers** |
| `react-spring` | Animations ressort | 2026-06-19 | `@react-spring/three` — transitions caméra/objets fluides |
| `zustand` | État global (hooks) | 2026-06-19 | `create((set)=>…)`. **refs=60fps, store=UI** |
| `racing-game` | Réf structure jouable | 2026-06-19 | Store unique + `/models /effects /ui`. ⚠️ physique **cannon→transposer rapier** |

## Effets sci-fi
| Dépôt | Rôle | Dernier commit analysé | Comment l'utiliser |
|---|---|---|---|
| `react-postprocessing` | Effets (Bloom, DOF, SSAO…) | 2026-06-19 | `<EffectComposer>` + effets. **v3↔R3F9** |
| `lamina` | Matériaux shaders par couches | 2026-06-19 | `LayerMaterial`+`Depth/Fresnel…`. ⚠️ **archivé** → préférer **CSM** |
| `three-nebula` | Moteur de **particules** 3D | 2026-06-19 | Systèmes de particules (étincelles, fumée). ⚠️ cible **three@0.122**, brancher avec soin |
| `3d-game-shaders-for-beginners` | Bible des shaders (théorie) | 2026-06-19 | Réf SSAO/DOF/normal maps/glow pour écrire & régler nos GLSL/post-fx |

## Ressources
| Dépôt | Rôle | Dernier commit analysé | Comment l'utiliser |
|---|---|---|---|
| `project_3D_developer_portfolio` | Portfolio 3D (JS Mastery) | 2026-06-19 | Réf patterns scène/sections/animation d'un site 3D |
| `glTF-Sample-Models` | Banque de modèles `.glb`/`.gltf` | 2026-06-19 | Source de modèles libres. ⚠️ **archivé** → suite = `glTF-Sample-Assets` |

## Design / Skills
| Dépôt | Rôle | Dernier commit analysé | Comment l'utiliser |
|---|---|---|---|
| `skills` | Agent Skills officiels (Anthropic) | 2026-06-19 | `docx`/`pdf`/`pptx`/`xlsx` + modèle pour créer nos skills |
| `awesome-design-skills` | 67 skills de design | 2026-06-19 | `npx typeui.sh pull <slug>` ou copier le `SKILL.md` |
| `awesome-design-md` | `DESIGN.md` de marques réelles | 2026-06-19 | « UI qui ressemble à X » → déposer le `DESIGN.md` |
| `open-design` | Workspace design agentique | 2026-06-19 | Référentiel 100+ skills / 150 `DESIGN.md` / 261 plugins |

---

## Projets (non-forks, pour info — pas des outils)
`ARTCOL`, `amavya-crm`, `machine-de-prospection`, `tarek-brain`, `tarek-planning`,
`tarek-shrine`, `mighty-charm-protocol`.

## Journal de veille
- **2026-06-19** — Init (16 forks) puis +3 (`lamina`, `three-nebula`, `glTF-Sample-Models`). Flags : lamina archivé, three-nebula three@0.122, glTF-Sample-Models archivé.
