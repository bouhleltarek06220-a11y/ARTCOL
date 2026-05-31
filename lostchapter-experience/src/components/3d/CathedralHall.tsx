import { useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterGroup } from './CharacterGroup';
import { Brazier } from './Brazier';

// Cathédrale gothique inspirée de Šibenik : longue nef, voûtes très hautes
// (3 niveaux de murs), vitraux émissifs colorés, rayons de lumière colorée,
// autel central avec le "Chapitre Perdu" qui rayonne.
//
// Construite avec les pièces KayKit Dungeon Remastered qu'on a déjà au lieu
// de fetch un nouveau modèle : cohérence visuelle avec le donjon (/experience-v3)
// et zéro téléchargement supplémentaire.

const B = '/assets/dungeon';
const FLOOR = `${B}/floor_tile_large.gltf.glb`;
const FLOOR_R = `${B}/floor_tile_large_rocks.gltf.glb`;
const WALL = `${B}/wall.gltf.glb`;
const WALL_ARCH = `${B}/wall_archedwindow_open.gltf.glb`;
const COLUMN = `${B}/column.gltf.glb`;
const TORCH = `${B}/torch_mounted.gltf.glb`;
const BANNER = `${B}/banner_brown.gltf.glb`;

[FLOOR, FLOOR_R, WALL, WALL_ARCH, COLUMN, TORCH, BANNER].forEach((u) => useGLTF.preload(u));

const TILE = 4;

function Piece({
  url,
  position,
  rotationY = 0,
  scale = 1,
  tint,
}: {
  url: string;
  position: [number, number, number];
  rotationY?: number;
  scale?: number;
  tint?: number;
}) {
  const { scene } = useGLTF(url) as unknown as { scene: THREE.Group };
  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && m.material) {
        const orig = m.material as THREE.MeshStandardMaterial;
        const mat = (orig.isMeshStandardMaterial ? orig.clone() : new THREE.MeshStandardMaterial()) as THREE.MeshStandardMaterial;
        if ('envMapIntensity' in mat) mat.envMapIntensity = 0.15;
        mat.color.multiplyScalar(tint ?? 0.82);
        m.castShadow = true;
        m.receiveShadow = true;
        m.material = mat;
      }
    });
    return c;
  }, [scene, tint]);
  return <primitive object={cloned} position={position} rotation={[0, rotationY, 0]} scale={scale} />;
}

// Vitrail : rosace colorée émissive plaquée dans une ouverture de mur arched.
// Joue le rôle d'une fenêtre lumineuse de cathédrale.
function StainedGlass({
  position,
  rotationY = 0,
  color = '#c84a32',
  intensity = 2.4,
}: {
  position: [number, number, number];
  rotationY?: number;
  color?: string;
  intensity?: number;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Panneau émissif principal (rectangle d'ogive) */}
      <mesh>
        <planeGeometry args={[2.6, 3.4]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={intensity}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Croisillon de plomb (croix centrale) */}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[0.12, 3.4]} />
        <meshBasicMaterial color="#1a0f08" side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[2.6, 0.12]} />
        <meshBasicMaterial color="#1a0f08" side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
}

