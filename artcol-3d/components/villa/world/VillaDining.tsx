"use client";

import { useMemo } from "react";
import { MeshStandardMaterial } from "three";

/**
 * Salle à manger (dans le hall, à gauche). La cuisine est désormais une pièce
 * à part (voir <VillaRooms/>), à gauche de cette salle.
 */
export function VillaDining() {
  const darkWood = useMemo(
    () => new MeshStandardMaterial({ color: "#3a2a1c", roughness: 0.6 }),
    [],
  );
  const metal = useMemo(
    () => new MeshStandardMaterial({ color: "#1b1c1e", roughness: 0.35, metalness: 0.85 }),
    [],
  );
  const wood = useMemo(
    () => new MeshStandardMaterial({ color: "#5b3f27", roughness: 0.55 }),
    [],
  );
  const linen = useMemo(
    () => new MeshStandardMaterial({ color: "#d9d3c8", roughness: 0.85 }),
    [],
  );

  return (
    <group position={[-6.8, 0, -2]}>
      {/* Table */}
      <mesh material={metal} position={[0, 0.36, 0]} castShadow>
        <boxGeometry args={[2.8, 0.7, 1]} />
      </mesh>
      <mesh material={wood} position={[0, 0.74, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 0.08, 1.3]} />
      </mesh>
      {/* Chaises (3 de chaque côté) */}
      {[-1, 0, 1].map((x) =>
        [-0.95, 0.95].map((z) => (
          <group key={`${x}-${z}`} position={[x, 0, z]} rotation={[0, z > 0 ? Math.PI : 0, 0]}>
            <mesh material={darkWood} position={[0, 0.24, 0]} castShadow>
              <boxGeometry args={[0.46, 0.08, 0.46]} />
            </mesh>
            {[-0.19, 0.19].map((sx) =>
              [-0.19, 0.19].map((sz) => (
                <mesh key={`${sx}-${sz}`} material={metal} position={[sx, 0.12, sz]}>
                  <boxGeometry args={[0.04, 0.24, 0.04]} />
                </mesh>
              )),
            )}
            <mesh material={linen} position={[0, 0.5, -0.2]} castShadow>
              <boxGeometry args={[0.44, 0.5, 0.06]} />
            </mesh>
          </group>
        )),
      )}
      {/* Suspension sculpturale */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} material={metal} position={[(i - 1.5) * 0.32, 2.5 - i * 0.12, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1.2 - i * 0.1, 8]} />
        </mesh>
      ))}
      <pointLight position={[0, 2.1, 0]} intensity={9} distance={8} decay={2} color="#ffdcae" />
    </group>
  );
}
