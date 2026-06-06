"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Sun({ size = 1.6 }) {
  const coreRef = useRef();
  const coronaRef = useRef();
  const flareRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.06;
    }
    if (coronaRef.current) {
      const p = 1 + Math.sin(t * 0.6) * 0.04;
      coronaRef.current.scale.set(p, p, p);
    }
    if (flareRef.current) {
      const p = 1 + Math.sin(t * 1.2 + 1.5) * 0.08;
      flareRef.current.scale.set(p, p, p);
    }
  });

  return (
    <group>
      {/* Lumière puissante émise par le Soleil — éclaire les planètes */}
      <pointLight intensity={3} color="#fff3c4" distance={120} decay={1.4} />
      <pointLight intensity={1.2} color="#f0d27a" distance={60} decay={1.2} />

      {/* Cœur du soleil */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshBasicMaterial color="#ffd966" />
      </mesh>

      {/* Couronne dorée intérieure */}
      <mesh>
        <sphereGeometry args={[size * 1.15, 32, 32]} />
        <meshBasicMaterial
          color="#f0d27a"
          transparent
          opacity={0.5}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Couronne médiane qui respire */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[size * 1.5, 32, 32]} />
        <meshBasicMaterial
          color="#f0d27a"
          transparent
          opacity={0.18}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Couronne externe ample */}
      <mesh ref={flareRef}>
        <sphereGeometry args={[size * 2.4, 32, 32]} />
        <meshBasicMaterial
          color="#a87f2e"
          transparent
          opacity={0.08}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
