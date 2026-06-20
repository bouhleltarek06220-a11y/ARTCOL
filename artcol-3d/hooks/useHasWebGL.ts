"use client";

import { useSyncExternalStore } from "react";

// La capacité WebGL ne change pas pendant la vie de la page : on détecte
// une seule fois puis on met le résultat en cache au niveau module.
let cached: boolean | null = null;

function detectWebGL(): boolean {
  if (cached !== null) return cached;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");
    cached = Boolean(gl);
  } catch {
    cached = false;
  }
  return cached;
}

// Aucune source à écouter : la valeur est stable une fois détectée.
const noopSubscribe = () => () => {};

/**
 * Détecte la disponibilité de WebGL côté client.
 * - `null`  : détection en cours (rendu serveur / hydratation initiale)
 * - `true`  : WebGL disponible, on peut monter le <Canvas>
 * - `false` : pas de WebGL, afficher l'alternative sans 3D
 */
export function useHasWebGL(): boolean | null {
  return useSyncExternalStore(noopSubscribe, detectWebGL, () => null);
}
