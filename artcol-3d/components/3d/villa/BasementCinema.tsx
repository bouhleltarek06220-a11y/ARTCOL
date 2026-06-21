"use client";

// BasementCinema — salle de cinéma privée au sous-sol. Zone x[1,10] z[-2,2].
import { useMemo } from "react";
import { MeshStandardMaterial, DoubleSide } from "three";

function Seat({
  position,
  material,
}: {
  position: [number, number, number];
  material: MeshStandardMaterial;
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow material={material}>
        <boxGeometry args={[0.78, 0.12, 0.72]} />
      </mesh>
      <mesh position={[0, 0.34, 0.02]} castShadow receiveShadow material={material}>
        <boxGeometry args={[0.7, 0.18, 0.64]} />
      </mesh>
      <mesh position={[0, 0.66, -0.28]} rotation={[-0.16, 0, 0]} castShadow receiveShadow material={material}>
        <boxGeometry args={[0.7, 0.62, 0.16]} />
      </mesh>
      <mesh position={[-0.39, 0.46, 0.02]} castShadow receiveShadow material={material}>
        <boxGeometry args={[0.12, 0.28, 0.6]} />
      </mesh>
      <mesh position={[0.39, 0.46, 0.02]} castShadow receiveShadow material={material}>
        <boxGeometry args={[0.12, 0.28, 0.6]} />
      </mesh>
    </group>
  );
}

export function BasementCinema() {
  const carpetMat = useMemo(
    () => new MeshStandardMaterial({ color: "#1a1a1d", roughness: 0.95 }),
    [],
  );
  const leatherMat = useMemo(
    () => new MeshStandardMaterial({ color: "#23262c", roughness: 0.55, metalness: 0.05 }),
    [],
  );
  const darkMetalMat = useMemo(
    () => new MeshStandardMaterial({ color: "#1b1c1e", roughness: 0.4, metalness: 0.6 }),
    [],
  );
  const frameMat = useMemo(
    () => new MeshStandardMaterial({ color: "#0c0c0e", roughness: 0.7, metalness: 0.2 }),
    [],
  );
  const screenMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#20242c",
        emissive: "#20242c",
        emissiveIntensity: 0.6,
        toneMapped: false,
        roughness: 0.3,
        side: DoubleSide,
      }),
    [],
  );
  const sconceMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#ffb060",
        emissive: "#ffb060",
        emissiveIntensity: 0.8,
        toneMapped: false,
      }),
    [],
  );
  const acousticMat = useMemo(
    () => new MeshStandardMaterial({ color: "#202024", roughness: 0.9 }),
    [],
  );

  const seatXs = useMemo(() => [4.4, 5.5, 6.6], []);

  return (
    <group position={[0, -3.85, 0]}>
      {/* MOQUETTE */}
      <mesh position={[5.5, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={carpetMat}>
        <planeGeometry args={[9, 4]} />
      </mesh>

      {/* GRADIN 2e rang */}
      <mesh position={[5.5, 0.175, -1.4]} castShadow receiveShadow material={carpetMat}>
        <boxGeometry args={[6, 0.35, 1.3]} />
      </mesh>

      {/* ÉCRAN (mur sud z≈1.9) */}
      <mesh position={[5.5, 1.7, 1.92]} castShadow receiveShadow material={frameMat}>
        <boxGeometry args={[5.4, 2.8, 0.12]} />
      </mesh>
      <mesh position={[5.5, 1.7, 1.86]} material={screenMat}>
        <planeGeometry args={[5, 2.4]} />
      </mesh>

      {/* RANG AVANT */}
      {seatXs.map((x) => (
        <Seat key={`front-${x}`} position={[x, 0, -0.3]} material={leatherMat} />
      ))}
      {/* RANG ARRIÈRE (sur estrade) */}
      {seatXs.map((x) => (
        <Seat key={`back-${x}`} position={[x, 0.35, -1.4]} material={leatherMat} />
      ))}

      {/* PROJECTEUR */}
      <group position={[5.5, 3.55, -1.4]}>
        <mesh castShadow material={darkMetalMat}>
          <boxGeometry args={[0.5, 0.22, 0.4]} />
        </mesh>
        <mesh position={[0, 0, 0.22]} rotation={[Math.PI / 2, 0, 0]} material={frameMat}>
          <cylinderGeometry args={[0.07, 0.09, 0.08, 16]} />
        </mesh>
      </group>

      {/* APPLIQUES */}
      <mesh position={[1.05, 1.6, -0.4]} rotation={[0, Math.PI / 2, 0]} material={sconceMat}>
        <planeGeometry args={[0.4, 0.16]} />
      </mesh>
      <mesh position={[1.05, 1.6, 1.2]} rotation={[0, Math.PI / 2, 0]} material={sconceMat}>
        <planeGeometry args={[0.4, 0.16]} />
      </mesh>
      <mesh position={[9.95, 1.6, -0.4]} rotation={[0, -Math.PI / 2, 0]} material={sconceMat}>
        <planeGeometry args={[0.4, 0.16]} />
      </mesh>
      <mesh position={[9.95, 1.6, 1.2]} rotation={[0, -Math.PI / 2, 0]} material={sconceMat}>
        <planeGeometry args={[0.4, 0.16]} />
      </mesh>

      {/* PANNEAUX ACOUSTIQUES */}
      {[-1.2, 0, 1.2].map((z) => (
        <mesh key={`acL-${z}`} position={[1.08, 2.2, z]} castShadow receiveShadow material={acousticMat}>
          <boxGeometry args={[0.06, 1.4, 0.9]} />
        </mesh>
      ))}
      {[-1.2, 0, 1.2].map((z) => (
        <mesh key={`acR-${z}`} position={[9.92, 2.2, z]} castShadow receiveShadow material={acousticMat}>
          <boxGeometry args={[0.06, 1.4, 0.9]} />
        </mesh>
      ))}

      <pointLight position={[5.5, 2.8, -0.6]} color="#ff9a5a" intensity={3} distance={7} decay={2} />
    </group>
  );
}
