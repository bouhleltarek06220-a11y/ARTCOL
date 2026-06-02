import { Suspense } from 'react';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { FranceMap3D } from './FranceMap3D';
import { Portal } from './Portal';
import { FloatingEmbers } from '../3d/FloatingEmbers';
import { Brazier } from '../3d/Brazier';
import { nationalZones } from '../../data/nationalZones';

const PORTAL_R = 10.5;

// Colonne monumentale stylisée (base + fût + chapiteau).
function Pillar({ angle, r = 15 }: { angle: number; r?: number }) {
  const x = Math.cos(angle) * r;
  const z = Math.sin(angle) * r;
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.45, 0]} receiveShadow><boxGeometry args={[1.7, 0.9, 1.7]} /><meshStandardMaterial color="#1d1610" roughness={0.96} /></mesh>
      <mesh position={[0, 4.8, 0]} castShadow><cylinderGeometry args={[0.55, 0.72, 8.2, 18]} /><meshStandardMaterial color="#2a2018" roughness={0.9} /></mesh>
      <mesh position={[0, 9.1, 0]}><boxGeometry args={[1.8, 0.7, 1.8]} /><meshStandardMaterial color="#1d1610" roughness={0.96} /></mesh>
    </group>
  );
}

/** Hall central : sol, anneaux lumineux, colonnes, braseros, carte de France
 *  holographique au centre et les 9 portails disposés en cercle. */
export function CentralHall({ onSelect, onHover }: { onSelect: (id: string) => void; onHover: (id: string | null) => void }) {
  return (
    <group>
      <Stars radius={140} depth={60} count={2600} factor={4} saturation={0} fade speed={0.5} />

      {/* Sol poli sombre */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[22, 96]} />
        <meshStandardMaterial color="#0a0a10" roughness={0.45} metalness={0.45} />
      </mesh>
      {/* Anneaux dorés au sol */}
      {[6, 10.5, 15].map((rr) => (
        <mesh key={rr} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[rr - 0.05, rr + 0.05, 120]} />
          <meshBasicMaterial color="#caa15a" transparent opacity={0.16} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
      ))}

      {/* Carte de France holographique */}
      <Suspense fallback={null}><FranceMap3D radius={3} /></Suspense>

      {/* Les 9 portails */}
      {nationalZones.map((z) => (
        <Portal key={z.id} zone={z} radius={PORTAL_R} onSelect={onSelect} onHover={onHover} />
      ))}

      {/* Colonnes en cercle */}
      {Array.from({ length: 12 }).map((_, i) => (
        <Pillar key={i} angle={(i / 12) * Math.PI * 2} />
      ))}

      {/* Braseros */}
      {[0.5, 3.5, 6.5, 9.5].map((i) => {
        const a = (i / 12) * Math.PI * 2;
        const r = 13.5;
        return <Brazier key={i} position={[Math.cos(a) * r, 0, Math.sin(a) * r]} />;
      })}

      {/* Éclairage cinéma : froid au centre (hologramme), chaud aux bords */}
      <ambientLight intensity={0.24} color="#4f4566" />
      <hemisphereLight args={['#26314f', '#1a1208', 0.4]} />
      <pointLight position={[0, 9, 0]} color="#6f7bff" intensity={34} distance={34} decay={2} />
      <spotLight position={[0, 17, 0]} target-position={[0, 1, 0]} color="#cfe0ff" intensity={140} distance={44} angle={0.95} penumbra={0.85} />

      <FloatingEmbers count={260} />
    </group>
  );
}
