"use client";

import { useMemo } from "react";
import {
  BoxGeometry,
  MeshStandardMaterial,
  MeshPhysicalMaterial,
  Color,
} from "three";

/**
 * Villa moderne modélisée intégralement avec des primitives React Three Fiber
 * (aucun modèle externe). Ambiance nuit : volumes blancs épurés, grandes baies
 * vitrées éclairées de l'intérieur (chaud), toit plat en débord, piscine
 * lumineuse. Pensée pour le rendu nocturne avec bloom sur les fenêtres.
 *
 * Géométries/matériaux partagés via useMemo (perf), conformément au guide projet.
 */

/** Fenêtre lumineuse : un fond émissif chaud + une vitre teintée par-dessus. */
function LitWindow({
  width,
  height,
  position,
  rotation = [0, 0, 0],
  intensity = 2.6,
}: {
  width: number;
  height: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  intensity?: number;
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Intérieur lumineux (émissif → bloom) */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color="#1a1206"
          emissive="#ffb259"
          emissiveIntensity={intensity}
          toneMapped={false}
        />
      </mesh>
      {/* Vitre teintée légèrement réfléchissante */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshPhysicalMaterial
          color="#0c1620"
          roughness={0.08}
          metalness={0}
          transmission={0.35}
          transparent
          opacity={0.55}
          reflectivity={0.4}
        />
      </mesh>
    </group>
  );
}

export function ModernVilla() {
  const wall = useMemo(
    () => new MeshStandardMaterial({ color: "#ece9e3", roughness: 0.85, metalness: 0 }),
    [],
  );
  const accent = useMemo(
    () => new MeshStandardMaterial({ color: "#2a2a2e", roughness: 0.7, metalness: 0.1 }),
    [],
  );
  const roof = useMemo(
    () => new MeshStandardMaterial({ color: "#15151a", roughness: 0.6, metalness: 0.2 }),
    [],
  );
  const deck = useMemo(
    () => new MeshStandardMaterial({ color: "#3b352d", roughness: 0.9, metalness: 0 }),
    [],
  );
  const water = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: new Color("#0a3a4a"),
        emissive: new Color("#0bd1ff"),
        emissiveIntensity: 0.35,
        roughness: 0.1,
        metalness: 0.2,
        transmission: 0.5,
        transparent: true,
        opacity: 0.85,
      }),
    [],
  );
  const box = useMemo(() => new BoxGeometry(1, 1, 1), []);

  return (
    <group position={[0, 0, 0]}>
      {/* ---- Terrasse / socle ---- */}
      <mesh geometry={box} material={deck} position={[0, 0.1, 1]} scale={[16, 0.2, 12]} receiveShadow />

      {/* ---- Rez-de-chaussée (grand volume blanc) ---- */}
      <mesh geometry={box} material={wall} position={[0, 1.8, -1]} scale={[10, 3.4, 6]} castShadow receiveShadow />
      {/* Toit plat du rez (débordant) */}
      <mesh geometry={box} material={roof} position={[0, 3.55, -1]} scale={[10.8, 0.25, 6.8]} castShadow />

      {/* ---- Étage (cantilever décalé) ---- */}
      <mesh geometry={box} material={wall} position={[-1, 5.2, -1.4]} scale={[7, 2.9, 5]} castShadow receiveShadow />
      <mesh geometry={box} material={roof} position={[-1, 6.75, -1.4]} scale={[7.6, 0.22, 5.6]} castShadow />

      {/* Bandeau d'accent vertical (entrée) */}
      <mesh geometry={box} material={accent} position={[3.6, 1.8, 2.05]} scale={[1.2, 3.4, 0.15]} castShadow />

      {/* ---- Baies vitrées rez-de-chaussée (façade avant, z = +2) ---- */}
      <LitWindow width={6} height={2.6} position={[0.4, 1.8, 2.02]} intensity={2.8} />
      {/* Mullions noirs */}
      <mesh geometry={box} material={accent} position={[-1.6, 1.8, 2.06]} scale={[0.08, 2.6, 0.08]} />
      <mesh geometry={box} material={accent} position={[0.4, 1.8, 2.06]} scale={[0.08, 2.6, 0.08]} />
      <mesh geometry={box} material={accent} position={[2.4, 1.8, 2.06]} scale={[0.08, 2.6, 0.08]} />

      {/* Baie latérale (façade droite, x = +5) */}
      <LitWindow
        width={3.2}
        height={2.2}
        position={[5.02, 1.8, -1]}
        rotation={[0, Math.PI / 2, 0]}
        intensity={2.2}
      />

      {/* ---- Fenêtres bandeau de l'étage (façade avant, z = -1.4+2.5 = 1.1) ---- */}
      <LitWindow width={5.4} height={1.5} position={[-1, 5.3, 1.12]} intensity={3.0} />
      <mesh geometry={box} material={accent} position={[-1, 5.3, 1.16]} scale={[0.08, 1.5, 0.08]} />
      <mesh geometry={box} material={accent} position={[-3, 5.3, 1.16]} scale={[0.08, 1.5, 0.08]} />
      <mesh geometry={box} material={accent} position={[1, 5.3, 1.16]} scale={[0.08, 1.5, 0.08]} />

      {/* ---- Piscine (devant la villa) ---- */}
      <mesh position={[1.5, 0.21, 6.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 3.2]} />
        <primitive object={water} attach="material" />
      </mesh>
      {/* Margelle */}
      <mesh geometry={box} material={wall} position={[1.5, 0.18, 6.5]} scale={[6.6, 0.32, 3.8]} receiveShadow />

      {/* ---- Lumières chaudes qui débordent des fenêtres ---- */}
      <pointLight position={[0.4, 1.8, 3]} intensity={18} distance={12} decay={2} color="#ffb060" />
      <pointLight position={[-1, 5.3, 2.5]} intensity={12} distance={11} decay={2} color="#ffc070" />
      {/* Lueur bleue de la piscine */}
      <pointLight position={[1.5, 0.6, 6.5]} intensity={14} distance={9} decay={2} color="#15c4ff" />

      {/* ---- Quelques arbres stylisés ---- */}
      <Tree position={[-6.5, 0.2, 4]} />
      <Tree position={[7, 0.2, 3.5]} scale={0.85} />
      <Tree position={[-7, 0.2, -3]} scale={1.1} />
    </group>
  );
}

function Tree({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.16, 2, 8]} />
        <meshStandardMaterial color="#2b211a" roughness={1} />
      </mesh>
      <mesh position={[0, 2.4, 0]} castShadow>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#1f3d2b" roughness={1} flatShading />
      </mesh>
      <mesh position={[0.4, 1.9, 0.2]} castShadow>
        <icosahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial color="#264a33" roughness={1} flatShading />
      </mesh>
    </group>
  );
}
