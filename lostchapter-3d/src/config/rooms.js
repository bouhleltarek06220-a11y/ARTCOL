import { lostChapter } from './theme.js'

// Étages / salles du monde, du haut (Hall) vers le bas (Crypte).
// `y`      = profondeur de l'étage ; la caméra plonge d'un étage à l'autre au scroll.
// `accent` = couleur dominante (torches + liseré du cadre).
// `slide`  = chemin d'une image de slide (sinon : placeholder).
// `portal` = la salle accueille le portail au lieu d'un cadre à slide.
export const ROOMS = [
  {
    id: 'hall',
    label: 'I · Le Hall',
    subtitle: "L'armure du chevalier — bouge la souris pour la décomposer",
    y: 0,
    accent: lostChapter.gold,
    slide: null,
    portal: false,
  },
  {
    id: 'soussol',
    label: 'II · Le Sous-sol',
    subtitle: 'Salle des archives — vos slides prennent place ici',
    y: -8,
    accent: lostChapter.portal.communes,
    slide: null,
    portal: false,
  },
  {
    id: 'crypte',
    label: 'III · La Crypte',
    subtitle: 'Le portail vers un autre monde',
    y: -16,
    accent: lostChapter.portal.createurs,
    portal: true,
    // Vidéo "autre monde" (Kling) une fois générée + déposée dans public/videos/.
    // Laisser indéfini tant que le fichier n'existe pas (sinon : fallback procédural).
    portalVideo: undefined,
  },
]

// Keyframes caméra dérivées des étages : une position + un point visé par salle.
export const CAMERA_KEYFRAMES = ROOMS.map((r) => ({
  pos: [0, r.y + 0.6, 7.5],
  look: [0, r.y - 0.1, 0],
}))

export default ROOMS
