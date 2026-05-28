import { Suspense, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { InteractivePortal } from './InteractivePortal';
import { CharacterGroup } from './CharacterGroup';
import { AnimatedBanner } from './AnimatedBanner';
import { zones } from '../../data/zones';

// Préchargement déclenché à l'import du module : le bundle commence à fetcher Sponza.
useGLTF.preload('/assets/sponza/glTF/Sponza.gltf');

// Sponza est orienté par défaut avec son axe long sur X. On le rote pour aligner la nef sur Z.
const SPONZA_ROT_Y = Math.PI / 2;
const SPONZA_POS: [number, number, number] = [0, 0, -21.37];

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
      <ambientLight intensity={0.55} color="#6a5238" />
      {[-8, -2, 4].map((zx) => (
        <pointLight key={zx} position={[0, 6.5, zx - 18]} color="#ffb066" intensity={32} distance={26} decay={2} />
      ))}
      {/* faisceau focal sur l'arc de portails */}
      <spotLight
        position={[0, 10, -28]}
        target-position={[0, 2.6, -30]}
        color="#fff0d0"
        intensity={380}
        distance={50}
        angle={0.6}
        penumbra={0.7}
      />

      {/* Bannières le long de la nef, repoussées profond pour ne pas écraser la caméra */}
      {[
        [-3.5, -22],
        [3.5, -22],
        [-3.5, -26],
        [3.5, -26],
      ].map(([x, z], i) => (
        <AnimatedBanner key={i} position={[x, 6.4, z]} phase={i * 0.7} />
      ))}

      {/* Personnages 3D animés (GLB rigged + walk-cycle) */}
      <Suspense fallback={null}>
        <CharacterGroup />
      </Suspense>

      {/* Arc serré au fond du hall, rayon réduit pour rester dans la nef centrale */}
      {zones.map((zone, i) => {
        const t = zones.length === 1 ? 0.5 : i / (zones.length - 1);
        // arc 120° au lieu de 150°, plus visible et moins masqué par les colonnes
        const angle = THREE.MathUtils.lerp(-Math.PI * 0.34, Math.PI * 0.34, t);
        const radius = 3.0;                                  // nef centrale dégagée
        const x = Math.sin(angle) * radius;
        const zPos = -30 + Math.cos(angle) * 1.0;            // au fond du hall
        return <InteractivePortal key={zone.id} zone={zone} position={[x, 2.6, zPos]} yaw={-angle * 0.5} />;
      })}
    </group>
  );
}
