"use client";

import { useMemo } from "react";
import { DoubleSide, MeshStandardMaterial } from "three";
import { getVillaTextures } from "@/components/villa/textures";
import { CORE } from "@/components/villa/dimensions";
import { CoreStairs } from "./CoreStairs";

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
    const m = new MeshStandardMaterial({ color: "#ece6da", roughness: 1, metalness: 0.12, envMapIntensity: 1.7 });
    if (t) {
      const rep = 2.6;
      const map = t.marble.clone();
      map.needsUpdate = true;
      map.repeat.set(rep, rep * 0.62);
      m.map = map;
      const rgh = t.marbleRough.clone();
      rgh.needsUpdate = true;
      rgh.repeat.set(rep, rep * 0.62);
      m.roughnessMap = rgh;
      const nrm = t.marbleNormal.clone();
      nrm.needsUpdate = true;
      nrm.repeat.set(rep, rep * 0.62);
      m.normalMap = nrm;
      m.normalScale.set(0.32, 0.32);
    }
    return m;
  }, []);
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

  return (
    <group>
      {/* ===== DALLE R2 — identique à la mezzanine : trouée sur le NOYAU =====
            Trémie ouverte x[-10.3,-6.5] z[-8.2,-4.4] ; bande arrière + palier
            d'arrivée (front). Profondeur jusqu'à z=-3.5 (couloir d'accès chambres). */}
      {/* bande droite (x -6.5..10.7) */}
      <mesh material={marble} position={[2.1, R2_Y, -6]} castShadow receiveShadow>
        <boxGeometry args={[17.2, 0.3, 5]} />
      </mesh>
      {/* fine bande gauche le long du mur */}
      <mesh material={marble} position={[-10.5, R2_Y, -6]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.3, 5]} />
      </mesh>
      {/* bande arrière du noyau (contre le mur du fond) */}
      <mesh material={marble} position={[-8.4, R2_Y, -8.35]} castShadow receiveShadow>
        <boxGeometry args={[3.8, 0.3, 0.3]} />
      </mesh>
      {/* palier d'arrivée du noyau (front) */}
      <mesh material={marble} position={[-8.4, R2_Y, -3.95]} castShadow receiveShadow>
        <boxGeometry args={[3.8, 0.3, 0.9]} />
      </mesh>

      {/* ===== GARDE-CORPS VERRE (façade z=-3.5 — segment droit ; noyau ouvre devant) ===== */}
      <mesh position={[2.1, R2_Y + 0.7, -3.5]}>
        <boxGeometry args={[17.2, 1.1, 0.06]} />
        <primitive object={glassRail} attach="material" />
      </mesh>
      <mesh material={metal} position={[2.1, R2_Y + 0.2, -3.5]}>
        <boxGeometry args={[17.2, 0.06, 0.1]} />
      </mesh>
      {/* garde-corps le long de la trémie (côté hall, x=-6.5) */}
      <mesh position={[-6.5, R2_Y + 0.7, -6.3]}>
        <boxGeometry args={[0.06, 1.1, 3.8]} />
        <primitive object={glassRail} attach="material" />
      </mesh>

      {/* ===== NOYAU DE CIRCULATION — volée R1→R2 ===== */}
      <CoreStairs loY={CORE.Y.r1} hiY={CORE.Y.r2} />
    </group>
  );
}
