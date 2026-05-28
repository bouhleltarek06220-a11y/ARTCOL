import { Suspense, useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { DoorPortal } from './DoorPortal';
import { CharacterGroup } from './CharacterGroup';
import { AnimatedBanner } from './AnimatedBanner';
import { Brazier } from './Brazier';
import { KnightArmor } from './KnightArmor';
import { zones } from '../../data/zones';

// Préchargement de Sponza (décor architectural photoréaliste, CC BY Crytek)
useGLTF.preload('/assets/sponza/glTF/Sponza.gltf');

// Sponza × 1.4 pour plus de monumentalité. Compensations :
//   - position.y = +1.4 pour que le sol (intrinsic min.y * 1.4 = -1.41) reste à y=0
//   - position.z = -26.16 pour que l'arche d'entrée (originale x=+14.40, scalée)
//     reste à world z=-6 (juste après le corridor de la porte).
const SPONZA_ROT_Y = -Math.PI / 2;
const SPONZA_SCALE = 1.4;
const SPONZA_POS: [number, number, number] = [0, 1.4, -26.16];
// Sponza s'étend maintenant : entrée z≈-6 (arche), apse z≈-48 (niche)
const Z_BACK = -44;  // les portes sont placées avant l'apse, dans la nef visible

export function HallScene() {
  const gltf = useGLTF('/assets/sponza/glTF/Sponza.gltf') as unknown as { scene: THREE.Group };

  useEffect(() => {
    if (!gltf?.scene) return;
    // Sponza est un atrium fermé : ses deux courts murs bloquent la vue.
    // On rend invisible tout ce qui est devant z=-6.5 (= le court mur d'entrée),
    // pour que la caméra voit directement l'intérieur de l'atrium quand elle
    // franchit le seuil. Les colonnes des arcades latérales (z<-7) restent
    // intactes.
    const entranceCutoff = new THREE.Plane(new THREE.Vector3(0, 0, -1), -6.5);
    gltf.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
        const mat = m.material as THREE.MeshStandardMaterial | undefined;
        if (mat) {
          if ('envMapIntensity' in mat) mat.envMapIntensity = 0.85;
          mat.clippingPlanes = [entranceCutoff];
          mat.clipShadows = true;
          mat.needsUpdate = true;
        }
      }
    });
  }, [gltf]);

  // Positions X des 9 portes le long du mur du fond
  const doorXs = useMemo(
    () => zones.map((_, i) => {
      const t = zones.length === 1 ? 0.5 : i / (zones.length - 1);
      return THREE.MathUtils.lerp(-7.5, 7.5, t);
    }),
    [],
  );
  // Positions X des armures : entre les portes (8 emplacements)
  const armorXs = useMemo(() => {
    const xs: number[] = [];
    for (let i = 0; i < doorXs.length - 1; i++) {
      xs.push((doorXs[i] + doorXs[i + 1]) / 2);
    }
    return xs;
  }, [doorXs]);

  return (
    <group>
      {/* ─── DÉCOR : atrium de palais Sponza (×1.4 monumental) ──────── */}
      <group rotation={[0, SPONZA_ROT_Y, 0]} position={SPONZA_POS} scale={SPONZA_SCALE}>
        <primitive object={gltf.scene} dispose={null} />
      </group>

      {/* ─── Tapis royal rouge bordé or qui parcourt la nef centrale ─── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -20]} receiveShadow>
        <planeGeometry args={[3.4, 26]} />
        <meshStandardMaterial color="#5a1a1a" roughness={0.92} metalness={0.06} />
      </mesh>
      {[-1.6, 1.6].map((s) => (
        <mesh key={`carpet-edge-${s}`} rotation={[-Math.PI / 2, 0, 0]} position={[s, 0.008, -20]}>
          <planeGeometry args={[0.12, 26]} />
          <meshStandardMaterial color="#c99b5c" metalness={0.9} roughness={0.45} />
        </mesh>
      ))}
      {[-7.5, -33.5].map((z) => (
        <mesh key={`carpet-end-${z}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, z]}>
          <planeGeometry args={[3.4, 0.12]} />
          <meshStandardMaterial color="#c99b5c" metalness={0.9} roughness={0.45} />
        </mesh>
      ))}

      {/* ─── Lumières chaudes baignant l'atrium ─────────────────────── */}
      <ambientLight intensity={0.6} color="#6a5238" />
      {[-10, -18, -26].map((zPos) => (
        <pointLight key={zPos} position={[0, 7.5, zPos]} color="#ffb066" intensity={32} distance={26} decay={2} />
      ))}
      {/* Faisceau focal sur le mur du fond et les portes */}
      <spotLight
        position={[0, 12, Z_BACK + 8]}
        target-position={[0, 2.6, Z_BACK + 0.5]}
        color="#fff0d0"
        intensity={650}
        distance={40}
        angle={0.75}
        penumbra={0.7}
      />

      {/* ─── 4 grands braseros allumés (entrée + fond) ──────────── */}
      <Brazier position={[-5, 0, -8]} />
      <Brazier position={[5, 0, -8]} />
      <Brazier position={[-5, 0, Z_BACK + 2]} />
      <Brazier position={[5, 0, Z_BACK + 2]} />

      {/* ─── Bannières héraldiques sur les côtés de la nef ─────── */}
      {[[-6.5, -12], [6.5, -12], [-6.5, -18], [6.5, -18], [-6.5, -24], [6.5, -24]].map(
        ([x, z], i) => (
          <AnimatedBanner key={i} position={[x, 7, z]} phase={i * 0.7} />
        ),
      )}

      {/* ─── 9 portes médiévales contre le mur du fond Sponza ──── */}
      {zones.map((zone, i) => (
        <DoorPortal key={zone.id} zone={zone} position={[doorXs[i], 0, Z_BACK + 1.5]} />
      ))}

      {/* ─── 8 armures de chevalier entre les portes ───────────── */}
      {armorXs.map((x, i) => (
        <KnightArmor
          key={i}
          position={[x, 0, Z_BACK + 3.5]}
          rotationY={Math.PI}
          plumeColor={i % 2 === 0 ? '#7a1a1a' : '#3a1a4a'}
        />
      ))}

      {/* ─── Personnages 3D animés (au sol uniquement) ─────────── */}
      <Suspense fallback={null}>
        <CharacterGroup />
      </Suspense>
    </group>
  );
}
