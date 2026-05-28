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
}

export interface CharacterNPCProps {
  character: CharacterDef;
  path?: [number, number][]; // (x,z) waypoints ; absent => idle stationnaire
  speed?: number;
  offset?: number;
  position?: [number, number, number];
  darkenColor?: string; // teinte sombre médiévale pour matcher l'ambiance
  emissive?: string;
}

// Préchargement des modèles humanoïdes au chargement du module
useGLTF.preload('/assets/characters/CesiumMan.glb');
useGLTF.preload('/assets/characters/BrainStem.glb');
useGLTF.preload('/assets/characters/RiggedFigure.glb');

export function CharacterNPC({
  character,
  path,
  speed = 0.5,
  offset = 0,
  position = [0, 0, 0],
  darkenColor = '#1a1208',
  emissive = '#2a1a0a',
}: CharacterNPCProps) {
  const gltf = useGLTF(character.url) as unknown as {
    scene: THREE.Group;
    animations: THREE.AnimationClip[];
  };

  // Clone du SkinnedMesh : chaque NPC a son propre squelette et état d'animation
  const cloned = useMemo(() => skeletonClone(gltf.scene) as THREE.Group, [gltf.scene]);

  const groupRef = useRef<THREE.Group>(null);

  // Teinte sombre médiévale (silhouettes crédibles dans le hall)
  useEffect(() => {
    cloned.traverse((o: THREE.Object3D) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && m.material) {
        const original = m.material as THREE.MeshStandardMaterial;
        const dark = (original.isMeshStandardMaterial ? original.clone() : new THREE.MeshStandardMaterial()) as THREE.MeshStandardMaterial;
        dark.color = new THREE.Color(darkenColor);
        dark.map = null; // on enlève la texture d'origine pour rester en silhouette unifiée
        dark.metalness = 0.12;
        dark.roughness = 0.85;
        dark.emissive = new THREE.Color(emissive);
        dark.emissiveIntensity = 0.06;
        m.material = dark;
        m.castShadow = true;
        m.receiveShadow = true;
        m.frustumCulled = false; // évite que la silhouette disparaisse en bord d'écran avec une grosse anim
      }
    });
  }, [cloned, darkenColor, emissive]);

  useCharacterAnimation(gltf.animations, cloned, character.animationName, character.timeScale ?? 1);

  // Déplacement le long du chemin (le walk-cycle des bones tourne sur place,
  // c'est nous qui translatons le groupe).
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
    }
  });

  return (
    <group ref={groupRef} position={position} scale={character.scale ?? 1}>
      <primitive object={cloned} />
    </group>
  );
}
