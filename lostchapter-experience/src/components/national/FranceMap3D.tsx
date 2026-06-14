import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { heritageSites } from '../../data/nationalZones';

const MAP = import.meta.env.BASE_URL + 'national/france-map.png';

/**
 * Hologramme de la carte de France, pièce maîtresse du hall : table lumineuse
 * au sol, faisceau volumétrique, et la carte qui flotte en hauteur, rayonne et
 * tourne lentement — avec un trait de lumière pour chaque lieu historique.
 */
export function FranceMap3D({ radius = 3.8, height = 2.2 }: { radius?: number; height?: number }) {
  const disc = useRef<THREE.Group>(null);
  const tex = useTexture(MAP);
  useMemo(() => { tex.colorSpace = THREE.SRGBColorSpace; }, [tex]);
  useFrame((_, dt) => { if (disc.current) disc.current.rotation.y += dt * 0.05; });

  return (
    <group>
      {/* Table holographique au sol */}
      <mesh position={[0, 0.35, 0]} receiveShadow>
        <cylinderGeometry args={[radius * 0.7, radius * 0.9, 0.7, 64]} />
        <meshStandardMaterial color="#0c1120" metalness={0.65} roughness={0.35} emissive="#0a1c3a" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0.72, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.66, radius * 0.82, 72]} />
        <meshBasicMaterial color="#4ea3ff" transparent opacity={0.7} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>

      {/* Faisceau volumétrique table → carte */}
      <mesh position={[0, (0.7 + height) / 2 + 0.35, 0]}>
        <cylinderGeometry args={[radius * 0.5, radius * 0.66, height - 0.4, 40, 1, true]} />
        <meshBasicMaterial color="#3f7fd0" transparent opacity={0.1} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} />
      </mesh>

      {/* La carte flottante */}
      <group ref={disc} position={[0, height, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[radius, 96]} />
          <meshBasicMaterial map={tex} transparent opacity={1} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
        {/* Halo sous la carte */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
          <circleGeometry args={[radius * 1.15, 64]} />
          <meshBasicMaterial color="#2b6fc0" transparent opacity={0.25} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
        {heritageSites.map((s) => (
          <group key={s.name} position={[s.x * radius * 0.8, 0.05, -s.z * radius * 0.8]}>
            <mesh position={[0, 0.75, 0]}>
              <cylinderGeometry args={[0.012, 0.07, 1.5, 8]} />
              <meshBasicMaterial color="#ffd98a" transparent opacity={0.5} blending={THREE.AdditiveBlending} toneMapped={false} depthWrite={false} />
            </mesh>
            <mesh position={[0, 0.07, 0]}>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshBasicMaterial color="#ffe6a8" toneMapped={false} />
            </mesh>
          </group>
        ))}
        <pointLight position={[0, 0.5, 0]} color="#5aa6ff" intensity={28} distance={20} decay={2} />
      </group>
    </group>
  );
}
