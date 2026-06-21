"use client";

// Hammam (cabine de vapeur orientale) au sous-sol — pièce d'angle x[-10.4,-7.6] z[-8,-3.2]
import { useMemo } from "react";
import { MeshStandardMaterial, DoubleSide } from "three";

export function BasementHammam() {
  const CX = -9;
  const CZ = -5.6;
  const W = 2.6;
  const D = 4.4;
  const H = 2.6;

  const marble = useMemo(
    () => new MeshStandardMaterial({ color: "#d7d1c6", roughness: 0.35, metalness: 0.05 }),
    [],
  );
  const stone = useMemo(
    () => new MeshStandardMaterial({ color: "#d8d2c6", roughness: 0.7, metalness: 0.02 }),
    [],
  );
  const brass = useMemo(
    () => new MeshStandardMaterial({ color: "#b9853f", roughness: 0.3, metalness: 1 }),
    [],
  );
  const glass = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#9fc4d6",
        transparent: true,
        opacity: 0.25,
        roughness: 0.1,
        metalness: 0,
        side: DoubleSide,
      }),
    [],
  );
  const haze = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#eef2f4",
        transparent: true,
        opacity: 0.06,
        depthWrite: false,
        roughness: 1,
      }),
    [],
  );
  const starWhite = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#ffffff",
        emissive: "#ffffff",
        emissiveIntensity: 2,
        toneMapped: false,
      }),
    [],
  );
  const starBlue = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#bcd0ff",
        emissive: "#bcd0ff",
        emissiveIntensity: 2,
        toneMapped: false,
      }),
    [],
  );

  const stars = useMemo(() => {
    const pts: { x: number; y: number; z: number; blue: boolean }[] = [];
    const n = 24;
    for (let i = 0; i < n; i++) {
      const fx = (Math.sin(i * 12.9898) * 43758.5453) % 1;
      const fz = (Math.sin(i * 78.233) * 12345.6789) % 1;
      const ux = Math.abs(fx);
      const uz = Math.abs(fz);
      const x = CX + (ux - 0.5) * (W - 0.4);
      const z = CZ + (uz - 0.5) * (D - 0.4);
      const y = H - 0.08 - Math.abs(Math.sin(i * 2.4)) * 0.12;
      pts.push({ x, y, z, blue: i % 3 === 0 });
    }
    return pts;
  }, []);

  return (
    <group position={[0, -3.85, 0]}>
      {/* Sol carrelé marbre */}
      <mesh position={[CX, 0.02, CZ]} material={marble} receiveShadow>
        <boxGeometry args={[W + 0.3, 0.04, D + 0.3]} />
      </mesh>

      {/* Murs de cabine en marbre */}
      <mesh position={[CX, H / 2, CZ - D / 2]} material={marble} castShadow>
        <boxGeometry args={[W + 0.3, H, 0.15]} />
      </mesh>
      <mesh position={[CX - W / 2, H / 2, CZ]} material={marble} castShadow>
        <boxGeometry args={[0.15, H, D + 0.3]} />
      </mesh>
      <mesh position={[CX + W / 2, H / 2, CZ]} material={marble} castShadow>
        <boxGeometry args={[0.15, H, D + 0.3]} />
      </mesh>
      {/* Mur d'accès z=-3.2 : 2 montants + porte verre */}
      <mesh position={[CX - W / 2 + 0.45, H / 2, CZ + D / 2]} material={marble} castShadow>
        <boxGeometry args={[0.9, H, 0.15]} />
      </mesh>
      <mesh position={[CX + W / 2 - 0.45, H / 2, CZ + D / 2]} material={marble} castShadow>
        <boxGeometry args={[0.9, H, 0.15]} />
      </mesh>
      <mesh position={[CX, H - 0.25, CZ + D / 2]} material={marble} castShadow>
        <boxGeometry args={[W + 0.3, 0.5, 0.15]} />
      </mesh>
      <mesh position={[CX, (H - 0.5) / 2, CZ + D / 2]} material={glass}>
        <boxGeometry args={[W - 0.6, H - 0.5, 0.04]} />
      </mesh>

      {/* Bancs marbre 2 niveaux (mur du fond) */}
      <mesh position={[CX, 0.45, CZ - D / 2 + 0.35]} material={marble} castShadow receiveShadow>
        <boxGeometry args={[W - 0.2, 0.18, 0.6]} />
      </mesh>
      <mesh position={[CX, 0.85, CZ - D / 2 + 0.65]} material={marble} castShadow receiveShadow>
        <boxGeometry args={[W - 0.2, 0.18, 0.5]} />
      </mesh>
      {/* Bancs mur gauche */}
      <mesh position={[CX - W / 2 + 0.3, 0.45, CZ - 0.3]} material={marble} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.18, D - 1.2]} />
      </mesh>
      <mesh position={[CX - W / 2 + 0.55, 0.85, CZ - 0.3]} material={marble} castShadow receiveShadow>
        <boxGeometry args={[0.45, 0.18, D - 1.6]} />
      </mesh>

      {/* Vasque centrale + bol laiton */}
      <mesh position={[CX, 0.2, CZ + 0.3]} material={stone} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.6, 0.4, 24]} />
      </mesh>
      <mesh position={[CX, 0.42, CZ + 0.3]} material={stone}>
        <cylinderGeometry args={[0.42, 0.42, 0.06, 24]} />
      </mesh>
      <mesh position={[CX, 0.5, CZ + 0.3]} material={brass} castShadow>
        <sphereGeometry args={[0.13, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>

      {/* Plafond voûté + dalle */}
      <mesh position={[CX, H, CZ]} material={marble} scale={[1, 0.18, 1]}>
        <sphereGeometry args={[1.5, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      <mesh position={[CX, H + 0.04, CZ]} material={marble}>
        <boxGeometry args={[W + 0.3, 0.08, D + 0.3]} />
      </mesh>

      {/* Ciel étoilé déterministe */}
      {stars.map((s, i) => (
        <mesh key={i} position={[s.x, s.y, s.z]} material={s.blue ? starBlue : starWhite}>
          <sphereGeometry args={[0.02, 8, 8]} />
        </mesh>
      ))}

      {/* Buée */}
      <mesh position={[CX, 1.7, CZ]} material={haze}>
        <boxGeometry args={[W - 0.1, 0.01, D - 0.1]} />
      </mesh>
      <mesh position={[CX, 2.2, CZ]} material={haze}>
        <boxGeometry args={[W - 0.1, 0.01, D - 0.1]} />
      </mesh>

      <pointLight position={[CX, 1.9, CZ]} color="#ffd9b0" intensity={4} distance={6} />
    </group>
  );
}
