import { Suspense, useEffect, useRef } from 'react';
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
import { CathedralHall } from './CathedralHall';
import { GuidedTour } from './GuidedTour';
import { useIsMobile } from '../../lib/useIsMobile';
import { useExperience } from '../../store';

// Choix de l'environnement selon l'URL de déploiement :
//   /experience-v4 → cathédrale gothique (sanctuaire final)
//   /experience-v3 → salle de donjon modulaire KayKit
//   sinon          → atrium Sponza
const USE_CATHEDRAL = import.meta.env.BASE_URL.includes('v4');
const USE_DUNGEON = import.meta.env.BASE_URL.includes('v3');

// OrbitControls verrouillés dans la boîte de l'atrium Sponza ×1.4 :
// target.x [-7, 7], target.y [1.2, 11], target.z [-46, -6]
function ClampedOrbitControls() {
  const ref = useRef<any>(null);
  const focusPos = useExperience((s) => s.selectedCharacter?.pos ?? null);
  const tourPhase = useExperience((s) => s.tourPhase);
  const tourRunning = tourPhase === 'dungeon' || tourPhase === 'cathedral' || tourPhase === 'transition';
  // Snapshot temporaire pour lerper en douceur
  const focusTmp = useRef(new THREE.Vector3());
  const camTmp = useRef(new THREE.Vector3());
  useFrame(({ camera }) => {
    const c = ref.current;
    if (!c?.target) return;
    // Pendant la visite guidée, on laisse GuidedTour piloter intégralement la caméra.
    if (tourRunning) return;

    if (focusPos) {
      // ── Mode FOCUS PERSONNAGE ── cible le perso + zoom caméra à 2.5 m devant
      focusTmp.current.set(focusPos[0], focusPos[1] + 1.2, focusPos[2]);
      c.target.lerp(focusTmp.current, 0.12);
      // position caméra : à 2.5 m devant le perso et 0.5 m au-dessus
      camTmp.current.set(focusPos[0], focusPos[1] + 1.7, focusPos[2] + 2.5);
      camera.position.lerp(camTmp.current, 0.1);
      return;
    }

    const t = c.target as THREE.Vector3;
    t.x = Math.max(-7, Math.min(7, t.x));
    // On élargit le clamp vertical du donjon pour permettre de viser le livre dans le ciel (y=11).
    t.y = Math.max(1.2, Math.min(USE_CATHEDRAL ? 13 : 13, t.y));
    t.z = Math.max(USE_CATHEDRAL ? -60 : -46, Math.min(-2, t.z));
  });
  return (
    <OrbitControls
      ref={ref}
      makeDefault
      target={USE_CATHEDRAL ? [0, 3, -40] : [0, 3, -30]}
      enabled={!tourRunning}
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
  const skip = useExperience((s) => s.skip);

  // En mode cathédrale on saute directement la séquence porte/cinématique :
  // l'utilisateur arrive du donjon (via le dragon), on le pose dans la nef.
  useEffect(() => {
    if (USE_CATHEDRAL && phase !== 'inside') skip();
  }, [phase, skip]);

  return (
    <Canvas
      shadows={!mobile}
      dpr={[1, mobile ? 1.4 : 2]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={USE_CATHEDRAL
        ? { fov: 60, near: 0.1, far: 400, position: [0, 4, 0] }
        : { fov: 65, near: 0.1, far: 400, position: [0, 3, 18] }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        // Cathédrale : très sombre / cinéma cathédrale ;
        // Donjon : sombre ; Sponza : exposure normale.
        gl.toneMappingExposure = USE_CATHEDRAL ? 0.42 : USE_DUNGEON ? 0.45 : 0.95;
        gl.setClearColor('#080604');
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
        background={!USE_CATHEDRAL}
        blur={0.05}
        environmentIntensity={USE_CATHEDRAL ? 0.08 : USE_DUNGEON ? 0.18 : 0.85}
      />
      {/* Fog atmosphérique chaud, très lointain, pour ne pas masquer le HDR.
          Cathédrale : fog court & froid (atmosphère sacrée / encens). */}
      <fog
        attach="fog"
        args={USE_CATHEDRAL
          ? ['#1a1228', 14, 90]
          : USE_DUNGEON
            ? ['#080604', 26, 130]
            : ['#080604', 90, 320]}
      />
      <ambientLight intensity={0.22} color="#5a4632" />
      <hemisphereLight args={['#2d3a55', '#241509', 0.25]} />
      <directionalLight
        castShadow={!mobile}
        position={[18, 22, 16]}
        intensity={1.4}
        color="#ffd9a0"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={140}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-bias={-0.0005}
      />

      {/* TERRE : grand sol non éclairé (MeshBasic) → JAMAIS noir quelle que soit
          l'exposition/le fog. Teinte terre chaude de coucher de soleil, plante
          le château dans le paysage et comble tout le vide autour. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, -18]}>
        <planeGeometry args={[1200, 1200]} />
        <meshBasicMaterial color="#b9925b" toneMapped={false} fog={false} />
      </mesh>
      {/* Anneau d'herbe sèche plus foncé autour du château (transition douce) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, -18]}>
        <ringGeometry args={[14, 80, 64]} />
        <meshBasicMaterial color="#8c7242" toneMapped={false} fog={false} />
      </mesh>

      {/* En mode cathédrale on n'affiche ni l'extérieur, ni la porte d'entrée, ni
          le corridor : l'utilisateur arrive directement dans la nef sacrée. */}
      {!USE_CATHEDRAL && (
        <>
          <CastleExterior mobile={mobile} />
          <CastleGate />
          <EntranceCorridor mobile={mobile} />

          {/* ─── 2 FLAMBEAUX DE FAÇADE qui illuminent l'entrée du château ───
              Plantés de part et d'autre de la grande porte, légèrement
              en avant de la pierre, scale 1.7 pour la présence cinéma. */}
          <group position={[-3.4, 3.6, 1.6]} scale={1.7}>
            <Torch position={[0, 0, 0]} />
          </group>
          <group position={[3.4, 3.6, 1.6]} scale={1.7}>
            <Torch position={[0, 0, 0]} />
          </group>
          {/* Wash lumineux chaud qui baigne la porte + l'avant-cour */}
          <pointLight position={[-3.4, 3.0, 2.5]} color="#ffae62" intensity={55} distance={18} decay={2} />
          <pointLight position={[3.4, 3.0, 2.5]} color="#ffae62" intensity={55} distance={18} decay={2} />
          {/* Spot rasant qui dramatise le portail */}
          <spotLight
            position={[0, 7, 5]}
            target-position={[0, 2.5, 0]}
            color="#ffc88a"
            intensity={90}
            distance={14}
            angle={0.8}
            penumbra={0.85}
          />
        </>
      )}
      {!mobile && !USE_CATHEDRAL && <FloatingEmbers count={360} />}

      {/* Le hall principal (différent selon le déploiement). */}
      {!mobile && (
        <Suspense fallback={null}>
          {USE_CATHEDRAL ? (
            <CathedralHall />
          ) : USE_DUNGEON ? (
            <DungeonHall />
          ) : (
            <HallScene />
          )}
        </Suspense>
      )}

      <CinematicCamera />
      <GuidedTour />

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
