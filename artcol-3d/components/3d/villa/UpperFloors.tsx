"use client";

import { useMemo } from "react";
import { DoubleSide, MeshStandardMaterial } from "three";
import { getVillaTextures } from "@/components/villa/textures";

/**
 * Étage 2 (R2) du bloc principal : dalle de plancher (moitié arrière, trémie
 * pour l'escalier), 2e volée d'escalier R1→R2 (côté gauche, montant le long de
 * X à z≈−6.9), et garde-corps verre en façade de l'étage. La mezzanine (R1)
 * existe déjà dans <VillaInterior/>.
 *
 * Repères : dalle R2 à y=7.6 (surface ≈7.75). Voir Player.tsx pour la nav.
 */
const R2_Y = 7.6; // centre de la dalle

export function UpperFloors() {
  const marble = useMemo(() => {
    const t = getVillaTextures();
    const m = new MeshStandardMaterial({ color: "#cfc9bf", roughness: 0.22, metalness: 0.1, envMapIntensity: 1.2 });
    if (t) {
      const map = t.marble.clone();
      map.needsUpdate = true;
      map.repeat.set(4, 2);
      m.map = map;
    }
    return m;
  }, []);
  const step = useMemo(
    () => new MeshStandardMaterial({ color: "#e6e1d8", roughness: 0.2, metalness: 0.1 }),
    [],
  );
  const metal = useMemo(
    () => new MeshStandardMaterial({ color: "#1b1c1e", roughness: 0.35, metalness: 0.85 }),
    [],
  );
  const glassRail = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#16242c",
        roughness: 0.05,
        transparent: true,
        opacity: 0.3,
        side: DoubleSide,
      }),
    [],
  );

  // 2e volée : 16 marches montant le long de X (de x=-10/y≈3.95 à x=-3.5/y≈7.75),
  // à z=-6.9, dans la trémie laissée libre dans la dalle.
  const steps = Array.from({ length: 16 });

  return (
    <group>
      {/* ===== DALLE R2 (3 bandes — trémie d'escalier laissée libre à gauche) ===== */}
      {/* bande arrière (z -8.5..-7.6) */}
      <mesh material={marble} position={[0, R2_Y, -8.05]} castShadow receiveShadow>
        <boxGeometry args={[21.4, 0.3, 0.9]} />
      </mesh>
      {/* bande avant (z -6.2..-4.95) */}
      <mesh material={marble} position={[0, R2_Y, -5.575]} castShadow receiveShadow>
        <boxGeometry args={[21.4, 0.3, 1.25]} />
      </mesh>
      {/* bande centrale droite (x -2.8..10.7, z -7.6..-6.2) — laisse la trémie à gauche */}
      <mesh material={marble} position={[3.95, R2_Y, -6.9]} castShadow receiveShadow>
        <boxGeometry args={[13.5, 0.3, 1.4]} />
      </mesh>

      {/* ===== GARDE-CORPS VERRE (façade de l'étage, z=-4.95) ===== */}
      <mesh position={[0, R2_Y + 0.7, -4.95]}>
        <boxGeometry args={[21.4, 1.1, 0.06]} />
        <primitive object={glassRail} attach="material" />
      </mesh>
      <mesh material={metal} position={[0, R2_Y + 0.2, -4.95]}>
        <boxGeometry args={[21.4, 0.06, 0.1]} />
      </mesh>

      {/* ===== 2e VOLÉE D'ESCALIER (R1 → R2), le long de X à z=-6.9 ===== */}
      <group>
        {steps.map((_, i) => (
          <mesh
            key={i}
            material={step}
            position={[-10 + i * 0.4333, 4.07 + i * 0.2375, -6.9]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.5, 0.24, 1.4]} />
          </mesh>
        ))}
        {/* limon latéral */}
        <mesh material={metal} position={[-6.75, 5.85, -7.55]} rotation={[0, 0, -Math.PI / 4.05]}>
          <boxGeometry args={[6.8, 0.12, 0.5]} />
        </mesh>
      </group>
    </group>
  );
}
