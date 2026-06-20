"use client";

import { useMemo } from "react";
import { MeshStandardMaterial, DoubleSide } from "three";

/**
 * Intérieur de la villa transformée en galerie : hall double hauteur, sol
 * marbre poli, mezzanine, escalier monumental, lustre architectural, grandes
 * œuvres éclairées comme dans un musée, lumière chaude d'ambiance.
 *
 * Cohérent avec la coque <VillaArchitecture/> (façade z=+2.5, fond z=-8.5).
 */
const ART = ["#7b2d3a", "#1f3a5f", "#2f5d4a", "#6a4a86", "#b5762a"];

export function VillaInterior() {
  const marble = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#ece8e1",
        roughness: 0.14,
        metalness: 0.1,
        envMapIntensity: 1.2,
      }),
    [],
  );
  const plaster = useMemo(
    () => new MeshStandardMaterial({ color: "#d8d3ca", roughness: 0.95, side: DoubleSide }),
    [],
  );
  const stepMat = useMemo(
    () => new MeshStandardMaterial({ color: "#e6e1d8", roughness: 0.2, metalness: 0.1 }),
    [],
  );
  const metal = useMemo(
    () => new MeshStandardMaterial({ color: "#1b1c1e", roughness: 0.35, metalness: 0.85 }),
    [],
  );
  const frameMat = useMemo(
    () => new MeshStandardMaterial({ color: "#171715", roughness: 0.5, metalness: 0.3 }),
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

  // Escalier monumental : volée droite vers la mezzanine (y = 3.8).
  const steps = Array.from({ length: 16 });

  return (
    <group>
      {/* ===== SOL MARBRE POLI ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -3]} receiveShadow>
        <planeGeometry args={[21.6, 10.8]} />
        <primitive object={marble} attach="material" />
      </mesh>
      {/* Plafond du hall (sous le toit) */}
      <mesh material={plaster} position={[0, 7.25, -3]}>
        <boxGeometry args={[21.6, 0.1, 10.8]} />
      </mesh>

      {/* ===== MEZZANINE (étage ouvert sur le hall, moitié arrière) ===== */}
      <mesh material={marble} position={[0, 3.8, -6]} castShadow receiveShadow>
        <boxGeometry args={[21.4, 0.3, 5]} />
      </mesh>
      {/* Garde-corps verre de la mezzanine */}
      <mesh position={[0, 4.4, -3.5]}>
        <boxGeometry args={[21.4, 1.1, 0.06]} />
        <meshStandardMaterial color="#16242c" roughness={0.05} transparent opacity={0.3} side={DoubleSide} />
      </mesh>
      <mesh material={metal} position={[0, 3.95, -3.5]}>
        <boxGeometry args={[21.4, 0.06, 0.1]} />
      </mesh>

      {/* ===== ESCALIER MONUMENTAL (côté droit, monte vers la mezzanine) ===== */}
      <group position={[6.5, 0, -2.6]}>
        {steps.map((_, i) => (
          <mesh
            key={i}
            material={stepMat}
            position={[0, 0.12 + i * 0.2375, -i * 0.3]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[3.2, 0.24, 0.34]} />
          </mesh>
        ))}
        {/* Limon latéral */}
        <mesh material={metal} position={[1.7, 1.9, -2.4]} rotation={[-Math.PI / 4.05, 0, 0]}>
          <boxGeometry args={[0.12, 0.5, 6.6]} />
        </mesh>
      </group>

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
        <pointLight position={[0, 5.4, 0]} intensity={22} distance={16} decay={2} color="#ffcf95" />
      </group>

      {/* ===== ŒUVRES D'ART (grandes toiles + cadre + spot musée + cartel) ===== */}
      {/* Mur du fond (z = -8.3, face +z) */}
      <Artwork position={[-6, 2.6, -8.28]} color={ART[0]} frameMat={frameMat} />
      <Artwork position={[0, 2.6, -8.28]} color={ART[1]} frameMat={frameMat} wide />
      <Artwork position={[6, 2.6, -8.28]} color={ART[2]} frameMat={frameMat} />
      {/* Mur gauche (x = -10.8, face +x) */}
      <Artwork
        position={[-10.78, 2.6, -3]}
        rotation={[0, Math.PI / 2, 0]}
        color={ART[3]}
        frameMat={frameMat}
        wide
      />
      {/* Mur droit (x = 10.8, face -x) */}
      <Artwork
        position={[10.78, 2.6, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        color={ART[4]}
        frameMat={frameMat}
      />

      {/* Lumière chaude d'ambiance dans le hall */}
      <pointLight position={[0, 3, 0]} intensity={10} distance={20} decay={2} color="#ffdcae" />
      <pointLight position={[5, 2.4, -6]} intensity={6} distance={14} decay={2} color="#ffe2ba" />
    </group>
  );
}

/* ---------- Une œuvre encadrée + cartel + spot ---------- */
function Artwork({
  position,
  rotation = [0, 0, 0],
  color,
  frameMat,
  wide = false,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  color: string;
  frameMat: MeshStandardMaterial;
  wide?: boolean;
}) {
  const w = wide ? 4.2 : 2.4;
  const h = 2.8;
  return (
    <group position={position} rotation={rotation}>
      {/* Cadre 3D en relief */}
      <mesh material={frameMat} castShadow>
        <boxGeometry args={[w + 0.2, h + 0.2, 0.12]} />
      </mesh>
      {/* Toile (couleur riche, légèrement lumineuse → lecture « musée ») */}
      <mesh position={[0, 0, 0.08]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial color={color} roughness={0.55} emissive={color} emissiveIntensity={0.4} />
      </mesh>
      {/* Cartel d'exposition */}
      <mesh position={[-(w / 2) + 0.3, -(h / 2) - 0.35, 0.08]}>
        <planeGeometry args={[0.5, 0.22]} />
        <meshStandardMaterial color="#f4f1ea" roughness={0.8} emissive="#f4f1ea" emissiveIntensity={0.15} />
      </mesh>
    </group>
  );
}
