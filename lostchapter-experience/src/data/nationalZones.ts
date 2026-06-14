// Les 9 piliers de l'expérience nationale LOST CHAPTER.
// Chaque zone = un portail disposé en cercle autour de la carte de France
// holographique du hall central.

export interface NationalZone {
  id: string;
  title: string;
  subtitle: string;
  /** Couleur d'accent (glow du portail). */
  color: string;
  /** Glyphe affiché sur le portail. */
  glyph: string;
  /** Angle (radians) de placement dans l'anneau de portails. */
  angle: number;
  /** Aperçu vidéo animé (fichier dans national/videos/) affiché dans le portail. */
  video?: string;
}

const N = 9;
const ring = (i: number) => (i / N) * Math.PI * 2 - Math.PI / 2; // départ en haut

export const nationalZones: NationalZone[] = [
  { id: 'concept',   title: 'Le Concept',            subtitle: "L'Histoire devient vivante",        color: '#e5c788', glyph: '📖', angle: ring(0), video: 'concept.mp4' },
  { id: 'lieux',     title: 'Les Lieux Historiques', subtitle: 'Des monuments qui renaissent',       color: '#f0a64a', glyph: '🏰', angle: ring(1), video: 'lieux.mp4' },
  { id: 'createurs', title: 'Créateurs & Streamers', subtitle: "Ils portent l'audience",             color: '#9146ff', glyph: '🎥', angle: ring(2), video: 'createurs.mp4' },
  { id: 'sponsors',  title: 'Sponsors & Mécènes',    subtitle: 'Visibilité, impact, mécénat',        color: '#e9d27a', glyph: '🤝', angle: ring(3), video: 'sponsors.mp4' },
  { id: 'public',    title: 'Public & Twitch',       subtitle: 'Sur place et en ligne',              color: '#6f7bff', glyph: '🎭', angle: ring(4), video: 'public.mp4' },
  { id: 'artistes',  title: 'Artistes & Bénévoles',  subtitle: 'Un écosystème humain',               color: '#5fb8a6', glyph: '🎪', angle: ring(5), video: 'artistes.mp4' },
  { id: 'coulisses', title: 'Les Coulisses',         subtitle: "L'invisible qui rend possible",      color: '#7fa6c9', glyph: '🎬', angle: ring(6) },
  { id: 'carte',     title: 'La Carte de France',    subtitle: 'Reproductible partout',              color: '#4ea3ff', glyph: '🗺️', angle: ring(7) },
  { id: 'contact',   title: 'Participer',            subtitle: 'Rejoignez le chapitre',              color: '#e5c788', glyph: '✉️', angle: ring(8) },
];

// Lieux historiques affichés sur la carte de France (positions normalisées
// approximatives sur un plan, x∈[-1,1] droite, z∈[-1,1] sud→nord inversé).
export interface HeritageSite { name: string; x: number; z: number }
export const heritageSites: HeritageSite[] = [
  { name: 'Mont-Saint-Michel', x: -0.42, z: -0.30 },
  { name: 'Fort Carré (Antibes)', x: 0.55, z: 0.62 },
  { name: 'Carcassonne', x: 0.05, z: 0.70 },
  { name: 'Chambord', x: 0.02, z: -0.02 },
  { name: 'Avignon', x: 0.34, z: 0.50 },
  { name: 'Arles', x: 0.30, z: 0.60 },
  { name: 'Provins', x: 0.20, z: -0.18 },
  { name: 'Nîmes', x: 0.26, z: 0.55 },
  { name: 'Aigues-Mortes', x: 0.28, z: 0.62 },
];
