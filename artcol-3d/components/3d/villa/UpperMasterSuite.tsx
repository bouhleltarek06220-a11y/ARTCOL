"use client";

import { useMemo } from "react";
import { MeshStandardMaterial, DoubleSide } from "three";

type Vec3 = [number, number, number];

// Suite parentale — plancher R1, surface au sol y=3.95
const FLOOR = 3.95;

export function UpperMasterSuite() {
  // --- Matériaux (palette du repo) ---
  const wallMat = useMemo(
    () => new MeshStandardMaterial({ color: "#d8d3ca", roughness: 0.9, side: DoubleSide }),
    [],
  );
  const woodMat = useMemo(
    () => new MeshStandardMaterial({ color: "#5b3f27", roughness: 0.6 }),
    [],
  );
  const darkWoodMat = useMemo(
    () => new MeshStandardMaterial({ color: "#3a2a1c", roughness: 0.5 }),
    [],
  );
  const stoneMat = useMemo(
    () => new MeshStandardMaterial({ color: "#d7d1c6", roughness: 0.3 }),
    [],
  );
  const metalMat = useMemo(
    () => new MeshStandardMaterial({ color: "#1b1c1e", roughness: 0.4, metalness: 0.8 }),
    [],
  );
  const linenMat = useMemo(
    () => new MeshStandardMaterial({ color: "#d9d3c8", roughness: 0.8 }),
    [],
  );
  const duvetMat = useMemo(
    () => new MeshStandardMaterial({ color: "#eae6dd", roughness: 0.85 }),
    [],
  );
  const glassMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#9fc4d6",
        roughness: 0.1,
        metalness: 0.1,
        transparent: true,
        opacity: 0.25,
        side: DoubleSide,
      }),
    [],
  );
  const rugMat = useMemo(
    () => new MeshStandardMaterial({ color: "#6b5640", roughness: 0.95 }),
    [],
  );
  const lampMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#ffdca6",
        emissive: "#ffdca6",
        emissiveIntensity: 1.5,
        roughness: 0.5,
      }),
    [],
  );

  // ---------- Sous-composants ----------

  // Cloison verticale (le long de Z), h 2.4 m, épaisseur 0.1 m.
  function WallZ({ x, z0, z1 }: { x: number; z0: number; z1: number }) {
    return (
      <mesh position={[x, 1.2, (z0 + z1) / 2]} material={wallMat} castShadow receiveShadow>
        <boxGeometry args={[0.1, 2.4, Math.abs(z1 - z0)]} />
      </mesh>
    );
  }

  // Lit king : sommier + matelas + couette + 2 oreillers
  function Bed({ position }: { position: Vec3 }) {
    const w = 2.0; // largeur lit (x)
    const d = 2.1; // profondeur lit (z)
    return (
      <group position={position}>
        {/* Sommier */}
        <mesh position={[0, 0.25, 0]} material={darkWoodMat} castShadow receiveShadow>
          <boxGeometry args={[w, 0.5, d]} />
        </mesh>
        {/* Tête de lit */}
        <mesh position={[0, 0.75, -d / 2 - 0.05]} material={linenMat} castShadow>
          <boxGeometry args={[w + 0.2, 1.1, 0.12]} />
        </mesh>
        {/* Matelas */}
        <mesh position={[0, 0.6, 0]} material={duvetMat} castShadow receiveShadow>
          <boxGeometry args={[w - 0.05, 0.25, d - 0.05]} />
        </mesh>
        {/* Couette */}
        <mesh position={[0, 0.78, 0.15]} material={duvetMat} castShadow>
          <boxGeometry args={[w, 0.12, d - 0.4]} />
        </mesh>
        {/* Oreillers */}
        <mesh position={[-0.5, 0.82, -d / 2 + 0.35]} material={linenMat} castShadow>
          <boxGeometry args={[0.7, 0.18, 0.4]} />
        </mesh>
        <mesh position={[0.5, 0.82, -d / 2 + 0.35]} material={linenMat} castShadow>
          <boxGeometry args={[0.7, 0.18, 0.4]} />
        </mesh>
      </group>
    );
  }

  // Table de chevet + lampe sphère emissive
  function Nightstand({ position }: { position: Vec3 }) {
    return (
      <group position={position}>
        <mesh position={[0, 0.25, 0]} material={woodMat} castShadow receiveShadow>
          <boxGeometry args={[0.5, 0.5, 0.45]} />
        </mesh>
        {/* Pied lampe */}
        <mesh position={[0, 0.6, 0]} material={metalMat} castShadow>
          <cylinderGeometry args={[0.03, 0.04, 0.2, 12]} />
        </mesh>
        {/* Abat-jour / sphère lumineuse */}
        <mesh position={[0, 0.75, 0]} material={lampMat}>
          <sphereGeometry args={[0.1, 16, 16]} />
        </mesh>
      </group>
    );
  }

  // Banc en pied de lit
  function Bench({ position }: { position: Vec3 }) {
    return (
      <group position={position}>
        <mesh position={[0, 0.22, 0]} material={linenMat} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.2, 0.5]} />
        </mesh>
        {([
          [-0.8, 0.11, -0.2],
          [0.8, 0.11, -0.2],
          [-0.8, 0.11, 0.2],
          [0.8, 0.11, 0.2],
        ] as Vec3[]).map((p, i) => (
          <mesh key={i} position={p} material={darkWoodMat} castShadow>
            <boxGeometry args={[0.06, 0.22, 0.06]} />
          </mesh>
        ))}
      </group>
    );
  }

  // Armoire / penderie basse
  function Wardrobe({ position }: { position: Vec3 }) {
    return (
      <group position={position}>
        <mesh position={[0, 0.9, 0]} material={woodMat} castShadow receiveShadow>
          <boxGeometry args={[2.4, 1.8, 0.55]} />
        </mesh>
        {([-0.6, 0, 0.6] as number[]).map((x, i) => (
          <mesh key={i} position={[x, 0.9, 0.28]} material={darkWoodMat}>
            <boxGeometry args={[0.03, 1.7, 0.02]} />
          </mesh>
        ))}
      </group>
    );
  }

  // Double vasque sur meuble + miroir
  function Vanity({ position }: { position: Vec3 }) {
    return (
      <group position={position}>
        <mesh position={[0, 0.4, 0]} material={darkWoodMat} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.8, 0.55]} />
        </mesh>
        <mesh position={[0, 0.83, 0]} material={stoneMat} castShadow>
          <boxGeometry args={[2.5, 0.06, 0.6]} />
        </mesh>
        {([-0.6, 0.6] as number[]).map((x, i) => (
          <mesh key={i} position={[x, 0.9, 0]} material={stoneMat} castShadow>
            <cylinderGeometry args={[0.22, 0.18, 0.12, 20]} />
          </mesh>
        ))}
        {([-0.6, 0.6] as number[]).map((x, i) => (
          <mesh key={`f${i}`} position={[x, 1.05, -0.18]} material={metalMat} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.18, 8]} />
          </mesh>
        ))}
        {/* Miroir contre le mur du fond */}
        <mesh position={[0, 1.55, -0.28]} material={glassMat} castShadow>
          <boxGeometry args={[2.2, 1.0, 0.04]} />
        </mesh>
      </group>
    );
  }

  // Baignoire îlot ovale
  function Bathtub({ position }: { position: Vec3 }) {
    return (
      <group position={position}>
        <mesh position={[0, 0.3, 0]} material={stoneMat} castShadow receiveShadow scale={[1, 1, 1.7]}>
          <cylinderGeometry args={[0.55, 0.5, 0.6, 28]} />
        </mesh>
        <mesh position={[0, 0.42, 0]} material={duvetMat} scale={[1, 1, 1.7]}>
          <cylinderGeometry args={[0.45, 0.42, 0.45, 28]} />
        </mesh>
      </group>
    );
  }

  // Douche à l'italienne (parois verre)
  function Shower({ position }: { position: Vec3 }) {
    return (
      <group position={position}>
        <mesh position={[0, 0.03, 0]} material={stoneMat} receiveShadow>
          <boxGeometry args={[1.2, 0.06, 1.2]} />
        </mesh>
        <mesh position={[0, 1.1, 0.6]} material={glassMat}>
          <boxGeometry args={[1.2, 2.0, 0.03]} />
        </mesh>
        <mesh position={[0.6, 1.1, 0]} material={glassMat}>
          <boxGeometry args={[0.03, 2.0, 1.2]} />
        </mesh>
        <mesh position={[-0.5, 2.0, -0.5]} material={metalMat} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.04, 16]} />
        </mesh>
      </group>
    );
  }

  // WC
  function Toilet({ position }: { position: Vec3 }) {
    return (
      <group position={position}>
        <mesh position={[0, 0.2, 0]} material={stoneMat} castShadow>
          <boxGeometry args={[0.38, 0.4, 0.55]} />
        </mesh>
        <mesh position={[0, 0.42, 0.05]} material={stoneMat} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.1, 20]} />
        </mesh>
        <mesh position={[0, 0.55, -0.22]} material={stoneMat} castShadow>
          <boxGeometry args={[0.36, 0.5, 0.14]} />
        </mesh>
      </group>
    );
  }

  // Module de penderie ouvert (dressing) : étagères + tringle
  function ClosetModule({ position }: { position: Vec3 }) {
    return (
      <group position={position}>
        <mesh position={[0, 1.0, 0]} material={woodMat} castShadow receiveShadow>
          <boxGeometry args={[1.0, 2.0, 0.45]} />
        </mesh>
        <mesh position={[0, 1.0, 0.12]} material={darkWoodMat}>
          <boxGeometry args={[0.9, 1.9, 0.4]} />
        </mesh>
        {([0.3, 0.7, 1.7] as number[]).map((y, i) => (
          <mesh key={i} position={[0, y, 0.14]} material={woodMat} castShadow>
            <boxGeometry args={[0.9, 0.03, 0.38]} />
          </mesh>
        ))}
        {/* Tringle métal (horizontale) */}
        <mesh position={[0, 1.35, 0.14]} rotation={[0, 0, Math.PI / 2]} material={metalMat}>
          <cylinderGeometry args={[0.015, 0.015, 0.9, 8]} />
        </mesh>
      </group>
    );
  }

  // ---------- Layout ----------
  return (
    <group position={[0, FLOOR, 0]}>
      {/* ===== CLOISONS (toutes en x > −6.4 : le NOYAU occupe l'arrière-gauche) =====
            On débouche du noyau (palier avant-gauche) dans la suite par
            l'ouverture avant (z > −5.2) le long de la cloison x=−6.4. */}
      {/* Cloison noyau / suite (laisse l'entrée à l'avant) */}
      <WallZ x={-6.4} z0={-8.3} z1={-5.2} />
      {/* Cloison dressing / chambre (ouverture avant) */}
      <WallZ x={-3.0} z0={-8.3} z1={-5.6} />
      {/* Cloison chambre / salle de bain (ouverture avant) */}
      <WallZ x={5.6} z0={-8.3} z1={-5.2} />

      {/* ===== DRESSING (gauche, x[−6.3,−3]) ===== */}
      <ClosetModule position={[-5.9, 0, -7.9]} />
      <ClosetModule position={[-4.8, 0, -7.9]} />
      <ClosetModule position={[-3.7, 0, -7.9]} />
      <Wardrobe position={[-4.7, 0, -5.3]} />
      <mesh position={[-4.7, 0.45, -6.4]} material={woodMat} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.9, 0.9]} />
      </mesh>

      {/* ===== CHAMBRE (centre, x[−3,5.6]) ===== */}
      <Bed position={[1.3, 0, -7.0]} />
      <Nightstand position={[-0.3, 0, -7.7]} />
      <Nightstand position={[2.9, 0, -7.7]} />
      <Bench position={[1.3, 0, -4.7]} />
      <mesh position={[1.3, 0.01, -6.2]} material={rugMat} receiveShadow>
        <boxGeometry args={[4.0, 0.02, 4.0]} />
      </mesh>
      {/* TV murale (mur du fond) */}
      <mesh position={[1.3, 1.6, -8.42]} material={metalMat} castShadow>
        <boxGeometry args={[1.8, 1.0, 0.06]} />
      </mesh>

      {/* ===== SALLE DE BAIN (droite, x[5.8,10]) ===== */}
      <Vanity position={[8.4, 0, -8.0]} />
      <Bathtub position={[8.6, 0, -5.0]} />
      <Shower position={[9.3, 0, -6.9]} />
      <Toilet position={[6.4, 0, -8.0]} />

      {/* ===== ÉCLAIRAGE chaud ===== */}
      <pointLight position={[1.3, 2.4, -6.5]} color="#ffdca6" intensity={7} distance={8} decay={2} />
      <pointLight position={[8.3, 2.4, -6.8]} color="#ffdca6" intensity={6} distance={8} decay={2} />
      <pointLight position={[-4.6, 2.4, -6.6]} color="#ffdca6" intensity={5} distance={7} decay={2} />
    </group>
  );
}
