import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Brasero allumé : vasque en pierre sur trépied, charbons rougeoyants,
// flammes additives qui vacillent, braises montantes, lumière chaude pulsante.
export function Brazier({ position }: { position: [number, number, number] }) {
  const light = useRef<THREE.PointLight>(null);
  const flame = useRef<THREE.Group>(null);
  const embersRef = useRef<THREE.Points>(null);
  const seed = position[0] * 1.3 + position[2] * 0.7;

  const embers = useMemo(() => {
    const n = 50;
    const a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      a[i * 3] = (Math.random() - 0.5) * 0.4;
      a[i * 3 + 1] = Math.random() * 1.2;
      a[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
    }
    return a;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const flick = 0.85 + 0.15 * Math.sin(t * 11 + seed) + 0.08 * Math.sin(t * 23 + seed * 2);
    if (light.current) light.current.intensity = 18 * flick;
    if (flame.current) {
      flame.current.scale.y = 1 + 0.2 * Math.sin(t * 14 + seed);
      flame.current.scale.x = 1 + 0.06 * Math.sin(t * 18);
      flame.current.rotation.z = 0.05 * Math.sin(t * 8 + seed);
    }
    const g = embersRef.current?.geometry;
    if (g) {
      const arr = g.attributes.position.array as Float32Array;
      for (let i = 1; i < arr.length; i += 3) {
        arr[i] += 0.018;
        if (arr[i] > 1.4) arr[i] = 0;
      }
      g.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={position}>
      {/* Pied en fer forgé (3 jambes simulées par un tronc fin) */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.14, 1.2, 8]} />
        <meshStandardMaterial color="#1a140e" metalness={0.7} roughness={0.45} />
      </mesh>
      {/* Base au sol */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.5, 0.1, 16]} />
        <meshStandardMaterial color="#15100a" metalness={0.6} roughness={0.5} />
      </mesh>
      {/* Vasque en pierre */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.32, 0.45, 18, 1, true]} />
        <meshStandardMaterial color="#3a2818" roughness={0.85} metalness={0.2} side={THREE.DoubleSide} />
      </mesh>
      {/* Charbons rougeoyants */}
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.08, 18]} />
        <meshStandardMaterial color="#1a0a04" emissive="#ff5a18" emissiveIntensity={1.2} roughness={0.9} />
      </mesh>
      {/* Cœur incandescent */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshBasicMaterial color="#ffd57a" />
      </mesh>
      {/* Flammes additives empilées */}
      <group ref={flame} position={[0, 1.55, 0]}>
        <mesh position={[0, 0.45, 0]}>
          <coneGeometry args={[0.4, 1.1, 20, 1, true]} />
          <meshBasicMaterial color="#ff7a18" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <coneGeometry args={[0.26, 0.8, 18, 1, true]} />
          <meshBasicMaterial color="#ffb43c" transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.18, 0]}>
          <coneGeometry args={[0.16, 0.5, 16, 1, true]} />
          <meshBasicMaterial color="#ffe79a" transparent opacity={0.92} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <pointLight ref={light} color="#ff9d4d" intensity={18} distance={22} decay={2} position={[0, 1.8, 0]} castShadow />
      {/* Braises montantes */}
      <points ref={embersRef} position={[0, 1.5, 0]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[embers, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#ffb45c" size={0.05} transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
    </group>
  );
}
