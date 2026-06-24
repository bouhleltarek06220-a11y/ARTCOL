'use client';
/* ===========================================================================
   ScrollScenes — KIT
   Canvas WebGL plein écran, FIXÉ en fond. La progression de scroll (store)
   choisit quelles deux scènes mélanger et avec quelle transition.
   C'est l'élément central : « le scroll est responsable » du rendu 3D.
   =========================================================================== */
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScreenQuad, useTexture } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { scroll } from '@/lib/scroll-store';
import { vertexShader, fragmentShader } from './sceneShader';

function Scenes({ images }) {
  const textures = useTexture(images);
  const { size, viewport } = useThree();
  const matRef = useRef();
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // toutes les textures en cover, couleurs correctes
  useMemo(() => {
    textures.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.minFilter = THREE.LinearFilter;
      t.generateMipmaps = false;
    });
  }, [textures]);

  const uniforms = useMemo(
    () => ({
      uTexA: { value: textures[0] },
      uTexB: { value: textures[1] || textures[0] },
      uResA: { value: new THREE.Vector2(1, 1) },
      uResB: { value: new THREE.Vector2(1, 1) },
      uViewport: { value: new THREE.Vector2(1, 1) },
      uProgress: { value: 0 },
      uVelocity: { value: 0 },
      uTime: { value: 0 },
      uReduced: { value: reduced ? 1 : 0 },
    }),
    [textures, reduced]
  );

  const smooth = useRef({ frac: 0, vel: 0 });

  useFrame((state, delta) => {
    const mat = matRef.current;
    if (!mat) return;
    const N = textures.length;
    const f = scroll.progress * (N - 1);          // position « film » 0..N-1
    let idx = Math.min(Math.floor(f), N - 2);
    if (idx < 0) idx = 0;
    const target = f - idx;                         // 0..1 dans la transition courante

    // lissage pour des transitions soyeuses
    smooth.current.frac += (target - smooth.current.frac) * Math.min(1, delta * 6);
    smooth.current.vel += (scroll.velocity - smooth.current.vel) * Math.min(1, delta * 5);

    const a = textures[idx];
    const b = textures[idx + 1] || textures[idx];
    const u = mat.uniforms;                         // écrire dans les VRAIS uniforms du matériau
    u.uTexA.value = a;
    u.uTexB.value = b;
    if (a.image) u.uResA.value.set(a.image.width, a.image.height);
    if (b.image) u.uResB.value.set(b.image.width, b.image.height);
    u.uViewport.value.set(size.width, size.height);
    u.uProgress.value = smooth.current.frac;
    u.uVelocity.value = smooth.current.vel;
    u.uTime.value += delta;
  });

  return (
    <ScreenQuad>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </ScreenQuad>
  );
}

export default function ScrollScenes({ images }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        background: '#0b0d10',
      }}
    >
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 1] }}
      >
        <Scenes images={images} />
      </Canvas>
    </div>
  );
}
