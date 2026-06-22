"use client";

import { useMemo } from "react";
import { MeshStandardMaterial, DoubleSide } from "three";
import { MeshReflectorMaterial } from "@react-three/drei";

/**
 * SPA de luxe au sous-sol (niveau -1).
 * Sol local y=0 (monde -3.85), plafond local ~3.85.
 * Zone monde : x ∈ [-7.5, -0.5], z ∈ [-8, 2].
 */
export function BasementSpa() {
  const matPierre = useMemo(
    () => new MeshStandardMaterial({ color: "#cdbb9c", roughness: 0.85 }),
    [],
  );
  const matPierreClaire = useMemo(
    () => new MeshStandardMaterial({ color: "#d8d2c6", roughness: 0.8 }),
    [],
  );
  const matMarbre = useMemo(
    () => new MeshStandardMaterial({ color: "#d7d1c6", roughness: 0.35, metalness: 0.1 }),
    [],
  );
  const matBassinSombre = useMemo(
    () => new MeshStandardMaterial({ color: "#06222b", roughness: 0.6, metalness: 0.2 }),
    [],
  );
  const matMetal = useMemo(
    () => new MeshStandardMaterial({ color: "#1b1c1e", roughness: 0.4, metalness: 0.8 }),
    [],
  );
  const matLin = useMemo(
    () => new MeshStandardMaterial({ color: "#d9d3c8", roughness: 0.9 }),
    [],
  );
  const matVerre = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#9fc4d6",
        transparent: true,
        opacity: 0.25,
        roughness: 0.1,
        metalness: 0.2,
        side: DoubleSide,
      }),
    [],
  );
  const matEauJacuzzi = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#0e3a47",
        emissive: "#1e5a72",
        emissiveIntensity: 0.6,
        roughness: 0.25,
        metalness: 0.6,
      }),
    [],
  );
  const matTeak = useMemo(() => new MeshStandardMaterial({ color: "#6b4a2c", roughness: 0.6 }), []);
  const matPot = useMemo(() => new MeshStandardMaterial({ color: "#33302b", roughness: 0.85 }), []);
  const matLeaf = useMemo(() => new MeshStandardMaterial({ color: "#3f5d36", roughness: 0.8 }), []);
  const matLeafDark = useMemo(() => new MeshStandardMaterial({ color: "#2f4a2a", roughness: 0.8 }), []);
  const matFlame = useMemo(
    () => new MeshStandardMaterial({ color: "#3a2e16", emissive: "#ffce8a", emissiveIntensity: 3.6, toneMapped: false, roughness: 0.5 }),
    [],
  );

  // Plante en pot, type sansevière (feuilles dressées) — lisible et élégante.
  const Plant = ({ x, z, s = 1 }: { x: number; z: number; s?: number }) => (
    <group position={[x, 0, z]} scale={s}>
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow material={matPot}>
        <cylinderGeometry args={[0.24, 0.3, 0.56, 20]} />
      </mesh>
      <mesh position={[0, 0.55, 0]} material={matLeafDark}>
        <cylinderGeometry args={[0.22, 0.22, 0.05, 16]} />
      </mesh>
      {[-0.14, -0.07, 0, 0.07, 0.14].map((dx, i) => (
        <mesh
          key={i}
          position={[dx, 0.95 + (i % 2) * 0.08, (i - 2) * 0.05]}
          rotation={[(i - 2) * 0.12, 0, dx * 1.6]}
          castShadow
          material={i % 2 ? matLeaf : matLeafDark}
        >
          <boxGeometry args={[0.07, 0.95, 0.03]} />
        </mesh>
      ))}
    </group>
  );

  // Lanterne à bougie : cage métal + verre + flamme émissive (+ halo chaud
  // optionnel via pointLight courte portée pour les plus visibles).
  const Lantern = ({ x, z, glow = false }: { x: number; z: number; glow?: boolean }) => (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.03, 0]} castShadow material={matMetal}>
        <boxGeometry args={[0.2, 0.06, 0.2]} />
      </mesh>
      {([[-1, -1], [1, -1], [-1, 1], [1, 1]] as const).map(([sx, sz], i) => (
        <mesh key={i} position={[sx * 0.085, 0.28, sz * 0.085]} material={matMetal}>
          <boxGeometry args={[0.02, 0.42, 0.02]} />
        </mesh>
      ))}
      <mesh position={[0, 0.5, 0]} castShadow material={matMetal}>
        <boxGeometry args={[0.22, 0.04, 0.22]} />
      </mesh>
      <mesh position={[0, 0.28, 0]} material={matVerre}>
        <boxGeometry args={[0.16, 0.4, 0.16]} />
      </mesh>
      <mesh position={[0, 0.2, 0]} material={matFlame}>
        <sphereGeometry args={[0.05, 10, 10]} />
      </mesh>
      {glow && <pointLight position={[0, 0.28, 0]} color="#ff9c4a" intensity={2.2} distance={2.4} decay={2} />}
    </group>
  );

  const poolX = -4.2;
  const poolZ = -4.5;
  const poolW = 5;
  const poolD = 3;
  const poolDepth = 1.2;

  const Transat = ({ x, z, rotY }: { x: number; z: number; rotY: number }) => (
    <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow material={matMetal}>
        <boxGeometry args={[0.7, 0.08, 1.8]} />
      </mesh>
      <mesh position={[0.28, 0.1, 0.7]} castShadow material={matMetal}>
        <cylinderGeometry args={[0.03, 0.03, 0.2, 8]} />
      </mesh>
      <mesh position={[-0.28, 0.1, 0.7]} castShadow material={matMetal}>
        <cylinderGeometry args={[0.03, 0.03, 0.2, 8]} />
      </mesh>
      <mesh position={[0.28, 0.1, -0.7]} castShadow material={matMetal}>
        <cylinderGeometry args={[0.03, 0.03, 0.2, 8]} />
      </mesh>
      <mesh position={[-0.28, 0.1, -0.7]} castShadow material={matMetal}>
        <cylinderGeometry args={[0.03, 0.03, 0.2, 8]} />
      </mesh>
      <mesh position={[0, 0.32, 0.1]} castShadow receiveShadow material={matLin}>
        <boxGeometry args={[0.62, 0.1, 1.5]} />
      </mesh>
      <mesh position={[0, 0.5, -0.7]} rotation={[-0.6, 0, 0]} castShadow receiveShadow material={matLin}>
        <boxGeometry args={[0.62, 0.1, 0.7]} />
      </mesh>
    </group>
  );

  return (
    <group position={[0, -3.85, 0]}>
      {/* SOL CARRELÉ */}
      <mesh position={[-4, 0.01, -3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={matPierreClaire}>
        <planeGeometry args={[7, 10]} />
      </mesh>

      {/* PLAFOND */}
      <mesh position={[-4, 3.84, -3]} rotation={[Math.PI / 2, 0, 0]} material={matMarbre}>
        <planeGeometry args={[7, 10]} />
      </mesh>

      {/* BASSIN DE NAGE ENCAISSÉ */}
      <group position={[poolX, 0, poolZ]}>
        <mesh position={[0, -poolDepth, 0]} receiveShadow material={matBassinSombre}>
          <boxGeometry args={[poolW, 0.1, poolD]} />
        </mesh>
        <mesh position={[poolW / 2, -poolDepth / 2, 0]} receiveShadow material={matBassinSombre}>
          <boxGeometry args={[0.1, poolDepth, poolD]} />
        </mesh>
        <mesh position={[-poolW / 2, -poolDepth / 2, 0]} receiveShadow material={matBassinSombre}>
          <boxGeometry args={[0.1, poolDepth, poolD]} />
        </mesh>
        <mesh position={[0, -poolDepth / 2, poolD / 2]} receiveShadow material={matBassinSombre}>
          <boxGeometry args={[poolW, poolDepth, 0.1]} />
        </mesh>
        <mesh position={[0, -poolDepth / 2, -poolD / 2]} receiveShadow material={matBassinSombre}>
          <boxGeometry args={[poolW, poolDepth, 0.1]} />
        </mesh>

        {/* SURFACE D'EAU réfléchissante */}
        <mesh position={[0, -poolDepth + 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[poolW - 0.2, poolD - 0.2]} />
          <MeshReflectorMaterial
            resolution={512}
            blur={[80, 30]}
            mixStrength={0.9}
            roughness={0.28}
            color="#072a34"
            metalness={0.5}
          />
        </mesh>

        {/* MARGELLE */}
        <mesh position={[poolW / 2 + 0.2, 0.02, 0]} castShadow receiveShadow material={matPierreClaire}>
          <boxGeometry args={[0.4, 0.06, poolD + 0.8]} />
        </mesh>
        <mesh position={[-poolW / 2 - 0.2, 0.02, 0]} castShadow receiveShadow material={matPierreClaire}>
          <boxGeometry args={[0.4, 0.06, poolD + 0.8]} />
        </mesh>
        <mesh position={[0, 0.02, poolD / 2 + 0.2]} castShadow receiveShadow material={matPierreClaire}>
          <boxGeometry args={[poolW + 0.8, 0.06, 0.4]} />
        </mesh>
        <mesh position={[0, 0.02, -poolD / 2 - 0.2]} castShadow receiveShadow material={matPierreClaire}>
          <boxGeometry args={[poolW + 0.8, 0.06, 0.4]} />
        </mesh>
      </group>

      {/* JACUZZI ROND */}
      <group position={[-1.6, 0, -0.8]}>
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow material={matBassinSombre}>
          <cylinderGeometry args={[0.9, 0.9, 0.8, 32]} />
        </mesh>
        <mesh position={[0, 0.82, 0]} castShadow receiveShadow material={matPierreClaire}>
          <cylinderGeometry args={[0.98, 0.98, 0.12, 32]} />
        </mesh>
        <mesh position={[0, 0.78, 0]} rotation={[-Math.PI / 2, 0, 0]} material={matEauJacuzzi}>
          <circleGeometry args={[0.82, 32]} />
        </mesh>
      </group>

      {/* TRANSATS — regroupés face au bassin, hors de l'axe de l'escalier */}
      <Transat x={-5.4} z={-1.6} rotY={Math.PI} />
      <Transat x={-3.6} z={-1.6} rotY={Math.PI} />
      <Transat x={-6.7} z={-5.2} rotY={Math.PI / 2} />

      {/* PAROI VITRÉE décorative */}
      <mesh position={[-0.7, 1.4, -3]} castShadow material={matVerre}>
        <boxGeometry args={[0.06, 2.8, 6]} />
      </mesh>

      {/* ===== DÉCO SPA (plantes, lanternes, serviettes, table) ===== */}
      {/* Plantes aux angles */}
      <Plant x={-7.0} z={-7.3} s={1.1} />
      <Plant x={-1.0} z={-7.3} s={1} />
      <Plant x={-6.9} z={1.3} s={1.15} />
      <Plant x={-1.2} z={0.9} s={0.95} />

      {/* Lanternes à bougie autour du bassin + jacuzzi (halo sur les plus visibles) */}
      <Lantern x={-6.9} z={-6.2} glow />
      <Lantern x={-1.5} z={-6.2} glow />
      <Lantern x={-6.9} z={-2.8} glow />
      <Lantern x={-1.5} z={-2.8} glow />
      <Lantern x={-0.6} z={-0.8} glow />
      <Lantern x={-4.5} z={-0.3} glow />

      {/* Serviettes roulées sur les transats (face bassin) */}
      {[-5.4, -3.6].map((x) => (
        <mesh key={x} position={[x, 0.42, -1.2]} rotation={[Math.PI / 2, 0, 0]} castShadow material={matLin}>
          <cylinderGeometry args={[0.09, 0.09, 0.5, 12]} />
        </mesh>
      ))}

      {/* Table d'appoint en teck (entre les transats) + serviettes pliées + flacon */}
      <group position={[-4.5, 0, -1.6]}>
        <mesh position={[0, 0.24, 0]} castShadow receiveShadow material={matTeak}>
          <boxGeometry args={[0.5, 0.48, 0.5]} />
        </mesh>
        <mesh position={[0, 0.52, 0]} castShadow material={matLin}>
          <boxGeometry args={[0.42, 0.1, 0.42]} />
        </mesh>
        <mesh position={[0, 0.6, 0]} castShadow material={matLin}>
          <boxGeometry args={[0.38, 0.07, 0.38]} />
        </mesh>
        <mesh position={[0.12, 0.74, 0.12]} castShadow material={matMetal}>
          <cylinderGeometry args={[0.035, 0.045, 0.22, 10]} />
        </mesh>
      </group>

      {/* Appliques murales (corps métal + barre chaude émissive + halo) */}
      {[-5.2, -2.4].map((x) => (
        <group key={x} position={[x, 1.95, -7.85]}>
          <mesh castShadow material={matMetal}>
            <boxGeometry args={[0.62, 0.16, 0.1]} />
          </mesh>
          <mesh position={[0, 0, 0.06]} material={matFlame}>
            <boxGeometry args={[0.5, 0.09, 0.04]} />
          </mesh>
          <pointLight position={[0, 0.1, 0.4]} color="#ffb066" intensity={3} distance={3.5} decay={2} />
        </group>
      ))}

      {/* ÉCLAIRAGE — bleu d'eau (underglow) + chaud d'ambiance */}
      <pointLight position={[poolX - 1.5, -0.7, poolZ]} color="#2f7da0" intensity={9} distance={4.5} />
      <pointLight position={[poolX + 1.5, -0.7, poolZ]} color="#2f7da0" intensity={9} distance={4.5} />
      <pointLight position={[-1.6, 0.5, -0.8]} color="#2f7da0" intensity={5} distance={2.6} />
      <pointLight position={[-4, 3, -1.5]} color="#ffe0b4" intensity={8} distance={6} />
      <pointLight position={[-5.5, 3, -6]} color="#ffe0b4" intensity={6} distance={5} />
      {/* fonds chauds (zone transats) */}
      <pointLight position={[-4.5, 1.4, -1]} color="#ffc98a" intensity={6} distance={5} decay={2} />
      <pointLight position={[-3, 0.6, 0.5]} color="#ffb066" intensity={4} distance={3.5} decay={2} />
    </group>
  );
}
