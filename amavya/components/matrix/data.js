/* Données de l'expérience "/matrix" — 4 dimensions + messages bilingues */

// Couleurs interpolées entre dimensions (vert Matrix → or AMAVYA)
export const COLORS = {
  matrix: { r: 0, g: 255, b: 65 },
  gold:   { r: 240, g: 210, b: 122 },
};

// Préréglages caméra par dimension
export const CAM = [
  { pos: [0,  0.0,  6], look: [0, 0, -1] }, // D0 — Matrix immersif
  { pos: [0,  0.4,  3], look: [0, 0, -3] }, // D1 — Recul, transition
  { pos: [0,  0.0,  0], look: [0, 0, -6] }, // D2 — Entrée tunnel
  { pos: [0, -0.2, -5], look: [0, 0, -10] }, // D3 — Cœur AMAVYA
];

// Messages qui se composent (effet decode) — apparaissent à un certain scroll
export const MESSAGES = {
  fr: [
    { at: 0.30, text: "VOUS AVEZ FAIT UN CHOIX",        hold: 1.4 },
    { at: 0.55, text: "VOUS AVEZ CHOISI DE VOIR",       hold: 1.4 },
    { at: 0.80, text: "BIENVENUE DANS LE FUTUR",        hold: 1.6 },
    { at: 0.92, text: "AMAVYA",                          hold: 99,  big: true },
  ],
  en: [
    { at: 0.30, text: "YOU MADE A CHOICE",              hold: 1.4 },
    { at: 0.55, text: "YOU CHOSE TO SEE",               hold: 1.4 },
    { at: 0.80, text: "WELCOME TO THE FUTURE",          hold: 1.6 },
    { at: 0.92, text: "AMAVYA",                          hold: 99,  big: true },
  ],
};

// Bouton final
export const CTA = {
  fr: "DÉCOUVRIR AMAVYA",
  en: "ENTER AMAVYA",
};

// Tagline marque pour HUD top
export const BRAND = {
  fr: "AMAVYA · Voyage dans le code",
  en: "AMAVYA · Journey through the code",
};

// Hint scroll initial
export const HINT = {
  fr: "Scrollez pour entrer",
  en: "Scroll to enter",
};

export const STOPS = CAM.length;
