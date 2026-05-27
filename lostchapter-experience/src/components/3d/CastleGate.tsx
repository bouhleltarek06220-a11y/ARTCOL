import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperience } from '../../store';

const OPEN = 1.95;
const DW = 1.7; // largeur d'un vantail
const DH = 6.2; // hauteur d'un vantail

const ironMat = { color: '#15100a', metalness: 0.85, roughness: 0.45 } as const;
const woodMat = { color: '#2a1709', roughness: 0.82, metalness: 0.08 } as const;
const stoneMat = { color: '#3a2a1d', roughness: 0.95, metalness: 0.04 } as const;

// Un vantail détaillé : planches, ferrures horizontales, rivets, anneau.
function Door({ side }: { side: 1 | -1 }) {
  const ref = useRef<THREE.Group>(null);
  const phase = useExperience((s) => s.phase);
  useFrame(() => {
    const o = phase === 'entering' || phase === 'inside' ? OPEN : 0;
    const target = side < 0 ? o : -o;
    if (ref.current) ref.current.rotation.y += (target - ref.current.rotation.y) * 0.03;
  });

  const cx = -side * (DW / 2); // centre du vantail vers le milieu de l'ouverture

  const planks = [];
  for (let i = 0; i < 4; i++) {
    const px = cx - DW / 2 + DW / 8 + i * (DW / 4);
    planks.push(
      <mesh key={i} position={[px, DH / 2, 0.13]} castShadow>
        <boxGeometry args={[DW / 4 - 0.03, DH - 0.25, 0.06]} />
        <meshStandardMaterial {...woodMat} color="#3a2412" />
      </mesh>,
    );
  }
  const bolts = (y: number) =>
    [-0.42, -0.15, 0.12, 0.4].map((bx, i) => (
      <mesh key={i} position={[cx + bx * DW, y, 0.2]}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshStandardMaterial {...ironMat} />
      </mesh>
    ));

  return (
    <group ref={ref} position={[side * DW, 0, 0.16]}>
      <mesh position={[cx, DH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[DW, DH, 0.22]} />
        <meshStandardMaterial {...woodMat} />
      </mesh>
      {planks}
      {[DH * 0.2, DH * 0.55, DH * 0.85].map((y) => (
        <group key={y}>
          <mesh position={[cx, y, 0.18]} castShadow>
            <boxGeometry args={[DW * 0.96, 0.16, 0.05]} />
            <meshStandardMaterial {...ironMat} />
          </mesh>
          {bolts(y)}
        </group>
      ))}
      {/* anneau de tirage */}
      <mesh position={[cx - side * DW * 0.34, DH * 0.5, 0.24]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.16, 0.035, 10, 24]} />
        <meshStandardMaterial {...ironMat} metalness={0.9} />
      </mesh>
    </group>
  );
}

// Porte de château : surround en pierre + arche en plein cintre + deux vantaux.
export function CastleGate() {
  const half = DW; // demi-ouverture
  return (
    <group>
      {/* arche en plein cintre */}
      <mesh position={[0, DH, 0.12]}>
        <ringGeometry args={[half * 1.7, half * 2.2, 40, 1, 0, Math.PI]} />
        <meshStandardMaterial {...stoneMat} side={THREE.DoubleSide} />
      </mesh>
      {/* jambages */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * half * 1.95, DH / 2, 0.1]} castShadow receiveShadow>
          <boxGeometry args={[half * 0.55, DH + 1.4, 0.7]} />
          <meshStandardMaterial {...stoneMat} />
        </mesh>
      ))}
      {/* tympan sombre derrière l'arche */}
      <mesh position={[0, DH + 0.3, -0.1]}>
        <circleGeometry args={[half * 1.7, 40, 0, Math.PI]} />
        <meshStandardMaterial color="#0d0805" roughness={1} side={THREE.DoubleSide} />
      </mesh>
      <Door side={-1} />
      <Door side={1} />
    </group>
  );
}
