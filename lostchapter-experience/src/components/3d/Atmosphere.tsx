import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Lumière de torche/brasero qui VACILLE — somme de sinus + petite irrégularité
 * pour un feu vivant plutôt qu'une source statique.
 */
export function FlickerLight({
  position,
  color = '#ff9d4d',
  base = 9,
  amp = 3.5,
  distance = 11,
}: {
  position: [number, number, number];
  color?: string;
  base?: number;
  amp?: number;
  distance?: number;
}) {
  const ref = useRef<THREE.PointLight>(null);
  const seed = useMemo(() => Math.random() * 100, []);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * 9 + seed;
    const f = Math.sin(t) * 0.5 + Math.sin(t * 2.3) * 0.3 + Math.sin(t * 5.7) * 0.2;
    ref.current.intensity = Math.max(0.5, base + f * amp);
  });
  return <pointLight ref={ref} position={position} color={color} intensity={base} distance={distance} decay={2} />;
}

/**
 * Lueur chaude derrière une fenêtre/ouverture : un plan additif (jamais noir,
 * non affecté par le fog) qui simule la lumière du jour dehors et fait "respirer"
 * doucement. Sert de base avant d'y coller un vrai paysage (phase Décor IA).
 */
export function WindowGlow({
  position,
  rotationY = 0,
  w = 2.7,
  h = 3.1,
  color = '#ffd9a0',
  opacity = 0.85,
}: {
  position: [number, number, number];
  rotationY?: number;
  w?: number;
  h?: number;
  color?: string;
  opacity?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const seed = useMemo(() => Math.random() * 10, []);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const m = ref.current.material as THREE.MeshBasicMaterial;
    m.opacity = opacity * (0.9 + 0.1 * Math.sin(clock.elapsedTime * 0.6 + seed));
  });
  return (
    <mesh ref={ref} position={position} rotation={[0, rotationY, 0]}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
        fog={false}
      />
    </mesh>
  );
}

/**
 * Rais de lumière volumétrique ("god ray") : un cône additif tendu entre la
 * fenêtre (`from`, étroit) et le sol (`to`, large). Très subtil, scintille
 * légèrement. Pas de vraie diffusion lumineuse — c'est un trompe-l'œil cinéma.
 */
export function GodRayShaft({
  from,
  to,
  radius = 1.4,
  color = '#ffca78',
  opacity = 0.07,
}: {
  from: [number, number, number];
  to: [number, number, number];
  radius?: number;
  color?: string;
  opacity?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const seed = useMemo(() => Math.random() * 10, []);
  const { pos, quat, height } = useMemo(() => {
    const f = new THREE.Vector3(...from);
    const t = new THREE.Vector3(...to);
    const dir = new THREE.Vector3().subVectors(f, t);
    const h = dir.length();
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.clone().normalize(),
    );
    const mid = new THREE.Vector3().addVectors(f, t).multiplyScalar(0.5);
    return {
      pos: [mid.x, mid.y, mid.z] as [number, number, number],
      quat: [q.x, q.y, q.z, q.w] as [number, number, number, number],
      height: h,
    };
  }, [from, to]);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const m = ref.current.material as THREE.MeshBasicMaterial;
    m.opacity = opacity * (0.75 + 0.25 * Math.sin(clock.elapsedTime * 0.8 + seed));
  });
  return (
    <mesh ref={ref} position={pos} quaternion={quat}>
      <coneGeometry args={[radius, height, 20, 1, true]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
        toneMapped={false}
        fog={false}
      />
    </mesh>
  );
}
