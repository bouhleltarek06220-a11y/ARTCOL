import { useMemo, useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Position globale du livre flottant dans le ciel du donjon.
export const BOOK_POS: [number, number, number] = [0, 11, -22];

const BOOK_URL = '/assets/characters/custom/Book.glb';
useGLTF.preload(BOOK_URL);

/**
 * Livre du Chapitre Perdu suspendu dans le ciel du donjon, entouré d'un anneau
 * d'or qui tourne, d'un halo lumineux pulsant et de particules dorées qui
 * s'élèvent. Cliquable → ouvre la soutenance dans un nouvel onglet.
 */
export function FloatingBook() {
  const { scene: bookScene } = useGLTF(BOOK_URL) as unknown as { scene: THREE.Group };
  const bookRef = useRef<THREE.Group>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.PointLight>(null);
  const sparksRef = useRef<THREE.Points>(null);
  const [hover, setHover] = useState(false);

  // Clone du livre avec coup d'éclat doré pour qu'il rayonne dans l'obscurité.
  const book = useMemo(() => {
    const c = bookScene.clone(true);
    c.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && m.material) {
        const orig = m.material as THREE.MeshStandardMaterial;
        const mat = (orig.isMeshStandardMaterial ? orig.clone() : new THREE.MeshStandardMaterial()) as THREE.MeshStandardMaterial;
        mat.emissive = new THREE.Color('#ffb066');
        mat.emissiveIntensity = 0.6;
        if ('envMapIntensity' in mat) mat.envMapIntensity = 0.5;
        m.castShadow = true;
        m.material = mat;
      }
    });
    return c;
  }, [bookScene]);

  // Particules dorées (40) qui s'élèvent autour du livre.
  const particles = useMemo(() => {
    const n = 40;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 1.2 + Math.random() * 1.8;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 2.4;
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (bookRef.current) {
      bookRef.current.position.y = Math.sin(t * 0.7) * 0.18;
      bookRef.current.rotation.y = t * 0.55;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = t * 0.35;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = -t * 0.22;
      outerRingRef.current.rotation.x = Math.sin(t * 0.5) * 0.18;
    }
    if (pulseRef.current) {
      pulseRef.current.intensity = 110 + Math.sin(t * 2.2) * 30 + (hover ? 40 : 0);
    }
    // Animation des particules : montée + recyclage
    const g = sparksRef.current?.geometry;
    if (g) {
      const arr = g.attributes.position.array as Float32Array;
      for (let i = 1; i < arr.length; i += 3) {
        arr[i] += 0.012;
        if (arr[i] > 1.6) arr[i] = -1.6;
      }
      g.attributes.position.needsUpdate = true;
    }
  });

  const open = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    window.open('/Soutenance.html', '_blank', 'noopener');
  };

  return (
    <group
      position={BOOK_POS}
      onClick={open}
      onPointerOver={() => { setHover(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHover(false); document.body.style.cursor = 'default'; }}
    >
      {/* Anneau extérieur : grand cercle d'or qui tourne lentement, légère oscillation */}
      <mesh ref={outerRingRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.6, 0.085, 16, 80]} />
        <meshStandardMaterial
          color="#ffd980"
          emissive="#ffd980"
          emissiveIntensity={hover ? 3.6 : 2.4}
          metalness={0.85}
          roughness={0.35}
          toneMapped={false}
        />
      </mesh>
      {/* Anneau intérieur : plus fin, contre-rotation */}
      <mesh ref={innerRingRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.85, 0.05, 12, 64]} />
        <meshStandardMaterial
          color="#ffb066"
          emissive="#ffb066"
          emissiveIntensity={hover ? 3.2 : 2.0}
          metalness={0.9}
          roughness={0.3}
          toneMapped={false}
        />
      </mesh>
      {/* Halo doré soft derrière (un cercle plat additif pour la profondeur) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <ringGeometry args={[0.0, 3.4, 64]} />
        <meshBasicMaterial
          color="#ffd980"
          transparent
          opacity={hover ? 0.28 : 0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      {/* Livre 3D qui flotte au centre, scale 1.6 pour bien le voir depuis le sol */}
      <group ref={bookRef} scale={1.6}>
        <primitive object={book} />
      </group>
      {/* Lumière pulsante (pointlight) qui se diffuse sur tout le donjon */}
      <pointLight ref={pulseRef} color="#ffd9a0" intensity={120} distance={30} decay={2} />
      {/* Particules ascendantes dorées */}
      <points ref={sparksRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particles, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#ffd980"
          size={0.07}
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </points>
    </group>
  );
}
