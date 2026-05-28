import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { clone as skeletonClone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import * as THREE from 'three';
import { useCharacterAnimation } from '../../lib/useCharacterAnimation';

export interface CharacterDef {
  url: string;
  scale?: number;
  rotationOffset?: number; // si le modèle ne pointe pas vers +Z par défaut
  animationName?: string;
  timeScale?: number;
  /**
   * URL d'un GLB de rig partagé contenant les clips d'animation. Si présent, les
   * clips sont chargés depuis là (KayKit v2). Sinon, on utilise les animations
   * embedded du fichier principal (CesiumMan, KayKit v1...).
   */
  animationsUrl?: string;
}

export interface CharacterNPCProps {
  character: CharacterDef;
  path?: [number, number][]; // (x,z) waypoints ; absent => idle stationnaire
  speed?: number;
  offset?: number;
  position?: [number, number, number];
  rotationY?: number;        // orientation fixe quand sans chemin
  preserveTextures?: boolean; // garde la texture KayKit (armure, robe…)
  darkenColor?: string;      // teinte sombre médiévale pour matcher l'ambiance
  emissive?: string;
}

// Préchargement des modèles humanoïdes (KayKit Adventurers 2.0)
useGLTF.preload('/assets/characters/kaykit-v2/Knight.glb');
useGLTF.preload('/assets/characters/kaykit-v2/Mage.glb');
useGLTF.preload('/assets/characters/kaykit-v2/Rogue.glb');
useGLTF.preload('/assets/characters/kaykit-v2/Rogue_Hooded.glb');
useGLTF.preload('/assets/characters/kaykit-v2/Barbarian.glb');
useGLTF.preload('/assets/characters/kaykit-v2/Ranger.glb');
useGLTF.preload('/assets/characters/kaykit-v2/animations/Rig_Medium_MovementBasic.glb');
useGLTF.preload('/assets/characters/kaykit-v2/animations/Rig_Medium_General.glb');

export function CharacterNPC({
  character,
  path,
  speed = 0.5,
  offset = 0,
  position = [0, 0, 0],
  rotationY = 0,
  preserveTextures = false,
  darkenColor = '#1a1208',
  emissive = '#2a1a0a',
}: CharacterNPCProps) {
  const gltf = useGLTF(character.url) as unknown as {
    scene: THREE.Group;
    animations: THREE.AnimationClip[];
  };
  // Quand un rig partagé est fourni (KayKit v2 → animations dans un autre GLB),
  // on charge ses clips ; sinon on retombe sur ceux du fichier principal.
  // useGLTF est mis en cache par drei : appeler 2x la même URL ne fetch qu'une fois.
  const animSrc = useGLTF(character.animationsUrl ?? character.url) as unknown as {
    animations: THREE.AnimationClip[];
  };
  const animations = animSrc?.animations?.length ? animSrc.animations : gltf.animations;

  // Clone du SkinnedMesh : chaque NPC a son propre squelette et état d'animation
  const cloned = useMemo(() => skeletonClone(gltf.scene) as THREE.Group, [gltf.scene]);

  const groupRef = useRef<THREE.Group>(null);

  // Matériaux : soit on garde les textures KayKit (médiéval crédible),
  // soit on les retire pour une silhouette unifiée brun-noir.
  useEffect(() => {
    cloned.traverse((o: THREE.Object3D) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && m.material) {
        const original = m.material as THREE.MeshStandardMaterial;
        const mat = (original.isMeshStandardMaterial ? original.clone() : new THREE.MeshStandardMaterial()) as THREE.MeshStandardMaterial;
        if (preserveTextures) {
          // assombrir légèrement pour matcher l'ambiance nef éclairée aux torches
          mat.color.multiplyScalar(0.82);
          mat.metalness = (mat.metalness ?? 0.1) * 0.6;
          mat.roughness = 0.85;
          mat.emissive = new THREE.Color(emissive);
          mat.emissiveIntensity = 0.03;
        } else {
          mat.color = new THREE.Color(darkenColor);
          mat.map = null;
          mat.metalness = 0.12;
          mat.roughness = 0.85;
          mat.emissive = new THREE.Color(emissive);
          mat.emissiveIntensity = 0.06;
        }
        m.material = mat;
        m.castShadow = true;
        m.receiveShadow = true;
        m.frustumCulled = false;
      }
    });
  }, [cloned, preserveTextures, darkenColor, emissive]);

  useCharacterAnimation(animations, cloned, character.animationName, character.timeScale ?? 1);

  // Déplacement le long du chemin (le walk-cycle des bones tourne sur place,
  // c'est nous qui translatons le groupe). Si pas de chemin, idle stationnaire.
  useFrame(({ clock }) => {
    const g = groupRef.current;
    if (!g) return;
    if (path && path.length >= 2) {
      const segs = path.length;
      const u = (clock.elapsedTime * speed + offset) % segs;
      const i0 = Math.floor(u);
      const i1 = (i0 + 1) % segs;
      const f = u - i0;
      const p0 = path[i0];
      const p1 = path[i1];
      g.position.x = p0[0] + (p1[0] - p0[0]) * f;
      g.position.z = p0[1] + (p1[1] - p0[1]) * f;
      g.position.y = position[1] ?? 0;
      const dx = p1[0] - p0[0];
      const dz = p1[1] - p0[1];
      g.rotation.y = Math.atan2(dx, dz) + (character.rotationOffset ?? 0);
    } else {
      // Idle stationnaire : légère respiration en y + micro sway
      g.position.set(position[0], (position[1] ?? 0) + Math.sin(clock.elapsedTime * 1.4 + offset) * 0.012, position[2]);
      g.rotation.y = rotationY + Math.sin(clock.elapsedTime * 0.5 + offset) * 0.03;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={character.scale ?? 1}>
      <primitive object={cloned} />
    </group>
  );
}
