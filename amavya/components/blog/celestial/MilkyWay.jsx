"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

/* Bande de poussière galactique : un disque incliné de particules colorées
   qui donne l'illusion de la voie lactée traversant le ciel. */
function GalacticBand({ count = 8000, radius = 220, thickness = 30, tilt = 0.45 }) {
  const ref = useRef();

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    const tints = [
      [1.0, 0.85, 0.55], // doré (signature AMAVYA)
      [0.95, 0.95, 1.0], // blanc bleuté
      [1.0, 0.65, 0.45], // orange chaud
      [0.7, 0.85, 1.0], // bleu froid
      [0.9, 0.8, 1.0], // mauve
    ];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * Math.PI * 2;
      // densité plus forte au centre, qui décroît
      const rJitter = Math.pow(Math.random(), 0.6);
      const r = radius * (0.4 + rJitter * 0.6);
      const arm = Math.random() < 0.6 ? (Math.PI / 3) * Math.sin(r * 0.03) : 0;
      const angle = t + arm;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const y = (Math.random() - 0.5) * thickness * (1 - rJitter * 0.4);
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      const tint = tints[Math.floor(Math.random() * tints.length)];
      col[i * 3] = tint[0];
      col[i * 3 + 1] = tint[1];
      col[i * 3 + 2] = tint[2];

      siz[i] = Math.random() * 1.4 + 0.6;
    }
    return { positions: pos, colors: col, sizes: siz };
  }, [count, radius, thickness]);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.005;
  });

  return (
    <points ref={ref} rotation={[tilt, 0, 0.2]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.55}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* Nébuleuses : 3-4 voiles colorés diffus en arrière-plan */
function NebulaPatch({ position, color, scale = 28 }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      const p = 1 + Math.sin(state.clock.elapsedTime * 0.2 + position[0]) * 0.04;
      ref.current.scale.set(scale * p, scale * p, scale * p);
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.12}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export default function MilkyWay() {
  return (
    <group>
      {/* Couche d'étoiles standard (drei) — fond stellaire dense */}
      <Stars radius={180} depth={80} count={8000} factor={5} fade speed={0.2} />
      {/* Petites étoiles plus proches */}
      <Stars radius={60} depth={30} count={2500} factor={2.5} fade speed={0.35} />
      {/* La bande galactique inclinée */}
      <GalacticBand />
      {/* Quelques nébuleuses colorées */}
      <NebulaPatch position={[-60, 18, -90]} color="#a87f2e" scale={50} />
      <NebulaPatch position={[80, -22, -110]} color="#5b3d99" scale={45} />
      <NebulaPatch position={[-40, -30, 70]} color="#1e6fbe" scale={42} />
      <NebulaPatch position={[40, 35, 80]} color="#c98144" scale={38} />
    </group>
  );
}
