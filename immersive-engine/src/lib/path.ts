/**
 * Deux rails parallèles : la trajectoire de la caméra (camCurve) et la cible
 * regardée (focusCurve). Même paramètre t∈[0..1] → la caméra glisse ET tourne
 * doucement vers chaque œuvre quand on l'approche. C'est ça le « cinématique ».
 */
import * as THREE from "three";
import { PATH } from "@/data/experience";

export const camCurve = new THREE.CatmullRomCurve3(
  PATH.map((n) => new THREE.Vector3(...n.cam)),
  false,
  "catmullrom",
  0.5,
);

export const focusCurve = new THREE.CatmullRomCurve3(
  PATH.map((n) => new THREE.Vector3(...n.focus)),
  false,
  "catmullrom",
  0.5,
);

export const TOTAL = PATH.length;

export function nodeT(index: number): number {
  return TOTAL > 1 ? index / (TOTAL - 1) : 0;
}
