import { useRef, useState } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Zone } from '../../data/zones';
import { useExperience } from '../../store';
import { chime, activationChord } from '../../lib/audio';

// Couleurs d'accent par zone (charte : orange torche / violet Twitch / or)
const accent: Record<Zone['accent'], string> = {
  torch: '#ff9d4d',
  twitch: '#9146ff',
  gold: '#e5c788',
};

export function InteractivePortal({
  zone,
  position,
  yaw,
}: {
  zone: Zone;
  position: [number, number, number];
  yaw: number;
}) {
  const ring = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);
  const [hover, setHover] = useState(false);
  const select = useExperience((s) => s.selectZone);
  const color = accent[zone.accent];

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (ring.current) {
      ring.current.rotation.z = t * 0.25;
      const target = hover ? 1.15 : 1.0;
      ring.current.scale.x += (target - ring.current.scale.x) * 0.12;
      ring.current.scale.y += (target - ring.current.scale.y) * 0.12;
    }
    if (inner.current) {
      const m = inner.current.material as THREE.MeshBasicMaterial;
      const base = 0.22 + Math.sin(t * 1.4 + position[0]) * 0.06;
      m.opacity = hover ? base + 0.3 : base;
    }
    if (light.current) {
      light.current.intensity = (hover ? 16 : 6) + Math.sin(t * 3 + position[0]) * 1.2;
    }
  });

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!hover) {
      setHover(true);
      chime(820, 0.18, 0.08, 'sine');
      document.body.style.cursor = 'pointer';
    }
  };
  const onOut = () => {
    setHover(false);
    document.body.style.cursor = 'default';
  };
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    activationChord();
    select(zone.id);
  };

  return (
    <group position={position} rotation={[0, yaw, 0]}>
      {/* anneau d'or */}
      <mesh ref={ring} onPointerOver={onOver} onPointerOut={onOut} onClick={onClick}>
        <torusGeometry args={[1.05, 0.07, 18, 64]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} metalness={0.7} roughness={0.25} />
      </mesh>
      {/* halo intérieur */}
      <mesh ref={inner}>
        <circleGeometry args={[1.0, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.28} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* lumière qui éclaire les pierres autour */}
      <pointLight ref={light} color={color} intensity={6} distance={6} decay={2} />
      {/* étiquette flottante (3D-HTML, repointe vers la caméra) */}
      <Html position={[0, 1.55, 0]} center distanceFactor={10} style={{ pointerEvents: 'none' }} occlude={false}>
        <div
          className="font-medieval whitespace-nowrap text-[14px] uppercase tracking-[0.32em] text-parchment"
          style={{ textShadow: '0 0 10px rgba(0,0,0,0.75), 0 0 18px rgba(229,199,136,0.35)' }}
        >
          {zone.title}
        </div>
      </Html>
    </group>
  );
}
