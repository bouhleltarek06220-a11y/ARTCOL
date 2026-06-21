"use client";

import { useMemo } from "react";
import { MeshStandardMaterial } from "three";
import { MeshReflectorMaterial } from "@react-three/drei";

/**
 * Salle de sport au sous-sol. Zone monde : x ∈ [1, 10], z ∈ [−8, −2.8].
 * Group décalé à y = −3.85 → sol local y = 0, plafond local y ≈ 3.85.
 */
type Mats = {
  rubber: MeshStandardMaterial;
  darkMetal: MeshStandardMaterial;
  lightMetal: MeshStandardMaterial;
  accent: MeshStandardMaterial;
  leather: MeshStandardMaterial;
};
type PartProps = {
  mats: Mats;
  position: [number, number, number];
  rotation?: [number, number, number];
};

export function BasementGym() {
  const mats = useMemo<Mats>(() => {
    return {
      rubber: new MeshStandardMaterial({ color: "#26272b", roughness: 0.95, metalness: 0.05 }),
      darkMetal: new MeshStandardMaterial({ color: "#1b1c1e", metalness: 0.8, roughness: 0.35 }),
      lightMetal: new MeshStandardMaterial({ color: "#9a9aa0", metalness: 0.7, roughness: 0.4 }),
      accent: new MeshStandardMaterial({ color: "#d9601e", metalness: 0.3, roughness: 0.5 }),
      leather: new MeshStandardMaterial({ color: "#23262c", roughness: 0.7, metalness: 0.1 }),
    };
  }, []);

  return (
    <group position={[0, -3.85, 0]}>
      {/* SOL caoutchouc */}
      <mesh position={[5.5, 0.01, -5.4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={mats.rubber}>
        <planeGeometry args={[9, 5.2]} />
      </mesh>

      {/* MIROIR mural (mur du fond z=-8) */}
      <mesh position={[5.5, 1.9, -7.96]}>
        <planeGeometry args={[8.6, 3.6]} />
        <MeshReflectorMaterial
          resolution={1024}
          blur={[0, 0]}
          mixBlur={0}
          mixStrength={1}
          roughness={0.05}
          metalness={0.6}
          color="#dfe3ea"
          mirror={1}
        />
      </mesh>
      <mesh position={[5.5, 1.9, -7.99]} material={mats.darkMetal}>
        <boxGeometry args={[8.8, 3.8, 0.05]} />
      </mesh>

      {/* ÉQUIPEMENTS */}
      <Treadmill mats={mats} position={[2.5, 0, -6.6]} rotation={[0, 0.25, 0]} />
      <DumbbellRack mats={mats} position={[8.6, 0, -7]} rotation={[0, -0.4, 0]} />
      <Bench mats={mats} position={[5.4, 0, -5]} rotation={[0, 0, 0]} />
      <Bike mats={mats} position={[7.6, 0, -4]} rotation={[0, -0.6, 0]} />
      <mesh position={[3.6, 0.38, -3.6]} castShadow receiveShadow material={mats.accent}>
        <sphereGeometry args={[0.38, 24, 24]} />
      </mesh>

      {/* Éclairage froid */}
      <pointLight position={[3.5, 3.4, -5.5]} color="#cfe0ff" intensity={7} distance={9} />
      <pointLight position={[7.5, 3.4, -5]} color="#cfe0ff" intensity={7} distance={9} />
    </group>
  );
}

/* ---------- TAPIS DE COURSE ---------- */
function Treadmill({ mats, position, rotation = [0, 0, 0] }: PartProps) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow material={mats.darkMetal}>
        <boxGeometry args={[0.9, 0.24, 1.8]} />
      </mesh>
      <mesh position={[0, 0.27, 0.1]} rotation={[-0.06, 0, 0]} castShadow receiveShadow material={mats.rubber}>
        <boxGeometry args={[0.62, 0.04, 1.5]} />
      </mesh>
      <mesh position={[-0.36, 0.75, -0.78]} castShadow receiveShadow material={mats.lightMetal}>
        <boxGeometry args={[0.07, 1.3, 0.07]} />
      </mesh>
      <mesh position={[0.36, 0.75, -0.78]} castShadow receiveShadow material={mats.lightMetal}>
        <boxGeometry args={[0.07, 1.3, 0.07]} />
      </mesh>
      <mesh position={[0, 1.4, -0.74]} rotation={[0.3, 0, 0]} castShadow receiveShadow material={mats.darkMetal}>
        <boxGeometry args={[0.78, 0.4, 0.06]} />
      </mesh>
      <mesh position={[0, 1.18, -0.7]} rotation={[0, 0, Math.PI / 2]} castShadow material={mats.lightMetal}>
        <cylinderGeometry args={[0.03, 0.03, 0.78, 12]} />
      </mesh>
    </group>
  );
}

