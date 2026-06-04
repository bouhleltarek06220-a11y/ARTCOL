// Métadonnées des pièces de l'armure (effet signature — exploded view).
// Chaque pièce : position de repos (rest), direction d'éclatement (dir, normalisée
// dans le composant), distance max d'éclatement (spread) et une géométrie stand-in.
//
// >>> SWAP GLB (quand le modèle Meshy est prêt) :
//     remplacer le rendu `geometry` par le nœud du GLB
//     (<primitive object={nodes[piece.node]} />) en GARDANT rest / dir / spread.
//     Côté Blender : l'origine de CHAQUE pièce doit être sur son centre de masse
//     → rest correspond au montage, dir à la normale d'éclatement.

export const ARMOR_PIECES = [
  { name: 'Heaume',     node: 'Helmet',      rest: [0, 1.62, 0],        dir: [0, 1, 0.2],      spread: 0.9, geometry: { type: 'capsule',  args: [0.3, 0.22, 6, 16] } },
  { name: 'Plastron',   node: 'Breastplate', rest: [0, 0.55, 0],        dir: [0, 0.15, 1],     spread: 0.9, geometry: { type: 'box',      args: [0.82, 1.05, 0.55] } },
  { name: 'Pauldron G', node: 'PauldronL',   rest: [-0.62, 1.02, 0],    dir: [-1, 0.45, 0.25], spread: 1.0, geometry: { type: 'sphere',   args: [0.3, 20, 16] } },
  { name: 'Pauldron D', node: 'PauldronR',   rest: [0.62, 1.02, 0],     dir: [1, 0.45, 0.25],  spread: 1.0, geometry: { type: 'sphere',   args: [0.3, 20, 16] } },
  { name: 'Gantelet G', node: 'GauntletL',   rest: [-0.82, 0.02, 0.05], dir: [-1, -0.2, 0.45], spread: 1.2, geometry: { type: 'box',      args: [0.26, 0.42, 0.26] } },
  { name: 'Gantelet D', node: 'GauntletR',   rest: [0.82, 0.02, 0.05],  dir: [1, -0.2, 0.45],  spread: 1.2, geometry: { type: 'box',      args: [0.26, 0.42, 0.26] } },
  { name: 'Jambière G', node: 'GreaveL',     rest: [-0.27, -1.05, 0],   dir: [-0.6, -0.7, 0.35], spread: 1.0, geometry: { type: 'cylinder', args: [0.15, 0.2, 0.72, 16] } },
  { name: 'Jambière D', node: 'GreaveR',     rest: [0.27, -1.05, 0],    dir: [0.6, -0.7, 0.35],  spread: 1.0, geometry: { type: 'cylinder', args: [0.15, 0.2, 0.72, 16] } },
  { name: 'Solleret G', node: 'SabatonL',    rest: [-0.27, -1.72, 0.12], dir: [-0.4, -0.9, 0.7], spread: 1.1, geometry: { type: 'box',      args: [0.24, 0.18, 0.52] } },
  { name: 'Solleret D', node: 'SabatonR',    rest: [0.27, -1.72, 0.12],  dir: [0.4, -0.9, 0.7],  spread: 1.1, geometry: { type: 'box',      args: [0.24, 0.18, 0.52] } },
]

export default ARMOR_PIECES
