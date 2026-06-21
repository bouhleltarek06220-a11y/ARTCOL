"use client";

import { useMemo } from "react";
import { DoubleSide, MeshStandardMaterial } from "three";
import { getVillaTextures } from "@/components/villa/textures";

/**
 * Sous-sol (niveau −1) du bloc principal : coque enterrée (dalle y=−4, murs de
 * soutènement jusqu'au plancher du rez à y=0) + escalier de descente débouchant
 * par une trémie percée dans le sol du hall (gérée dans <VillaInterior/>).
 *
 * Surface du sol sous-sol ≈ −3.85. Voir Player.tsx pour la nav (niveau −1).
 * Les pièces (spa, hammam, sport, cinéma) sont des modules séparés.
 */
const F = -4.0; // centre de la dalle (surface ≈ -3.85)

export function Basement() {
  const marble = useMemo(() => {
    const t = getVillaTextures();
    const m = new MeshStandardMaterial({ color: "#cbc5ba", roughness: 0.3, metalness: 0.1 });
    if (t) {
      const map = t.marble.clone();
      map.needsUpdate = true;
      map.repeat.set(5, 3);
      m.map = map;
    }
    return m;
  }, []);
  const concrete = useMemo(() => {
    const t = getVillaTextures();
    const m = new MeshStandardMaterial({ color: "#9c9484", roughness: 0.95, side: DoubleSide });
    if (t) {
      const map = t.concrete.clone();
      map.needsUpdate = true;
      map.repeat.set(4, 1.5);
      m.map = map;
      const bump = t.concreteBump.clone();
      bump.needsUpdate = true;
      bump.repeat.set(4, 1.5);
      m.bumpMap = bump;
      m.bumpScale = 0.9;
    }
    return m;
  }, []);
  const step = useMemo(
    () => new MeshStandardMaterial({ color: "#d8d2c6", roughness: 0.3 }),
    [],
  );
  const metal = useMemo(
    () => new MeshStandardMaterial({ color: "#1b1c1e", roughness: 0.35, metalness: 0.85 }),
    [],
  );

  // Escalier de descente : 16 marches le long de z (de z=2.0/y≈0 à z=-3.0/y≈-3.9),
  // à x=-9, dans la trémie laissée libre dans le sol du hall.
  const steps = Array.from({ length: 16 });

  return (
    <group>
      {/* ===== DALLE SOL (marbre) ===== */}
      <mesh material={marble} position={[0, F, -3]} receiveShadow>
        <boxGeometry args={[21.5, 0.3, 11]} />
      </mesh>

      {/* ===== MURS DE SOUTÈNEMENT (béton, y=-4 → 0) ===== */}
      <mesh material={concrete} position={[0, -2, -8.3]} castShadow receiveShadow>
        <boxGeometry args={[21.5, 4, 0.3]} />
      </mesh>
      <mesh material={concrete} position={[0, -2, 2.3]} castShadow receiveShadow>
        <boxGeometry args={[21.5, 4, 0.3]} />
      </mesh>
      <mesh material={concrete} position={[-10.6, -2, -3]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 4, 11]} />
      </mesh>
      <mesh material={concrete} position={[10.6, -2, -3]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 4, 11]} />
      </mesh>

      {/* ===== ESCALIER DE DESCENTE (trémie x=-9) ===== */}
      <group>
        {steps.map((_, i) => (
          <mesh
            key={i}
            material={step}
            position={[-9, -0.12 - i * 0.247, 2.0 - i * 0.333]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[2.0, 0.2, 0.42]} />
          </mesh>
        ))}
        {/* limons */}
        {[-9.95, -8.05].map((x) => (
          <mesh key={x} material={metal} position={[x, -2.0, -0.5]} rotation={[Math.PI / 3.6, 0, 0]}>
            <boxGeometry args={[0.1, 0.4, 6.2]} />
          </mesh>
        ))}
      </group>

      {/* ===== ÉCLAIRAGE (sous-sol, chaud + appoint froid) ===== */}
      <pointLight position={[-6, -1.2, -1]} intensity={9} distance={12} decay={2} color="#ffe0b4" />
      <pointLight position={[6, -1.2, -1]} intensity={9} distance={12} decay={2} color="#ffe0b4" />
      <pointLight position={[0, -1.0, -6]} intensity={6} distance={11} decay={2} color="#bcd0ff" />
      <pointLight position={[-9, -0.5, 0.5]} intensity={5} distance={7} decay={2} color="#ffe0b4" />
    </group>
  );
}
