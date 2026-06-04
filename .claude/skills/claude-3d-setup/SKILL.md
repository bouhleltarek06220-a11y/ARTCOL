---
name: claude-3d-setup
description: "Checklist 'Étape 0' pour équiper un projet web 3D avec Claude Code : installer les skills 3D communautaires (emalorenzo/three-agent-skills avec 70+ règles R3F, CloudAI-X/threejs-skills, freshtechbro/claudedesignskills), brancher les MCP Blender (uvx blender-mcp) et Meshy (npx add-mcp @meshy-ai/meshy-mcp-server), cloner le starter pmndrs/react-three-next, écrire un CLAUDE.md décrivant le stack et les règles de performance 3D (cap devicePixelRatio, jamais de setState dans useFrame, instancing, frameloop demand). Utiliser pour : démarrer un projet 3D web avec Claude Code, configurer les outils IA 3D dès le début, rédiger le CLAUDE.md d'un projet R3F, brancher BlenderMCP pour piloter Blender depuis Claude, intégrer Meshy pour la génération 3D. Mots-clés : claude code, setup 3D, CLAUDE.md, skills communautaires, three-agent-skills, BlenderMCP, Meshy MCP, react-three-next, R3F, drei, performance rules, useFrame, setState, devicePixelRatio, frameloop, instancing, démarrage projet 3D."
---

# Setup Claude Code pour un projet 3D web — Étape 0

Avant d'écrire la première ligne de code, **armer Claude Code** avec les bons skills, MCP et règles de projet. Ce setup prend 15 minutes et évite des heures de debug + de mauvaises habitudes de performance.

## Quand l'activer
Démarrer un projet 3D web (R3F, three.js, Lost Chapter, soutenance 3D), configurer Claude Code pour qu'il connaisse les règles R3F, brancher Blender/Meshy en MCP.

---

## 1. Skills communautaires 3D

Les skills étendent la connaissance de Claude Code sur le domaine. À installer via `npx skills add`.

### emalorenzo/three-agent-skills (le plus important)
```bash
npx skills add emalorenzo/three-agent-skills
```
Contient **70+ règles R3F/drei** (best practices, anti-patterns, perf). Claude les activera automatiquement sur les fichiers `.tsx`/`.jsx` contenant du R3F. Inclut notamment :
- Ne jamais appeler `setState` dans `useFrame` (cause un re-render par frame)
- Toujours `dispose()` les géométries/matériaux/textures au unmount
- `frameloop="demand"` + `invalidate()` pour les scènes statiques
- `dpr={[1, 2]}` (cap devicePixelRatio) — jamais `dpr={window.devicePixelRatio}` (crash sur Retina 3x)
- Préférer `InstancedMesh` / drei `<Instances>` aux objets répétés
- `useGLTF.preload()` en dehors des composants

### CloudAI-X/threejs-skills
```bash
npx skills add CloudAI-X/threejs-skills
```
Règles vanilla three.js + patterns de performance GPU.

### freshtechbro/claudedesignskills
```bash
npx skills add freshtechbro/claudedesignskills
```
Design system, UI/UX, Tailwind, cohérence visuelle — utile pour les overlays/HUD 3D.

---

## 2. MCP Blender — BlenderMCP

Permet de **piloter Blender depuis Claude** : créer/modifier des scènes, exporter des GLB, préparer les loose parts, lancer Cell Fracture.

### Installation (une fois)
```bash
uvx blender-mcp
# ou via pip si uvx absent :
pip install blender-mcp && blender-mcp
```

### Ajouter dans Claude Code
```bash
claude mcp add blender-mcp -- uvx blender-mcp
```
Ou manuellement dans `.claude/settings.json` :
```json
{
  "mcpServers": {
    "blender": {
      "command": "uvx",
      "args": ["blender-mcp"]
    }
  }
}
```

### Activer le plugin Blender
Dans Blender : **Edit → Preferences → Add-ons → rechercher "BlenderMCP"** → activer. Lance un serveur WebSocket local sur le port 8765. Claude peut alors :
- Créer/modifier des objets, matériaux, armatures
- Déclencher **Separate by Loose Parts** et **Cell Fracture** (pour `web3d-effects-cookbook`)
- Exporter en GLB avec les settings corrects
- Inspecter la scène, lire les dimensions/UVs

---

## 3. MCP Meshy — génération 3D par IA

Meshy génère des assets 3D (text-to-3D, image-to-3D) avec output GLB/FBX + textures PBR.

### Installation
```bash
npx add-mcp @meshy-ai/meshy-mcp-server --env MESHY_API_KEY=<votre_clé>
```
Ou dans `.claude/settings.json` :
```json
{
  "mcpServers": {
    "meshy": {
      "command": "npx",
      "args": ["-y", "@meshy-ai/meshy-mcp-server"],
      "env": { "MESHY_API_KEY": "<votre_clé>" }
    }
  }
}
```
Obtenir la clé : **app.meshy.ai → API Keys**.

