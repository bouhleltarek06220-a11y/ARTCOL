---
name: blender-mcp-pipeline
description: "Piloter Blender depuis Claude Code via BlenderMCP (github ahujasid/blender-mcp, ~22k stars, MIT) : créer/modifier objets, exécuter du Python Blender arbitraire, nettoyer un mesh IA, séparer les pièces pour une vue éclatée, retopo, bake lighting, télécharger des assets Poly Haven CC0, générer via Hyper3D Rodin ; installation en une ligne (uvx blender-mcp + addon Blender), configuration mcpServers. Utiliser pour : nettoyer un GLB généré par IA, préparer une vue éclatée 3D interactive (type Lost Chapter), bake une scène statique, exporter un GLB optimisé depuis Claude Code sans ouvrir Blender manuellement. Mots-clés : blender, blendermcp, mcp, python blender, bpy, vue éclatée, exploded view, retopo, bake, poly haven, hyper3D, rodin, mesh cleanup, blender automation, blender scripting, GLB export, claude code blender."
---

# BlenderMCP — piloter Blender depuis Claude Code

Contrôle total de Blender via le protocole MCP : créer, modifier, nettoyer, baker et exporter des assets 3D **sans quitter Claude Code**. Idéal pour la phase de finition des assets IA (les 20 % de travail après génération).

## Quand l'activer
- Nettoyer un mesh sorti d'un outil IA (Meshy, Tripo, Rodin) : retopo, suppression de géométrie parasite.
- **Séparer les pièces d'un objet pour une vue éclatée interactive** (Lost Chapter : armure, mécanisme, architecture).
- Bake le lighting sur une scène statique (ombres portées cuites dans les textures → perf web maximale).
- Télécharger des assets Poly Haven (CC0) directement depuis un prompt.
- Exécuter n'importe quel script Python Blender depuis une conversation Claude.
- Automatiser des tâches répétitives (renommer matériaux, recaler les UVs, appliquer les transforms).

---

## Installation

### 1. Prérequis
- **Blender 4.x** installé (et dans le PATH ou chemin connu).
- **uv** installé (`pip install uv` ou `brew install uv`).

### 2. Lancer le serveur BlenderMCP
```bash
# En une ligne — pas d'installation permanente
uvx blender-mcp
```
Le serveur écoute sur `localhost:9876` par défaut.

