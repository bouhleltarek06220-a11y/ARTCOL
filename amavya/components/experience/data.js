/* Chapitres du cinématique "The Living Planet" (bilingue) */

export const CAM = [
  { pos: [0,  2.0, 18], look: [0, 0, 0] },   // 0 — Deep space
  { pos: [0,  1.4, 12], look: [0, 0, 0] },   // 1 — Approach
  { pos: [ 3.2, 2.6,  7.5], look: [0, 0, 0] }, // 2 — Orbiting AMAVYA
  { pos: [-2.4, 4.2,  5.6], look: [0, 0, 0] }, // 3 — Atmosphere
  { pos: [ 4.0,-1.0,  4.9], look: [0, 0, 0] }, // 4 — Surface flyover
  { pos: [ 0.0, 0.6,  6.6], look: [0, 0, 0] }, // 5 — Cinematic finale
];

export const CHAPTERS = {
  fr: [
    { tag: "00 · DEEP SPACE",     title: "Au-delà des étoiles…",            text: "Une lueur familière se dessine au cœur de l'obscurité." },
    { tag: "01 · APPROACH",       title: "Une planète vivante apparaît.",   text: "À mi-chemin entre nature, robotique et intelligence." },
    { tag: "02 · AMAVYA",         title: "Bienvenue sur AMAVYA.",           text: "Là où les humains et l'IA construisent un futur commun." },
    { tag: "03 · ECOSYSTÈME",     title: "Un monde qui respire.",           text: "Forêts lumineuses, îles flottantes, rivières neuronales." },
    { tag: "04 · LE NOYAU",       title: "Le Core nourrit tout l'écosystème.", text: "Soleil artificiel, arbre de vie, intelligence quantique." },
    { tag: "05 · L'AVENIR",       title: "Un futur bâti ensemble.",         text: "L'IA n'est pas là pour remplacer. Elle est là pour augmenter." },
  ],
  en: [
    { tag: "00 · DEEP SPACE",     title: "Beyond the stars…",               text: "A familiar glow shapes itself in the heart of the void." },
    { tag: "01 · APPROACH",       title: "A living planet appears.",        text: "Where nature, robotics and intelligence meet." },
    { tag: "02 · AMAVYA",         title: "Welcome to AMAVYA.",              text: "Where humans and AI build a shared future." },
    { tag: "03 · ECOSYSTEM",      title: "A world that breathes.",          text: "Luminous forests, floating islands, neural rivers." },
    { tag: "04 · THE CORE",       title: "The Core powers everything.",     text: "An artificial sun. A tree of life. A quantum intelligence." },
    { tag: "05 · THE FUTURE",     title: "A future, built together.",       text: "AI is not here to replace. It is here to augment." },
  ],
};

export const STOPS = CHAPTERS.fr.length;
