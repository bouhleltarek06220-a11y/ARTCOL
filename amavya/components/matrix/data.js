/* Données de l'expérience "/matrix" — voyage orbital 3D + contenu bilingue */

// Couleurs clés interpolées le long du voyage (vert Matrix → or AMAVYA)
export const COLORS = {
  matrix: { r: 0, g: 255, b: 102 },
  gold: { r: 240, g: 210, b: 122 },
};

// Helper : couleur RGB interpolée selon p (0..1)
export const lerpColor = (p) => {
  const c = Math.max(0, Math.min(1, p));
  const r = Math.round(COLORS.matrix.r + (COLORS.gold.r - COLORS.matrix.r) * c);
  const g = Math.round(COLORS.matrix.g + (COLORS.gold.g - COLORS.matrix.g) * c);
  const b = Math.round(COLORS.matrix.b + (COLORS.gold.b - COLORS.matrix.b) * c);
  return { r, g, b, css: `rgb(${r},${g},${b})` };
};

// Les 4 dimensions du voyage
export const DIMENSIONS = {
  fr: [
    { id: "D0", name: "LA MATRICE", sub: "Code source", at: 0.0 },
    { id: "D1", name: "L'ÉVEIL", sub: "Le choix", at: 0.28 },
    { id: "D2", name: "LE PASSAGE", sub: "Voir au-delà", at: 0.55 },
    { id: "D3", name: "AMAVYA", sub: "Le futur", at: 0.8 },
  ],
  en: [
    { id: "D0", name: "THE MATRIX", sub: "Source code", at: 0.0 },
    { id: "D1", name: "THE AWAKENING", sub: "The choice", at: 0.28 },
    { id: "D2", name: "THE PASSAGE", sub: "See beyond", at: 0.55 },
    { id: "D3", name: "AMAVYA", sub: "The future", at: 0.8 },
  ],
};

// Mots-clés affichés en 3D (lettres extrudées qui tournent)
export const KEYWORDS = {
  fr: [
    { at: 0.3, word: "CHOIX" },
    { at: 0.57, word: "VOIR" },
    { at: 0.82, word: "AMAVYA", final: true },
  ],
  en: [
    { at: 0.3, word: "CHOICE" },
    { at: 0.57, word: "SEE" },
    { at: 0.82, word: "AMAVYA", final: true },
  ],
};

// Phrases complètes affichées en sous-titre (effet decode dans le HUD)
export const PHRASES = {
  fr: [
    { at: 0.3, text: "VOUS AVEZ FAIT UN CHOIX" },
    { at: 0.57, text: "VOUS AVEZ CHOISI DE VOIR" },
    { at: 0.82, text: "BIENVENUE DANS LE FUTUR" },
  ],
  en: [
    { at: 0.3, text: "YOU MADE A CHOICE" },
    { at: 0.57, text: "YOU CHOSE TO SEE" },
    { at: 0.82, text: "WELCOME TO THE FUTURE" },
  ],
};

export const UI = {
  fr: {
    brand: "AMAVYA · Construct",
    cta: "DÉCOUVRIR AMAVYA",
    back: "amavya.cloud",
    drag: "GLISSER POUR TOURNER",
    zoom: "MOLETTE / PINCER POUR ZOOMER",
    play: "Lecture",
    pause: "Pause",
    replay: "Revoir le voyage",
    loading: "Initialisation du construct",
    timeline: "Voyage",
  },
  en: {
    brand: "AMAVYA · Construct",
    cta: "ENTER AMAVYA",
    back: "amavya.cloud",
    drag: "DRAG TO ORBIT",
    zoom: "SCROLL / PINCH TO ZOOM",
    play: "Play",
    pause: "Pause",
    replay: "Replay the journey",
    loading: "Initializing the construct",
    timeline: "Journey",
  },
};

// Durée du voyage automatique (secondes)
export const JOURNEY_DURATION = 42;
