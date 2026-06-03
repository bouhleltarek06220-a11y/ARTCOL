import { Suspense, useRef, useState } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Html, useVideoTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { NationalZone } from '../../data/nationalZones';

const SCREEN_W = 2.1;
const SCREEN_H = 3.3;

/** Matériau = texture vidéo animée (aperçu de la zone). Suspend le temps du chargement. */
function VideoScreen({ src }: { src: string }) {
  const tex = useVideoTexture(src, { muted: true, loop: true, start: true, crossOrigin: 'anonymous' });
  return <meshBasicMaterial map={tex} toneMapped={false} />;
}

/** Écran lumineux animé (zones sans vidéo). */
function GlowScreen({ color }: { color: string }) {
  const ref = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(({ clock }) => { if (ref.current) ref.current.opacity = 0.45 + 0.18 * Math.sin(clock.elapsedTime * 1.4); });
  return <meshBasicMaterial ref={ref} color={color} transparent opacity={0.5} toneMapped={false} blending={THREE.AdditiveBlending} />;
}

/** Portail = cadre de pierre encadrant un ÉCRAN VIDÉO vivant (aperçu animé de la
 *  zone) + bord lumineux coloré + titre. Réagit au survol / clic. */
export function Portal({
  zone, radius, onSelect, onHover,
}: {
  zone: NationalZone;
  radius: number;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}) {
  const x = Math.cos(zone.angle) * radius;
  const z = Math.sin(zone.angle) * radius;
  const rotY = Math.atan2(-x, -z);
  const vid = zone.video ? import.meta.env.BASE_URL + 'national/videos/' + zone.video : null;

  const [hover, setHover] = useState(false);
  const grp = useRef<THREE.Group>(null);
  const glow = useRef<THREE.PointLight>(null);
  const border = useRef<THREE.Mesh>(null);
  const SY = SCREEN_H / 2 + 0.55;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (glow.current) glow.current.intensity = (hover ? 13 : 4.5) + Math.sin(t * 2 + zone.angle) * 0.8;
    if (grp.current) {
      const s = hover ? 1.05 : 1;
      grp.current.scale.x += (s - grp.current.scale.x) * 0.15;
      grp.current.scale.y = grp.current.scale.z = grp.current.scale.x;
    }
    if (border.current) {
      const m = border.current.material as THREE.MeshBasicMaterial;
      m.opacity = (hover ? 0.95 : 0.6) + Math.sin(t * 1.6 + zone.angle) * 0.1;
    }
  });

  const over = (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setHover(true); onHover(zone.id); document.body.style.cursor = 'pointer'; };
  const out = () => { setHover(false); onHover(null); document.body.style.cursor = 'default'; };
  const click = (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onSelect(zone.id); };

  return (
    <group ref={grp} position={[x, 0, z]} rotation={[0, rotY, 0]} onPointerOver={over} onPointerOut={out} onClick={click}>
      {/* Socle */}
      <mesh position={[0, 0.25, 0]} receiveShadow><boxGeometry args={[SCREEN_W + 1, 0.5, 0.9]} /><meshStandardMaterial color="#191209" roughness={0.92} /></mesh>
      {/* Dalle de pierre (arrière) */}
      <mesh position={[0, SY, -0.08]} castShadow><boxGeometry args={[SCREEN_W + 0.55, SCREEN_H + 0.6, 0.4]} /><meshStandardMaterial color="#241c14" roughness={0.92} metalness={0.06} /></mesh>
      {/* Bord lumineux coloré (halo du portail) */}
      <mesh ref={border} position={[0, SY, 0.04]}><planeGeometry args={[SCREEN_W + 0.34, SCREEN_H + 0.34]} /><meshBasicMaterial color={zone.color} transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></mesh>
      {/* Écran (vidéo vivante ou glow) */}
      <Suspense fallback={<mesh position={[0, SY, 0.2]}><planeGeometry args={[SCREEN_W, SCREEN_H]} /><meshBasicMaterial color={zone.color} transparent opacity={0.55} toneMapped={false} /></mesh>}>
        <mesh position={[0, SY, 0.2]}>
          <planeGeometry args={[SCREEN_W, SCREEN_H]} />
          {vid ? <VideoScreen src={vid} /> : <GlowScreen color={zone.color} />}
        </mesh>
      </Suspense>

      {/* Titre */}
      <Html position={[0, 0.6, 0.4]} center distanceFactor={9} style={{ pointerEvents: 'none' }}>
        <div className="font-display" style={{ whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.22em', fontSize: 13, fontWeight: 700, color: '#f4e6c4', textShadow: `0 0 12px ${zone.color}, 0 2px 6px #000`, opacity: hover ? 1 : 0.82, transition: 'opacity .3s' }}>{zone.title}</div>
      </Html>

      <pointLight ref={glow} position={[0, SY, 0.8]} color={zone.color} intensity={4.5} distance={9} decay={2} />
    </group>
  );
}
