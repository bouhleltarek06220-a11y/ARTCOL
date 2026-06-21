"use client";

import { useMemo } from "react";
import { MeshStandardMaterial, DoubleSide } from "three";

// Deux chambres d'amis sur le plancher de l'étage R2 (surface y=7.75)
export function UpperGuestRooms() {
  // --- Matériaux mutualisés (palette repo) ---
  const materials = useMemo(() => {
    const partition = new MeshStandardMaterial({
      color: "#d8d3ca", // plâtre cloison
      roughness: 0.92,
      side: DoubleSide,
    });
    const wood = new MeshStandardMaterial({ color: "#5b3f27", roughness: 0.7 });
    const woodDark = new MeshStandardMaterial({ color: "#3a2a1c", roughness: 0.65 });
    const stone = new MeshStandardMaterial({ color: "#d7d1c6", roughness: 0.85 });
    const metal = new MeshStandardMaterial({ color: "#1b1c1e", roughness: 0.35, metalness: 0.8 });
    const linen = new MeshStandardMaterial({ color: "#d9d3c8", roughness: 0.95 });
    const sheet = new MeshStandardMaterial({ color: "#eae6dd", roughness: 0.9 });
    const glass = new MeshStandardMaterial({
      color: "#9fc4d6",
      roughness: 0.05,
      metalness: 0,
      transparent: true,
      opacity: 0.25,
      side: DoubleSide,
    });
    const rug = new MeshStandardMaterial({ color: "#6b5640", roughness: 1 });
    const lamp = new MeshStandardMaterial({
      color: "#ffdca6",
      emissive: "#ffdca6",
      emissiveIntensity: 1.4,
      roughness: 0.5,
    });
    return { partition, wood, woodDark, stone, metal, linen, sheet, glass, rug, lamp };
  }, []);

  // --- Sous-composant : une chambre. side=1 (droite) ou side=-1 (gauche) ---
  function GuestRoom({ side }: { side: 1 | -1 }) {
    const m = materials;
    const floorY = 7.75;
    const cx = side * 5.2;

    return (
      <group>
        {/* ---- LIT DOUBLE : tête contre le mur du fond z=-8.2 ---- */}
        <mesh position={[cx, floorY + 0.28, -7.0]} castShadow receiveShadow material={m.woodDark}>
          <boxGeometry args={[2.0, 0.36, 2.2]} />
        </mesh>
        <mesh position={[cx, floorY + 0.58, -6.95]} castShadow receiveShadow material={m.sheet}>
          <boxGeometry args={[1.9, 0.28, 2.0]} />
        </mesh>
        <mesh position={[cx, floorY + 0.74, -6.55]} castShadow receiveShadow material={m.linen}>
          <boxGeometry args={[1.92, 0.06, 1.1]} />
        </mesh>
        <mesh position={[cx - 0.45, floorY + 0.78, -7.7]} castShadow material={m.sheet}>
          <boxGeometry args={[0.72, 0.14, 0.42]} />
        </mesh>
        <mesh position={[cx + 0.45, floorY + 0.78, -7.7]} castShadow material={m.sheet}>
          <boxGeometry args={[0.72, 0.14, 0.42]} />
        </mesh>
        <mesh position={[cx, floorY + 0.85, -8.08]} castShadow receiveShadow material={m.wood}>
          <boxGeometry args={[2.1, 1.1, 0.1]} />
        </mesh>

        {/* ---- TABLES DE CHEVET + LAMPES ---- */}
        {([-1, 1] as const).map((sgn) => (
          <group key={`chevet-${sgn}`}>
            <mesh position={[cx + sgn * 1.35, floorY + 0.25, -7.85]} castShadow receiveShadow material={m.wood}>
              <boxGeometry args={[0.5, 0.5, 0.45]} />
            </mesh>
            <mesh position={[cx + sgn * 1.35, floorY + 0.62, -7.85]} castShadow material={m.metal}>
              <cylinderGeometry args={[0.03, 0.04, 0.24, 12]} />
            </mesh>
            <mesh position={[cx + sgn * 1.35, floorY + 0.8, -7.85]} material={m.lamp}>
              <sphereGeometry args={[0.1, 16, 16]} />
            </mesh>
          </group>
        ))}

        {/* ---- ARMOIRE ---- */}
        <mesh position={[side * 10.0, floorY + 1.05, -6.4]} castShadow receiveShadow material={m.woodDark}>
          <boxGeometry args={[0.6, 2.1, 1.6]} />
        </mesh>
        <mesh position={[side * 9.68, floorY + 1.05, -6.05]} castShadow material={m.metal}>
          <boxGeometry args={[0.04, 0.2, 0.04]} />
        </mesh>

        {/* ---- BUREAU + CHAISE ---- */}
        <mesh position={[side * 2.6, floorY + 0.74, -5.55]} castShadow receiveShadow material={m.wood}>
          <boxGeometry args={[1.3, 0.05, 0.6]} />
        </mesh>
        {([[-0.58, -0.25], [0.58, -0.25], [-0.58, 0.25], [0.58, 0.25]] as const).map(([dx, dz], i) => (
          <mesh key={`pied-bureau-${i}`} position={[side * 2.6 + dx, floorY + 0.36, -5.55 + dz]} castShadow material={m.woodDark}>
            <boxGeometry args={[0.05, 0.72, 0.05]} />
          </mesh>
        ))}
        <mesh position={[side * 2.6, floorY + 0.46, -6.0]} castShadow receiveShadow material={m.metal}>
          <boxGeometry args={[0.45, 0.05, 0.45]} />
        </mesh>
        <mesh position={[side * 2.6, floorY + 0.7, -6.2]} castShadow material={m.metal}>
          <boxGeometry args={[0.45, 0.5, 0.05]} />
        </mesh>
        {([[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]] as const).map(([dx, dz], i) => (
          <mesh key={`pied-chaise-${i}`} position={[side * 2.6 + dx, floorY + 0.23, -6.0 + dz]} castShadow material={m.metal}>
            <cylinderGeometry args={[0.02, 0.02, 0.46, 8]} />
          </mesh>
        ))}

        {/* ---- TAPIS ---- */}
        <mesh position={[cx, floorY + 0.01, -6.4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={m.rug}>
          <planeGeometry args={[2.8, 2.2]} />
        </mesh>

        {/* ---- COIN SALLE D'EAU ---- */}
        {(() => {
          const innerX = side * 0.9;
          const wetW = 2.0;
          const wetCx = innerX + side * (wetW / 2);
          return (
            <group>
              <mesh position={[innerX + side * wetW, floorY + 1.2, -7.3]} castShadow receiveShadow material={m.partition}>
                <boxGeometry args={[0.08, 2.4, 2.4]} />
              </mesh>
              <mesh position={[wetCx, floorY + 1.2, -6.1]} castShadow material={m.glass}>
                <boxGeometry args={[wetW, 2.4, 0.04]} />
              </mesh>
              <mesh position={[wetCx, floorY + 0.02, -7.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={m.stone}>
                <planeGeometry args={[wetW, 2.2]} />
              </mesh>
              <mesh position={[wetCx, floorY + 0.4, -8.0]} castShadow receiveShadow material={m.woodDark}>
                <boxGeometry args={[0.9, 0.8, 0.45]} />
              </mesh>
              <mesh position={[wetCx, floorY + 0.82, -8.0]} castShadow receiveShadow material={m.stone}>
                <boxGeometry args={[0.96, 0.06, 0.5]} />
              </mesh>
              <mesh position={[wetCx, floorY + 0.95, -8.05]} castShadow material={m.metal}>
                <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
              </mesh>
              <mesh position={[wetCx - side * 0.55, floorY + 0.05, -6.7]} castShadow receiveShadow material={m.stone}>
                <boxGeometry args={[0.85, 0.08, 0.9]} />
              </mesh>
              <mesh position={[wetCx - side * 0.12, floorY + 1.0, -6.7]} castShadow material={m.glass}>
                <boxGeometry args={[0.04, 1.9, 0.9]} />
              </mesh>
              <mesh position={[wetCx - side * 0.55, floorY + 1.0, -7.1]} castShadow material={m.metal}>
                <cylinderGeometry args={[0.025, 0.025, 1.8, 10]} />
              </mesh>
            </group>
          );
        })()}

        {/* ---- LAMPE D'AMBIANCE ---- */}
        <pointLight position={[cx, floorY + 2.4, -6.6]} color="#ffdca6" intensity={6} distance={8} decay={2} />
      </group>
    );
  }

  const floorY = 7.75;

  return (
    <group>
      {/* ===== CLOISON CENTRALE (x≈0) ===== */}
      <mesh position={[0, floorY + 1.2, -6.725]} castShadow receiveShadow material={materials.partition}>
        <boxGeometry args={[0.12, 2.4, 3.55]} />
      </mesh>

      {/* ===== CLOISON AVANT (façade palier z≈-5.1), une porte par chambre ===== */}
      <mesh position={[-7.85, floorY + 1.2, -5.1]} castShadow receiveShadow material={materials.partition}>
        <boxGeometry args={[5.3, 2.4, 0.12]} />
      </mesh>
      <mesh position={[-2.15, floorY + 1.2, -5.1]} castShadow receiveShadow material={materials.partition}>
        <boxGeometry args={[3.5, 2.4, 0.12]} />
      </mesh>
      <mesh position={[-4.25, floorY + 2.15, -5.1]} castShadow receiveShadow material={materials.partition}>
        <boxGeometry args={[0.9, 0.5, 0.12]} />
      </mesh>

      <mesh position={[7.85, floorY + 1.2, -5.1]} castShadow receiveShadow material={materials.partition}>
        <boxGeometry args={[5.3, 2.4, 0.12]} />
      </mesh>
      <mesh position={[2.15, floorY + 1.2, -5.1]} castShadow receiveShadow material={materials.partition}>
        <boxGeometry args={[3.5, 2.4, 0.12]} />
      </mesh>
      <mesh position={[4.25, floorY + 2.15, -5.1]} castShadow receiveShadow material={materials.partition}>
        <boxGeometry args={[0.9, 0.5, 0.12]} />
      </mesh>

      {/* ===== Les deux chambres miroir ===== */}
      <GuestRoom side={-1} />
      <GuestRoom side={1} />
    </group>
  );
}
