import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
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
  /** Nom affiché dans une bulle au-dessus de la tête (ex: "TAREK"). */
  name?: string;
  /**
   * Palette de couleurs PAR sous-mesh (Knight_Head, Mage_Cape, etc.). Permet de
   * colorier chaque partie du corps avec une logique thématique. La clé `default`
   * est utilisée pour tout mesh non listé. Prioritaire sur preserveTextures/darkenColor.
   */
  meshColors?: Record<string, string>;
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
  meshColors,
  name,
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

  // Matériaux : coloration PAR sous-mesh quand meshColors fourni (style stylisé
  // KayKit, chaque partie a sa couleur thématique). Sinon fallback textures/silhouette.
  // On ajoute aussi des yeux + bouche sur le bone head pour donner des traits aux visages
  // (les atlas KayKit ne dessinent pas les yeux).
  useEffect(() => {
    cloned.traverse((o: THREE.Object3D) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && m.material) {
        const original = m.material as THREE.MeshStandardMaterial;
        const mat = (original.isMeshStandardMaterial ? original.clone() : new THREE.MeshStandardMaterial()) as THREE.MeshStandardMaterial;

        if (meshColors) {
          // La tête garde la texture atlas KayKit (yeux/bouche dessinés) — visage crédible.
          // Les autres parties reçoivent la couleur thématique unie de la palette.
          if (/head/i.test(m.name)) {
            mat.color.set('#ffffff');
            // map est conservée par clone() — on ne la met PAS à null
            mat.metalness = 0;
            mat.roughness = 0.85;
            mat.emissive = new THREE.Color(emissive);
            mat.emissiveIntensity = 0.03;
          } else {
            // Coloration par nom de mesh (ex: "Knight_Helmet", "Mage_Cape")
            const partColor = meshColors[m.name] ?? meshColors.default ?? '#888888';
            mat.color = new THREE.Color(partColor);
            mat.map = null; // pas de texture atlas, couleur unie
            // Métal pour les casques / visières, tissu pour le reste
            const isMetal = /helmet|visor|sword|axe|shield|armor|plate/i.test(m.name);
            mat.metalness = isMetal ? 0.75 : 0.08;
            mat.roughness = isMetal ? 0.35 : 0.85;
            mat.emissive = new THREE.Color(emissive);
            mat.emissiveIntensity = 0.04;
          }
        } else if (preserveTextures) {
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

    // Ajout des traits du visage (yeux + bouche) sur le bone "head" du squelette KayKit.
    // Comme c'est un enfant du bone, ça suit l'animation de la tête.
    const head = cloned.getObjectByName('head');
    if (head && !head.userData.faceAdded) {
      const eyeMat = new THREE.MeshStandardMaterial({ color: '#070504', roughness: 0.4, metalness: 0 });
      const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: '#f4ead8', roughness: 0.4, metalness: 0 });
      const mouthMat = new THREE.MeshStandardMaterial({ color: '#3a1410', roughness: 0.6 });

      const eyeR = new THREE.Vector3(0.075, 0.08, 0.18);
      [-1, 1].forEach((side) => {
        const white = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), eyeWhiteMat);
        white.position.set(side * eyeR.x, eyeR.y, eyeR.z - 0.005);
        head.add(white);
        const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.028, 10, 10), eyeMat);
        pupil.position.set(side * eyeR.x, eyeR.y, eyeR.z + 0.025);
        head.add(pupil);
      });

      const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.018, 0.02), mouthMat);
      mouth.position.set(0, -0.04, 0.2);
      head.add(mouth);

      head.userData.faceAdded = true;
    }
  }, [cloned, preserveTextures, darkenColor, emissive, meshColors]);

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
      {name && (
        <Html position={[0, 2.6, 0]} center distanceFactor={10} style={{ pointerEvents: 'none' }}>
          <div
            className="font-display whitespace-nowrap rounded-full border border-goldbright/70 bg-stone/85 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-parchment"
            style={{ textShadow: '0 0 8px rgba(229,199,136,0.5)' }}
          >
            {name}
          </div>
        </Html>
      )}
    </group>
  );
}
