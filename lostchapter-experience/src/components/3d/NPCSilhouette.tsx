import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Humanoïde sombre articulé qui marche le long d'un chemin — vraies silhouettes vivantes.
const darkMat = new THREE.MeshStandardMaterial({ color: '#0c0906', roughness: 0.95, metalness: 0.05 });
const rimMat = new THREE.MeshBasicMaterial({
  color: '#c99b5c',
  transparent: true,
  opacity: 0.05,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

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
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);

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
    // Cycle de marche : ~2 cycles/s
    const gait = clock.elapsedTime * speed * 6 + offset * 4;
    const swing = Math.sin(gait) * 0.55;
    const armSwing = Math.sin(gait + Math.PI) * 0.4;
    if (legL.current) legL.current.rotation.x = swing;
    if (legR.current) legR.current.rotation.x = -swing;
    if (armL.current) armL.current.rotation.x = -swing * 0.7;
    if (armR.current) armR.current.rotation.x = swing * 0.7;
    if (body.current) {
      body.current.position.y = 1.0 + Math.abs(Math.sin(gait)) * 0.04;
      body.current.rotation.z = Math.sin(gait) * 0.02;
    }
  });

  return (
    <group ref={group}>
      <group ref={body}>
        {/* torse (cape) */}
        <mesh material={darkMat} position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.42, 0.7, 0.26]} />
        </mesh>
        {/* capuche / tête */}
        <mesh material={darkMat} position={[0, 0.5, 0]} castShadow>
          <sphereGeometry args={[0.17, 14, 14]} />
        </mesh>
        {/* épaules (pivot des bras) */}
        <group ref={armL} position={[-0.26, 0.18, 0]}>
          <mesh material={darkMat} position={[0, -0.27, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.055, 0.55, 8]} />
          </mesh>
        </group>
        <group ref={armR} position={[0.26, 0.18, 0]}>
          <mesh material={darkMat} position={[0, -0.27, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.055, 0.55, 8]} />
          </mesh>
        </group>
        {/* rim doré (capture la lumière chaude des torches) */}
        <mesh material={rimMat} position={[0, 0, 0]}>
          <boxGeometry args={[0.5, 0.8, 0.34]} />
        </mesh>
      </group>
      {/* hanches (pivot des jambes) */}
      <group ref={legL} position={[-0.1, 0.55, 0]}>
        <mesh material={darkMat} position={[0, -0.275, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.06, 0.55, 8]} />
        </mesh>
      </group>
      <group ref={legR} position={[0.1, 0.55, 0]}>
        <mesh material={darkMat} position={[0, -0.275, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.06, 0.55, 8]} />
        </mesh>
      </group>
    </group>
  );
}
