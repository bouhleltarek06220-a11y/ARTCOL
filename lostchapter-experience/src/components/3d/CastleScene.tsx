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
import { DungeonHall } from './DungeonHall';
import { useIsMobile } from '../../lib/useIsMobile';
import { useExperience } from '../../store';

// Choix de l'environnement selon l'URL de déploiement :
//   /experience-v3 → salle de donjon modulaire KayKit
//   sinon          → atrium Sponza
const USE_DUNGEON = import.meta.env.BASE_URL.includes('v3');

// OrbitControls verrouillés dans la boîte de l'atrium Sponza ×1.4 :
// target.x [-7, 7], target.y [1.2, 11], target.z [-46, -6]
function ClampedOrbitControls() {
  const ref = useRef<any>(null);
  useFrame(() => {
    const c = ref.current;
    if (!c?.target) return;
    const t = c.target as THREE.Vector3;
    t.x = Math.max(-7, Math.min(7, t.x));
    t.y = Math.max(1.2, Math.min(11, t.y));
    t.z = Math.max(-46, Math.min(-6, t.z));
  });
  return (
    <OrbitControls
      ref={ref}
      makeDefault
      target={[0, 3, -30]}
      enablePan
      enableRotate
      enableZoom
      enableDamping
      dampingFactor={0.08}
      minDistance={4}
      maxDistance={32}
      minPolarAngle={Math.PI * 0.1}
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

// Corridor d'arches gothiques en pierre qui prolonge la porte vers le hall Sponza.
// Évite que la caméra traverse du vide / des murs entre l'extérieur et l'intérieur.
function EntranceCorridor({ mobile }: { mobile: boolean }) {
  const stoneCorridor = { color: '#4a3828', roughness: 0.92, metalness: 0.04 };
  const stoneArch = { color: '#3a2a1c', roughness: 0.92 };

  // 4 arches gothiques alignées entre z=-1.2 et z=-5.4 (juste avant Sponza)
  const zs = [-1.2, -2.6, -4.0, -5.4];

  return (
    <group>
      {/* Sol en pierre du corridor — couvre la zone z=0 à z=-6 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -3]} receiveShadow>
        <planeGeometry args={[5.2, 7]} />
        <meshStandardMaterial color="#3d2e20" roughness={0.92} metalness={0.04} />
      </mesh>
      {/* Tapis royal rouge qui mène à l'intérieur (continuité visuelle) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, -3]} receiveShadow>
        <planeGeometry args={[2.8, 6.6]} />
        <meshStandardMaterial color="#5a1a1a" roughness={0.92} metalness={0.06} />
      </mesh>
      {[-1.5, 1.5].map((s) => (
        <mesh key={`c-edge-${s}`} rotation={[-Math.PI / 2, 0, 0]} position={[s, 0.014, -3]}>
          <planeGeometry args={[0.1, 6.6]} />
          <meshStandardMaterial color="#c99b5c" metalness={0.9} roughness={0.45} />
        </mesh>
      ))}

      {/* Plafond voûté entre les arches (cache le ciel HDR vu d'en-dessous) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 8.5, -3]}>
        <planeGeometry args={[5.2, 7]} />
        <meshStandardMaterial color="#1f160f" roughness={1} />
      </mesh>

      {/* Murs latéraux du corridor (à l'extérieur des arches) — cachent le décor à travers */}
      {[-1, 1].map((s) => (
        <mesh key={`c-wall-${s}`} rotation={[0, s * Math.PI / 2, 0]} position={[s * 2.6, 4.25, -3]}>
          <planeGeometry args={[7, 8.5]} />
          <meshStandardMaterial color="#3a2a1c" roughness={0.95} />
        </mesh>
      ))}

      {/* 4 arches gothiques en plein cintre alignées */}
      {zs.map((z) => (
        <group key={z} position={[0, 0, z]}>
          {/* Jambage gauche */}
          <mesh position={[-2.45, 3.5, 0]} castShadow={!mobile} receiveShadow>
            <boxGeometry args={[0.45, 7, 0.55]} />
            <meshStandardMaterial {...stoneCorridor} />
          </mesh>
          {/* Jambage droit */}
          <mesh position={[2.45, 3.5, 0]} castShadow={!mobile} receiveShadow>
            <boxGeometry args={[0.45, 7, 0.55]} />
            <meshStandardMaterial {...stoneCorridor} />
          </mesh>
          {/* Arc en plein cintre */}
          <mesh position={[0, 7, 0]}>
            <ringGeometry args={[2.25, 2.75, 32, 1, 0, Math.PI]} />
            <meshStandardMaterial {...stoneArch} side={THREE.DoubleSide} />
          </mesh>
          {/* Clé de voûte centrale */}
          <mesh position={[0, 9.2, 0]} castShadow={!mobile}>
            <boxGeometry args={[0.6, 0.4, 0.5]} />
            <meshStandardMaterial {...stoneArch} />
          </mesh>
        </group>
      ))}

      {/* Petite lumière chaude qui se promène dans le corridor */}
      <pointLight position={[0, 5, -3]} color="#ffb066" intensity={18} distance={10} decay={2} />
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
        // Active le clipping LOCAL (par-matériau) : utilisé par HallScene pour
        // cacher le mur court de Sponza qui ferme l'atrium côté entrée.
        gl.localClippingEnabled = true;
      }}
    >
      {/* ─── Environnement HDRI : ciel + terre visibles PARTOUT ─────────────
          environmentIntensity : pour le donjon (pierre sombre/crypte) on réduit
          fortement l'éclairage indirect du HDR plein-jour, sinon l'intérieur est
          surexposé et lavé. Le ciel reste lumineux (background) mais ce sont les
          torches qui éclairent la salle. Pour Sponza (atrium ouvert) on garde
          un éclairage plus généreux. */}
      <Environment
        files="/assets/hdr/landscape.exr"
        background
        blur={0.05}
        environmentIntensity={USE_DUNGEON ? 0.18 : 0.85}
      />
      {/* Fog atmosphérique chaud, très lointain, pour ne pas masquer le HDR */}
      <fog attach="fog" args={['#080604', USE_DUNGEON ? 26 : 90, USE_DUNGEON ? 130 : 320]} />
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
      {/* Corridor d'arches gothiques entre la porte et le hall : fait le passage
          architectural réaliste et empêche la caméra de traverser du vide. */}
      <EntranceCorridor mobile={mobile} />
      <Torch position={[-3.0, 4.0, 1.0]} />
      <Torch position={[3.0, 4.0, 1.0]} />
      {!mobile && <FloatingEmbers count={360} />}

      {/* Le hall (Sponza + portails + NPC + bannières) est rendu derrière la porte,
          il commence à se charger immédiatement et useProgress reflète son téléchargement. */}
      {!mobile && (
        <Suspense fallback={null}>{USE_DUNGEON ? <DungeonHall /> : <HallScene />}</Suspense>
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
