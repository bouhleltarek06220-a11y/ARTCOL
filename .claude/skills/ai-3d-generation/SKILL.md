---
name: ai-3d-generation
description: "Générer des modèles 3D prêts pour le web via les outils IA (text-to-3D, image-to-3D, multi-image) : Meshy 6 (PBR natif, 500+ animations, API + MCP), Tripo (auto-rig rapide), Rodin/Hyper3D Gen-2 (qualité scan), Hunyuan3D 3.0 (open-source organique), TRELLIS 2 (fidélité visuelle max), Stable Fast 3D (sub-seconde) et Skybox AI pour HDRI 360° procéduraux ; pipeline de sortie vers GLB/R3F. Utiliser pour : bootstrapper un asset 3D en quelques minutes, générer des personnages/props pour une scène immersive (type Lost Chapter), obtenir un HDRI d'univers sci-fi/fantastique, préparer un GLB prêt pour gltfjsx + R3F. Mots-clés : text-to-3D, image-to-3D, meshy, tripo, rodin, hyper3D, trellis, hunyuan3D, stable fast 3D, 3d AI studio, skybox AI, blockade labs, HDRI, GLB, FBX, USDZ, PBR, auto-rig, génération 3D, IA 3D, asset 3D."
---

# Génération de modèles 3D par IA

Bootstrap un asset 3D en quelques minutes, puis **20 % de finition dans Blender**. La règle d'or : l'IA donne la forme et les UVs ; toi tu corriges la topologie, sépares les pièces et exportes en GLB propre.

## Quand l'activer
- Créer un prop/personnage/décor sans pipeline de modélisation manuelle.
- Besoin d'un HDRI procédural (skybox univers SF / fantastique) pour l'IBL de la scène.
- Prototyper rapidement un asset avant une commande à un artiste 3D.
- Générer un GLB à injecter dans un pipeline R3F (Lost Chapter, configurateur, hero 3D).

---

## Tableau comparatif des outils (2026)

| Outil | Vitesse | Point fort | Prix indicatif | Export |
|---|---|---|---|---|
| **Meshy 6** | ~30 s preview | PBR natif, 500+ anims, MCP | ~20 $/mo | GLB / FBX / OBJ / USDZ |
| **Tripo** | ~10–25 s | Auto-rig, jusqu'à 2M polys | ~12 $/mo | GLB / FBX |
| **Rodin / Hyper3D Gen-2** | ~60–90 s | Qualité « type scan », texture HD | ~99 $/mo ou ~0,50 $/modèle | GLB / OBJ |
| **Hunyuan3D 3.0** | variable | Open-source, organique/perso | gratuit (self-host) | GLB / OBJ |
| **TRELLIS 2** | ~60 s | Meilleure fidélité visuelle (Microsoft) | gratuit (open-source) | GLB / USDZ |
| **Stable Fast 3D** | < 1 s | Ultra-rapide, massing rapide | gratuit (HF) | OBJ (pas de PBR) |
| **3D AI Studio** | — | Agrégateur multi-modèles | freemium | selon modèle |

**Règle de choix :**
- Impression 3D ou rendu statique → **Meshy**
- Personnage riggé pour jeu/web → **Tripo** (auto-rig natif)
- Fidélité visuelle maximale (héros, artefact) → **TRELLIS 2** ou **Rodin**
- Expérimentation open-source locale → **Hunyuan3D 3.0**

---

## Meshy 6 — workflow détaillé

### Via l'interface web
1. Mode **Text to 3D** : prompt descriptif en anglais + style (realistic / stylized / low-poly).
2. Mode **Image to 3D** : photo/concept art isolé sur fond blanc/neutre (meilleur résultat).
3. Mode **Multi-Image to 3D** : 4 vues (front/back/left/right) → meilleure cohérence géométrique.
4. Preview 30 s → valider → générer le refine (~2 min, textures PBR complètes).
5. Exporter en **GLB** directement.

### Via l'API / MCP
```bash
# Installer le serveur MCP Meshy
npm install -g @meshy-ai/meshy-mcp-server

# Dans claude_desktop_config.json ou .claude/settings.json :
# "mcpServers": { "meshy": { "command": "meshy-mcp-server", "env": { "MESHY_API_KEY": "..." } } }
```
L'agent `meshy-dev/meshy-3d-agent` expose les outils : `text_to_3d`, `image_to_3d`, `get_task_status`, `download_model`.

```python
# Exemple API directe (REST)
import requests
resp = requests.post("https://api.meshy.ai/v2/text-to-3d", json={
    "mode": "preview",
    "prompt": "gothic dungeon torch sconce, stone, PBR, game-ready",
    "art_style": "realistic",
    "negative_prompt": "low quality, blurry"
}, headers={"Authorization": "Bearer YOUR_KEY"})
task_id = resp.json()["result"]
```

---

## Skybox AI — HDRI 360° procédural

Blockade Labs Skybox génère des environnements 360° à partir d'un prompt → utilisable comme HDRI/IBL dans three.js/R3F.

```
Prompt exemple (univers Lost Chapter) :
"another galaxy, ancient ruins floating in nebula, purple and gold light, 
 cinematic volumetric fog, 8K equirectangular"
```

- Exporter en **EXR 8K** ou JPG équirectangulaire.
- Convertir si besoin : `gltf-transform ktx2 --format uastc input.hdr output.ktx2`
- En R3F : `<Environment files="skybox.hdr" background />` (drei).

⚠️ Un EXR 8K pèse ~20 Mo → toujours downscaler en 2K pour le web (`magick skybox.exr -resize 2048x1024 skybox.hdr`).

---

## Pipeline de sortie vers R3F

```bash
# 1. Optimiser le GLB issu de l'IA (souvent brut)
npx gltfjsx model.glb --transform --output Model.jsx

# 2. Vérifier dans gltf.report ou https://sandbox.babylonjs.com
# → polygons, textures, UV sets

# 3. Si topologie à corriger → blender-mcp-pipeline
# 4. Si HDRI → web3d-threejs pour l'IBL
```

### Points de vigilance sur les GLB IA
- **Textures souvent en PNG haute résolution** (4K+) → compresser en KTX2 : voir `gltf-optimization-pipeline`.
- **Topologie haute densité** (Rodin peut générer 500k+ tris) → simplifier avec `gltf-transform simplify`.
- **UVs parfois dupliqués** → `gltf-transform dedup` avant tout.
- **Matériaux non-PBR** (Stable Fast 3D) → rebake dans Blender si qualité requise.

---

## À faire / à éviter

**Faire :**
- Donner des prompts très spécifiques : matière, style, polycount visé, usage (game-ready, print, web).
- Valider la forme sur le preview 30 s avant de payer le refine.
- Toujours passer par `gltfjsx --transform` avant intégration R3F.
- Utiliser multi-image (4 vues) pour les assets héros (meilleur résultat).

**Éviter :**
- Attendre un mesh directement intégrable sans retouche Blender.
- Oublier de compresser les textures PBR avant déploiement web.
- Utiliser Stable Fast 3D pour un asset final (pas de PBR, topologie brute).
- Ignorer les droits : les outputs IA peuvent avoir des restrictions commerciales selon l'outil.

---

> Voir aussi : **`gltf-optimization-pipeline`** (compression GLB/KTX2 pour le web), **`blender-mcp-pipeline`** (retopo, séparation pièces, bake depuis Claude Code), **`web3d-threejs`** (intégration R3F, IBL, post-FX), **`ai-visual-workflow`** (concept art / textures pour alimenter l'image-to-3D).