// Rayon de lumière colorée (god ray) tombant en oblique depuis un vitrail.
// Cône long et étroit en mode additif, jouera avec le bloom de la postpro.
function LightShaft({
  origin,
  color,
}: {
  origin: [number, number, number];
  color: string;
}) {
  return (
    <mesh position={[origin[0] * 0.55, origin[1] - 3, origin[2]]} rotation={[0, 0, Math.sign(origin[0]) * 0.35]}>
      <coneGeometry args={[1.6, 9, 24, 1, true]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.18}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

// Autel + livre 3D du Chapitre Perdu posé dessus. Cliquable → soutenance.
function Altar() {
  const bookRef = useRef<THREE.Group>(null);
  const { scene: bookScene } = useGLTF('/assets/characters/custom/Book.glb') as unknown as { scene: THREE.Group };
  const book = useMemo(() => {
    const c = bookScene.clone(true);
    c.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && m.material) {
        const orig = m.material as THREE.MeshStandardMaterial;
        const mat = (orig.isMeshStandardMaterial ? orig.clone() : new THREE.MeshStandardMaterial()) as THREE.MeshStandardMaterial;
        // Coup d'éclat doré pour qu'il brille comme une relique sacrée
        mat.emissive = new THREE.Color('#ffb066');
        mat.emissiveIntensity = 0.35;
        if ('envMapIntensity' in mat) mat.envMapIntensity = 0.4;
        m.castShadow = true;
        m.receiveShadow = true;
        m.material = mat;
      }
    });
    return c;
  }, [bookScene]);

  useFrame(({ clock }) => {
    if (bookRef.current) {
      bookRef.current.position.y = 2.0 + Math.sin(clock.elapsedTime * 0.6) * 0.015;
    }
  });

  const open = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    window.open('/Soutenance.html', '_blank', 'noopener');
  };
  const hover = () => (document.body.style.cursor = 'pointer');
  const unhover = () => (document.body.style.cursor = 'default');

  return (
    <group position={[0, 0, -58]}>
      {/* Marches (3 degrés) */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 0.1 + i * 0.2, i * 0.6]} receiveShadow castShadow>
          <boxGeometry args={[6 - i * 1.2, 0.2, 1.2]} />
          <meshStandardMaterial color="#5a4838" roughness={0.92} />
        </mesh>
      ))}
      {/* Bloc autel central */}
      <mesh position={[0, 1.1, -0.5]} receiveShadow castShadow>
        <boxGeometry args={[2.6, 1.6, 1.4]} />
        <meshStandardMaterial color="#6a5640" roughness={0.85} metalness={0.08} />
      </mesh>
      {/* Drap rouge */}
      <mesh position={[0, 1.91, -0.5]}>
        <boxGeometry args={[2.8, 0.04, 1.6]} />
        <meshStandardMaterial color="#7a1f1f" roughness={0.85} />
      </mesh>

      {/* Livre 3D posé sur l'autel (fermé), légèrement flottant, cliquable */}
      <group
        ref={bookRef}
        position={[0, 2.0, -0.5]}
        scale={1.2}
        onClick={open}
        onPointerOver={hover}
        onPointerOut={unhover}
      >
        <primitive object={book} />
      </group>

      {/* Halo doré au-dessus du livre pour le mettre en valeur */}
      <pointLight position={[0, 3, -0.5]} color="#ffd9a0" intensity={40} distance={18} decay={2} />

      {/* Chandeliers */}
      {[-2.0, 2.0].map((x) => (
        <group key={x} position={[x, 1.9, -0.5]}>
          <mesh>
            <cylinderGeometry args={[0.05, 0.07, 0.7, 8]} />
            <meshStandardMaterial color="#d4b06a" metalness={0.9} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.4, 0]}>
            <coneGeometry args={[0.08, 0.18, 12]} />
            <meshStandardMaterial color="#ff9d4d" emissive="#ffb066" emissiveIntensity={2.2} toneMapped={false} />
          </mesh>
          <pointLight position={[0, 0.5, 0]} color="#ffb066" intensity={6} distance={6} decay={2} />
        </group>
      ))}
    </group>
  );
}
useGLTF.preload('/assets/characters/custom/Book.glb');

// Banc d'église (low-poly) : siège + dossier en bois sombre.
function Pew({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.18, 0.55]} />
        <meshStandardMaterial color="#4a2f1c" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.4, -0.22]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.55, 0.08]} />
        <meshStandardMaterial color="#3a2412" roughness={0.85} />
      </mesh>
      {/* Pieds */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.95, -0.2, 0]} castShadow>
          <boxGeometry args={[0.1, 0.4, 0.55]} />
          <meshStandardMaterial color="#2a1810" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

