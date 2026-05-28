import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, ToneMapping, Vignette, Noise, BrightnessContrast } from '@react-three/postprocessing';
import { ToneMappingMode, BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { CastleGate } from './CastleGate';
import { CinematicCamera } from './CinematicCamera';
import { Torch } from './Torch';
import { FloatingEmbers } from './FloatingEmbers';
import { HallScene } from './HallScene';
import { useIsMobile } from '../../lib/useIsMobile';
import { useExperience } from '../../store';

// OrbitControls verrouillés dans la boîte de l'atrium Sponza :
// target.x [-5, 5] (nef centrale dégagée),
// target.y [1.2, 8] (du sol au-dessous du plafond voûté),
// target.z [-34, -6] (de l'entrée au mur du fond)
function ClampedOrbitControls() {
  const ref = useRef<any>(null);
  useFrame(() => {
    const c = ref.current;
    if (!c?.target) return;
    const t = c.target as THREE.Vector3;
    t.x = Math.max(-5, Math.min(5, t.x));
    t.y = Math.max(1.2, Math.min(8, t.y));
    t.z = Math.max(-34, Math.min(-6, t.z));
  });
  return (
    <OrbitControls
      ref={ref}
      makeDefault
      target={[0, 2.5, -24]}
      enablePan
      enableRotate
      enableZoom
      enableDamping
      dampingFactor={0.08}
      minDistance={4}
      maxDistance={24}
      minPolarAngle={Math.PI * 0.12}
      maxPolarAngle={Math.PI * 0.55}
      rotateSpeed={0.55}
      panSpeed={0.6}
      zoomSpeed={0.7}
    />
  );
}

const stone = { color: '#3a2a1d', roughness: 0.95, metalness: 0.05 };
const darkStone = { color: '#271a11', roughness: 1 };

// Massing extérieur du château (façade), remplacé par un modèle photoréaliste en phase ultérieure si besoin.
function CastleExterior({ mobile }: { mobile: boolean }) {
  const merlons = [];
  for (let x = -8; x <= 8; x += 1.7) {
    merlons.push(
      <mesh key={x} position={[x, 9.5, 0]} castShadow={!mobile}>
        <boxGeometry args={[0.85, 1, 2.4]} />
        <meshStandardMaterial {...darkStone} />
      </mesh>,
    );
  }
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[260, 260]} />
        <meshStandardMaterial color="#130b05" roughness={1} />
      </mesh>
      <mesh position={[-5.1, 4.5, 0]} castShadow={!mobile} receiveShadow>
        <boxGeometry args={[5.8, 9, 2.4]} />
        <meshStandardMaterial {...stone} />
      </mesh>
      <mesh position={[5.1, 4.5, 0]} castShadow={!mobile} receiveShadow>
        <boxGeometry args={[5.8, 9, 2.4]} />
        <meshStandardMaterial {...stone} />
      </mesh>
      <mesh position={[0, 8.6, 0]} castShadow={!mobile}>
        <boxGeometry args={[5.2, 1.4, 2.4]} />
        <meshStandardMaterial {...stone} />
      </mesh>
      {merlons}
      {[-8, 8].map((tx) => (
        <group key={tx}>
          <mesh position={[tx, 6, 0]} castShadow={!mobile} receiveShadow>
            <cylinderGeometry args={[1.7, 1.9, 12, 24]} />
            <meshStandardMaterial {...stone} />
          </mesh>
          <mesh position={[tx, 13.7, 0]} castShadow={!mobile}>
            <coneGeometry args={[2.3, 3.4, 24]} />
            <meshStandardMaterial {...darkStone} />
          </mesh>
        </group>
      ))}
      <pointLight position={[0, 3, -4]} color="#ffcf8a" intensity={45} distance={26} decay={2} />
    </group>
  );
}

export function CastleScene() {
  const mobile = useIsMobile();
  const phase = useExperience((s) => s.phase);
  return (
    <Canvas
      shadows={!mobile}
      dpr={[1, mobile ? 1.4 : 2]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ fov: 65, near: 0.1, far: 400, position: [0, 3, 18] }}
      onCreated={({ gl }) => {
        gl.setClearColor('#080604');
      }}
    >
      {/* ─── Environnement HDRI (IBL) ──────────────────────────────────────
          - bell_tower : ambiance beffroi médiéval extérieur, utilisé en phase
            gate/entering quand la caméra est devant le château
          - cathedral  : ambiance Georgentor (portail médiéval), utilisé en
            phase inside pour le hall (reflets sur les armures, ombres douces) */}
      {phase === 'inside' ? (
        <Environment files="/assets/hdr/cathedral.exr" background blur={0.6} />
      ) : (
        <Environment files="/assets/hdr/bell_tower.exr" background blur={0.35} />
      )}
      <fog attach="fog" args={['#080604', 18, 70]} />
      <ambientLight intensity={0.22} color="#5a4632" />
      <hemisphereLight args={['#2d3a55', '#241509', 0.25]} />
      <directionalLight
        castShadow={!mobile}
        position={[16, 26, 10]}
        intensity={0.85}
        color="#aec4ff"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={120}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-bias={-0.0005}
      />

      <CastleExterior mobile={mobile} />
      <CastleGate />
      <Torch position={[-3.0, 4.0, 1.0]} />
      <Torch position={[3.0, 4.0, 1.0]} />
      {!mobile && <FloatingEmbers count={360} />}

      {/* Le hall (Sponza + portails + NPC + bannières) est rendu derrière la porte,
          il commence à se charger immédiatement et useProgress reflète son téléchargement. */}
      {!mobile && (
        <Suspense fallback={null}>
          <HallScene />
        </Suspense>
      )}

      <CinematicCamera />

      {/* Navigation libre clampée dans la boîte du hall (target box-bound). */}
      {phase === 'inside' && <ClampedOrbitControls />}

      <EffectComposer>
        {/* Halo des flammes et portails — douceur cinéma */}
        <Bloom intensity={1.05} luminanceThreshold={0.2} luminanceSmoothing={0.35} mipmapBlur />
        {/* Étalonnage couleur léger (un cran de contraste + chaleur) */}
        <BrightnessContrast brightness={-0.02} contrast={0.08} />
        {/* Grain de pellicule subtil */}
        <Noise opacity={0.06} blendFunction={BlendFunction.OVERLAY} premultiply />
        {/* Vignette cinéma : assombrit les bords pour focaliser le regard */}
        <Vignette eskil={false} offset={0.18} darkness={0.95} />
        {/* Tone mapping ACES filmique en sortie */}
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </Canvas>
  );
}
