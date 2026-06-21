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

  // Cloison haute 2.4 m (de y=3.95 à y=6.35) avec épaisseur fine
  function Partition({
    position,
    size,
  }: {
    position: Vec3;
    size: [number, number]; // [longueur, épaisseur]
  }) {
    return (
      <mesh position={position} material={wallMat} castShadow receiveShadow>
        <boxGeometry args={[size[0], 2.4, size[1]]} />
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
      {/* ===== CLOISONS (h 2.4 m, centre à y=1.2 au-dessus du sol) ===== */}
      {/* Cloison SdB / Dressing (gauche, en z≈−6.1) */}
      <Partition position={[-6.85, 1.2, -6.1]} size={[7.3, 0.1]} />
      {/* Cloison verticale séparant zone gauche de la chambre, en x≈−3.1 (ouverture ≈0.9 m) */}
      <mesh position={[-3.1, 1.2, -7.1]} material={wallMat} castShadow receiveShadow>
        <boxGeometry args={[0.1, 2.4, 2.8]} />
      </mesh>
      <mesh position={[-3.1, 1.2, -4.55]} material={wallMat} castShadow receiveShadow>
        <boxGeometry args={[0.1, 2.4, 1.5]} />
      </mesh>

      {/* Cloison avant le long de z≈−3.8 (suite / palier) avec ouverture vers l'escalier */}
      <mesh position={[-3.35, 1.2, -3.8]} material={wallMat} castShadow receiveShadow>
        <boxGeometry args={[14.7, 2.4, 0.1]} />
      </mesh>
      <mesh position={[9.35, 1.2, -3.8]} material={wallMat} castShadow receiveShadow>
        <boxGeometry args={[2.7, 2.4, 0.1]} />
      </mesh>

      {/* ===== CHAMBRE (centre-droit) ===== */}
      <Bed position={[3.5, 0, -7.0]} />
      <Nightstand position={[1.9, 0, -7.7]} />
      <Nightstand position={[5.1, 0, -7.7]} />
      <Bench position={[3.5, 0, -4.7]} />
      <Wardrobe position={[9.6, 0, -7.7]} />
      <mesh position={[3.5, 0.01, -6.2]} material={rugMat} receiveShadow>
        <boxGeometry args={[4.0, 0.02, 4.0]} />
      </mesh>
      <mesh position={[7.0, 1.6, -8.42]} material={metalMat} castShadow>
        <boxGeometry args={[1.8, 1.0, 0.06]} />
      </mesh>

      {/* ===== SALLE DE BAIN (gauche-fond) ===== */}
      <Vanity position={[-9.0, 0, -8.1]} />
      <Bathtub position={[-4.6, 0, -7.3]} />
      <Shower position={[-9.2, 0, -6.9]} />
      <Toilet position={[-6.6, 0, -8.1]} />

      {/* ===== DRESSING (gauche-avant) ===== */}
      <ClosetModule position={[-10.0, 0, -5.7]} />
      <ClosetModule position={[-8.9, 0, -5.7]} />
      <ClosetModule position={[-7.8, 0, -5.7]} />
      <ClosetModule position={[-6.7, 0, -5.7]} />
      <mesh position={[-5.0, 0.45, -5.0]} material={woodMat} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.9, 0.9]} />
      </mesh>

      {/* ===== ÉCLAIRAGE chaud ===== */}
      <pointLight position={[3.5, 2.4, -6.5]} color="#ffdca6" intensity={7} distance={8} decay={2} />
      <pointLight position={[-6.5, 2.4, -7.2]} color="#ffdca6" intensity={6} distance={8} decay={2} />
    </group>
  );
}
