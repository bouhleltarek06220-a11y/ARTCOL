import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ToneMapping, Noise, BrightnessContrast } from '@react-three/postprocessing';
import { ToneMappingMode, BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { CentralHall } from './CentralHall';
import { CinematicIntro } from './CinematicIntro';
import { CastleVisit } from './CastleVisit';
import { ZoneOverlay } from './ZoneOverlay';

type Mode = 'intro' | 'visiting' | 'hall';
const HALL_VIEW: [number, number, number] = [0, 12, 20.5];

export default function LostChapterExperience() {
  const [mode, setMode] = useState<Mode>('intro');
  const [zone, setZone] = useState<string | null>(null);
  const [, setHover] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 bg-black">
      <Canvas
        shadows dpr={[1, 2]} gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ fov: 60, near: 0.1, far: 600, position: HALL_VIEW }}
        onCreated={({ gl, camera }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.8;
          gl.setClearColor('#05060a');
          camera.lookAt(0, 1.2, 0);
        }}
      >
        <fog attach="fog" args={['#06070c', 26, 100]} />
        <CentralHall onSelect={setZone} onHover={setHover} />
        {mode === 'hall' && (
          <OrbitControls
            makeDefault enablePan={false} enableDamping dampingFactor={0.08}
            target={[0, 1.2, 0]} minDistance={8} maxDistance={32}
            minPolarAngle={Math.PI * 0.14} maxPolarAngle={Math.PI * 0.5}
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

      {mode === 'intro' && <CinematicIntro onEnter={() => setMode('visiting')} />}
      {mode === 'visiting' && <CastleVisit onDone={() => setMode('hall')} />}
      <ZoneOverlay zoneId={zone} onClose={() => setZone(null)} />
    </div>
  );
}