---

## 4. Starter recommandé

```bash
npx create-next-app --example https://github.com/pmndrs/react-three-next my-3d-project
cd my-3d-project
npm install
```
**react-three-next** (pmndrs) embarque : Next.js App Router, R3F, drei, @react-three/postprocessing, Leva (panel debug), TypeScript.
Ajouter ensuite :
```bash
npm install gsap @studio-freight/lenis react-spring @react-spring/three
npm install -D @types/three
```

---

## 5. Écrire le CLAUDE.md du projet

Le `CLAUDE.md` à la racine du projet est **lu par Claude Code à chaque session**. Il doit décrire le stack exact et les règles non-négociables.

Template pour un projet R3F + Lost Chapter / soutenance 3D :
```markdown
# Stack
- React 18 + Next.js 14 App Router
- React Three Fiber 8 + drei 9 + three.js r171
- GSAP 3 + @studio-freight/lenis (scroll)
- react-spring / @react-spring/three (animations UI)
- Tailwind CSS (UI overlays)
- Déploiement : Vercel (Edge Network)

# Assets 3D
- Format : GLB uniquement (optimisé Draco ou meshopt + KTX2)
- Décodeurs self-hosted : /public/draco/ et /public/basis/
- Environnements : .hdr max 2k (pas d'EXR > 5 Mo)

# Règles de performance (IMPÉRATIVES)
- JAMAIS de setState / useState update dans useFrame → utiliser useRef ou Zustand
- TOUJOURS cap devicePixelRatio : dpr={[1, 2]} — jamais window.devicePixelRatio nu
- frameloop="demand" + invalidate() sur les sections sans animation continue
- InstancedMesh / drei <Instances> pour tout objet répété (colonnes, tuiles, arbres)
- dispose() géométries/matériaux/textures au unmount (useEffect cleanup)
- Lumières : max 1 shadow-casting light, IBL (env map) pour le reste
- Post-FX : Bloom léger + DoF optionnel — pas de SSAO sur mobile

# Accessibilité
- prefers-reduced-motion → couper parallax et auto-animations
- Fallback image/vidéo si WebGL absent

# CSP (routes /experience-*)
- script-src: 'wasm-unsafe-eval'
- worker-src: blob:
- (voir web3d-threejs skill pour le détail complet)
```

---

## 6. Checklist complète "Étape 0"

```
[ ] npx skills add emalorenzo/three-agent-skills
[ ] npx skills add CloudAI-X/threejs-skills
[ ] npx skills add freshtechbro/claudedesignskills
[ ] BlenderMCP installé + plugin Blender activé (port 8765)
[ ] Meshy MCP configuré (MESHY_API_KEY dans .env.local + settings.json)
[ ] Starter react-three-next cloné ou projet Next.js configuré
[ ] CLAUDE.md écrit à la racine (stack + règles perf + CSP)
[ ] .claude/settings.json committé (MCP servers, permissions)
[ ] /public/draco/ et /public/basis/ présents (décodeurs self-hosted)
[ ] r3f-perf installé (<Perf /> en dev uniquement)
[ ] Leva installé pour les panels debug de scene
```

---

## Do / Don't

**DO** — Écrire le CLAUDE.md avant de coder : Claude Code s'y réfère à chaque prompt.
**DO** — Self-host les décodeurs Draco/Basis dès le départ : gstatic.com = dépendance externe fragile.
**DO** — Versionner `.claude/settings.json` (sans les secrets) pour que l'équipe partage les MCP.
**DON'T** — Mettre la clé Meshy dans settings.json versionné : utiliser `.env.local` + `env` dans le MCP config.
**DON'T** — Installer des skills inutilisés : chaque skill alourdit le contexte injecté dans Claude.
**DON'T** — Oublier le `await renderer.init()` si tu migres vers WebGPU (voir `webgpu-tsl`).

---

## Vérifier que tout fonctionne
```bash
# Test BlenderMCP (Blender doit être ouvert avec le plugin activé)
# Dans Claude Code : "liste les objets dans la scène Blender courante"

# Test Meshy MCP
# Dans Claude Code : "génère un modèle 3D d'une lanterne médiévale avec Meshy"

# Test skills 3D
# Dans Claude Code : "applique les best practices R3F à ce composant"
```

> Skills sœurs : `web3d-threejs` (stack complet R3F + CSP + perf), `blender-mcp-pipeline` (workflow Blender → GLB piloté par Claude), `ai-3d-generation` (Meshy, Tripo, génération d'assets 3D).
