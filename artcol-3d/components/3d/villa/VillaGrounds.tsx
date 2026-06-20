"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshReflectorMaterial } from "@react-three/drei";
import { MeshStandardMaterial, type PointLight } from "three";

/**
 * Aménagement paysager & piscine de la villa : sol minéral, allée privée,
 * terrasse en bois, piscine à débordement miroir, salon extérieur, brasero,
 * palmiers et oliviers en silhouette rétro-éclairée (crépuscule premium).
 */
export function VillaGrounds() {
  const sandStone = useMemo(
    () => new MeshStandardMaterial({ color: "#b9b0a0", roughness: 0.95, metalness: 0 }),
    [],
  );
  const wood = useMemo(
    () => new MeshStandardMaterial({ color: "#5b3f27", roughness: 0.7, metalness: 0 }),
    [],
  );
  const coping = useMemo(
    () => new MeshStandardMaterial({ color: "#d8d2c6", roughness: 0.8, metalness: 0 }),
    [],
  );
  const planter = useMemo(
    () => new MeshStandardMaterial({ color: "#2c2c2e", roughness: 0.6, metalness: 0.2 }),
    [],
  );

  return (
    <group>
      {/* ===== SOL MINÉRAL (large dalle de pierre claire) ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[400, 400]} />
        <primitive object={sandStone} attach="material" />
      </mesh>

      {/* ===== ALLÉE PRIVÉE (dalles, approche depuis l'avant) ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3, 0.02, 22]} receiveShadow>
        <planeGeometry args={[7, 34]} />
        <meshStandardMaterial color="#9a9183" roughness={0.9} />
      </mesh>

      {/* ===== TERRASSE BOIS (entre villa et piscine) ===== */}
      <mesh material={wood} position={[1, 0.08, 4.4]} receiveShadow>
        <boxGeometry args={[20, 0.16, 4]} />
      </mesh>

      {/* ===== PISCINE À DÉBORDEMENT MIROIR ===== */}
      {/* Margelle */}
      <mesh material={coping} position={[1, 0.12, 9]} receiveShadow>
        <boxGeometry args={[18.6, 0.24, 7.6]} />
      </mesh>
      {/* Bassin sombre */}
      <mesh position={[1, 0.16, 9]}>
        <boxGeometry args={[18, 0.4, 7]} />
        <meshStandardMaterial color="#06222b" roughness={0.2} metalness={0.3} />
      </mesh>
      {/* Surface d'eau réfléchissante (miroir) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1, 0.33, 9]}>
        <planeGeometry args={[18, 7]} />
        <MeshReflectorMaterial
          resolution={1024}
          blur={[120, 40]}
          mixBlur={0.6}
          mixStrength={2.2}
          roughness={0.18}
          depthScale={0.6}
          minDepthThreshold={0.3}
          maxDepthThreshold={1.2}
          color="#0e3a47"
          metalness={0.7}
        />
      </mesh>
      {/* Lèvre de débordement (côté vue) + fine lame d'eau */}
      <mesh material={coping} position={[1, 0.14, 12.7]}>
        <boxGeometry args={[18, 0.28, 0.3]} />
      </mesh>

      {/* ===== SALON EXTÉRIEUR (canapés bas + table) ===== */}
      <Lounge position={[-6, 0, 6.5]} />

      {/* ===== BRASERO MODERNE ===== */}
      <FirePit position={[-2, 0, 7]} />

      {/* ===== JARDINIÈRES + VÉGÉTATION ===== */}
      <mesh material={planter} position={[10, 0.4, 6]} receiveShadow castShadow>
        <boxGeometry args={[1.4, 0.8, 6]} />
      </mesh>
      <OliveTree position={[10, 0.8, 6]} />

      {/* Palmiers (silhouettes élégantes, rétro-éclairés) */}
      <Palm position={[12.5, 0, 9]} scale={1.15} tilt={0.05} />
      <Palm position={[-12, 0, 8]} scale={1.3} tilt={-0.08} />
      <Palm position={[14, 0, 2]} scale={1.0} tilt={0.04} />
      <OliveTree position={[-13, 0.2, 2]} scale={1.1} />
      <OliveTree position={[13.5, 0.2, -4]} scale={0.9} />
    </group>
  );
}

