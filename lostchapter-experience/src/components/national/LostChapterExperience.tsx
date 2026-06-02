import { useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ToneMapping, Noise, BrightnessContrast } from '@react-three/postprocessing';
import { ToneMappingMode, BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import { CentralHall } from './CentralHall';
import { CinematicIntro } from './CinematicIntro';
import { ZoneOverlay } from './ZoneOverlay';

type Mode = 'intro' | 'entering' | 'hall';

/** Caméra d'entrée cinématique : plongée aérienne au-dessus de la carte puis
 *  descente fluide (GSAP) jusqu'au niveau du hall, avant de rendre la main. */
function IntroCamera({ mode, onArrived }: { mode: Mode; onArrived: () => void }) {
  const { camera } = useThree();
  const started = useRef(false);
  useEffect(() => {
    if (mode !== 'entering' || started.current) return;
    started.current = true;
    const from = new THREE.Vector3(0, 40, 0.01);
    const to = new THREE.Vector3(0, 5, 17.5);
    camera.position.copy(from);
    camera.lookAt(0, 1.6, 0);
    const proxy = { t: 0 };
    gsap.to(proxy, {
      t: 1, duration: 3.8, ease: 'power2.inOut',
      onUpdate: () => { camera.position.lerpVectors(from, to, proxy.t); camera.lookAt(0, 1.6, 0); },
      onComplete: onArrived,
    });
  }, [mode, camera, onArrived]);
  return null;
}

export default function LostChapterExperience() {
  const [mode, setMode] = useState<Mode>('intro');
  const [zone, setZone] = useState<string | null>(null);
  const [, setHover] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 bg-black">
      <Canvas
        shadows dpr={[1, 2]} gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ fov: 60, near: 0.1, far: 600, position: [0, 40, 0.01] }}
        onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 0.78; gl.setClearColor('#05060a'); }}
      >
        <fog attach="fog" args={['#06070c', 24, 95]} />
        <CentralHall onSelect={setZone} onHover={setHover} />
        <IntroCamera mode={mode} onArrived={() => setMode('hall')} />
        {mode === 'hall' && (
          <OrbitControls
            makeDefault enablePan={false} enableDamping dampingFactor={0.08}
            target={[0, 2, 0]} minDistance={6} maxDistance={28}
            minPolarAngle={Math.PI * 0.18} maxPolarAngle={Math.PI * 0.52}
            rotateSpeed={0.5} zoomSpeed={0.7}
          />
        )}
        <EffectComposer>
          <Bloom intensity={1.15} luminanceThreshold={0.2} luminanceSmoothing={0.4} mipmapBlur />
          <BrightnessContrast brightness={-0.02} contrast={0.1} />
          <Noise opacity={0.045} blendFunction={BlendFunction.OVERLAY} premultiply />
          <Vignette eskil={false} offset={0.2} darkness={0.92} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
      </Canvas>

      {mode === 'intro' && <CinematicIntro onEnter={() => setMode('entering')} />}
      <ZoneOverlay zoneId={zone} onClose={() => setZone(null)} />
    </div>
  );
}
