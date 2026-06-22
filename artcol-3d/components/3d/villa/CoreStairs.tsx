"use client";

import { useMemo } from "react";
import { DoubleSide, MeshStandardMaterial } from "three";
import { CORE } from "@/components/villa/dimensions";

/**
 * Une volée demi-tour (switchback) du NOYAU de circulation, entre deux niveaux
 * `loY` (sol bas) et `hiY` (sol haut). Géométrie pilotée à 100 % par les
 * constantes `CORE` (source unique de vérité partagée avec la nav `Player.tsx`).
 *
 *  - Lane A (x=CORE.LANE_A_X) : 1re moitié, monte de loY au palier (mid).
 *  - Palier intermédiaire au fond (z ≤ CORE.LAND_Z1), à mi-hauteur.
 *  - Lane B (x=CORE.LANE_B_X) : 2e moitié, monte du palier (mid) à hiY.
 *
 * Empilable : la même volée se répète pour s1→r0, r0→r1, r1→r2, toujours dans
 * le même puits XZ. Voir docs/MEGAVILLA-PLAN.md.
 */
export function CoreStairs({ loY, hiY }: { loY: number; hiY: number }) {
  const mid = (loY + hiY) / 2;
  const N = CORE.STEP_N;
  const runZ = CORE.FLIGHT_FRONT_Z - CORE.LAND_Z1; // course en Z d'une demi-volée
  const landZ0 = CORE.Z0;

  const step = useMemo(
    () => new MeshStandardMaterial({ color: "#e6e1d8", roughness: 0.25, metalness: 0.08 }),
    [],
  );
  const slab = useMemo(
    () => new MeshStandardMaterial({ color: "#cfc9bf", roughness: 0.3, metalness: 0.1 }),
    [],
  );
  const metal = useMemo(
    () => new MeshStandardMaterial({ color: "#1b1c1e", roughness: 0.35, metalness: 0.85 }),
    [],
  );
  const glass = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#16242c",
        roughness: 0.05,
        transparent: true,
        opacity: 0.3,
        side: DoubleSide,
      }),
    [],
  );

  const idx = useMemo(() => Array.from({ length: N }, (_, i) => i), [N]);

  return (
    <group>
      {/* ===== LANE A : monte loY → mid (le long de −Z) ===== */}
      {idx.map((i) => {
        const z = CORE.FLIGHT_FRONT_Z - (i + 0.5) * (runZ / N);
        const yTop = loY + ((i + 1) * (mid - loY)) / N;
        return (
          <mesh key={`a${i}`} material={step} position={[CORE.LANE_A_X, yTop - 0.09, z]} castShadow receiveShadow>
            <boxGeometry args={[CORE.LANE_W, 0.18, (runZ / N) * 1.25]} />
          </mesh>
        );
      })}

      {/* ===== PALIER intermédiaire (au fond), à mi-hauteur ===== */}
      <mesh material={slab} position={[(CORE.X0 + CORE.X1) / 2, mid - 0.15, (landZ0 + CORE.LAND_Z1) / 2]} castShadow receiveShadow>
        <boxGeometry args={[CORE.X1 - CORE.X0, 0.3, CORE.LAND_Z1 - landZ0]} />
      </mesh>

      {/* ===== LANE B : monte mid → hiY (le long de +Z) ===== */}
      {idx.map((i) => {
        const z = CORE.LAND_Z1 + (i + 0.5) * (runZ / N);
        const yTop = mid + ((i + 1) * (hiY - mid)) / N;
        return (
          <mesh key={`b${i}`} material={step} position={[CORE.LANE_B_X, yTop - 0.09, z]} castShadow receiveShadow>
            <boxGeometry args={[CORE.LANE_W, 0.18, (runZ / N) * 1.25]} />
          </mesh>
        );
      })}

      {/* ===== LIMONS (sous chaque volée) ===== */}
      <mesh
        material={metal}
        position={[CORE.LANE_A_X, (loY + mid) / 2 - 0.25, (CORE.FLIGHT_FRONT_Z + CORE.LAND_Z1) / 2]}
        rotation={[Math.atan2(mid - loY, runZ), 0, 0]}
      >
        <boxGeometry args={[CORE.LANE_W + 0.05, 0.12, Math.hypot(runZ, mid - loY)]} />
      </mesh>
      <mesh
        material={metal}
        position={[CORE.LANE_B_X, (mid + hiY) / 2 - 0.25, (CORE.LAND_Z1 + CORE.FLIGHT_FRONT_Z) / 2]}
        rotation={[-Math.atan2(hiY - mid, runZ), 0, 0]}
      >
        <boxGeometry args={[CORE.LANE_W + 0.05, 0.12, Math.hypot(runZ, hiY - mid)]} />
      </mesh>

      {/* ===== GARDE-CORPS VERRE (côté vide, entre les 2 volées) ===== */}
      <mesh material={glass} position={[(CORE.LANE_A_X + CORE.LANE_B_X) / 2, mid + 0.4, (CORE.FLIGHT_FRONT_Z + CORE.LAND_Z1) / 2]}>
        <boxGeometry args={[0.05, 1.0, runZ]} />
      </mesh>
    </group>
  );
}