### 3. Installer l'addon Blender
1. Télécharger `addon.py` depuis [github.com/ahujasid/blender-mcp](https://github.com/ahujasid/blender-mcp).
2. Blender → Edit → Preferences → Add-ons → Install → sélectionner `addon.py`.
3. Activer l'addon. Un panneau **BlenderMCP** apparaît dans la sidebar (N-panel).
4. Cliquer **Connect** dans le panneau → Blender se connecte au serveur.

### 4. Configurer dans Claude Code
```json
// .claude/settings.json ou mcpServers dans claude_desktop_config.json
{
  "mcpServers": {
    "blender": {
      "command": "uvx",
      "args": ["blender-mcp"]
    }
  }
}
```

---

## Capacités clés

### Créer / modifier des objets
```
"Crée un cube 2x2x2 centré en (0,0,1), renomme-le 'SoclePortail'"
"Ajoute un matériau émissif rouge à l'objet 'TorchFlame', intensité 5"
"Scale l'armature 'Knight' à 0.01 (conversion cm → m pour GLB web)"
```

### Exécuter du Python Blender arbitraire
L'outil `execute_blender_code` envoie n'importe quel snippet `bpy` :
```python
# Exemple : séparer par matériau pour vue éclatée
import bpy
obj = bpy.data.objects['ArmorFull']
bpy.context.view_layer.objects.active = obj
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.separate(type='BY_MATERIAL')
bpy.ops.object.mode_set(mode='OBJECT')
# Recentrer chaque pièce sur son propre centre de masse
for o in bpy.context.selected_objects:
    bpy.context.view_layer.objects.active = o
    bpy.ops.object.origin_set(type='ORIGIN_CENTER_OF_MASS')
```

### Vue éclatée interactive — workflow complet

1. **Séparer les pièces** : `bpy.ops.mesh.separate(type='BY_MATERIAL')` ou par sélection manuelle.
2. **Origin to Center of Mass** sur chaque pièce (chaque objet tourne/déplace autour de son propre pivot).
3. **Nommer clairement** chaque objet (`Gorget`, `Pauldron_L`, `Cuirass`…).
4. **Exporter en GLB** avec hiérarchie préservée :
   ```python
   bpy.ops.export_scene.gltf(filepath="/output/armor_exploded.glb",
       export_format='GLB', export_apply=True,
       export_hierarchy_full_object_mode=True)
   ```
5. En R3F : animer chaque pièce via `useRef` + GSAP timeline sur scroll (voir `cinematic-scroll`).

### Bake lighting
```
"Bake les ombres de la scène 'DungeonRoom' dans les textures (mode 'Combined'),
 résolution 1024×1024, sauvegarde les maps dans /baked/"
```
**Quand bake ?** : décors statiques (murs, sol, colonnes) → textures cuites = zéro calcul RT en temps réel → perf mobile.

### Assets Poly Haven (CC0)
```
"Télécharge la texture 'cobblestone_large' (2K, JPG) depuis Poly Haven
 et applique-la au matériau 'Floor' de la scène"
```
BlenderMCP intègre l'API Poly Haven directement. Toutes les textures/HDRIs/modèles sont **CC0**.

### Générer via Hyper3D Rodin
```
"Génère un chandelier en pierre gothique via Rodin depuis Blender,
 qualité max, exporte en GLB dans la scène courante"
```
Nécessite une clé API Hyper3D configurée dans l'addon.

---

## Nettoyage de mesh IA — checklist

Après importation d'un GLB issu de Meshy/Tripo/Rodin :

```
[ ] Appliquer les transforms (Ctrl+A → All Transforms)
[ ] Supprimer les vertices dupliqués (Mesh → Merge by Distance, 0.001 m)
[ ] Supprimer les faces internes (non visibles depuis l'extérieur)
[ ] Recalculer les normales (Mesh → Normals → Recalculate Outside)
[ ] Simplifier si > 100k tris pour le web (Decimate modifier → ratio 0.3–0.5)
[ ] Vérifier les UV maps (UV Editor → aucun overlap pour le bake)
[ ] Renommer les matériaux de façon lisible
[ ] Exporter : Apply Modifiers = ✓, Export Normals = ✓, Draco = ✓ si disponible
```

---

## Export GLB optimisé

```python
bpy.ops.export_scene.gltf(
    filepath="/output/model_clean.glb",
    export_format='GLB',
    export_apply=True,           # applique tous les modifiers
    export_normals=True,
    export_texcoords=True,
    export_colors=False,         # vertex colors rarement utiles
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=6,
    export_image_format='WEBP',  # plus léger que PNG
    export_image_quality=85,
)
```

---

## ⚠️ Sécurité — à lire absolument

BlenderMCP exécute du **code Python arbitraire** dans Blender sans sandbox.

- **Sauvegarder le fichier .blend avant chaque session** (Ctrl+S ou `bpy.ops.wm.save_mainfile()`).
- Ne jamais coller de code provenant de sources non fiables dans les prompts MCP.
- Tester les scripts destructifs sur une **copie du fichier**.
- En production CI : utiliser Blender en mode headless (`blender --background --python script.py`) plutôt que BlenderMCP.

---

> Voir aussi : **`ai-3d-generation`** (générer le GLB brut avant nettoyage), **`gltf-optimization-pipeline`** (compression KTX2/Draco post-Blender), **`web3d-threejs`** (intégration R3F de la vue éclatée + animations GSAP), **`cinematic-scroll`** (animer la vue éclatée sur scroll).
