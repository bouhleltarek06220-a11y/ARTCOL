"use client";

import { useMemo } from "react";
import { Instances, Instance } from "@react-three/drei";
import { MeshStandardMaterial } from "three";

// Couleurs feuillage et tronc
const COLOR_FOLIAGE_DARK = "#3f4a31";
const COLOR_FOLIAGE_MID = "#34501f";
const COLOR_FOLIAGE_LIGHT = "#4d6b33";
const COLOR_TRUNK = "#2f2920";

// Bruit pseudo-aléatoire déterministe basé sur l'index (SSR-safe, pas de Math.random)
function noise(i: number): number {
  const v = Math.sin(i * 12.9898) * 43758.5453;
  return v - Math.floor(v);
}
function noise2(i: number): number {
  const v = Math.sin(i * 78.233 + 4.1) * 24634.6345;
  return v - Math.floor(v);
}

// Test des zones interdites (true = position à éviter)
function isBlocked(x: number, z: number): boolean {
  if (x >= -22 && x <= 22 && z >= -18 && z <= 18) return true; // villa
  if (x >= -9 && x <= 16 && z >= 6 && z <= 18) return true; // piscine
  if (x >= -13 && x <= -6 && z >= 8 && z <= 44) return true; // allée
  if (x >= -37 && x <= -17 && z >= -53 && z <= -29) return true; // tennis
  if (x >= 9 && x <= 26 && z >= -48 && z <= -31) return true; // basket
  return false;
}

const PARK = { xMin: -40, xMax: 40, zMin: -56, zMax: 34 };

type Placed = { x: number; z: number; s: number; r: number; c: string };

export function LandscapePlanting() {
  const hedgeMaterial = useMemo(() => new MeshStandardMaterial({ color: COLOR_FOLIAGE_MID, roughness: 0.9 }), []);
  const bushMaterial = useMemo(() => new MeshStandardMaterial({ color: COLOR_FOLIAGE_LIGHT, roughness: 1 }), []);
  const trunkMaterial = useMemo(() => new MeshStandardMaterial({ color: COLOR_TRUNK, roughness: 0.95 }), []);
  const treeFoliageMaterial = useMemo(() => new MeshStandardMaterial({ color: COLOR_FOLIAGE_DARK, roughness: 1 }), []);

  // HAIE PÉRIMÉTRIQUE
  const hedge = useMemo<Placed[]>(() => {
    const out: Placed[] = [];
    const step = 1.1;
    let k = 0;
    for (let z = PARK.zMin + 1; z <= PARK.zMax - 1; z += step) {
      for (const xb of [-38, 38]) {
        const x = xb + (noise(k) - 0.5) * 0.25;
        const zz = z + (noise2(k) - 0.5) * 0.2;
        if (!isBlocked(x, zz)) out.push({ x, z: zz, s: 0.92 + noise(k + 3) * 0.2, r: (noise2(k + 5) - 0.5) * 0.4, c: COLOR_FOLIAGE_MID });
        k++;
      }
    }
    for (let x = PARK.xMin + 1; x <= PARK.xMax - 1; x += step) {
      for (const zb of [-54, 32]) {
        const xx = x + (noise(k) - 0.5) * 0.25;
        const z = zb + (noise2(k) - 0.5) * 0.2;
        if (!isBlocked(xx, z)) out.push({ x: xx, z, s: 0.92 + noise(k + 3) * 0.2, r: (noise2(k + 5) - 0.5) * 0.4, c: COLOR_FOLIAGE_MID });
        k++;
      }
    }
    return out;
  }, []);

  // MASSIFS DE BUISSONS
  const bushes = useMemo<Placed[]>(() => {
    const out: Placed[] = [];
    const clusters: Array<[number, number, number]> = [
      [-16, 14, 5], [-3, 22, 6], [20, 14, 6], [-28, 8, 5], [28, -8, 6],
      [-30, -22, 6], [4, -24, 6], [30, -36, 5], [0, 28, 6], [-32, 24, 5],
    ];
    let k = 100;
    clusters.forEach((cluster, ci) => {
      const [cx, cz, count] = cluster;
      for (let n = 0; n < count; n++) {
        const a = noise(k) * Math.PI * 2;
        const rad = 1.5 + noise2(k) * 3.5;
        const x = cx + Math.cos(a) * rad;
        const z = cz + Math.sin(a) * rad;
        if (!isBlocked(x, z) && x > PARK.xMin && x < PARK.xMax && z > PARK.zMin && z < PARK.zMax) {
          const palette = [COLOR_FOLIAGE_LIGHT, COLOR_FOLIAGE_MID, COLOR_FOLIAGE_DARK];
          out.push({ x, z, s: 0.7 + noise(k + ci) * 0.9, r: noise2(k + ci) * Math.PI, c: palette[(n + ci) % 3] });
        }
        k++;
      }
    });
    return out;
  }, []);

  // ARBUSTES / PETITS ARBRES
  const trees = useMemo(() => {
    const candidates: Array<[number, number]> = [
      [-34, 0], [34, 4], [-2, 30], [-36, 30], [36, 30], [-24, -26],
      [2, -10], [30, -20], [-8, -36], [36, -50], [-36, -10], [24, 26],
    ];
    const out: Array<{ x: number; z: number; s: number; r: number }> = [];
    candidates.forEach((c, i) => {
      const [x, z] = c;
      if (!isBlocked(x, z)) out.push({ x, z, s: 0.85 + noise(i + 50) * 0.6, r: noise2(i + 50) * Math.PI });
    });
    return out;
  }, []);

  return (
    <group>
      <Instances limit={hedge.length} material={hedgeMaterial} castShadow receiveShadow>
        <boxGeometry args={[1.0, 1.2, 1.0]} />
        {hedge.map((h, i) => (
          <Instance key={`hedge-${i}`} position={[h.x, 0.6 * h.s, h.z]} scale={[1, h.s, 1]} rotation={[0, h.r, 0]} />
        ))}
      </Instances>

      <Instances limit={bushes.length} material={bushMaterial} castShadow receiveShadow>
        <icosahedronGeometry args={[1, 1]} />
        {bushes.map((b, i) => (
          <Instance key={`bush-${i}`} position={[b.x, 0.6 * b.s, b.z]} scale={[b.s, b.s * 0.75, b.s]} rotation={[0, b.r, 0]} color={b.c} />
        ))}
      </Instances>

      <Instances limit={trees.length} material={trunkMaterial} castShadow receiveShadow>
        <cylinderGeometry args={[0.16, 0.22, 1.8, 6]} />
        {trees.map((t, i) => (
          <Instance key={`trunk-${i}`} position={[t.x, 0.9 * t.s, t.z]} scale={[t.s, t.s, t.s]} />
        ))}
      </Instances>

      <Instances limit={trees.length * 3} material={treeFoliageMaterial} castShadow receiveShadow>
        <icosahedronGeometry args={[1, 1]} />
        {trees.flatMap((t, i) => {
          const top = 1.8 * t.s;
          return [0, 1, 2].map((b) => {
            const off = noise(i * 3 + b);
            const off2 = noise2(i * 3 + b);
            const r = 0.9 + off * 0.5;
            return (
              <Instance key={`leaf-${i}-${b}`} position={[t.x + (off - 0.5) * 0.9, top - 0.2 + b * 0.45 * t.s, t.z + (off2 - 0.5) * 0.9]} scale={[r * t.s, r * t.s, r * t.s]} rotation={[off2, off, 0]} />
            );
          });
        })}
      </Instances>
    </group>
  );
}
