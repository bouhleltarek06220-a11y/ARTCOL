import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Silhouette sombre qui glisse le long d'un chemin — "les figures qui passent" du château vivant.
export function NPCSilhouette({
  path,
  speed = 0.6,
  offset = 0,
}: {
  path: [number, number][];
  speed?: number;
  offset?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const segs = path.length;
    const u = (clock.elapsedTime * speed + offset) % segs;
    const i0 = Math.floor(u);
    const i1 = (i0 + 1) % segs;
    const f = u - i0;
    const p0 = path[i0];
    const p1 = path[i1];
    const x = p0[0] + (p1[0] - p0[0]) * f;
    const z = p0[1] + (p1[1] - p0[1]) * f;
    if (group.current) {
      group.current.position.x = x;
      group.current.position.z = z;
      const dx = p1[0] - p0[0];
      const dz = p1[1] - p0[1];
      group.current.rotation.y = Math.atan2(dx, dz);
    }
    if (body.current) {
      const phase = clock.elapsedTime * 4 + offset * 3;
      body.current.position.y = 0.05 + Math.abs(Math.sin(phase)) * 0.06;
    }
  });

  return (
    <group ref={group}>
      <group ref={body}>
        {/* corps : capsule sombre */}
        <mesh position={[0, 0.65, 0]} castShadow>
          <capsuleGeometry args={[0.18, 0.9, 4, 12]} />
          <meshStandardMaterial color="#0a0805" roughness={0.95} metalness={0.05} />
        </mesh>
        {/* tête */}
        <mesh position={[0, 1.32, 0]} castShadow>
          <sphereGeometry args={[0.15, 14, 14]} />
          <meshStandardMaterial color="#0a0805" roughness={0.95} metalness={0.05} />
        </mesh>
        {/* léger rim doré sur la cape (additif faible) */}
        <mesh position={[0, 0.65, 0]}>
          <capsuleGeometry args={[0.21, 0.95, 4, 12]} />
          <meshBasicMaterial color="#c99b5c" transparent opacity={0.06} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}
