import { useEffect, useMemo, useRef, useState } from 'react';
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
  revealDelay = 0,
}: {
  zone: Zone;
  position: [number, number, number];
  rotationY?: number;
  /** Délai en secondes avant que le TITRE de la porte n'apparaisse pendant la
   *  visite caméra du donjon. À 0 si on n'est pas en mode tour, le titre est
   *  visible immédiatement. */
  revealDelay?: number;
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

  // ── Reveal progressif du titre pendant la visite caméra ──
  const phase = useExperience((s) => s.phase);
  const tourPhase = useExperience((s) => s.tourPhase);
  const tourCameraStartedAt = useExperience((s) => s.tourCameraStartedAt);
  const [titleVisible, setTitleVisible] = useState(false);
  useEffect(() => {
    // Tant que l'utilisateur n'est pas vraiment à l'intérieur du château
    // (loading, gate avec la vidéo d'intro, entering = cinématique caméra) → titres cachés.
    if (phase !== 'inside') { setTitleVisible(false); return; }
    // À l'intérieur mais hors visite donjon → titres tous visibles directement.
    if (tourPhase !== 'dungeon' || !tourCameraStartedAt) { setTitleVisible(true); return; }
    // Pendant la visite : on hide puis on reveal au delay prévu.
    const elapsed = (Date.now() - tourCameraStartedAt) / 1000;
    if (elapsed >= revealDelay) { setTitleVisible(true); return; }
    setTitleVisible(false);
    const t = window.setTimeout(() => setTitleVisible(true), (revealDelay - elapsed) * 1000);
    return () => window.clearTimeout(t);
  }, [phase, tourPhase, tourCameraStartedAt, revealDelay]);

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

      {/* TITRE de la porte — apparaît progressivement pendant le tour caméra */}
      <Html position={[0, 4.4, 0.4]} center distanceFactor={10} occlude={false} style={{ pointerEvents: 'none' }}>
        <div
          className="font-medieval whitespace-nowrap rounded-lg border-2 border-goldbright/70 bg-stone/85 px-6 py-3 text-[22px] uppercase tracking-[0.32em] text-parchment shadow-[0_10px_36px_rgba(0,0,0,0.7)] backdrop-blur-sm"
          style={{
            textShadow: `0 0 14px ${color}aa, 0 2px 6px rgba(0,0,0,0.8)`,
            color: hover ? color : undefined,
            borderColor: hover ? color : undefined,
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible
              ? (hover ? 'scale(1.08) translateY(0)' : 'scale(1) translateY(0)')
              : 'scale(0.6) translateY(22px)',
            transition: 'opacity .75s cubic-bezier(.22,.61,.36,1), transform .75s cubic-bezier(.22,.61,.36,1), color .25s, border-color .25s',
          }}
        >
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
