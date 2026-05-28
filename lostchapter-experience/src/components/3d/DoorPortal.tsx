import { useRef, useState } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Zone } from '../../data/zones';
import { useExperience } from '../../store';
import { chime, activationChord } from '../../lib/audio';

const accent: Record<Zone['accent'], string> = {
  torch: '#ff9d4d',
  twitch: '#9146ff',
  gold: '#e5c788',
};

const W = 1.4;   // largeur du vantail
const H = 3.0;   // hauteur du vantail
const D = 0.18;  // profondeur

// Vraie porte de château : cadre en pierre + arche en plein cintre + double vantail
// en bois à planches + ferrures + anneau de tirage. Cliquable, halo coloré sur hover.
export function DoorPortal({ zone, position }: { zone: Zone; position: [number, number, number] }) {
  const halo = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);
  const [hover, setHover] = useState(false);
  const select = useExperience((s) => s.selectZone);
  const color = accent[zone.accent];

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (halo.current) {
      const mat = halo.current.material as THREE.MeshBasicMaterial;
      const base = 0.08 + Math.sin(t * 1.6 + position[0]) * 0.03;
      mat.opacity = hover ? base + 0.28 : base;
    }
    if (light.current) {
      light.current.intensity = (hover ? 9 : 2.5) + Math.sin(t * 4 + position[0]) * 0.6;
    }
  });

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!hover) {
      setHover(true);
      chime(820, 0.18, 0.08);
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
    <group position={position} onPointerOver={onOver} onPointerOut={onOut} onClick={onClick}>
      {/* ─── Cadre en pierre ──────────────────────────────── */}
      <mesh position={[-W / 2 - 0.14, H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.28, H + 0.3, D + 0.25]} />
        <meshStandardMaterial color="#4a3a2a" roughness={0.95} metalness={0.04} />
      </mesh>
      <mesh position={[W / 2 + 0.14, H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.28, H + 0.3, D + 0.25]} />
        <meshStandardMaterial color="#4a3a2a" roughness={0.95} metalness={0.04} />
      </mesh>
      {/* Arche en plein cintre (demi-anneau de pierre au-dessus) */}
      <mesh position={[0, H + 0.05, 0]}>
        <ringGeometry args={[W / 2 + 0.05, W / 2 + 0.4, 28, 1, 0, Math.PI]} />
        <meshStandardMaterial color="#3a2a1c" side={THREE.DoubleSide} roughness={0.95} />
      </mesh>

      {/* ─── Vantail en bois ──────────────────────────────── */}
      <mesh position={[0, H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial color="#2a1709" roughness={0.85} metalness={0.08} emissive="#150a03" emissiveIntensity={0.18} />
      </mesh>
      {/* Planches verticales (texture par geometry) */}
      {[-W / 3, 0, W / 3].map((x, i) => (
        <mesh key={i} position={[x, H / 2, D / 2 + 0.012]}>
          <boxGeometry args={[W / 3 - 0.04, H - 0.18, 0.04]} />
          <meshStandardMaterial color="#3a2412" roughness={0.88} metalness={0.05} />
        </mesh>
      ))}
      {/* Ferrures horizontales noires */}
      {[H * 0.18, H * 0.5, H * 0.82].map((y) => (
        <mesh key={y} position={[0, y, D / 2 + 0.05]}>
          <boxGeometry args={[W * 0.96, 0.14, 0.04]} />
          <meshStandardMaterial color="#13100b" metalness={0.85} roughness={0.4} />
        </mesh>
      ))}
      {/* Rivets sur les ferrures */}
      {[-0.5, -0.15, 0.15, 0.5].flatMap((nx) =>
        [H * 0.18, H * 0.5, H * 0.82].map((y, ri) => (
          <mesh key={`${nx}-${ri}`} position={[nx * W, y, D / 2 + 0.07]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshStandardMaterial color="#0d0a06" metalness={0.9} roughness={0.35} />
          </mesh>
        )),
      )}
      {/* Anneau de tirage (heurtoir) */}
      <mesh position={[W * 0.33, H * 0.5, D / 2 + 0.08]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.13, 0.028, 10, 20]} />
        <meshStandardMaterial color="#1a140e" metalness={0.92} roughness={0.35} />
      </mesh>

      {/* ─── Halo coloré (signature de la zone) ──────────── */}
      <mesh ref={halo} position={[0, H / 2, D / 2 + 0.06]}>
        <planeGeometry args={[W * 0.95, H * 0.95]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <pointLight ref={light} color={color} intensity={2.5} distance={5} decay={2} position={[0, H * 0.55, D + 0.4]} />

      {/* ─── Plaque au-dessus de l'arche ───────────────── */}
      <Html
        position={[0, H + 0.95, 0]}
        center
        distanceFactor={10}
        occlude
        style={{ pointerEvents: 'none' }}
      >
        <div
          className="font-medieval whitespace-nowrap text-[12px] uppercase tracking-[0.32em] text-parchment"
          style={{ textShadow: '0 0 10px rgba(0,0,0,0.8), 0 0 18px rgba(229,199,136,0.4)' }}
        >
          {zone.title}
        </div>
      </Html>
    </group>
  );
}
