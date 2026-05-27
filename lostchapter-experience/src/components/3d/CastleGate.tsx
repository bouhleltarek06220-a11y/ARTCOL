import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperience } from '../../store';

const H = 6;

function Band({ x }: { x: number }) {
  return (
    <>
      {[1.4, 3, 4.6].map((y) => (
        <mesh key={y} position={[x, y, 0.16]}>
          <boxGeometry args={[2, 0.16, 0.06]} />
          <meshStandardMaterial color="#c99b5c" emissive="#e5c788" emissiveIntensity={0.5} metalness={0.9} roughness={0.3} />
        </mesh>
      ))}
    </>
  );
}

// Deux vantaux qui pivotent sur leurs gonds quand on entre.
export function CastleGate() {
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  const phase = useExperience((s) => s.phase);

  useFrame(() => {
    const open = phase === 'entering' || phase === 'inside' ? 1.85 : 0;
    if (left.current) left.current.rotation.y += (open - left.current.rotation.y) * 0.035;
    if (right.current) right.current.rotation.y += (-open - right.current.rotation.y) * 0.035;
  });

  return (
    <group>
      <group ref={left} position={[-2.2, 0, 0.15]}>
        <mesh position={[1.1, H / 2, 0]} castShadow>
          <boxGeometry args={[2.2, H, 0.28]} />
          <meshStandardMaterial color="#2a1709" roughness={0.8} metalness={0.15} emissive="#140a03" emissiveIntensity={0.3} />
        </mesh>
        <Band x={1.1} />
      </group>
      <group ref={right} position={[2.2, 0, 0.15]}>
        <mesh position={[-1.1, H / 2, 0]} castShadow>
          <boxGeometry args={[2.2, H, 0.28]} />
          <meshStandardMaterial color="#2a1709" roughness={0.8} metalness={0.15} emissive="#140a03" emissiveIntensity={0.3} />
        </mesh>
        <Band x={-1.1} />
      </group>
    </group>
  );
}
