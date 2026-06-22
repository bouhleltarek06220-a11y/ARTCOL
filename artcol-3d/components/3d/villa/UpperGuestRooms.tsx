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

  // --- Sous-composant : une chambre, centrée en cx ; dir = côté du mur extérieur
  //     (+1 vers +x, -1 vers -x). Toutes les chambres sont en x > -6.4 : le
  //     NOYAU d'escalier occupe l'arrière-gauche (x[-10.3,-6.5]). ---
  function GuestRoom({ cx, dir }: { cx: number; dir: 1 | -1 }) {
    const m = materials;
    const floorY = 7.75;

    return (
      <group>
        {/* ---- LIT DOUBLE : tête contre le mur du fond z=-8.3 ---- */}
        <mesh position={[cx, floorY + 0.28, -7.2]} castShadow receiveShadow material={m.woodDark}>
          <boxGeometry args={[2.0, 0.36, 2.2]} />
        </mesh>
        <mesh position={[cx, floorY + 0.58, -7.15]} castShadow receiveShadow material={m.sheet}>
          <boxGeometry args={[1.9, 0.28, 2.0]} />
        </mesh>
        <mesh position={[cx, floorY + 0.74, -6.75]} castShadow receiveShadow material={m.linen}>
          <boxGeometry args={[1.92, 0.06, 1.1]} />
        </mesh>
        <mesh position={[cx - 0.45, floorY + 0.78, -7.9]} castShadow material={m.sheet}>
          <boxGeometry args={[0.72, 0.14, 0.42]} />
        </mesh>
        <mesh position={[cx + 0.45, floorY + 0.78, -7.9]} castShadow material={m.sheet}>
          <boxGeometry args={[0.72, 0.14, 0.42]} />
        </mesh>
        <mesh position={[cx, floorY + 0.85, -8.28]} castShadow receiveShadow material={m.wood}>
          <boxGeometry args={[2.1, 1.1, 0.1]} />
        </mesh>

        {/* ---- TABLES DE CHEVET + LAMPES ---- */}
        {([-1, 1] as const).map((sgn) => (
          <group key={`chevet-${sgn}`}>
            <mesh position={[cx + sgn * 1.35, floorY + 0.25, -8.05]} castShadow receiveShadow material={m.wood}>
              <boxGeometry args={[0.5, 0.5, 0.45]} />
            </mesh>
            <mesh position={[cx + sgn * 1.35, floorY + 0.62, -8.05]} castShadow material={m.metal}>
              <cylinderGeometry args={[0.03, 0.04, 0.24, 12]} />
            </mesh>
            <mesh position={[cx + sgn * 1.35, floorY + 0.8, -8.05]} material={m.lamp}>
              <sphereGeometry args={[0.1, 16, 16]} />
            </mesh>
          </group>
        ))}

        {/* ---- ARMOIRE (contre le mur extérieur) ---- */}
        <mesh position={[cx + dir * 3.2, floorY + 1.05, -7.6]} castShadow receiveShadow material={m.woodDark}>
          <boxGeometry args={[0.6, 2.1, 1.6]} />
        </mesh>
        <mesh position={[cx + dir * 2.88, floorY + 1.05, -7.25]} castShadow material={m.metal}>
          <boxGeometry args={[0.04, 0.2, 0.04]} />
        </mesh>

        {/* ---- BUREAU + CHAISE (côté intérieur) ---- */}
        <mesh position={[cx - dir * 2.4, floorY + 0.74, -5.85]} castShadow receiveShadow material={m.wood}>
          <boxGeometry args={[1.3, 0.05, 0.6]} />
        </mesh>
        {([[-0.58, -0.25], [0.58, -0.25], [-0.58, 0.25], [0.58, 0.25]] as const).map(([dx, dz], i) => (
          <mesh key={`pied-bureau-${i}`} position={[cx - dir * 2.4 + dx, floorY + 0.36, -5.85 + dz]} castShadow material={m.woodDark}>
            <boxGeometry args={[0.05, 0.72, 0.05]} />
          </mesh>
        ))}
        <mesh position={[cx - dir * 2.4, floorY + 0.46, -6.3]} castShadow receiveShadow material={m.metal}>
          <boxGeometry args={[0.45, 0.05, 0.45]} />
        </mesh>
        <mesh position={[cx - dir * 2.4, floorY + 0.7, -6.5]} castShadow material={m.metal}>
          <boxGeometry args={[0.45, 0.5, 0.05]} />
        </mesh>
        {([[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]] as const).map(([dx, dz], i) => (
          <mesh key={`pied-chaise-${i}`} position={[cx - dir * 2.4 + dx, floorY + 0.23, -6.3 + dz]} castShadow material={m.metal}>
            <cylinderGeometry args={[0.02, 0.02, 0.46, 8]} />
          </mesh>
        ))}

        {/* ---- TAPIS ---- */}
        <mesh position={[cx, floorY + 0.01, -6.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={m.rug}>
          <planeGeometry args={[2.8, 2.2]} />
        </mesh>

        {/* ---- COIN SALLE D'EAU (angle extérieur-fond) ---- */}
        {(() => {
          const wetCx = cx + dir * 2.55; // centre douche/vasque
          const wetW = 1.9;
          return (
            <group>
              {/* cloison vitrée côté chambre */}
              <mesh position={[wetCx - dir * (wetW / 2 + 0.02), floorY + 1.2, -7.3]} castShadow material={m.glass}>
                <boxGeometry args={[0.04, 2.4, 2.4]} />
              </mesh>
              <mesh position={[wetCx, floorY + 1.2, -6.12]} castShadow material={m.glass}>
                <boxGeometry args={[wetW, 2.4, 0.04]} />
              </mesh>
              {/* receveur */}
              <mesh position={[wetCx, floorY + 0.02, -7.3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={m.stone}>
                <planeGeometry args={[wetW, 2.2]} />
              </mesh>
              {/* meuble vasque */}
              <mesh position={[wetCx, floorY + 0.4, -8.0]} castShadow receiveShadow material={m.woodDark}>
                <boxGeometry args={[0.9, 0.8, 0.45]} />
              </mesh>
              <mesh position={[wetCx, floorY + 0.82, -8.0]} castShadow receiveShadow material={m.stone}>
                <boxGeometry args={[0.96, 0.06, 0.5]} />
              </mesh>
              <mesh position={[wetCx, floorY + 0.95, -8.05]} castShadow material={m.metal}>
                <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
              </mesh>
              {/* colonne de douche */}
              <mesh position={[wetCx + dir * 0.7, floorY + 1.0, -6.9]} castShadow material={m.metal}>
                <cylinderGeometry args={[0.025, 0.025, 1.8, 10]} />
              </mesh>
            </group>
          );
        })()}

        {/* ---- LAMPE D'AMBIANCE ---- */}
        <pointLight position={[cx, floorY + 2.4, -6.8]} color="#ffdca6" intensity={6} distance={8} decay={2} />
      </group>
    );
  }

  const floorY = 7.75;
  // Mur de chambre le long de Z (h 2.4 m).
  const wallZ = (x: number, z0: number, z1: number, key?: string) => (
    <mesh key={key} position={[x, floorY + 1.2, (z0 + z1) / 2]} castShadow receiveShadow material={materials.partition}>
      <boxGeometry args={[0.12, 2.4, Math.abs(z1 - z0)]} />
    </mesh>
  );
  // Mur de chambre le long de X, avec une porte (gap), via 2 segments + linteau.
  const wallXdoor = (z: number, x0: number, x1: number, doorC: number, doorW: number, key: string) => (
    <group key={key}>
      <mesh position={[(x0 + (doorC - doorW / 2)) / 2, floorY + 1.2, z]} castShadow receiveShadow material={materials.partition}>
        <boxGeometry args={[Math.abs(doorC - doorW / 2 - x0), 2.4, 0.12]} />
      </mesh>
      <mesh position={[((doorC + doorW / 2) + x1) / 2, floorY + 1.2, z]} castShadow receiveShadow material={materials.partition}>
        <boxGeometry args={[Math.abs(x1 - (doorC + doorW / 2)), 2.4, 0.12]} />
      </mesh>
      <mesh position={[doorC, floorY + 2.15, z]} castShadow receiveShadow material={materials.partition}>
        <boxGeometry args={[doorW, 0.5, 0.12]} />
      </mesh>
    </group>
  );

  return (
    <group>
      {/* ===== Mur noyau / couloir (laisse le couloir ouvert devant) ===== */}
      {wallZ(-6.4, -8.3, -5.4, "w-core")}
      {/* ===== Cloison centrale entre les 2 chambres ===== */}
      {wallZ(1.75, -8.3, -5.2, "w-center")}
      {/* ===== Façades des chambres (z=-5.2) avec une porte chacune ===== */}
      {wallXdoor(-5.2, -6.4, 1.75, -2.5, 1.1, "front-left")}
      {wallXdoor(-5.2, 1.75, 10.4, 6.0, 1.1, "front-right")}

      {/* ===== Les deux chambres (toutes deux à droite du noyau) ===== */}
      <GuestRoom cx={-2.5} dir={-1} />
      <GuestRoom cx={6.0} dir={1} />
    </group>
  );
}
