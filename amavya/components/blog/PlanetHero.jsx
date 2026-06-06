"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

export default function PlanetHero({ color, size = 1.4 }) {
  const planet = useRef();
  const halo = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (planet.current) {
      planet.current.rotation.y = t * 0.18;
      planet.current.rotation.x = Math.sin(t * 0.3) * 0.08;
    }
    if (halo.current) {
      const p = 1 + Math.sin(t * 0.8) * 0.04;
      halo.current.scale.set(p, p, p);
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1.4} color={color} />
      <pointLight position={[-5, -3, 2]} intensity={0.4} color="#9b9bb0" />
      <Stars radius={70} depth={40} count={2500} factor={3} fade speed={0.3} />
      <group>
        <mesh ref={planet}>
          <sphereGeometry args={[size, 64, 64]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.7}
            roughness={0.3}
            metalness={0.9}
          />
        </mesh>
        <mesh ref={halo}>
          <sphereGeometry args={[size * 1.7, 32, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.18}
            depthWrite={false}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2.5, 0, 0]}>
          <ringGeometry args={[size * 2.2, size * 2.25, 96]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.5}
            side={2}
            depthWrite={false}
          />
        </mesh>
      </group>
      <EffectComposer>
        <Bloom intensity={1.1} luminanceThreshold={0.25} mipmapBlur />
      </EffectComposer>
    </>
  );
}
