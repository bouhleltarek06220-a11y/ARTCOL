import { lostChapter } from './theme.js'

// Étages / salles du monde, du haut (Hall) vers le bas (Crypte).
// `y` = profondeur de l'étage dans la scène ; la caméra plonge d'un étage à l'autre au scroll.
// `accent` = couleur dominante de la salle (torches + liseré du cadre à slide).
export const ROOMS = [
  {
    id: 'hall',
    label: 'I · Le Hall',
    subtitle: "L'armure du chevalier — bouge la souris pour la décomposer",
    y: 0,
    accent: lostChapter.gold,
  },
  {
    id: 'soussol',
    label: 'II · Le Sous-sol',
    subtitle: 'Salle des archives — vos slides prennent place ici',
    y: -8,
    accent: lostChapter.portal.communes,
  },
  {
    id: 'crypte',
    label: 'III · La Crypte',
    subtitle: 'Le portail vers un autre monde',
    y: -16,
    accent: lostChapter.portal.createurs,
  },
]

// Keyframes caméra dérivées des étages : une position + un point visé par salle.
// Interpolées par CameraRig selon la progression du scroll.
export const CAMERA_KEYFRAMES = ROOMS.map((r) => ({
  pos: [0, r.y + 0.6, 7.5],
  look: [0, r.y - 0.1, 0],
}))

export default ROOMS
