import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Flambeau : support fer + flamme procédurale animée (cônes additifs), lumière vacillante et braises.
export function Torch({ position }: { position: [number, number, number] }) {
  const light = useRef<THREE.PointLight>(null);
  const flame = useRef<THREE.Group>(null);
  const embersRef = useRef<THREE.Points>(null);
  const seed = position[0] * 1.7 + position[1];

  const embers = useMemo(() => {
    const n = 26;
    const a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      a[i * 3] = (Math.random() - 0.5) * 0.16;
      a[i * 3 + 1] = Math.random() * 0.7;
      a[i * 3 + 2] = (Math.random() - 0.5) * 0.16;
    }
    return a;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const flick = 0.8 + 0.2 * Math.sin(t * 12 + seed) + 0.12 * Math.sin(t * 27 + seed * 2);
    if (light.current) light.current.intensity = 10 * flick;
    if (flame.current) {
      flame.current.scale.y = 1 + 0.22 * Math.sin(t * 15 + seed);
      flame.current.scale.x = 1 + 0.07 * Math.sin(t * 21 + seed);
      flame.current.rotation.z = 0.06 * Math.sin(t * 9 + seed);
      flame.current.position.x = 0.025 * Math.sin(t * 23 + seed);
    }
    const g = embersRef.current?.geometry;
    if (g) {
      const arr = g.attributes.position.array as Float32Array;
      for (let i = 1; i < arr.length; i += 3) {
        arr[i] += 0.012;
        if (arr[i] > 0.95) arr[i] = 0;
      }
      g.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={position}>
      {/* bras de fixation + manche */}
      <mesh position={[0, -0.18, 0.16]} rotation={[0.55, 0, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.6, 8]} />
        <meshStandardMaterial color="#221913" roughness={0.6} metalness={0.55} />
      </mesh>
      {/* coupe en fer */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.13, 0.07, 0.2, 14, 1, true]} />
        <meshStandardMaterial color="#2b2018" roughness={0.5} metalness={0.6} side={THREE.DoubleSide} />
      </mesh>
      {/* cœur incandescent */}
      <mesh position={[0, 0.32, 0]}>
        <sphereGeometry args={[0.085, 12, 12]} />
        <meshBasicMaterial color="#fff1c4" />
      </mesh>
      {/* flamme : cônes additifs empilés */}
      <group ref={flame} position={[0, 0.34, 0]}>
        <mesh position={[0, 0.2, 0]}>
          <coneGeometry args={[0.19, 0.66, 18, 1, true]} />
          <meshBasicMaterial color="#ff7a18" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.14, 0]}>
          <coneGeometry args={[0.12, 0.46, 18, 1, true]} />
          <meshBasicMaterial color="#ffb43c" transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <coneGeometry args={[0.07, 0.28, 18, 1, true]} />
          <meshBasicMaterial color="#ffe79a" transparent opacity={0.92} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <pointLight ref={light} color="#ff9d4d" intensity={10} distance={15} decay={2} position={[0, 0.45, 0]} castShadow />
      {/* braises montantes */}
      <points ref={embersRef} position={[0, 0.4, 0]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[embers, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#ffb45c" size={0.028} transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
    </group>
  );
}
