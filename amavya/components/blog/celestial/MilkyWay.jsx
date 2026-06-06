"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

/* Caméra qui dérive doucement dans l'espace : on a l'impression de voyager. */
function CameraDrift() {
  const { camera } = useThree();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const radius = 50;
    camera.position.x = Math.cos(t * 0.04) * radius;
    camera.position.z = Math.sin(t * 0.04) * radius;
    camera.position.y = Math.sin(t * 0.07) * 4;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* Bande de poussière galactique : un disque incliné de petites particules
   ponctuelles (étoiles, pas des voiles). Pas de masses colorées. */
function GalacticBand({ count = 9000, radius = 220, thickness = 30, tilt = 0.45 }) {
  const ref = useRef();

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    const tints = [
      [1.0, 0.95, 0.82], // blanc chaud
      [0.95, 0.95, 1.0], // blanc bleuté
      [1.0, 0.85, 0.7], // crème
      [0.85, 0.92, 1.0], // bleu clair
    ];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * Math.PI * 2;
      const rJitter = Math.pow(Math.random(), 0.6);
      const r = radius * (0.4 + rJitter * 0.6);
      const arm = Math.random() < 0.6 ? (Math.PI / 3) * Math.sin(r * 0.03) : 0;
      const angle = t + arm;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * thickness * (1 - rJitter * 0.4);
      pos[i * 3 + 2] = Math.sin(angle) * r;

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
        size={0.45}
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

export default function MilkyWay({ drift = true }) {
  return (
    <group>
      {drift && <CameraDrift />}
      {/* Trois couches d'étoiles drei pour la profondeur */}
      <Stars radius={180} depth={80} count={14000} factor={6} fade speed={0.2} />
      <Stars radius={90} depth={40} count={6000} factor={3.5} fade speed={0.3} />
      <Stars radius={40} depth={20} count={3000} factor={2} fade speed={0.4} />
      {/* La bande galactique (uniquement de l'étoile, aucune masse colorée) */}
      <GalacticBand />
    </group>
  );
}
