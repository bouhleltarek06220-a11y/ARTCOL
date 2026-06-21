/**
 * Constantes dimensionnelles partagées de la villa — source unique de vérité
 * pour les coordonnées, afin d'éviter la dérive entre modules (coque, étages,
 * sous-sol, jardin). Mètres, Y vers le haut. Voir docs/MEGAVILLA-PLAN.md.
 */
export const VILLA = {
  // Coque RDC existante
  LEFT_X: -11,
  RIGHT_X: 11,
  FRONT_Z: 2.5,
  BACK_Z: -8.5,
  WALL_H: 7.4,

  // Niveaux empilés
  BASE_Y: -4.0, // dalle sous-sol (S1)
  GROUND_Y: 0, // rez-de-chaussée (R0)
  SLAB_Y: 4.0, // dalle étage 1 (R1)
  R2_Y: 7.6, // dalle étage 2 (R2)
  ROOF2_Y: 11.2, // nouvelle toiture

  EYE: 1.65, // hauteur des yeux du visiteur
} as const;

/** Palette matériaux partagée (couleurs de référence). */
export const PALETTE = {
  concrete: "#b3a896",
  stone: "#cdbb9c",
  coping: "#d8d2c6",
  marble: "#d7d1c6",
  wood: "#5b3f27",
  darkWood: "#3a2a1c",
  darkMetal: "#1b1c1e",
  glass: "#9fc4d6",
  linen: "#d9d3c8",
  leaf: "#3f4a31",
  leafDark: "#34501f",
} as const;
