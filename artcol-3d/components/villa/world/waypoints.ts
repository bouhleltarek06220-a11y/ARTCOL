/**
 * Points de vue de la visite guidée (façon kellydev.io) : chaque destination =
 * une caméra cible { pos, target, level }. Le déplacement se fait par glissement
 * caméra (TourController) au clic d'un bouton — plus de marche libre laborieuse.
 *
 * `level` synchronise le niveau du joueur (−1 sous-sol, 0 RDC, 1 R1, 2 R2) pour
 * que la marche libre éventuelle reste cohérente après un vol.
 *
 * Repères : villa intérieure x∈[−10.4,10.4], façade z=+2.5, fond z=−8.5.
 * Sols (Y) : s1=−3.85, r0=0, r1=3.95, r2=7.75 ; œil ≈ +1.65.
 */
export type Waypoint = {
  id: string;
  label: string;
  pos: [number, number, number];
  target: [number, number, number];
  level: number;
};

export const WAYPOINTS: Record<string, Waypoint> = {
  // ---------- EXTÉRIEUR ----------
  "ext-entree": { id: "ext-entree", label: "Entrée", level: 0, pos: [-6.5, 1.8, 12], target: [-6.5, 1.7, -2] },
  "ext-jardin": { id: "ext-jardin", label: "Jardin & piscine", level: 0, pos: [15, 3.2, 9], target: [2, 1, -1] },
  "ext-apercu": { id: "ext-apercu", label: "Vue d'ensemble", level: 0, pos: [24, 12, 24], target: [0, 3, -3] },

  // ---------- REZ-DE-CHAUSSÉE ----------
  "rdc-hall": { id: "rdc-hall", label: "Hall / Galerie", level: 0, pos: [0, 1.7, 1.5], target: [0, 2.2, -7] },
  "rdc-cuisine": { id: "rdc-cuisine", label: "Cuisine", level: 0, pos: [-12.5, 1.7, -1], target: [-16, 1.5, -3] },
  "rdc-biblio": { id: "rdc-biblio", label: "Bibliothèque", level: 0, pos: [12.5, 1.7, -1], target: [16, 1.5, -3] },
  "rdc-bureau": { id: "rdc-bureau", label: "Bureau", level: 0, pos: [-3, 1.7, -9.2], target: [-3, 1.6, -13.5] },

  // ---------- ÉTAGE ----------
  "r1-suite": { id: "r1-suite", label: "Suite parentale", level: 1, pos: [1.3, 5.6, -4], target: [2, 5.2, -7.6] },
  "r2-chambres": { id: "r2-chambres", label: "Chambres", level: 2, pos: [5, 9.4, -5.6], target: [6.5, 8.9, -8] },

  // ---------- SOUS-SOL ----------
  "ss-spa": { id: "ss-spa", label: "Spa & détente", level: -1, pos: [-0.5, -2.2, 1.5], target: [-5, -2.8, -5] },
};

/** Groupes pour le menu (ordre d'affichage). */
export const WAYPOINT_GROUPS: { title: string; items: string[] }[] = [
  { title: "Extérieur", items: ["ext-entree", "ext-jardin", "ext-apercu"] },
  { title: "Rez-de-chaussée", items: ["rdc-hall", "rdc-cuisine", "rdc-biblio", "rdc-bureau"] },
  { title: "Étage", items: ["r1-suite", "r2-chambres"] },
  { title: "Sous-sol", items: ["ss-spa"] },
];
