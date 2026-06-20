"use client";

import { useMemo } from "react";
import {
  MeshStandardMaterial,
  MeshPhysicalMaterial,
  DoubleSide,
} from "three";

/**
 * Architecture de la villa contemporaine (béton, pierre naturelle, verre,
 * métal sombre). Volumes épurés, grands débords, immenses baies vitrées avec
 * lueur intérieure chaude. Modélisée en primitives, pensée pour un rendu
 * « golden hour » premium.
 */
export function VillaArchitecture() {
  const concrete = useMemo(
    () => new MeshStandardMaterial({ color: "#c7c2b8", roughness: 0.92, metalness: 0 }),
    [],
  );
  const stone = useMemo(
    () => new MeshStandardMaterial({ color: "#cdbb9c", roughness: 0.85, metalness: 0 }),
    [],
  );
  const darkMetal = useMemo(
    () => new MeshStandardMaterial({ color: "#1b1c1e", roughness: 0.4, metalness: 0.8 }),
    [],
  );
  const woodSoffit = useMemo(
    () => new MeshStandardMaterial({ color: "#6e4e30", roughness: 0.6, metalness: 0 }),
    [],
  );
  // Verre teinté réfléchissant : capte le ciel coucher de soleil.
  const glass = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#0c1519",
        roughness: 0.05,
        metalness: 0.1,
        envMapIntensity: 1.6,
        transparent: true,
        opacity: 0.38,
        side: DoubleSide,
      }),
    [],
  );
  // Intérieur chaud visible derrière les vitres.
  const interiorGlow = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#241708",
        emissive: "#ffb866",
        emissiveIntensity: 1.5,
        toneMapped: false,
      }),
    [],
  );

  return (
    <group>
      {/* ===== REZ-DE-CHAUSSÉE (long volume béton) ===== */}
      <mesh material={concrete} position={[0, 1.7, -3]} castShadow receiveShadow>
        <boxGeometry args={[22, 3.4, 11]} />
      </mesh>
      {/* Toit débordant du rez */}
      <mesh material={concrete} position={[0, 3.5, -3]} castShadow>
        <boxGeometry args={[23.4, 0.3, 12.4]} />
      </mesh>

      {/* Intérieur lumineux + grande baie vitrée (façade piscine, z = +2.5) */}
      <mesh material={interiorGlow} position={[1, 1.7, 2.46]}>
        <planeGeometry args={[15, 2.8]} />
      </mesh>
      <mesh material={glass} position={[1, 1.7, 2.55]}>
        <planeGeometry args={[15.4, 3]} />
      </mesh>
      {/* Meneaux verticaux (métal sombre) */}
      {[-6.5, -3, 0.5, 4, 7.5].map((x) => (
        <mesh key={x} material={darkMetal} position={[x, 1.7, 2.6]}>
          <boxGeometry args={[0.1, 3, 0.1]} />
        </mesh>
      ))}

      {/* ===== ÉTAGE (volume en porte-à-faux décalé) ===== */}
      <mesh material={concrete} position={[3.5, 5.3, -3.6]} castShadow receiveShadow>
        <boxGeometry args={[15, 3.2, 9.2]} />
      </mesh>
      {/* Soffite bois sous le cantilever */}
      <mesh material={woodSoffit} position={[3.5, 3.68, 0.6]} castShadow>
        <boxGeometry args={[15, 0.12, 2.2]} />
      </mesh>
      {/* Toit de l'étage */}
      <mesh material={concrete} position={[3.5, 7.0, -3.6]} castShadow>
        <boxGeometry args={[16, 0.28, 10]} />
      </mesh>

      {/* Bandeau vitré de l'étage (façade piscine, z = -3.6 + 4.6 = 1.0) */}
      <mesh material={interiorGlow} position={[3.5, 5.3, 0.96]}>
        <planeGeometry args={[13.5, 2.2]} />
      </mesh>
      <mesh material={glass} position={[3.5, 5.3, 1.02]}>
        <planeGeometry args={[14, 2.4]} />
      </mesh>
      {/* Garde-corps verre de la terrasse d'étage */}
      <mesh material={glass} position={[3.5, 4.1, 1.9]}>
        <planeGeometry args={[14, 1.1]} />
      </mesh>
      <mesh material={darkMetal} position={[3.5, 3.55, 1.9]}>
        <boxGeometry args={[14, 0.06, 0.12]} />
      </mesh>

      {/* ===== TOUR DE PIERRE (entrée, à gauche) ===== */}
      <mesh material={stone} position={[-10.5, 4.2, -1]} castShadow receiveShadow>
        <boxGeometry args={[3, 8.6, 7]} />
      </mesh>
      {/* Fente lumineuse verticale dans la pierre */}
      <mesh material={interiorGlow} position={[-9, 4.2, 2.52]}>
        <planeGeometry args={[0.5, 6]} />
      </mesh>

      {/* ===== PORTE PIVOT (entrée) ===== */}
      <mesh material={woodSoffit} position={[-6.5, 1.5, 2.5]} castShadow>
        <boxGeometry args={[2.2, 3, 0.14]} />
      </mesh>
      <mesh material={darkMetal} position={[-5.7, 1.5, 2.58]}>
        <boxGeometry args={[0.06, 1.4, 0.06]} />
      </mesh>

      {/* ===== MUR PLEIN ARRIÈRE / PIGNONS (béton) ===== */}
      <mesh material={concrete} position={[11.2, 1.7, -3]} castShadow>
        <boxGeometry args={[0.4, 3.4, 11]} />
      </mesh>
    </group>
  );
}
