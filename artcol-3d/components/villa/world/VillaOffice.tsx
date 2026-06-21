"use client";

import { useMemo } from "react";
import { MeshStandardMaterial, DoubleSide } from "three";
import { getVillaTextures } from "@/components/villa/textures";

/**
 * BUREAU = grande pièce fermée (aile NORD de la villa), dans le même esprit que
 * la cuisine / la bibliothèque mais 2 à 3× plus grande. Sa PORTE d'entrée est
 * percée dans le mur du fond du hall, ENTRE les deux œuvres (x = -6 et x = 0,
 * porte à x ≈ -3). Murs béton, fenêtre, plafond + mobilier complet :
 * mini-salon, TV, PC, armoire, statues, trophées.
 *
 * Empreinte intérieure : x ∈ [-9.5, 3.5], z ∈ [-17, -8.5], hauteur 3.6.
 */
const CX = -3;
const CZ = -12.75;
const H = 3.6;

export function VillaOffice() {
  const concrete = useMemo(() => {
    const t = getVillaTextures();
    const m = new MeshStandardMaterial({ color: "#b3a896", roughness: 0.92, side: DoubleSide });
    if (t) {
      const map = t.concrete.clone();
      map.needsUpdate = true;
      map.repeat.set(3, 1.5);
      m.map = map;
      const bump = t.concreteBump.clone();
      bump.needsUpdate = true;
      bump.repeat.set(3, 1.5);
      m.bumpMap = bump;
      m.bumpScale = 0.9;
    }
    return m;
  }, []);
  const marble = useMemo(() => {
    const t = getVillaTextures();
    const m = new MeshStandardMaterial({ color: "#d7d1c6", roughness: 0.2, metalness: 0.1, envMapIntensity: 1.1 });
    if (t) {
      const map = t.marble.clone();
      map.needsUpdate = true;
      map.repeat.set(4, 3);
      m.map = map;
    }
    return m;
  }, []);
  const cabinet = useMemo(() => new MeshStandardMaterial({ color: "#20232a", roughness: 0.5, metalness: 0.3 }), []);
  const metal = useMemo(() => new MeshStandardMaterial({ color: "#15161a", roughness: 0.4, metalness: 0.8 }), []);
  const wood = useMemo(() => new MeshStandardMaterial({ color: "#3a2a1c", roughness: 0.55 }), []);
  const fabric = useMemo(() => new MeshStandardMaterial({ color: "#cfc8bb", roughness: 0.9 }), []);
  const leather = useMemo(() => new MeshStandardMaterial({ color: "#23262c", roughness: 0.5 }), []);
  const stone = useMemo(() => new MeshStandardMaterial({ color: "#cdbb9c", roughness: 0.85 }), []);
  const bronze = useMemo(() => new MeshStandardMaterial({ color: "#b9853f", roughness: 0.28, metalness: 1 }), []);
  const gold = useMemo(() => new MeshStandardMaterial({ color: "#c8a13c", roughness: 0.25, metalness: 1 }), []);
  const glass = useMemo(
    () => new MeshStandardMaterial({ color: "#9fc4d6", roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.22, side: DoubleSide }),
    [],
  );
  const screen = useMemo(
    () => new MeshStandardMaterial({ color: "#05070c", emissive: "#1d3a66", emissiveIntensity: 1.2, roughness: 0.2 }),
    [],
  );

  return (
    <group>
      {/* ============================ COQUE ============================ */}
      {/* Sol marbre */}
      <mesh material={marble} position={[CX, 0.03, CZ]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[13, 8.5]} />
      </mesh>
      {/* Plafond + toit */}
      <mesh material={concrete} position={[CX, H, CZ]}><boxGeometry args={[13.2, 0.2, 8.7]} /></mesh>
      <mesh material={concrete} position={[CX, H + 0.18, CZ]} castShadow><boxGeometry args={[13.7, 0.2, 9.1]} /></mesh>
      {/* Murs latéraux */}
      <mesh material={concrete} position={[-9.65, H / 2, CZ]} castShadow receiveShadow><boxGeometry args={[0.3, H, 8.5]} /></mesh>
      <mesh material={concrete} position={[3.65, H / 2, CZ]} castShadow receiveShadow><boxGeometry args={[0.3, H, 8.5]} /></mesh>
      {/* Mur nord (z=-17) + grande FENÊTRE */}
      <mesh material={concrete} position={[CX, 0.5, -17]} castShadow receiveShadow><boxGeometry args={[13, 1.0, 0.3]} /></mesh>
      <mesh material={concrete} position={[CX, 3.2, -17]} castShadow><boxGeometry args={[13, 0.8, 0.3]} /></mesh>
      <mesh material={concrete} position={[-7.25, 1.9, -17]} castShadow><boxGeometry args={[4.5, 1.8, 0.3]} /></mesh>
      <mesh material={concrete} position={[1.25, 1.9, -17]} castShadow><boxGeometry args={[4.5, 1.8, 0.3]} /></mesh>
      <mesh material={glass} position={[CX, 1.9, -16.98]}><planeGeometry args={[4, 1.8]} /></mesh>
      {[[-2.95], [2.95]].map(([dz], i) => (
        <mesh key={i} material={metal} position={[CX + dz, 1.9, -16.96]}><boxGeometry args={[0.06, 1.8, 0.06]} /></mesh>
      ))}
      {/* Encadrement de la PORTE (mur du fond, x=-3, z=-8.5) */}
      <mesh material={metal} position={[-3.9, 1.3, -8.5]}><boxGeometry args={[0.12, 2.6, 0.16]} /></mesh>
      <mesh material={metal} position={[-2.1, 1.3, -8.5]}><boxGeometry args={[0.12, 2.6, 0.16]} /></mesh>
      <mesh material={metal} position={[-3, 2.6, -8.5]}><boxGeometry args={[2.0, 0.12, 0.16]} /></mesh>

      {/* ===================== BUREAU + PC (fond gauche) ===================== */}
      <group position={[-7, 0, -14.6]}>
        <mesh material={metal} position={[0, 0.38, 0]} castShadow><boxGeometry args={[2.0, 0.72, 0.95]} /></mesh>
        <mesh material={wood} position={[0, 0.76, 0]} castShadow receiveShadow><boxGeometry args={[2.2, 0.07, 1.05]} /></mesh>
        <mesh material={metal} position={[0, 0.85, -0.32]}><boxGeometry args={[0.08, 0.2, 0.12]} /></mesh>
        <mesh material={screen} position={[0, 1.14, -0.34]} castShadow><boxGeometry args={[1.05, 0.58, 0.04]} /></mesh>
        <mesh material={metal} position={[0, 0.82, 0.2]}><boxGeometry args={[0.55, 0.03, 0.2]} /></mesh>
        <group position={[0, 0, 0.8]} rotation={[0, Math.PI, 0]}>
          <mesh material={leather} position={[0, 0.5, 0]} castShadow><boxGeometry args={[0.62, 0.12, 0.58]} /></mesh>
          <mesh material={leather} position={[0, 0.86, -0.28]} castShadow><boxGeometry args={[0.62, 0.64, 0.1]} /></mesh>
          <mesh material={metal} position={[0, 0.28, 0]}><cylinderGeometry args={[0.04, 0.04, 0.44, 10]} /></mesh>
          <mesh material={metal} position={[0, 0.06, 0]}><cylinderGeometry args={[0.32, 0.32, 0.05, 16]} /></mesh>
        </group>
      </group>

      {/* ===================== MINI-SALON (centre) ===================== */}
      <mesh material={leather} position={[CX, 0.04, -11.6]} receiveShadow><boxGeometry args={[5, 0.04, 4]} /></mesh>
      {/* canapé 3 places (face à la TV au nord) */}
      <group position={[CX, 0, -10.4]}>
        <mesh material={metal} position={[0, 0.22, 0]} castShadow><boxGeometry args={[2.8, 0.4, 0.95]} /></mesh>
        <mesh material={fabric} position={[0, 0.46, -0.05]} castShadow><boxGeometry args={[2.7, 0.2, 0.8]} /></mesh>
        <mesh material={fabric} position={[0, 0.72, -0.4]} castShadow><boxGeometry args={[2.7, 0.5, 0.18]} /></mesh>
      </group>
      {/* 2 fauteuils */}
      {[-2.4, 2.4].map((dx) => (
        <group key={dx} position={[CX + dx, 0, -11.8]} rotation={[0, dx > 0 ? -0.7 : 0.7, 0]}>
          <mesh material={fabric} position={[0, 0.32, 0]} castShadow><boxGeometry args={[0.85, 0.3, 0.85]} /></mesh>
          <mesh material={fabric} position={[0, 0.64, -0.34]} castShadow><boxGeometry args={[0.85, 0.5, 0.16]} /></mesh>
        </group>
      ))}
      {/* table basse */}
      <mesh material={metal} position={[CX, 0.22, -12.2]} castShadow><boxGeometry args={[1.5, 0.12, 0.8]} /></mesh>

      {/* ===================== TV (console mur nord) ===================== */}
      <group position={[CX, 0, -16.5]}>
        <mesh material={cabinet} position={[0, 0.3, 0]} castShadow><boxGeometry args={[2.6, 0.5, 0.45]} /></mesh>
        <mesh material={screen} position={[0, 1.45, 0.12]} castShadow><boxGeometry args={[2.4, 1.3, 0.06]} /></mesh>
      </group>

      {/* ===================== ARMOIRE (fond droit) ===================== */}
      <mesh material={wood} position={[3.0, 1.1, -15.5]} castShadow receiveShadow><boxGeometry args={[1.0, 2.2, 0.55]} /></mesh>
      <mesh material={metal} position={[3.0, 1.1, -15.2]}><boxGeometry args={[0.03, 2.0, 0.02]} /></mesh>

      {/* ===================== STATUES (socle + bronze) ===================== */}
      {[[-8.5, -9.6], [2.7, -9.6]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh material={stone} position={[0, 0.6, 0]} castShadow receiveShadow><boxGeometry args={[0.7, 1.2, 0.7]} /></mesh>
          <mesh material={bronze} position={[0, 1.55, 0]} castShadow>
            {i === 0 ? <torusKnotGeometry args={[0.24, 0.09, 120, 18]} /> : <icosahedronGeometry args={[0.32, 0]} />}
          </mesh>
        </group>
      ))}

      {/* ===================== TROPHÉES (vitrine basse, mur est) ===================== */}
      <group position={[3.1, 0, -12.5]}>
        <mesh material={cabinet} position={[0, 0.5, 0]} castShadow><boxGeometry args={[0.5, 1.0, 2.2]} /></mesh>
        {[-0.7, 0, 0.7].map((dz, i) => (
          <group key={i} position={[0, 1.15, dz]}>
            <mesh material={gold}><cylinderGeometry args={[0.06, 0.08, 0.14, 14]} /></mesh>
            <mesh material={gold} position={[0, 0.15, 0]}><sphereGeometry args={[0.09, 14, 12]} /></mesh>
          </group>
        ))}
      </group>

      {/* ===================== ÉCLAIRAGE ===================== */}
      <pointLight position={[CX, 3.2, -11]} intensity={16} distance={12} decay={2} color="#ffe1b4" />
      <pointLight position={[-7, 3.0, -14.5]} intensity={8} distance={9} decay={2} color="#ffdcae" />
      <pointLight position={[CX, 2.2, -15.8]} intensity={5} distance={7} decay={2} color="#bcd0ff" />
    </group>
  );
}
