"use client";

import { useMemo } from "react";
import { MeshStandardMaterial, DoubleSide } from "three";

/**
 * BUREAU = vraie pièce VITRÉE (verrière + porte) dans le hall, entre les deux
 * œuvres du fond (x = -6 et x = 0 → centrée x ≈ -3). Assez grande, avec
 * mini-salon, TV, PC, armoire, fenêtres (parois vitrées), statues et trophées.
 *
 * Empreinte : x ∈ [-5.8, -0.2], z ∈ [-8.2, -4.0], hauteur 3.0.
 */
export function VillaOffice() {
  const glass = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#cfe0e6",
        roughness: 0.04,
        metalness: 0.1,
        transparent: true,
        opacity: 0.16,
        envMapIntensity: 1.6,
        side: DoubleSide,
      }),
    [],
  );
  const frame = useMemo(() => new MeshStandardMaterial({ color: "#15161a", roughness: 0.4, metalness: 0.8 }), []);
  const wood = useMemo(() => new MeshStandardMaterial({ color: "#3a2a1c", roughness: 0.55 }), []);
  const fabric = useMemo(() => new MeshStandardMaterial({ color: "#cfc8bb", roughness: 0.9 }), []);
  const leather = useMemo(() => new MeshStandardMaterial({ color: "#23262c", roughness: 0.5 }), []);
  const stone = useMemo(() => new MeshStandardMaterial({ color: "#cdbb9c", roughness: 0.85 }), []);
  const gold = useMemo(() => new MeshStandardMaterial({ color: "#c8a13c", roughness: 0.25, metalness: 1 }), []);
  const screen = useMemo(
    () => new MeshStandardMaterial({ color: "#05070c", emissive: "#1d3a66", emissiveIntensity: 1.2, roughness: 0.2 }),
    [],
  );
  const bronze = useMemo(() => new MeshStandardMaterial({ color: "#b9853f", roughness: 0.28, metalness: 1 }), []);

  return (
    <group>
      {/* ===================== VERRIÈRE (parois vitrées) ===================== */}
      {/* Façade avant (z=-4) avec porte (x∈[-3.8,-2.2]) */}
      <mesh material={glass} position={[-4.8, 1.5, -4.0]}><planeGeometry args={[2.0, 3.0]} /></mesh>
      <mesh material={glass} position={[-1.2, 1.5, -4.0]}><planeGeometry args={[2.0, 3.0]} /></mesh>
      <mesh material={glass} position={[-3.0, 2.6, -4.0]}><planeGeometry args={[1.6, 0.8]} /></mesh>
      {/* Paroi arrière (z=-8.2) */}
      <mesh material={glass} position={[-3.0, 1.5, -8.2]}><planeGeometry args={[5.6, 3.0]} /></mesh>
      {/* Parois latérales */}
      <mesh material={glass} position={[-5.8, 1.5, -6.1]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[4.2, 3.0]} /></mesh>
      <mesh material={glass} position={[-0.2, 1.5, -6.1]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[4.2, 3.0]} /></mesh>
      {/* Plafond */}
      <mesh material={frame} position={[-3.0, 3.0, -6.1]}><boxGeometry args={[5.8, 0.12, 4.4]} /></mesh>
      {/* Poteaux d'angle + encadrement de porte (métal noir) */}
      {[
        [-5.8, -4.0], [-0.2, -4.0], [-5.8, -8.2], [-0.2, -8.2],
      ].map(([x, z], i) => (
        <mesh key={i} material={frame} position={[x, 1.5, z]}><boxGeometry args={[0.12, 3.0, 0.12]} /></mesh>
      ))}
      <mesh material={frame} position={[-3.8, 1.1, -4.0]}><boxGeometry args={[0.1, 2.2, 0.12]} /></mesh>
      <mesh material={frame} position={[-2.2, 1.1, -4.0]}><boxGeometry args={[0.1, 2.2, 0.12]} /></mesh>
      <mesh material={frame} position={[-3.0, 2.2, -4.0]}><boxGeometry args={[1.7, 0.1, 0.12]} /></mesh>
      {/* Bandeaux haut/bas des parois (cadre) */}
      <mesh material={frame} position={[-3.0, 3.0, -6.1]}><boxGeometry args={[5.7, 0.06, 4.3]} /></mesh>

      {/* Tapis */}
      <mesh material={leather} position={[-3.0, 0.04, -5.4]} receiveShadow>
        <boxGeometry args={[3.2, 0.04, 2.2]} />
      </mesh>

      {/* ===================== BUREAU + PC ===================== */}
      <group position={[-4.4, 0, -7.4]}>
        <mesh material={frame} position={[0, 0.38, 0]} castShadow><boxGeometry args={[1.9, 0.72, 0.9]} /></mesh>
        <mesh material={wood} position={[0, 0.76, 0]} castShadow receiveShadow><boxGeometry args={[2.1, 0.07, 1.0]} /></mesh>
        {/* écran PC */}
        <mesh material={frame} position={[0, 0.83, -0.3]}><boxGeometry args={[0.08, 0.2, 0.12]} /></mesh>
        <mesh material={screen} position={[0, 1.12, -0.32]} castShadow><boxGeometry args={[1.0, 0.56, 0.04]} /></mesh>
        {/* clavier */}
        <mesh material={frame} position={[0, 0.81, 0.18]}><boxGeometry args={[0.5, 0.03, 0.18]} /></mesh>
        {/* fauteuil */}
        <group position={[0, 0, 0.75]}>
          <mesh material={leather} position={[0, 0.5, 0]} castShadow><boxGeometry args={[0.6, 0.12, 0.55]} /></mesh>
          <mesh material={leather} position={[0, 0.85, 0.27]} castShadow><boxGeometry args={[0.6, 0.62, 0.1]} /></mesh>
          <mesh material={frame} position={[0, 0.28, 0]}><cylinderGeometry args={[0.04, 0.04, 0.44, 10]} /></mesh>
          <mesh material={frame} position={[0, 0.06, 0]}><cylinderGeometry args={[0.3, 0.3, 0.05, 16]} /></mesh>
        </group>
      </group>

      {/* ===================== TV (sur console) ===================== */}
      <group position={[-1.4, 0, -7.8]}>
        <mesh material={frame} position={[0, 0.3, 0]} castShadow><boxGeometry args={[1.6, 0.5, 0.4]} /></mesh>
        <mesh material={screen} position={[0, 1.15, 0.05]} castShadow><boxGeometry args={[1.5, 0.85, 0.05]} /></mesh>
      </group>

      {/* ===================== ARMOIRE ===================== */}
      <mesh material={wood} position={[-5.1, 1.05, -7.6]} castShadow receiveShadow>
        <boxGeometry args={[1.0, 2.1, 0.5]} />
      </mesh>
      <mesh material={frame} position={[-5.1, 1.05, -7.34]}><boxGeometry args={[0.04, 2.0, 0.02]} /></mesh>

      {/* ===================== MINI-SALON ===================== */}
      {/* canapé 2 places (face à la TV) */}
      <group position={[-3.2, 0, -5.2]}>
        <mesh material={frame} position={[0, 0.22, 0]} castShadow><boxGeometry args={[1.9, 0.4, 0.85]} /></mesh>
        <mesh material={fabric} position={[0, 0.45, 0.05]} castShadow><boxGeometry args={[1.8, 0.2, 0.7]} /></mesh>
        <mesh material={fabric} position={[0, 0.68, 0.36]} castShadow><boxGeometry args={[1.8, 0.45, 0.18]} /></mesh>
      </group>
      {/* fauteuil */}
      <group position={[-1.3, 0, -5.4]} rotation={[0, -0.6, 0]}>
        <mesh material={fabric} position={[0, 0.32, 0]} castShadow><boxGeometry args={[0.8, 0.3, 0.8]} /></mesh>
        <mesh material={fabric} position={[0, 0.62, -0.32]} castShadow><boxGeometry args={[0.8, 0.5, 0.16]} /></mesh>
      </group>
      {/* table basse */}
      <mesh material={frame} position={[-2.9, 0.22, -5.9]} castShadow><boxGeometry args={[1.0, 0.1, 0.6]} /></mesh>

      {/* ===================== STATUE (socle + bronze) ===================== */}
      <mesh material={stone} position={[-5.1, 0.55, -4.7]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 1.1, 0.6]} />
      </mesh>
      <mesh material={bronze} position={[-5.1, 1.4, -4.7]} castShadow>
        <torusKnotGeometry args={[0.22, 0.08, 120, 18]} />
      </mesh>

      {/* ===================== TROPHÉES (étagère + coupes) ===================== */}
      <mesh material={wood} position={[-0.9, 1.5, -7.6]} castShadow><boxGeometry args={[0.9, 0.05, 0.32]} /></mesh>
      {[-0.3, 0, 0.3].map((dx, i) => (
        <group key={i} position={[-0.9 + dx, 1.53, -7.6]}>
          <mesh material={gold}><cylinderGeometry args={[0.05, 0.07, 0.12, 14]} /></mesh>
          <mesh material={gold} position={[0, 0.13, 0]}><sphereGeometry args={[0.08, 14, 12]} /></mesh>
        </group>
      ))}

      {/* ===================== ÉCLAIRAGE ===================== */}
      <pointLight position={[-3.0, 2.7, -6.0]} intensity={13} distance={9} decay={2} color="#ffe1b4" />
      <pointLight position={[-3.0, 1.6, -4.8]} intensity={5} distance={6} decay={2} color="#bcd0ff" />
    </group>
  );
}