/* ---------- Salon extérieur ---------- */
function Lounge({ position }: { position: [number, number, number] }) {
  const frame = useMemo(
    () => new MeshStandardMaterial({ color: "#26262a", roughness: 0.6, metalness: 0.3 }),
    [],
  );
  const cushion = useMemo(
    () => new MeshStandardMaterial({ color: "#d9d3c8", roughness: 0.9 }),
    [],
  );
  const tableTop = useMemo(
    () => new MeshStandardMaterial({ color: "#1b1b1d", roughness: 0.3, metalness: 0.4 }),
    [],
  );
  return (
    <group position={position}>
      {/* Canapé en L : base + assises */}
      <mesh material={frame} position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 0.5, 1.3]} />
      </mesh>
      <mesh material={cushion} position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[3.8, 0.25, 1.1]} />
      </mesh>
      <mesh material={cushion} position={[0, 0.85, -0.5]} castShadow>
        <boxGeometry args={[3.8, 0.5, 0.22]} />
      </mesh>
      {/* Table basse */}
      <mesh material={tableTop} position={[0, 0.35, 1.7]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.12, 0.9]} />
      </mesh>
    </group>
  );
}

/* ---------- Brasero (feu) ---------- */
function FirePit({ position }: { position: [number, number, number] }) {
  const light = useRef<PointLight>(null);
  const bowl = useMemo(
    () => new MeshStandardMaterial({ color: "#2a2a2d", roughness: 0.5, metalness: 0.6 }),
    [],
  );
  const embers = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#1a0a00",
        emissive: "#ff5a1e",
        emissiveIntensity: 3,
        toneMapped: false,
      }),
    [],
  );

  // Scintillement subtil de la flamme (mutation directe, pas de setState).
  useFrame(({ clock }) => {
    if (light.current) {
      const t = clock.elapsedTime;
      light.current.intensity =
        9 + Math.sin(t * 11) * 1.5 + Math.sin(t * 23) * 0.8;
    }
  });

  return (
    <group position={position}>
      <mesh material={bowl} position={[0, 0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.9, 0.7, 0.6, 24]} />
      </mesh>
      <mesh material={embers} position={[0, 0.58, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.75, 24]} />
      </mesh>
      <pointLight
        ref={light}
        position={[0, 0.9, 0]}
        intensity={9}
        distance={11}
        decay={2}
        color="#ff7a2e"
        castShadow={false}
      />
    </group>
  );
}

/* ---------- Palmier (silhouette) ---------- */
function Palm({
  position,
  scale = 1,
  tilt = 0,
}: {
  position: [number, number, number];
  scale?: number;
  tilt?: number;
}) {
  const bark = useMemo(
    () => new MeshStandardMaterial({ color: "#241a10", roughness: 1 }),
    [],
  );
  const frond = useMemo(
    () => new MeshStandardMaterial({ color: "#15200f", roughness: 1 }),
    [],
  );
  // Tronc : segments empilés légèrement courbés.
  const segments = Array.from({ length: 9 });
  // Frondes : disposées en couronne, retombantes.
  const fronds = Array.from({ length: 11 });
  return (
    <group position={position} scale={scale} rotation={[0, 0, tilt]}>
      {segments.map((_, i) => (
        <mesh
          key={i}
          material={bark}
          position={[Math.sin(i * 0.25) * 0.25, 0.6 + i * 0.72, 0]}
          rotation={[0, 0, Math.sin(i * 0.25) * 0.06]}
          castShadow
        >
          <cylinderGeometry args={[0.16 - i * 0.008, 0.2 - i * 0.008, 0.78, 10]} />
        </mesh>
      ))}
      <group position={[Math.sin(9 * 0.25) * 0.25, 0.6 + 9 * 0.72, 0]}>
        {fronds.map((_, i) => {
          const a = (i / 11) * Math.PI * 2;
          return (
            <mesh
              key={i}
              material={frond}
              position={[Math.cos(a) * 1.1, -0.1, Math.sin(a) * 1.1]}
              rotation={[Math.PI / 2.4, a, 0]}
              castShadow
            >
              <coneGeometry args={[0.18, 2.6, 4]} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

/* ---------- Olivier (silhouette) ---------- */
function OliveTree({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  const bark = useMemo(
    () => new MeshStandardMaterial({ color: "#2f2920", roughness: 1 }),
    [],
  );
  const leaves = useMemo(
    () => new MeshStandardMaterial({ color: "#3f4a31", roughness: 1 }),
    [],
  );
  const blobs: [number, number, number, number][] = [
    [0, 2.2, 0, 1.1],
    [0.7, 2.0, 0.3, 0.8],
    [-0.6, 2.1, -0.2, 0.85],
    [0.2, 2.7, -0.4, 0.7],
    [-0.3, 2.6, 0.5, 0.65],
  ];
  return (
    <group position={position} scale={scale}>
      <mesh material={bark} position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.26, 1.8, 8]} />
      </mesh>
      {blobs.map(([x, y, z, r], i) => (
        <mesh key={i} material={leaves} position={[x, y, z]} castShadow>
          <icosahedronGeometry args={[r, 1]} />
        </mesh>
      ))}
    </group>
  );
}