export function CathedralHall() {
  // Nef très longue : 15 rangées (× TILE = 60 unités de profondeur)
  const cols = useMemo(() => [-8, -4, 0, 4, 8], []);
  const rows = useMemo(
    () => [-2, -6, -10, -14, -18, -22, -26, -30, -34, -38, -42, -46, -50, -54, -58],
    [],
  );
  const X_LEFT = -10;
  const X_RIGHT = 10;
  const Z_BACK = -60;

  // Couleurs des vitraux le long de la nef (alternance bleu / rouge / or)
  const glassColors = ['#3a78d8', '#c84a32', '#e8b850', '#3a78d8', '#c84a32', '#7a3ac8', '#e8b850'];

  return (
    <group>
      {/* ─── SOL en grand format pierre ─── */}
      {cols.map((x) =>
        rows.map((z, ri) => (
          <Piece
            key={`f-${x}-${z}`}
            url={(x + z) % 12 === 0 ? FLOOR_R : FLOOR}
            position={[x, 0, z]}
            rotationY={(ri % 2) * Math.PI / 2}
          />
        )),
      )}

      {/* ─── Tapis rouge royal qui mène à l'autel ─── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.09, -30]} receiveShadow>
        <planeGeometry args={[3.4, 58]} />
        <meshStandardMaterial color="#6a1818" roughness={0.92} metalness={0.06} />
      </mesh>
      {/* Liserés dorés du tapis */}
      {[-1.65, 1.65].map((s) => (
        <mesh key={`carpet-${s}`} rotation={[-Math.PI / 2, 0, 0]} position={[s, 0.1, -30]}>
          <planeGeometry args={[0.08, 58]} />
          <meshStandardMaterial color="#c99b5c" metalness={0.85} roughness={0.4} />
        </mesh>
      ))}

      {/* ─── MURS LATÉRAUX 3 NIVEAUX (nef très haute, style cathédrale) ─── */}
      {rows.map((z, ri) => {
        const isGlassRow = ri % 2 === 1 && ri >= 1 && ri <= 13;
        const glassIdx = Math.floor((ri - 1) / 2);
        const col = glassColors[glassIdx % glassColors.length];
        return (
          <group key={`wl-${z}`}>
            {/* base (0) */}
            <Piece url={WALL} position={[X_LEFT, 0, z]} rotationY={Math.PI / 2} />
            <Piece url={WALL} position={[X_RIGHT, 0, z]} rotationY={-Math.PI / 2} />
            {/* milieu (4) : arche ouverte + vitrail derrière */}
            <Piece url={WALL_ARCH} position={[X_LEFT, TILE, z]} rotationY={Math.PI / 2} />
            <Piece url={WALL_ARCH} position={[X_RIGHT, TILE, z]} rotationY={-Math.PI / 2} />
            {isGlassRow && (
              <>
                <StainedGlass position={[X_LEFT - 0.05, TILE + 1.7, z]} rotationY={Math.PI / 2} color={col} />
                <StainedGlass position={[X_RIGHT + 0.05, TILE + 1.7, z]} rotationY={-Math.PI / 2} color={col} />
                {/* Spot coloré qui projette la lumière dans la nef */}
                <spotLight
                  position={[X_LEFT - 1, TILE + 4, z]}
                  target-position={[X_LEFT + 5, 0.5, z]}
                  color={col}
                  intensity={70}
                  distance={20}
                  angle={0.55}
                  penumbra={0.7}
                />
                <spotLight
                  position={[X_RIGHT + 1, TILE + 4, z]}
                  target-position={[X_RIGHT - 5, 0.5, z]}
                  color={col}
                  intensity={70}
                  distance={20}
                  angle={0.55}
                  penumbra={0.7}
                />
                {/* Rayons visibles (volumétriques additifs) */}
                <LightShaft origin={[X_LEFT, TILE + 4, z]} color={col} />
                <LightShaft origin={[X_RIGHT, TILE + 4, z]} color={col} />
              </>
            )}
            {/* clerestory (haut) : étage supérieur arché */}
            <Piece url={WALL_ARCH} position={[X_LEFT, TILE * 2, z]} rotationY={Math.PI / 2} />
            <Piece url={WALL_ARCH} position={[X_RIGHT, TILE * 2, z]} rotationY={-Math.PI / 2} />
          </group>
        );
      })}

      {/* ─── MUR DU FOND (3 niveaux, base pleine + 2 niveaux d'arches) ─── */}
      {cols.map((x) => (
        <group key={`wb-${x}`}>
          <Piece url={WALL} position={[x, 0, Z_BACK]} rotationY={0} />
          <Piece url={WALL_ARCH} position={[x, TILE, Z_BACK]} rotationY={0} />
          <Piece url={WALL_ARCH} position={[x, TILE * 2, Z_BACK]} rotationY={0} />
        </group>
      ))}

      {/* ─── MUR D'ENTRÉE (façade, 3 niveaux + ouverture centrale = porte de retour) ─── */}
      {cols.map((x) => {
        const isDoorCol = x === 0;
        return (
          <group key={`we-${x}`}>
            {!isDoorCol && <Piece url={WALL} position={[x, 0, 2]} rotationY={Math.PI} />}
            <Piece url={WALL_ARCH} position={[x, TILE, 2]} rotationY={Math.PI} />
            <Piece url={WALL_ARCH} position={[x, TILE * 2, 2]} rotationY={Math.PI} />
          </group>
        );
      })}

      {/* ─── COLONNES géantes (paire à chaque rangée paire) ─── */}
      {rows.filter((_, i) => i % 2 === 0).map((z) => (
        <group key={`col-${z}`}>
          <Piece url={COLUMN} position={[X_LEFT + 0.9, 0, z]} scale={1.6} />
          <Piece url={COLUMN} position={[X_LEFT + 0.9, TILE, z]} scale={1.6} />
          <Piece url={COLUMN} position={[X_RIGHT - 0.9, 0, z]} scale={1.6} />
          <Piece url={COLUMN} position={[X_RIGHT - 0.9, TILE, z]} scale={1.6} />
        </group>
      ))}

      {/* ─── BANCS d'église alignés sur la nef ─── */}
      {[-22, -18, -14, -10, -6].map((z) => (
        <group key={`pews-${z}`}>
          <Pew position={[-4.2, 0.3, z]} />
          <Pew position={[4.2, 0.3, z]} />
        </group>
      ))}

      {/* ─── TORCHES murales ─── */}
      {rows.filter((_, i) => i % 2 === 0).map((z) => (
        <group key={`t-${z}`}>
          <Piece url={TORCH} position={[X_LEFT + 0.55, 2.6, z]} rotationY={-Math.PI / 2} />
          <Piece url={TORCH} position={[X_RIGHT - 0.55, 2.6, z]} rotationY={Math.PI / 2} />
          <pointLight position={[X_LEFT + 1.4, 2.9, z]} color="#ff9d4d" intensity={5} distance={9} decay={2} />
          <pointLight position={[X_RIGHT - 1.4, 2.9, z]} color="#ff9d4d" intensity={5} distance={9} decay={2} />
        </group>
      ))}

      {/* ─── Bannières religieuses ─── */}
      <Piece url={BANNER} position={[X_LEFT + 0.6, 5.5, -50]} rotationY={-Math.PI / 2} scale={1.4} />
      <Piece url={BANNER} position={[X_RIGHT - 0.6, 5.5, -50]} rotationY={Math.PI / 2} scale={1.4} />
      <Piece url={BANNER} position={[X_LEFT + 0.6, 5.5, -34]} rotationY={-Math.PI / 2} scale={1.4} />
      <Piece url={BANNER} position={[X_RIGHT - 0.6, 5.5, -34]} rotationY={Math.PI / 2} scale={1.4} />

      {/* ─── Éclairage d'ambiance ─── */}
      <ambientLight intensity={0.18} color="#3a3045" />
      <hemisphereLight args={['#4a5a78', '#1a0f08', 0.3]} />
      {/* Lumière divine descendant sur l'autel */}
      <spotLight
        position={[0, 14, -55]}
        target-position={[0, 1, -58]}
        color="#ffeac4"
        intensity={420}
        distance={26}
        angle={0.45}
        penumbra={0.55}
      />

      {/* ─── Braseros & autel ─── */}
      <Brazier position={[-5, 0, -55]} />
      <Brazier position={[5, 0, -55]} />
      <Altar />

      {/* ─── Équipe présente comme témoins, sans dragon ─── */}
      <CharacterGroup showDragon={false} />
    </group>
  );
}
