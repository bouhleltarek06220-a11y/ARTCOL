import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ToneMapping, Noise, BrightnessContrast } from '@react-three/postprocessing';
import { ToneMappingMode, BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { CentralHall } from './CentralHall';
import { CinematicIntro } from './CinematicIntro';
import { ZoneOverlay } from './ZoneOverlay';

type Mode = 'intro' | 'entering' | 'hall';

const HALL_VIEW = new THREE.Vector3(0, 12, 20.5);
const AERIAL = new THREE.Vector3(0, 40, 0.01);
const DUR = 3.6;

function easeInOut(k: number) { return k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; }

/** Descente cinématique pilotée par la boucle R3F (fiable partout) :
 *  plongée aérienne → vue 3/4 du hall, puis on rend la main aux OrbitControls. */
function IntroCamera({ mode, onArrived }: { mode: Mode; onArrived: () => void }) {
  const { camera } = useThree();
  const t = useRef(0);
  useFrame((_, dt) => {
    if (mode !== 'entering') return;
    t.current = Math.min(t.current + dt, DUR);
    camera.position.lerpVectors(AERIAL, HALL_VIEW, easeInOut(t.current / DUR));
    camera.lookAt(0, 1.2, 0);
    if (t.current >= DUR) onArrived();
  });
  // Filet de sécurité : si on arrive au hall sans descente, on se cale bien.
  useEffect(() => {
    if (mode === 'hall' && t.current < DUR) { camera.position.copy(HALL_VIEW); camera.lookAt(0, 1.2, 0); }
  }, [mode, camera]);
  return null;
}

export default function LostChapterExperience() {
  const [mode, setMode] = useState<Mode>('intro');
  const [zone, setZone] = useState<string | null>(null);
  const [, setHover] = useState<string | null>(null);
  const initialCam = useMemo(() => [AERIAL.x, AERIAL.y, AERIAL.z] as [number, number, number], []);

  return (
    <div className="fixed inset-0 bg-black">
      <Canvas
        shadows dpr={[1, 2]} gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ fov: 60, near: 0.1, far: 600, position: initialCam }}
        onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 0.8; gl.setClearColor('#05060a'); }}
      >
        <fog attach="fog" args={['#06070c', 26, 100]} />
        <CentralHall onSelect={setZone} onHover={setHover} />
        <IntroCamera mode={mode} onArrived={() => setMode('hall')} />
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

      {mode === 'intro' && <CinematicIntro onEnter={() => setMode('entering')} />}
      <ZoneOverlay zoneId={zone} onClose={() => setZone(null)} />
    </div>
  );
}
