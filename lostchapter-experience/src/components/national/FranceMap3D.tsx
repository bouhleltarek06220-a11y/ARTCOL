import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { heritageSites } from '../../data/nationalZones';

const MAP = import.meta.env.BASE_URL + 'national/france-map.png';

/**
 * Carte de France holographique au centre du hall : disque texturé qui rayonne
 * et tourne lentement, socle "table holographique", anneau lumineux, et un
 * faisceau de lumière pour chaque lieu historique.
 */
export function FranceMap3D({ radius = 3 }: { radius?: number }) {
  const disc = useRef<THREE.Group>(null);
  const tex = useTexture(MAP);
  useMemo(() => { tex.colorSpace = THREE.SRGBColorSpace; }, [tex]);
  useFrame((_, dt) => { if (disc.current) disc.current.rotation.y += dt * 0.05; });

  return (
    <group position={[0, 1.25, 0]}>
      {/* Socle / table holographique */}
      <mesh position={[0, -0.55, 0]} receiveShadow>
        <cylinderGeometry args={[radius * 1.08, radius * 1.25, 0.7, 72]} />
        <meshStandardMaterial color="#0c1120" metalness={0.65} roughness={0.35} emissive="#0a1c3a" emissiveIntensity={0.35} />
      </mesh>
      {/* Anneau lumineux qui borde la table */}
      <mesh position={[0, -0.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 1.04, radius * 1.16, 72]} />
        <meshBasicMaterial color="#4ea3ff" transparent opacity={0.6} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>

      {/* La carte (disque texturé) + marqueurs, en rotation lente */}
      <group ref={disc}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <circleGeometry args={[radius, 96]} />
          <meshBasicMaterial map={tex} transparent opacity={0.96} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
        {heritageSites.map((s) => (
          <group key={s.name} position={[s.x * radius * 0.78, 0.05, -s.z * radius * 0.78]}>
            <mesh position={[0, 0.7, 0]}>
              <cylinderGeometry args={[0.012, 0.06, 1.4, 8]} />
              <meshBasicMaterial color="#ffd98a" transparent opacity={0.45} blending={THREE.AdditiveBlending} toneMapped={false} depthWrite={false} />
            </mesh>
            <mesh position={[0, 0.07, 0]}>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshBasicMaterial color="#ffe6a8" toneMapped={false} />
            </mesh>
          </group>
        ))}
        <pointLight position={[0, 1.6, 0]} color="#4ea3ff" intensity={22} distance={16} decay={2} />
      </group>
    </group>
  );
}
