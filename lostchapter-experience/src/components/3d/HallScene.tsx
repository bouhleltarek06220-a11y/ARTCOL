import { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { InteractivePortal } from './InteractivePortal';
import { NPCSilhouette } from './NPCSilhouette';
import { AnimatedBanner } from './AnimatedBanner';
import { zones } from '../../data/zones';

// Préchargement déclenché à l'import du module : le bundle commence à fetcher Sponza.
useGLTF.preload('/assets/sponza/glTF/Sponza.gltf');

// Sponza est orienté par défaut avec son axe long sur X. On le rote pour aligner la nef sur Z.
const SPONZA_ROT_Y = Math.PI / 2;
const SPONZA_POS: [number, number, number] = [0, 0, -21.37];

// Trois trajets de patrouille pour les silhouettes vivantes (coords mondiales x,z dans le hall).
const PATHS_NPC: { path: [number, number][]; speed: number; offset: number }[] = [
  { path: [[-3.5, -14], [3.5, -18], [-2.5, -23], [2.5, -16]], speed: 0.55, offset: 0 },
  { path: [[3, -12], [4.5, -22], [-2, -26], [-4, -14]], speed: 0.45, offset: 1.4 },
  { path: [[0, -27], [-3.5, -22], [3.5, -22], [0, -27]], speed: 0.4, offset: 2.8 },
];

export function HallScene() {
  const gltf = useGLTF('/assets/sponza/glTF/Sponza.gltf') as unknown as { scene: THREE.Group };

  useEffect(() => {
    if (!gltf?.scene) return;
    gltf.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
        const mat = m.material as THREE.MeshStandardMaterial | undefined;
        if (mat && 'envMapIntensity' in mat) mat.envMapIntensity = 0.6;
      }
    });
  }, [gltf]);

  return (
    <group>
      {/* le décor */}
      <group rotation={[0, SPONZA_ROT_Y, 0]} position={SPONZA_POS}>
        <primitive object={gltf.scene} dispose={null} />
      </group>

      {/* éclairage chaud d'ambiance dans la nef */}
      <ambientLight intensity={0.42} color="#5a4632" />
      {[-6, 0, 6].map((zx) => (
        <pointLight key={zx} position={[zx, 6.5, -22]} color="#ffb066" intensity={28} distance={28} decay={2} />
      ))}
      {/* faisceau focal sur l'arc de portails */}
      <spotLight
        position={[0, 11, -28]}
        target-position={[0, 1.5, -29]}
        color="#fff0d0"
        intensity={320}
        distance={50}
        angle={0.55}
        penumbra={0.7}
      />

      {/* Bannières médiévales le long de la nef */}
      {[-7, -3.5, 3.5, 7].map((x, i) => (
        <AnimatedBanner key={i} position={[x, 6.5, -16 - i * 1.8]} phase={i * 0.7} />
      ))}

      {/* Silhouettes vivantes */}
      {PATHS_NPC.map((p, i) => (
        <NPCSilhouette key={i} path={p.path} speed={p.speed} offset={p.offset} />
      ))}

      {/* Arc de portails au fond du hall, regardant vers la caméra */}
      {zones.map((zone, i) => {
        // angle réparti sur ~150° face à la caméra
        const t = zones.length === 1 ? 0.5 : i / (zones.length - 1);
        const angle = THREE.MathUtils.lerp(-Math.PI * 0.42, Math.PI * 0.42, t);
        const radius = 4.8;
        const x = Math.sin(angle) * radius;
        const zPos = -27 + Math.cos(angle) * 1.4;
        // chaque portail s'incline légèrement vers la caméra
        return <InteractivePortal key={zone.id} zone={zone} position={[x, 2.6, zPos]} yaw={-angle * 0.4} />;
      })}
    </group>
  );
}
