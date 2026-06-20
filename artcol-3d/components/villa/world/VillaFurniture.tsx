"use client";

import { useMemo } from "react";
import { MeshStandardMaterial } from "three";

/**
 * Bloc 3 — Mobilier (grand salon). Set lounge haut de gamme dans l'espace de
 * vie de la galerie : canapé panoramique en L, table basse en pierre, tapis,
 * fauteuils, lampadaire à lumière chaude. Modélisé en primitives, matériaux
 * sobres (lin, pierre, métal noir).
 */
export function VillaFurniture() {
  const linen = useMemo(
    () => new MeshStandardMaterial({ color: "#d9d3c8", roughness: 0.85 }),
    [],
  );
  const frame = useMemo(
    () => new MeshStandardMaterial({ color: "#23232a", roughness: 0.5, metalness: 0.4 }),
    [],
  );
  const stone = useMemo(
    () => new MeshStandardMaterial({ color: "#2a2a2e", roughness: 0.3, metalness: 0.3 }),
    [],
  );
  const rug = useMemo(
    () => new MeshStandardMaterial({ color: "#6b5640", roughness: 0.95 }),
    [],
  );
  const metal = useMemo(
    () => new MeshStandardMaterial({ color: "#1b1c1e", roughness: 0.35, metalness: 0.85 }),
    [],
  );

  // Salon organisé autour de (x=2.5, z=-1), face à la baie vitrée.
  return (
    <group position={[2.5, 0, -1]}>
      {/* Tapis */}
      <mesh material={rug} position={[0, 0.04, 0.2]} receiveShadow>
        <boxGeometry args={[7, 0.04, 4.6]} />
      </mesh>

      {/* ===== Canapé panoramique en L ===== */}
      {/* Segment principal (le long de X, dossier au fond) */}
      <Sofa frame={frame} linen={linen} position={[0, 0, -1.2]} size={[5, 1.1]} />
      {/* Segment retour (le long de Z, dossier à droite) */}
      <Sofa
        frame={frame}
        linen={linen}
        position={[2.45, 0, 0]}
        size={[2.4, 1.1]}
        rotation={Math.PI / 2}
      />

      {/* ===== Table basse en pierre ===== */}
      <mesh material={metal} position={[0, 0.18, 0.3]}>
        <boxGeometry args={[1.7, 0.36, 0.9]} />
      </mesh>
      <mesh material={stone} position={[0, 0.4, 0.3]} castShadow>
        <boxGeometry args={[2, 0.1, 1.1]} />
      </mesh>

      {/* ===== Fauteuils design (face au canapé) ===== */}
      <Armchair frame={frame} linen={linen} position={[-2.4, 0, 1.1]} rotation={-0.5} />
      <Armchair frame={frame} linen={linen} position={[-1.1, 0, 1.6]} rotation={-0.2} />

      {/* ===== Lampadaire (lumière chaude d'appoint) ===== */}
      <group position={[3.1, 0, -1.9]}>
        <mesh material={metal} position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 1.8, 10]} />
        </mesh>
        <mesh material={metal} position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.05, 16]} />
        </mesh>
        <mesh position={[0, 1.85, 0]}>
          <coneGeometry args={[0.22, 0.3, 18, 1, true]} />
          <meshStandardMaterial color="#241708" emissive="#ffcf8f" emissiveIntensity={2} side={2} />
        </mesh>
        <pointLight position={[0, 1.75, 0]} intensity={7} distance={7} decay={2} color="#ffd9a0" />
      </group>

      {/* ===== Console / desserte basse ===== */}
      <mesh material={frame} position={[0, 0.35, -2.3]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.7, 0.5]} />
      </mesh>
    </group>
  );
}

/* ---------- Canapé (base + assises + dossier + accoudoirs) ---------- */
function Sofa({
  frame,
  linen,
  position,
  size,
  rotation = 0,
}: {
  frame: MeshStandardMaterial;
  linen: MeshStandardMaterial;
  position: [number, number, number];
  size: [number, number];
  rotation?: number;
}) {
  const [w, d] = size;
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Socle */}
      <mesh material={frame} position={[0, 0.18, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.36, d]} />
      </mesh>
      {/* Assise */}
      <mesh material={linen} position={[0, 0.45, 0.08]} castShadow>
        <boxGeometry args={[w - 0.2, 0.22, d - 0.3]} />
      </mesh>
      {/* Dossier */}
      <mesh material={linen} position={[0, 0.72, -(d / 2) + 0.18]} castShadow>
        <boxGeometry args={[w - 0.2, 0.5, 0.28]} />
      </mesh>
      {/* Accoudoirs */}
      <mesh material={linen} position={[-(w / 2) + 0.14, 0.55, 0.05]} castShadow>
        <boxGeometry args={[0.26, 0.5, d - 0.2]} />
      </mesh>
      <mesh material={linen} position={[w / 2 - 0.14, 0.55, 0.05]} castShadow>
        <boxGeometry args={[0.26, 0.5, d - 0.2]} />
      </mesh>
    </group>
  );
}

/* ---------- Fauteuil ---------- */
function Armchair({
  frame,
  linen,
  position,
  rotation = 0,
}: {
  frame: MeshStandardMaterial;
  linen: MeshStandardMaterial;
  position: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh material={frame} position={[0, 0.16, 0]} castShadow>
        <boxGeometry args={[0.9, 0.32, 0.9]} />
      </mesh>
      <mesh material={linen} position={[0, 0.4, 0.06]} castShadow>
        <boxGeometry args={[0.78, 0.2, 0.72]} />
      </mesh>
      <mesh material={linen} position={[0, 0.66, -0.34]} castShadow>
        <boxGeometry args={[0.78, 0.5, 0.22]} />
      </mesh>
      <mesh material={linen} position={[-0.4, 0.5, 0.04]} castShadow>
        <boxGeometry args={[0.16, 0.36, 0.78]} />
      </mesh>
      <mesh material={linen} position={[0.4, 0.5, 0.04]} castShadow>
        <boxGeometry args={[0.16, 0.36, 0.78]} />
      </mesh>
    </group>
  );
}
