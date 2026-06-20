"use client";

import { useMemo } from "react";
import { MeshStandardMaterial, DoubleSide } from "three";
import { getVillaTextures } from "@/components/villa/textures";

/**
 * Coque de la villa contemporaine — pensée pour être VISITÉE de l'intérieur :
 * murs périphériques (béton, double face), grande baie vitrée en façade avec
 * une OUVERTURE d'entrée, toit, mur-lame en pierre. L'intérieur (sol marbre,
 * mezzanine, escalier, œuvres…) est dans <VillaInterior/>.
 *
 * Repère : façade vitrée en z = +2.5, mur arrière en z = -8.5, double hauteur.
 */
const FRONT_Z = 2.5;
const BACK_Z = -8.5;
const LEFT_X = -11;
const RIGHT_X = 11;
const WALL_H = 7.4;
const ROOF_Y = 7.5;

export function VillaArchitecture() {
  const concrete = useMemo(() => {
    const t = getVillaTextures();
    const m = new MeshStandardMaterial({
      color: "#b3a896",
      roughness: 0.92,
      metalness: 0,
      side: DoubleSide,
    });
    if (t) {
      const map = t.concrete.clone();
      map.needsUpdate = true;
      map.repeat.set(3, 2);
      m.map = map;
    }
    return m;
  }, []);
  const stone = useMemo(
    () => new MeshStandardMaterial({ color: "#cdbb9c", roughness: 0.85, metalness: 0 }),
    [],
  );
  const darkMetal = useMemo(
    () => new MeshStandardMaterial({ color: "#1b1c1e", roughness: 0.4, metalness: 0.8 }),
    [],
  );
  const wood = useMemo(
    () => new MeshStandardMaterial({ color: "#5b3f27", roughness: 0.6, metalness: 0 }),
    [],
  );
  const glass = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#0c1519",
        roughness: 0.05,
        metalness: 0.1,
        envMapIntensity: 1.6,
        transparent: true,
        opacity: 0.32,
        side: DoubleSide,
      }),
    [],
  );

  return (
    <group>
      {/* ===== MURS PÉRIPHÉRIQUES (béton, double face) ===== */}
      {/* Mur arrière */}
      <mesh material={concrete} position={[0, WALL_H / 2, BACK_Z]} castShadow receiveShadow>
        <boxGeometry args={[22.4, WALL_H, 0.4]} />
      </mesh>
      {/* Mur gauche */}
      <mesh material={concrete} position={[LEFT_X, WALL_H / 2, -3]} castShadow receiveShadow>
        <boxGeometry args={[0.4, WALL_H, 11.4]} />
      </mesh>
      {/* Mur droit */}
      <mesh material={concrete} position={[RIGHT_X, WALL_H / 2, -3]} castShadow receiveShadow>
        <boxGeometry args={[0.4, WALL_H, 11.4]} />
      </mesh>
      {/* Bandeau béton au-dessus de la façade (linteau) */}
      <mesh material={concrete} position={[0, 7.0, FRONT_Z]} castShadow>
        <boxGeometry args={[22.4, 0.9, 0.5]} />
      </mesh>

      {/* ===== TOIT (dalle débordante) ===== */}
      <mesh material={concrete} position={[0, ROOF_Y, -3]} castShadow>
        <boxGeometry args={[23.6, 0.3, 12.4]} />
      </mesh>

      {/* ===== FAÇADE VITRÉE avec OUVERTURE d'entrée (vers x = -6.5) ===== */}
      {/* Panneau gauche (de x=-11 à x=-7.7) */}
      <mesh material={glass} position={[-9.35, 3.35, FRONT_Z]}>
        <planeGeometry args={[3.3, 6.5]} />
      </mesh>
      {/* Panneau droit (de x=-5.3 à x=11) */}
      <mesh material={glass} position={[2.85, 3.35, FRONT_Z]}>
        <planeGeometry args={[16.3, 6.5]} />
      </mesh>
      {/* Meneaux verticaux (métal) */}
      {[-9.35, -3, 0.5, 4, 7.5, 10.3].map((x) => (
        <mesh key={x} material={darkMetal} position={[x, 3.35, FRONT_Z + 0.04]}>
          <boxGeometry args={[0.1, 6.5, 0.1]} />
        </mesh>
      ))}

      {/* ===== PORTE PIVOT OUVERTE (entrée, x = -6.5) ===== */}
      <group position={[-7.5, 1.6, FRONT_Z]} rotation={[0, Math.PI / 2.4, 0]}>
        <mesh material={wood} castShadow>
          <boxGeometry args={[2.2, 3.2, 0.14]} />
        </mesh>
        <mesh material={darkMetal} position={[0.8, 0, 0.1]}>
          <boxGeometry args={[0.06, 1.6, 0.06]} />
        </mesh>
      </group>

      {/* ===== MUR-LAME EN PIERRE (feature d'entrée, à l'extérieur) ===== */}
      <mesh material={stone} position={[-10, 3.5, 4.2]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 7, 5]} />
      </mesh>
    </group>
  );
}
