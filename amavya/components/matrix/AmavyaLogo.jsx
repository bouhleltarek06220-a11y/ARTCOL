"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/**
 * Logo AMAVYA en 3D : poignée de main humain/robot sculptée en low-poly
 * (avant-bras + paume + doigts qui s'enroulent + pouce), main robot
 * chromée vs main humaine dorée. Anneau doré + halos. Tourne et se révèle
 * au bout du tapis de code.
 */

const HUMAN = { color: "#e9c890", metalness: 0.5, roughness: 0.42, emissive: "#2a1d05" };
const ROBOT = { color: "#e7edf6", metalness: 1.0, roughness: 0.16, emissive: "#0a0e16" };

function Mat({ m }) {
  return (
    <meshStandardMaterial
      color={m.color}
      metalness={m.metalness}
      roughness={m.roughness}
      emissive={m.emissive}
      emissiveIntensity={0.4}
      toneMapped={false}
    />
  );
}

/* Un doigt = 2 phalanges (capsules le long de Z) avec une flexion (grip) */
function Finger({ r = 0.085, l1 = 0.32, l2 = 0.26, base = 0.2, bend = 1.15, m }) {
  return (
    <group rotation={[base, 0, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, l1 / 2]}>
        <capsuleGeometry args={[r, l1, 3, 8]} />
        <Mat m={m} />
      </mesh>
      <group position={[0, 0, l1]} rotation={[bend, 0, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, l2 / 2]}>
          <capsuleGeometry args={[r * 0.92, l2, 3, 8]} />
          <Mat m={m} />
        </mesh>
      </group>
    </group>
  );
}

/* Une main (paume + 4 doigts + pouce + avant-bras + manchette) */
function Hand({ m, robot }) {
  return (
    <group>
      {/* Avant-bras (le long de -Z) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -1.15]}>
        <cylinderGeometry args={[0.24, 0.3, 1.5, robot ? 8 : 16]} />
        <Mat m={m} />
      </mesh>
      {/* Manchette (poignet) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.42]}>
        <cylinderGeometry args={[0.33, 0.33, 0.18, robot ? 8 : 18]} />
        <Mat m={robot ? { ...ROBOT, color: "#cfd6e0" } : { ...HUMAN, color: "#cdb074" }} />
      </mesh>
      {/* Paume */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[0.6, 0.24, 0.7]} />
        <Mat m={m} />
      </mesh>
      {/* Articulations (knuckles) */}
      <mesh position={[0, 0.02, 0.38]}>
        <boxGeometry args={[0.6, 0.2, 0.14]} />
        <Mat m={m} />
      </mesh>
      {/* 4 doigts qui s'enroulent */}
      {[-0.21, -0.07, 0.07, 0.21].map((x, i) => (
        <group key={i} position={[x, 0.02, 0.42]}>
          <Finger
            m={m}
            l1={0.3 - Math.abs(x) * 0.2}
            l2={0.24 - Math.abs(x) * 0.15}
            bend={1.2}
            base={0.15}
          />
        </group>
      ))}
      {/* Pouce (sur le côté, vers le haut) */}
      <group position={[0.3, 0.05, 0.12]} rotation={[0.2, 0, -0.9]}>
        <Finger m={m} l1={0.26} l2={0.2} bend={0.8} base={0.1} r={0.1} />
      </group>
    </group>
  );
}

export default function AmavyaLogo({ progressRef }) {
  const group = useRef();
  const ringMat = useRef();
  const haloMat = useRef();
  const halo2Mat = useRef();
  const light = useRef();

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const p = Math.max(0, Math.min(1, progressRef.current));
    const reveal = THREE.MathUtils.clamp((p - 0.2) / 0.4, 0, 1);

    if (group.current) {
      group.current.rotation.y += dt * 0.45;
      const pulse = 1 + Math.sin(t * 1.6) * 0.04;
      group.current.scale.setScalar(reveal * 1.15 * pulse);
      group.current.visible = reveal > 0.01;
    }
    if (ringMat.current) ringMat.current.opacity = reveal;
    if (haloMat.current) haloMat.current.opacity = reveal * 0.3 * (1 + Math.sin(t * 1.6) * 0.12);
    if (halo2Mat.current) halo2Mat.current.opacity = reveal * 0.13;
    if (light.current) light.current.intensity = reveal * 5;
  });

  return (
    <Float speed={1.3} rotationIntensity={0.15} floatIntensity={0.45}>
      <group ref={group} scale={0}>
        <pointLight ref={light} color="#f0d27a" intensity={0} distance={18} decay={1.4} />

        {/* La poignée de main : deux mains qui se rejoignent au centre.
            Elles s'inclinent vers la caméra et leurs doigts s'entrecroisent. */}
        <group rotation={[-0.5, 0, 0]}>
          {/* Main robot — vient de la gauche, doigts vers le centre/haut */}
          <group position={[-0.18, -0.1, -0.05]} rotation={[0, 1.15, 0.12]}>
            <Hand m={ROBOT} robot />
          </group>
          {/* Main humaine — vient de la droite (miroir), légèrement décalée */}
          <group position={[0.18, 0.1, 0.05]} rotation={[0, 1.15, 0.12]} scale={[-1, 1, 1]}>
            <Hand m={HUMAN} />
          </group>
        </group>

        {/* Anneau doré en relief (rappel du logo) */}
        <mesh rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[1.9, 0.045, 16, 90]} />
          <meshStandardMaterial
            ref={ringMat}
            color="#f0d27a"
            emissive="#f0c052"
            emissiveIntensity={2}
            metalness={1}
            roughness={0.2}
            transparent
            opacity={0}
            toneMapped={false}
          />
        </mesh>

        {/* Halos lumineux */}
        <mesh>
          <sphereGeometry args={[2.0, 32, 32]} />
          <meshBasicMaterial ref={haloMat} color="#f0d27a" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh>
          <sphereGeometry args={[3.2, 32, 32]} />
          <meshBasicMaterial ref={halo2Mat} color="#a87f2e" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>
    </Float>
  );
}
