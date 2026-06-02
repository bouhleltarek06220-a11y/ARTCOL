import { useRef, useState } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { NationalZone } from '../../data/nationalZones';

/**
 * Un portail = un pilier de pierre avec une ouverture lumineuse colorée + glyphe
 * + titre. Réagit au survol (glow, échelle, halo) et au clic (sélection de zone).
 */
export function Portal({
  zone,
  radius,
  onSelect,
  onHover,
}: {
  zone: NationalZone;
  radius: number;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}) {
  const x = Math.cos(zone.angle) * radius;
  const z = Math.sin(zone.angle) * radius;
  const rotY = Math.atan2(-x, -z); // l'avant (+Z local) regarde le centre

  const [hover, setHover] = useState(false);
  const grp = useRef<THREE.Group>(null);
  const glow = useRef<THREE.PointLight>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (glow.current) glow.current.intensity = (hover ? 11 : 3.8) + Math.sin(t * 2 + zone.angle) * 0.7;
    if (inner.current) {
      const m = inner.current.material as THREE.MeshBasicMaterial;
      m.opacity = (hover ? 0.9 : 0.5) + Math.sin(t * 1.6 + zone.angle) * 0.06;
    }
    if (grp.current) {
      const target = hover ? 1.06 : 1;
      grp.current.scale.x += (target - grp.current.scale.x) * 0.15;
      grp.current.scale.y = grp.current.scale.z = grp.current.scale.x;
    }
  });

  const over = (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setHover(true); onHover(zone.id); document.body.style.cursor = 'pointer'; };
  const out = () => { setHover(false); onHover(null); document.body.style.cursor = 'default'; };
  const click = (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onSelect(zone.id); };

  return (
    <group ref={grp} position={[x, 0, z]} rotation={[0, rotY, 0]} onPointerOver={over} onPointerOut={out} onClick={click}>
      {/* Pilier de pierre */}
      <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.7, 4.4, 0.55]} />
        <meshStandardMaterial color="#241c14" roughness={0.92} metalness={0.08} />
      </mesh>
      {/* Linteau */}
      <mesh position={[0, 4.5, 0]} castShadow>
        <boxGeometry args={[3.1, 0.5, 0.8]} />
        <meshStandardMaterial color="#2e241a" roughness={0.9} />
      </mesh>
      {/* Ouverture lumineuse (portail) */}
      <mesh ref={inner} position={[0, 2.15, 0.3]}>
        <planeGeometry args={[1.8, 3.3]} />
        <meshBasicMaterial color={zone.color} transparent opacity={0.55} blending={THREE.AdditiveBlending} toneMapped={false} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      {/* Glyphe */}
      <Html position={[0, 2.7, 0.34]} center distanceFactor={11} style={{ pointerEvents: 'none' }}>
        <div style={{ fontSize: 44, lineHeight: 1, filter: `drop-shadow(0 0 14px ${zone.color})` }}>{zone.glyph}</div>
      </Html>
      {/* Titre */}
      <Html position={[0, 0.55, 0.34]} center distanceFactor={9} style={{ pointerEvents: 'none' }}>
        <div className="font-display" style={{ whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.22em', fontSize: 13, fontWeight: 700, color: '#f4e6c4', textShadow: `0 0 12px ${zone.color}, 0 2px 6px #000`, opacity: hover ? 1 : 0.82, transition: 'opacity .3s' }}>{zone.title}</div>
      </Html>
      <pointLight ref={glow} position={[0, 2.2, 0.7]} color={zone.color} intensity={3.8} distance={8} decay={2} />
    </group>
  );
}
