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
            resolution={1024}
            blur={[120, 40]}
            mixStrength={2}
            roughness={0.2}
            color="#0e3a47"
            metalness={0.7}
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

      {/* TRANSATS */}
      <Transat x={-6.6} z={-4.5} rotY={Math.PI / 2} />
      <Transat x={-6.6} z={-6} rotY={Math.PI / 2} />

      {/* PAROI VITRÉE décorative */}
      <mesh position={[-0.7, 1.4, -3]} castShadow material={matVerre}>
        <boxGeometry args={[0.06, 2.8, 6]} />
      </mesh>

      {/* ÉCLAIRAGE */}
      <pointLight position={[poolX - 1.5, -0.6, poolZ]} color="#3a6a8a" intensity={6} distance={4} />
      <pointLight position={[poolX + 1.5, -0.6, poolZ]} color="#3a6a8a" intensity={6} distance={4} />
      <pointLight position={[-1.6, 0.5, -0.8]} color="#3a6a8a" intensity={4} distance={2.5} />
      <pointLight position={[-4, 3, -1.5]} color="#ffe0b4" intensity={8} distance={6} />
      <pointLight position={[-5.5, 3, -6]} color="#ffe0b4" intensity={6} distance={5} />
    </group>
  );
}
