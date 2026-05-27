import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Torche : point lumineux chaud qui vacille + braise visible.
export function TorchLight({ position }: { position: [number, number, number] }) {
  const light = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (light.current) {
      light.current.intensity = 12 * (0.82 + 0.18 * Math.sin(t * 7 + position[0]) + 0.08 * Math.sin(t * 23));
    }
  });
  return (
    <group position={position}>
      <pointLight ref={light} color="#ff9d4d" intensity={12} distance={18} decay={2} />
      <mesh>
        <sphereGeometry args={[0.14, 12, 12]} />
        <meshBasicMaterial color="#ffc06a" />
      </mesh>
    </group>
  );
}
