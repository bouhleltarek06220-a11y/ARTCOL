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

/**
 * NOYAU DE CIRCULATION VERTICAL — source unique de vérité.
 *
 * Un seul escalier, empilé et aligné sur les 4 niveaux (S−1 → R0 → R1 → R2),
 * dans un puits réservé à l'arrière-gauche. Escalier demi-tour (switchback) :
 * 2 volées le long de Z (« lane A » qui monte / « lane B » qui descend) reliées
 * par un palier au fond. Sur chaque niveau : lane A = on monte, lane B = on
 * descend. La géométrie (CoreStairs, dalles trouées) ET la navigation
 * (Player.tsx) consomment ces constantes — AUCUNE coordonnée d'escalier ne doit
 * être répétée en dur ailleurs (c'est ce qui avait fait diverger le projet).
 */
export const CORE = {
  // Emprise du puits (réservée vide sur CHAQUE dalle)
  X0: -10.3,
  X1: -6.5, // largeur 3.8 m
  Z0: -8.2,
  Z1: -3.5, // profondeur 4.7 m (bord avant aligné sur la mezzanine)
  // Deux couloirs de volée (le long de Z)
  LANE_A_X: -7.4, // monte (1re moitié, côté droit du puits)
  LANE_B_X: -9.3, // descend (2e moitié, côté gauche/mur)
  LANE_W: 1.6, // largeur de marche praticable
  FLIGHT_FRONT_Z: -3.7, // pied de volée (côté avant) ; [Z1..FRONT] = palier plat
  LAND_Z1: -7.0, // début du palier intermédiaire (du fond LAND_Z0=Z0 à LAND_Z1)
  STEP_N: 16, // marches par demi-volée
  // Niveaux empilés (Y des sols praticables)
  Y: { s1: -3.85, r0: 0, r1: 3.95, r2: 7.75 },
} as const;

/** Sols empilés, du bas vers le haut (pour itérer les volées du noyau). */
export const CORE_LEVELS = [CORE.Y.s1, CORE.Y.r0, CORE.Y.r1, CORE.Y.r2] as const;

/** Couloir de volée sous (x) : 'A' (monte) | 'B' (descend) | null (entre-deux). */
export function coreLane(x: number): "A" | "B" | null {
  if (Math.abs(x - CORE.LANE_A_X) <= CORE.LANE_W / 2) return "A";
  if (Math.abs(x - CORE.LANE_B_X) <= CORE.LANE_W / 2) return "B";
  return null;
}

/** (x,z) dans l'emprise du puits ? */
export function inCore(x: number, z: number): boolean {
  return x >= CORE.X0 && x <= CORE.X1 && z >= CORE.Z0 && z <= CORE.Z1;
}

/** Surface praticable du noyau (une volée ou le palier) — sinon c'est le vide. */
export function onCoreWalk(x: number, z: number): boolean {
  if (!inCore(x, z)) return false;
  return coreLane(x) !== null || z <= CORE.LAND_Z1;
}

/**
 * Hauteurs de sol candidates à (x,z) dans le noyau, pour TOUTES les volées
 * empilées. La nav choisit la plus proche de la hauteur courante : la
 * continuité du déplacement lève l'ambiguïté d'empreinte partagée (pas d'état).
 */
export function coreHeights(x: number, z: number): number[] {
  if (!inCore(x, z)) return [];
  const onLanding = z <= CORE.LAND_Z1;
  const lane = coreLane(x);
  const span = CORE.FLIGHT_FRONT_Z - CORE.LAND_Z1; // 3.3 m de course en Z
  const t = Math.max(0, Math.min(1, (CORE.FLIGHT_FRONT_Z - z) / span)); // avant→0, fond→1
  const out: number[] = [];
  for (let i = 0; i < CORE_LEVELS.length - 1; i++) {
    const lo = CORE_LEVELS[i];
    const hi = CORE_LEVELS[i + 1];
    const mid = (lo + hi) / 2;
    if (onLanding) out.push(mid);
    else if (lane === "A") out.push(lo + t * (mid - lo)); // 1re moitié : lo→mid
    else if (lane === "B") out.push(hi - t * (hi - mid)); // 2e moitié : mid→hi
  }
  return out;
}

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
