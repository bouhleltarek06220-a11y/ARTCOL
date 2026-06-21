"use client";

import { useMemo } from "react";
import { DoubleSide, MeshStandardMaterial } from "three";

/**
 * Équipements de sport du parc (nord de la villa, derrière, sur la pelouse) :
 *  - COURT DE TENNIS : aire de jeu réglementaire 23,77 × 10,97 m (orientée N-S,
 *    longueur le long de z), surface acrylique + lignes + filet + clôture.
 *  - DEMI-TERRAIN DE BASKET : résine 15 × 14 m, lignes + panier.
 * Tout en primitives (très peu coûteux). Lignes = fines boîtes blanches émissives.
 */

const TENNIS = { cx: -27, cz: -41, L: 23.77, W: 10.97 }; // aire de jeu (lignes)
const BASKET = { cx: 17.5, cz: -39.5, L: 15, W: 14 };

export function GardenSport() {
  const acrylicPlay = useMemo(
    () => new MeshStandardMaterial({ color: "#2f6d4a", roughness: 0.85 }),
    [],
  );
  const acrylicOut = useMemo(
    () => new MeshStandardMaterial({ color: "#36507a", roughness: 0.85 }),
    [],
  );
  const resin = useMemo(
    () => new MeshStandardMaterial({ color: "#b5762a", roughness: 0.8 }),
    [],
  );
  const line = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#f4f1ea",
        roughness: 0.6,
        emissive: "#cfcabd",
        emissiveIntensity: 0.25,
      }),
    [],
  );
  const metal = useMemo(
    () => new MeshStandardMaterial({ color: "#20232a", roughness: 0.4, metalness: 0.8 }),
    [],
  );
  const net = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#0e0f12",
        roughness: 0.9,
        transparent: true,
        opacity: 0.45,
        side: DoubleSide,
      }),
    [],
  );
  const fence = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#1a1d22",
        roughness: 0.6,
        metalness: 0.3,
        transparent: true,
        opacity: 0.16,
        side: DoubleSide,
      }),
    [],
  );
  const board = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#cfe6ef",
        roughness: 0.1,
        metalness: 0.1,
        transparent: true,
        opacity: 0.4,
        side: DoubleSide,
      }),
    [],
  );
  const rim = useMemo(
    () => new MeshStandardMaterial({ color: "#d9601e", roughness: 0.5, metalness: 0.3 }),
    [],
  );

  // Ligne horizontale (le long de X) à z donné.
  const LX = (x: number, z: number, w: number, len = 0.05) => (
    <mesh material={line} position={[x, 0.08, z]} receiveShadow>
      <boxGeometry args={[w, 0.02, len]} />
    </mesh>
  );
  // Ligne verticale (le long de Z) à x donné.
  const LZ = (x: number, z: number, l: number, w = 0.05) => (
    <mesh material={line} position={[x, 0.08, z]} receiveShadow>
      <boxGeometry args={[w, 0.02, l]} />
    </mesh>
  );

  const t = TENNIS;
  const halfL = t.L / 2;
  const halfW = t.W / 2;
  const serviceZ = 6.4; // ligne de service à ±6.40 m du filet

  const b = BASKET;
  const bHalfW = b.W / 2;
  const hoopZ = b.cz - b.L / 2 + 1.2; // panier près du fond

  return (
    <group>
      {/* ============================ TENNIS ============================ */}
      <group>
        {/* dégagement (surface bleue) */}
        <mesh material={acrylicOut} rotation={[-Math.PI / 2, 0, 0]} position={[t.cx, 0.04, t.cz]} receiveShadow>
          <planeGeometry args={[t.W + 7, t.L + 11]} />
        </mesh>
        {/* aire de jeu (surface verte) */}
        <mesh material={acrylicPlay} rotation={[-Math.PI / 2, 0, 0]} position={[t.cx, 0.06, t.cz]} receiveShadow>
          <planeGeometry args={[t.W, t.L]} />
        </mesh>
        {/* lignes de fond (baselines) */}
        {LX(t.cx, t.cz - halfL, t.W)}
        {LX(t.cx, t.cz + halfL, t.W)}
        {/* lignes de côté (doubles) */}
        {LZ(t.cx - halfW, t.cz, t.L)}
        {LZ(t.cx + halfW, t.cz, t.L)}
        {/* lignes de côté simples (à 1,37 m des doubles) */}
        {LZ(t.cx - halfW + 1.37, t.cz, t.L)}
        {LZ(t.cx + halfW - 1.37, t.cz, t.L)}
        {/* lignes de service */}
        {LX(t.cx, t.cz - serviceZ, t.W - 2.74)}
        {LX(t.cx, t.cz + serviceZ, t.W - 2.74)}
        {/* ligne médiane de service */}
        {LZ(t.cx, t.cz, serviceZ * 2)}
        {/* FILET (poteaux + bande) */}
        {[-halfW - 0.4, halfW + 0.4].map((dx) => (
          <mesh key={dx} material={metal} position={[t.cx + dx, 0.53, t.cz]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 1.07, 10]} />
          </mesh>
        ))}
        <mesh material={net} position={[t.cx, 0.5, t.cz]}>
          <planeGeometry args={[t.W + 0.8, 0.95]} />
        </mesh>
        <mesh material={line} position={[t.cx, 0.97, t.cz]}>
          <boxGeometry args={[t.W + 0.8, 0.06, 0.04]} />
        </mesh>
        {/* CLÔTURE (plans translucides, h 4 m) */}
        {[
          [t.cx, t.cz - (t.L + 11) / 2, t.W + 7, 0] as const,
          [t.cx, t.cz + (t.L + 11) / 2, t.W + 7, 0] as const,
        ].map(([x, z, w], i) => (
          <mesh key={`fh${i}`} material={fence} position={[x, 2, z]}>
            <planeGeometry args={[w, 4]} />
          </mesh>
        ))}
        {[t.cx - (t.W + 7) / 2, t.cx + (t.W + 7) / 2].map((x, i) => (
          <mesh key={`fv${i}`} material={fence} position={[x, 2, t.cz]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[t.L + 11, 4]} />
          </mesh>
        ))}
        {/* poteaux de clôture aux coins */}
        {[
          [-(t.W + 7) / 2, -(t.L + 11) / 2],
          [(t.W + 7) / 2, -(t.L + 11) / 2],
          [-(t.W + 7) / 2, (t.L + 11) / 2],
          [(t.W + 7) / 2, (t.L + 11) / 2],
        ].map(([dx, dz], i) => (
          <mesh key={`fp${i}`} material={metal} position={[t.cx + dx, 2, t.cz + dz]}>
            <cylinderGeometry args={[0.06, 0.06, 4, 8]} />
          </mesh>
        ))}
      </group>

      {/* ============================ BASKET ============================ */}
      <group>
        {/* surface résine */}
        <mesh material={resin} rotation={[-Math.PI / 2, 0, 0]} position={[b.cx, 0.05, b.cz]} receiveShadow>
          <planeGeometry args={[b.W, b.L]} />
        </mesh>
        {/* limites */}
        {LX(b.cx, b.cz - b.L / 2, b.W, 0.06)}
        {LX(b.cx, b.cz + b.L / 2, b.W, 0.06)}
        {LZ(b.cx - bHalfW, b.cz, b.L, 0.06)}
        {LZ(b.cx + bHalfW, b.cz, b.L, 0.06)}
        {/* raquette (key) côté panier */}
        {LZ(b.cx - 2.45, hoopZ + 2.9, 5.8, 0.06)}
        {LZ(b.cx + 2.45, hoopZ + 2.9, 5.8, 0.06)}
        {LX(b.cx, hoopZ + 5.8, 4.9, 0.06)}
        {/* cercle de lancer franc (anneau approx) */}
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2;
          return (
            <mesh key={`ft${i}`} material={line} position={[b.cx + Math.cos(a) * 1.8, 0.08, hoopZ + 5.8 + Math.sin(a) * 1.8]}>
              <boxGeometry args={[0.06, 0.02, 0.06]} />
            </mesh>
          );
        })}
        {/* arc à 3 points (demi-cercle) */}
        {Array.from({ length: 28 }).map((_, i) => {
          const a = (i / 27) * Math.PI - Math.PI / 2;
          return (
            <mesh key={`tp${i}`} material={line} position={[b.cx + Math.sin(a) * 6.75, 0.08, hoopZ + Math.cos(a) * 6.75]}>
              <boxGeometry args={[0.06, 0.02, 0.06]} />
            </mesh>
          );
        })}
        {/* PANIER : poteau + panneau + arceau */}
        <mesh material={metal} position={[b.cx, 1.6, hoopZ - 0.9]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 3.2, 12]} />
        </mesh>
        <mesh material={metal} position={[b.cx, 3.05, hoopZ - 0.5]}>
          <boxGeometry args={[0.1, 0.1, 0.8]} />
        </mesh>
        <mesh material={board} position={[b.cx, 3.05, hoopZ - 0.1]}>
          <planeGeometry args={[1.8, 1.05]} />
        </mesh>
        <mesh material={rim} position={[b.cx, 3.05, hoopZ + 0.15]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.23, 0.025, 8, 20]} />
        </mesh>
      </group>
    </group>
  );
}
