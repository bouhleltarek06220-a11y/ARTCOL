"use client";

import { useMemo } from "react";
import { MeshStandardMaterial, DoubleSide } from "three";

/**
 * Bloc 3 (suite) — Cuisine ouverte + Salle à manger, en plan ouvert luxe dans
 * la partie arrière-gauche du rez. Îlot central marbre, crédence + meubles
 * hauts, cave à vin vitrée lumineuse, grande table et chaises, suspensions.
 */
export function VillaKitchenDining() {
  const marble = useMemo(
    () => new MeshStandardMaterial({ color: "#ece8e1", roughness: 0.18, metalness: 0.1 }),
    [],
  );
  const darkWood = useMemo(
    () => new MeshStandardMaterial({ color: "#3a2a1c", roughness: 0.6 }),
    [],
  );
  const cabinet = useMemo(
    () => new MeshStandardMaterial({ color: "#20232a", roughness: 0.5, metalness: 0.3 }),
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
  const glass = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#0c1519",
        roughness: 0.05,
        metalness: 0.1,
        transparent: true,
        opacity: 0.35,
        side: DoubleSide,
      }),
    [],
  );
  const wineGlow = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#1a0a06",
        emissive: "#ff7a3a",
        emissiveIntensity: 1.6,
        toneMapped: false,
      }),
    [],
  );

  return (
    <group>
      {/* ===================== CUISINE ===================== */}
      {/* Îlot central */}
      <group position={[-6.5, 0, -6.2]}>
        <mesh material={cabinet} position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.4, 0.9, 1.1]} />
        </mesh>
        <mesh material={marble} position={[0, 0.93, 0]} castShadow>
          <boxGeometry args={[3.7, 0.08, 1.35]} />
        </mesh>
        {/* Tabourets côté salle */}
        {[-1.1, 0, 1.1].map((x) => (
          <group key={x} position={[x, 0, 0.95]}>
            <mesh material={metal} position={[0, 0.31, 0]} castShadow>
              <cylinderGeometry args={[0.03, 0.03, 0.62, 10]} />
            </mesh>
            <mesh material={darkWood} position={[0, 0.64, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.18, 0.06, 18]} />
            </mesh>
          </group>
        ))}
        {/* Suspensions au-dessus de l'îlot */}
        {[-0.8, 0.8].map((x) => (
          <group key={x} position={[x, 0, 0]}>
            <mesh material={metal} position={[0, 1.55, 0]}>
              <coneGeometry args={[0.16, 0.28, 18, 1, true]} />
            </mesh>
            <mesh position={[0, 1.45, 0]}>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshStandardMaterial color="#241708" emissive="#ffcf8f" emissiveIntensity={3} toneMapped={false} />
            </mesh>
          </group>
        ))}
        <pointLight position={[0, 1.5, 0]} intensity={8} distance={6} decay={2} color="#ffdca6" />
      </group>

      {/* Crédence + meubles hauts le long du mur du fond (z ≈ -7.9) */}
      <mesh material={cabinet} position={[-7, 0.45, -7.9]} castShadow receiveShadow>
        <boxGeometry args={[6, 0.9, 0.6]} />
      </mesh>
      <mesh material={marble} position={[-7, 0.92, -7.9]}>
        <boxGeometry args={[6.2, 0.06, 0.66]} />
      </mesh>
      <mesh material={cabinet} position={[-7, 2.1, -7.95]} castShadow>
        <boxGeometry args={[6, 0.8, 0.42]} />
      </mesh>

      {/* Cave à vin vitrée lumineuse */}
      <group position={[-3.4, 0, -7.9]}>
        <mesh material={cabinet} position={[0, 1.3, 0]} castShadow>
          <boxGeometry args={[1.3, 2.6, 0.55]} />
        </mesh>
        <mesh material={wineGlow} position={[0, 1.3, 0.2]}>
          <planeGeometry args={[1, 2.3]} />
        </mesh>
        <mesh material={glass} position={[0, 1.3, 0.29]}>
          <planeGeometry args={[1.1, 2.4]} />
        </mesh>
        <pointLight position={[0, 1.3, 0.6]} intensity={3} distance={4} decay={2} color="#ff8a4a" />
      </group>

      {/* ===================== SALLE À MANGER ===================== */}
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
          <mesh
            key={i}
            material={metal}
            position={[(i - 1.5) * 0.32, 2.5 - i * 0.12, 0]}
          >
            <cylinderGeometry args={[0.03, 0.03, 1.2 - i * 0.1, 8]} />
          </mesh>
        ))}
        <pointLight position={[0, 2.1, 0]} intensity={9} distance={8} decay={2} color="#ffdcae" />
      </group>
    </group>
  );
}
