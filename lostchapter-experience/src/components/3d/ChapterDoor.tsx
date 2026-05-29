import { useMemo, useRef, useState } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Zone } from '../../data/zones';
import { useExperience } from '../../store';
import { chime, activationChord } from '../../lib/audio';

const FRAME = '/assets/dungeon/wall_doorway.glb'; // arche de pierre KayKit (4×4×1)
useGLTF.preload(FRAME);

const accent: Record<Zone['accent'], string> = {
  torch: '#ff9d4d',
  twitch: '#9146ff',
  gold: '#e5c788',
};

const LEAF_W = 0.9;  // largeur d'un battant
const LEAF_H = 3.0;  // hauteur
const LEAF_D = 0.16;

// Un battant en bois à planches + ferrures + anneau, qui pivote sur le gond.
function Leaf({ side, open }: { side: 1 | -1; open: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current) {
      const target = side < 0 ? open : -open;
      ref.current.rotation.y += (target - ref.current.rotation.y) * 0.08;
    }
  });
  const cx = -side * (LEAF_W / 2); // s'étend vers le centre de l'ouverture
  return (
    <group ref={ref} position={[side * (LEAF_W / 2), 0, 0]}>
      <mesh position={[cx, LEAF_H / 2, 0]} castShadow>
        <boxGeometry args={[LEAF_W, LEAF_H, LEAF_D]} />
        <meshStandardMaterial color="#2a1709" roughness={0.85} metalness={0.08} />
      </mesh>
      {/* planches */}
      {[-LEAF_W / 4, LEAF_W / 4].map((px, i) => (
        <mesh key={i} position={[cx + px, LEAF_H / 2, LEAF_D / 2 + 0.012]}>
          <boxGeometry args={[LEAF_W / 2 - 0.04, LEAF_H - 0.16, 0.03]} />
          <meshStandardMaterial color="#3a2412" roughness={0.88} />
        </mesh>
      ))}
      {/* ferrures */}
      {[LEAF_H * 0.2, LEAF_H * 0.8].map((y) => (
        <mesh key={y} position={[cx, y, LEAF_D / 2 + 0.04]}>
          <boxGeometry args={[LEAF_W * 0.95, 0.1, 0.03]} />
          <meshStandardMaterial color="#13100b" metalness={0.85} roughness={0.4} />
        </mesh>
      ))}
      {/* anneau */}
      <mesh position={[cx - side * LEAF_W * 0.3, LEAF_H * 0.5, LEAF_D / 2 + 0.06]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.1, 0.022, 8, 18]} />
        <meshStandardMaterial color="#1a140e" metalness={0.9} roughness={0.35} />
      </mesh>
    </group>
  );
}

/**
 * Vraie porte de chapitre : cadre de pierre KayKit encastré dans le mur +
 * double battant en bois qui s'ouvre + lueur dorée derrière + halo coloré.
 * rotationY oriente la porte selon le mur (fond=0, gauche=+90°, droite=-90°).
 */
export function ChapterDoor({
  zone,
  position,
  rotationY = 0,
}: {
  zone: Zone;
  position: [number, number, number];
  rotationY?: number;
}) {
  const { scene } = useGLTF(FRAME) as unknown as { scene: THREE.Group };
  const frame = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
        if (m.material) {
          const mat = (m.material as THREE.MeshStandardMaterial).clone();
          if ('envMapIntensity' in mat) mat.envMapIntensity = 0.12;
          mat.color.multiplyScalar(0.8);
          m.material = mat;
        }
      }
    });
    return c;
  }, [scene]);

  const [hover, setHover] = useState(false);
  const select = useExperience((s) => s.selectZone);
  const glow = useRef<THREE.PointLight>(null);
  const color = accent[zone.accent];

  useFrame(({ clock }) => {
    if (glow.current) {
      const base = hover ? 14 : 4;
      glow.current.intensity = base + Math.sin(clock.elapsedTime * 3) * 1.2;
    }
  });

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!hover) { setHover(true); chime(760, 0.18, 0.08); document.body.style.cursor = 'pointer'; }
  };
  const onOut = () => { setHover(false); document.body.style.cursor = 'default'; };
  const onActivate = (e: React.MouseEvent) => { e.stopPropagation(); activationChord(); select(zone.id); };

  const openAmount = hover ? 1.7 : 0;

  return (
    <group position={position} rotation={[0, rotationY, 0]} onPointerOver={onOver} onPointerOut={onOut}>
      {/* Cadre de pierre KayKit (l'arche) */}
      <primitive object={frame} />
      {/* Lueur dorée derrière l'ouverture */}
      <mesh position={[0, 1.8, -0.5]}>
        <planeGeometry args={[2.4, 3.4]} />
        <meshBasicMaterial color={color} transparent opacity={hover ? 0.5 : 0.18} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <pointLight ref={glow} color={color} intensity={4} distance={7} decay={2} position={[0, 1.8, -1]} />
      {/* Double battant */}
      <group position={[0, 0, 0.1]}>
        <Leaf side={-1} open={openAmount} />
        <Leaf side={1} open={openAmount} />
      </group>
      {/* Étiquette du chapitre */}
      <Html position={[0, 4.3, 0]} center distanceFactor={11} occlude style={{ pointerEvents: 'none' }}>
        <div className="font-medieval whitespace-nowrap text-[12px] uppercase tracking-[0.3em] text-parchment"
             style={{ textShadow: '0 0 10px rgba(0,0,0,0.85), 0 0 16px rgba(229,199,136,0.4)' }}>
          {zone.title}
        </div>
      </Html>
      {/* Bouton d'entrée DOM au survol */}
      {hover && (
        <Html position={[0, 1.7, 0.4]} center distanceFactor={7} style={{ pointerEvents: 'auto' }}>
          <button
            onClick={onActivate}
            onPointerDown={(e) => e.stopPropagation()}
            className="font-display rounded-md border border-goldbright bg-gradient-to-br from-goldbright to-gold px-4 py-2 text-[10px] font-bold uppercase tracking-[0.3em] text-stone shadow-[0_8px_24px_rgba(229,199,136,0.5)] transition hover:scale-105"
          >
            Entrer
          </button>
        </Html>
      )}
    </group>
  );
}