/* ---------- RACK D'HALTÈRES ---------- */
function DumbbellRack({ mats, position, rotation = [0, 0, 0] }: PartProps) {
  const Dumbbell = () => (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow material={mats.lightMetal}>
        <cylinderGeometry args={[0.025, 0.025, 0.5, 10]} />
      </mesh>
      {[-0.21, -0.13, 0.13, 0.21].map((z) => (
        <mesh key={z} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]} castShadow material={mats.darkMetal}>
          <cylinderGeometry args={[0.09, 0.09, 0.05, 16]} />
        </mesh>
      ))}
    </group>
  );
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[-0.55, 0.55, 0]} castShadow receiveShadow material={mats.accent}>
        <boxGeometry args={[0.08, 1.1, 0.08]} />
      </mesh>
      <mesh position={[0.55, 0.55, 0]} castShadow receiveShadow material={mats.accent}>
        <boxGeometry args={[0.08, 1.1, 0.08]} />
      </mesh>
      {[0.35, 0.65, 0.95].map((y) => (
        <mesh key={y} position={[0, y, 0.05]} rotation={[0.25, 0, 0]} castShadow receiveShadow material={mats.darkMetal}>
          <boxGeometry args={[1.1, 0.04, 0.28]} />
        </mesh>
      ))}
      <group position={[0, 0.42, 0.07]}><Dumbbell /></group>
      <group position={[0, 0.72, 0.07]}><Dumbbell /></group>
      <group position={[0, 1.02, 0.07]}><Dumbbell /></group>
    </group>
  );
}

/* ---------- BANC DE MUSCULATION ---------- */
function Bench({ mats, position, rotation = [0, 0, 0] }: PartProps) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow material={mats.leather}>
        <boxGeometry args={[0.4, 0.1, 1.3]} />
      </mesh>
      <mesh position={[0, 0.22, 0.5]} rotation={[0.4, 0, 0]} castShadow material={mats.darkMetal}>
        <boxGeometry args={[0.36, 0.06, 0.5]} />
      </mesh>
      <mesh position={[0, 0.22, -0.5]} rotation={[-0.4, 0, 0]} castShadow material={mats.darkMetal}>
        <boxGeometry args={[0.36, 0.06, 0.5]} />
      </mesh>
      <mesh position={[0, 0.05, 0]} castShadow material={mats.darkMetal}>
        <boxGeometry args={[0.3, 0.06, 1.1]} />
      </mesh>
    </group>
  );
}

/* ---------- VÉLO D'APPARTEMENT ---------- */
function Bike({ mats, position, rotation = [0, 0, 0] }: PartProps) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.55, 0.45]} rotation={[0, 0, Math.PI / 2]} castShadow material={mats.lightMetal}>
        <cylinderGeometry args={[0.35, 0.35, 0.08, 28]} />
      </mesh>
      <mesh position={[0, 0.6, -0.05]} rotation={[0.45, 0, 0]} castShadow material={mats.accent}>
        <boxGeometry args={[0.08, 1.0, 0.08]} />
      </mesh>
      <mesh position={[0, 0.85, -0.45]} castShadow material={mats.darkMetal}>
        <boxGeometry args={[0.06, 0.5, 0.06]} />
      </mesh>
      <mesh position={[0, 1.08, -0.45]} castShadow receiveShadow material={mats.leather}>
        <boxGeometry args={[0.18, 0.07, 0.32]} />
      </mesh>
      <mesh position={[0, 1.0, 0.2]} castShadow material={mats.darkMetal}>
        <boxGeometry args={[0.06, 0.5, 0.06]} />
      </mesh>
      <mesh position={[0, 1.22, 0.22]} rotation={[0, 0, Math.PI / 2]} castShadow material={mats.lightMetal}>
        <cylinderGeometry args={[0.025, 0.025, 0.36, 12]} />
      </mesh>
      <mesh position={[0, 0.06, 0]} castShadow receiveShadow material={mats.darkMetal}>
        <boxGeometry args={[0.5, 0.1, 1.1]} />
      </mesh>
    </group>
  );
}
