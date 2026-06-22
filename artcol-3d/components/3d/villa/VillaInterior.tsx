"use client";

import { useMemo } from "react";
import { MeshStandardMaterial, DoubleSide } from "three";
import { getVillaTextures } from "@/components/villa/textures";
import { ARTWORKS } from "@/components/villa/world/artworks";
import { Artwork } from "@/components/villa/world/Artwork";
import { CORE } from "@/components/villa/dimensions";
import { CoreStairs } from "./CoreStairs";

/**
 * Intérieur de la villa transformée en galerie : hall double hauteur, sol
 * marbre poli, mezzanine, escalier monumental, lustre architectural, grandes
 * œuvres éclairées comme dans un musée, lumière chaude d'ambiance.
 *
 * Cohérent avec la coque <VillaArchitecture/> (façade z=+2.5, fond z=-8.5).
 */
const ART = ["#7b2d3a", "#1f3a5f", "#2f5d4a", "#6a4a86", "#b5762a"];

export function VillaInterior() {
  const marble = useMemo(() => {
    const t = getVillaTextures();
    const m = new MeshStandardMaterial({
      color: "#cfc9bf",
      roughness: 0.22,
      metalness: 0.1,
      envMapIntensity: 1.2,
    });
    if (t) {
      const map = t.marble.clone();
      map.needsUpdate = true;
      map.repeat.set(4, 2);
      m.map = map;
    }
    return m;
  }, []);
  const plaster = useMemo(
    () => new MeshStandardMaterial({ color: "#d8d3ca", roughness: 0.95, side: DoubleSide }),
    [],
  );
  const metal = useMemo(
    () => new MeshStandardMaterial({ color: "#1b1c1e", roughness: 0.35, metalness: 0.85 }),
    [],
  );
  const chandelierMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#2a2008",
        emissive: "#ffcf8a",
        emissiveIntensity: 3,
        toneMapped: false,
      }),
    [],
  );

  return (
    <group>
      {/* ===== SOL MARBRE POLI — trémie du NOYAU laissée libre (x[-10.3,-6.5]
            z[-8.2,-4.4], là où descend la volée R0→S−1) ===== */}
      {/* à droite du noyau */}
      <mesh material={marble} rotation={[-Math.PI / 2, 0, 0]} position={[2.15, 0.02, -3]} receiveShadow>
        <planeGeometry args={[17.3, 10.8]} />
      </mesh>
      {/* fine bande gauche le long du mur */}
      <mesh material={marble} rotation={[-Math.PI / 2, 0, 0]} position={[-10.55, 0.02, -3]} receiveShadow>
        <planeGeometry args={[0.5, 10.8]} />
      </mesh>
      {/* devant le noyau (hall → terrasse) */}
      <mesh material={marble} rotation={[-Math.PI / 2, 0, 0]} position={[-8.4, 0.02, -1.0]} receiveShadow>
        <planeGeometry args={[3.8, 6.8]} />
      </mesh>
      {/* derrière le noyau (contre le mur du fond) */}
      <mesh material={marble} rotation={[-Math.PI / 2, 0, 0]} position={[-8.4, 0.02, -8.3]} receiveShadow>
        <planeGeometry args={[3.8, 0.2]} />
      </mesh>
      {/* Plafond du hall, remonté sous la nouvelle toiture (hall triple hauteur) */}
      <mesh material={plaster} position={[0, 11.0, -3]}>
        <boxGeometry args={[21.6, 0.1, 10.8]} />
      </mesh>

      {/* ===== DALLE MEZZANINE (R1) — trouée sur l'emprise du NOYAU ===== *
            Trémie ouverte x[-10.3,-6.5] z[-8.2,-4.4] ; palier d'arrivée (front)
            et bande arrière conservés en plancher. */}
      {/* bande droite (x -6.5..10.7) */}
      <mesh material={marble} position={[2.1, 3.8, -6]} castShadow receiveShadow>
        <boxGeometry args={[17.2, 0.3, 5]} />
      </mesh>
      {/* fine bande gauche le long du mur (x -10.7..-10.3) */}
      <mesh material={marble} position={[-10.5, 3.8, -6]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.3, 5]} />
      </mesh>
      {/* bande arrière du noyau (contre le mur du fond) */}
      <mesh material={marble} position={[-8.4, 3.8, -8.35]} castShadow receiveShadow>
        <boxGeometry args={[3.8, 0.3, 0.3]} />
      </mesh>
      {/* palier d'arrivée du noyau (avant, là où débouche la volée R0→R1) */}
      <mesh material={marble} position={[-8.4, 3.8, -3.95]} castShadow receiveShadow>
        <boxGeometry args={[3.8, 0.3, 0.9]} />
      </mesh>
      {/* Garde-corps verre de la mezzanine */}
      <mesh position={[0, 4.4, -3.5]}>
        <boxGeometry args={[21.4, 1.1, 0.06]} />
        <meshStandardMaterial color="#16242c" roughness={0.05} transparent opacity={0.3} side={DoubleSide} />
      </mesh>
      <mesh material={metal} position={[0, 3.95, -3.5]}>
        <boxGeometry args={[21.4, 0.06, 0.1]} />
      </mesh>

      {/* ===== NOYAU DE CIRCULATION — volée R0→R1 (arrière-gauche) ===== */}
      <CoreStairs loY={CORE.Y.r0} hiY={CORE.Y.r1} />

      {/* ===== LUSTRE ARCHITECTURAL (suspension de barres lumineuses) ===== */}
      <group position={[-2, 0, 0]}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh
            key={i}
            material={chandelierMat}
            position={[(i - 2) * 0.35, 6.4 - i * 0.45, 0]}
          >
            <cylinderGeometry args={[0.04, 0.04, 1.6 - i * 0.15, 8]} />
          </mesh>
        ))}
        <pointLight position={[0, 5.4, 0]} intensity={30} distance={16} decay={2} color="#ffcf95" />
      </group>

      {/* ===== ŒUVRES D'ART (grandes toiles + cadre + spot musée + cartel) ===== */}
      {/* Mur du fond (z = -8.3, face +z) */}
      <Artwork position={[-6, 2.6, -8.28]} color={ART[0]} meta={ARTWORKS["art-1"]} />
      <Artwork position={[0, 2.6, -8.28]} color={ART[1]} meta={ARTWORKS["art-2"]} wide />
      <Artwork position={[6, 2.6, -8.28]} color={ART[2]} meta={ARTWORKS["art-3"]} />
      {/* Mur gauche (x = -10.8, face +x) — avancée en z=-2.9 (entre le noyau
            d'escalier au fond et l'embrasure de la cuisine) */}
      <Artwork
        position={[-10.78, 2.6, -2.9]}
        rotation={[0, Math.PI / 2, 0]}
        color={ART[3]}
        meta={ARTWORKS["art-4"]}
      />
      {/* Mur droit (x = 10.8, face -x) — décalée pour dégager la porte bibliothèque */}
      <Artwork
        position={[10.78, 2.6, -5.5]}
        rotation={[0, -Math.PI / 2, 0]}
        color={ART[4]}
        meta={ARTWORKS["art-5"]}
      />
      {/* ÉTAGE — œuvre sur le mur DROIT de la mezzanine (y ≈ 5), face -x
            (déplacée du mur gauche, désormais occupé par le noyau d'escalier) */}
      <Artwork
        position={[10.78, 5.0, -6.0]}
        rotation={[0, -Math.PI / 2, 0]}
        color={ART[0]}
        meta={ARTWORKS["art-8"]}
        wide
      />
      <pointLight position={[9.4, 6.2, -6.0]} intensity={6} distance={7} decay={2} color="#ffe6c0" />

      {/* Lumière chaude d'ambiance dans le hall */}
      <pointLight position={[0, 3, 0]} intensity={14} distance={20} decay={2} color="#ffdcae" />
      <pointLight position={[5, 2.4, -6]} intensity={9} distance={14} decay={2} color="#ffe2ba" />
    </group>
  );
}
