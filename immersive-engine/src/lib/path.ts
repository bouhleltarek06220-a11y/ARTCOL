/**
 * Le « rail » de la caméra : une courbe lisse (CatmullRom) qui passe par
 * chaque station. La caméra se déplace le long de cette courbe selon t∈[0..1].
 */
import * as THREE from "three";
import { STATIONS } from "@/data/experience";

export const curve = new THREE.CatmullRomCurve3(
  STATIONS.map((s) => new THREE.Vector3(...s.position)),
  false,
  "catmullrom",
  0.5,
);

export const TOTAL = STATIONS.length;

/** Position normalisée [0..1] d'une station sur le rail. */
export function stationT(index: number): number {
  return TOTAL > 1 ? index / (TOTAL - 1) : 0;
}
