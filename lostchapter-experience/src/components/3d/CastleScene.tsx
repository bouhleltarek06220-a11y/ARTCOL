import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { CastleGate } from './CastleGate';
import { CinematicCamera } from './CinematicCamera';
import { TorchLight } from './TorchLight';
import { FloatingEmbers } from './FloatingEmbers';
import { useIsMobile } from '../../lib/useIsMobile';

const stoneMat = { color: '#3a2a1d', roughness: 0.95, metalness: 0.05 };
const darkStoneMat = { color: '#271a11', roughness: 1 };

// Massing blockout du château (sera remplacé par un modèle réaliste sourcé en phase ultérieure).
function Castle({ mobile }: { mobile: boolean }) {
  const merlons = [];
  for (let x = -8; x <= 8; x += 1.7) {
    merlons.push(
      <mesh key={x} position={[x, 9.5, 0]} castShadow={!mobile}>
        <boxGeometry args={[0.85, 1, 2.4]} />
        <meshStandardMaterial {...darkStoneMat} />
      </mesh>,
    );
  }
  return (
    <group>
      {/* sol */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#130b05" roughness={1} />
      </mesh>

      {/* murs + linteau (porche central laissé ouvert) */}
      <mesh position={[-5.1, 4.5, 0]} castShadow={!mobile} receiveShadow>
        <boxGeometry args={[5.8, 9, 2.4]} />
        <meshStandardMaterial {...stoneMat} />
      </mesh>
      <mesh position={[5.1, 4.5, 0]} castShadow={!mobile} receiveShadow>
        <boxGeometry args={[5.8, 9, 2.4]} />
        <meshStandardMaterial {...stoneMat} />
      </mesh>
      <mesh position={[0, 7.5, 0]} castShadow={!mobile}>
        <boxGeometry args={[5.2, 3, 2.4]} />
        <meshStandardMaterial {...stoneMat} />
      </mesh>
      {merlons}

      {/* tours + toits coniques */}
      {[-8, 8].map((tx) => (
        <group key={tx}>
          <mesh position={[tx, 6, 0]} castShadow={!mobile} receiveShadow>
            <cylinderGeometry args={[1.7, 1.9, 12, 24]} />
            <meshStandardMaterial {...stoneMat} />
          </mesh>
          <mesh position={[tx, 13.7, 0]} castShadow={!mobile}>
            <coneGeometry args={[2.3, 3.4, 24]} />
            <meshStandardMaterial {...darkStoneMat} />
          </mesh>
        </group>
      ))}

      {/* lueur chaude derrière le porche (jaillit quand les portes s'ouvrent) */}
      <pointLight position={[0, 3, -4]} color="#ffcf8a" intensity={45} distance={26} decay={2} />
      <mesh position={[0, 3, -1.4]}>
        <planeGeometry args={[4.4, 6]} />
        <meshBasicMaterial color="#ffcf8a" transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

export function CastleScene() {
  const mobile = useIsMobile();
  return (
    <Canvas
      shadows={!mobile}
      dpr={[1, mobile ? 1.4 : 2]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ fov: 58, near: 0.1, far: 400, position: [0, 3, 18] }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.95;
        gl.setClearColor('#0a0705');
      }}
    >
      <fog attach="fog" args={['#0a0705', 14, 60]} />
      <ambientLight intensity={0.35} color="#5a4632" />
      <hemisphereLight args={['#33415e', '#2a1a0d', 0.3]} />
      <directionalLight
        castShadow={!mobile}
        position={[16, 26, 10]}
        intensity={1.0}
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
      <Castle mobile={mobile} />
      <CastleGate />
      <TorchLight position={[-3.4, 4, 2.2]} />
      <TorchLight position={[3.4, 4, 2.2]} />
      {!mobile && <FloatingEmbers count={420} />}
      <CinematicCamera />
    </Canvas>
  );
}
