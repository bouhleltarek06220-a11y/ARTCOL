"use client";

import { useMemo } from "react";
import { MeshStandardMaterial } from "three";

/**
 * Entrée du domaine : portail monumental en travers de l'allée (z≈+42) + mur de
 * périmètre bas avec haie, de part et d'autre. Primitives uniquement.
 */
const GATE_Z = 42;
const ALLEY_X = -9.5;

export function EntranceGate() {
  const stone = useMemo(() => new MeshStandardMaterial({ color: "#cdbb9c", roughness: 0.85 }), []);
  const capStone = useMemo(() => new MeshStandardMaterial({ color: "#d8d2c6", roughness: 0.8 }), []);
  const concrete = useMemo(() => new MeshStandardMaterial({ color: "#b3a896", roughness: 0.92 }), []);
  const metal = useMemo(
    () => new MeshStandardMaterial({ color: "#1b1c1e", roughness: 0.4, metalness: 0.8 }),
    [],
  );
  const hedge = useMemo(() => new MeshStandardMaterial({ color: "#34501f", roughness: 1 }), []);

  return (
    <group>
      {/* ===== PILIERS ===== */}
      {[ALLEY_X - 3.3, ALLEY_X + 3.3].map((x, i) => (
        <group key={i} position={[x, 0, GATE_Z]}>
          <mesh material={stone} position={[0, 1.3, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.85, 2.6, 0.85]} />
          </mesh>
          <mesh material={capStone} position={[0, 2.68, 0]} castShadow>
            <boxGeometry args={[1.05, 0.18, 1.05]} />
          </mesh>
          <mesh material={capStone} position={[0, 2.86, 0]} castShadow>
            <boxGeometry args={[0.5, 0.2, 0.5]} />
          </mesh>
          {/* lanterne */}
          <mesh position={[0, 3.08, 0]}>
            <sphereGeometry args={[0.12, 14, 12]} />
            <meshStandardMaterial color="#2a1f0c" emissive="#ffdca6" emissiveIntensity={3} toneMapped={false} />
          </mesh>
          <pointLight position={[0, 3.1, 0]} intensity={5} distance={7} decay={2} color="#ffdca6" />
        </group>
      ))}

      {/* ===== VANTAUX (grilles métalliques entrouvertes) ===== */}
      {[
        { hinge: ALLEY_X - 2.9, dir: 1, open: -0.35 },
        { hinge: ALLEY_X + 2.9, dir: -1, open: 0.35 },
      ].map(({ hinge, dir, open }, gi) => (
        <group key={gi} position={[hinge, 0, GATE_Z]} rotation={[0, open, 0]}>
          {/* cadre */}
          <mesh material={metal} position={[dir * 1.25, 1.1, 0]}>
            <boxGeometry args={[2.5, 0.1, 0.08]} />
          </mesh>
          <mesh material={metal} position={[dir * 1.25, 2.15, 0]}>
            <boxGeometry args={[2.5, 0.12, 0.08]} />
          </mesh>
          <mesh material={metal} position={[dir * 1.25, 0.1, 0]}>
            <boxGeometry args={[2.5, 0.1, 0.08]} />
          </mesh>
          {/* barreaux verticaux */}
          {Array.from({ length: 11 }).map((_, b) => (
            <mesh key={b} material={metal} position={[dir * (0.1 + b * 0.23), 1.12, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 2.1, 8]} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ===== MUR DE PÉRIMÈTRE + HAIE (de part et d'autre du portail) ===== */}
      {[
        { x: -26.5, w: 27 }, // x de -40 à -13
        { x: 17, w: 46 }, // x de -6 à +40
      ].map(({ x, w }, i) => (
        <group key={i} position={[x, 0, GATE_Z]}>
          <mesh material={concrete} position={[0, 0.35, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, 0.7, 0.5]} />
          </mesh>
          <mesh material={stone} position={[0, 1.0, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, 0.7, 0.42]} />
          </mesh>
          <mesh material={capStone} position={[0, 1.38, 0]}>
            <boxGeometry args={[w, 0.1, 0.56]} />
          </mesh>
          {/* haie taillée au-dessus */}
          <mesh material={hedge} position={[0, 1.85, 0]} castShadow>
            <boxGeometry args={[w, 0.8, 0.7]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
