import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { CharacterGroup } from './CharacterGroup';
import { Brazier } from './Brazier';
import { ChapterDoor } from './ChapterDoor';
import { FloatingBook } from './FloatingBook';
import { FlickerLight, WindowGlow, GodRayShaft } from './Atmosphere';
import { zones } from '../../data/zones';

// Pack KayKit Dungeon Remastered (CC0) — pièces modulaires sur grille de 4 unités.
const B = '/assets/dungeon';
const FLOOR = `${B}/floor_tile_large.gltf.glb`;
const FLOOR_R = `${B}/floor_tile_large_rocks.gltf.glb`;
const WALL = `${B}/wall.gltf.glb`;
const WALL_ARCH = `${B}/wall_archedwindow_open.gltf.glb`;
const WALL_DOOR = `${B}/wall_doorway.glb`;
const COLUMN = `${B}/column.gltf.glb`;
const TORCH = `${B}/torch_mounted.gltf.glb`;
const BANNER = `${B}/banner_brown.gltf.glb`;

[FLOOR, FLOOR_R, WALL, WALL_ARCH, WALL_DOOR, COLUMN, TORCH, BANNER].forEach((u) => useGLTF.preload(u));

const TILE = 4; // taille d'une dalle / largeur d'un mur

// Petit composant : clone le GLB (mesh statique → scene.clone suffit, pas de squelette).
function Piece({
  url,
  position,
  rotationY = 0,
  scale = 1,
}: {
  url: string;
  position: [number, number, number];
  rotationY?: number;
  scale?: number;
}) {
  const { scene } = useGLTF(url) as unknown as { scene: THREE.Group };
  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
        // Clone le matériau (sinon on modifie toutes les instances) et coupe
        // l'IBL HDR (sinon le ciel plein-jour lave la pierre KayKit).
        if (m.material) {
          const orig = m.material as THREE.MeshStandardMaterial;
          const mat = (orig.isMeshStandardMaterial ? orig.clone() : new THREE.MeshStandardMaterial()) as THREE.MeshStandardMaterial;
          if ('envMapIntensity' in mat) mat.envMapIntensity = 0.12;
          mat.color.multiplyScalar(0.78); // assombrir légèrement la teinte
          m.material = mat;
        }
      }
    });
    return c;
  }, [scene]);
  return <primitive object={cloned} position={position} rotation={[0, rotationY, 0]} scale={scale} />;
}

// Salle de donjon : grille 5 (X) × 9 (Z), murs 2 niveaux (8 de haut), open-top
// pour laisser voir le ciel HDR. Plus sombre / cryptique que Sponza.
export function DungeonHall() {
  // Centres des dalles
  const cols = useMemo(() => [-8, -4, 0, 4, 8], []);          // X : 5 dalles, intérieur [-10,10]
  const rows = useMemo(() => [-2, -6, -10, -14, -18, -22, -26, -30, -34], []); // Z : 9 dalles
  const X_LEFT = -10;
  const X_RIGHT = 10;
  const Z_BACK = -36;

  return (
    <group>
      {/* ─── SOL ───────────────────────────── */}
      {cols.map((x) =>
        rows.map((z, ri) => (
          <Piece
            key={`f-${x}-${z}`}
            url={(x + z) % 8 === 0 ? FLOOR_R : FLOOR}
            position={[x, 0, z]}
            rotationY={(ri % 2) * Math.PI / 2}
          />
        )),
      )}

      {/* ─── TAPIS rouge central (continuité avec l'entrée) ─── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, -18]} receiveShadow>
        <planeGeometry args={[3.2, 34]} />
        <meshStandardMaterial color="#5a1a1a" roughness={0.92} metalness={0.05} />
      </mesh>

      {/* ─── MURS LATÉRAUX (2 niveaux) ─── */}
      {rows.map((z) => {
        const isDoorRow = z === -10 || z === -18 || z === -26;
        return (
          <group key={`wl-${z}`}>
            {/* gauche : porte si door-row, sinon mur plein */}
            {!isDoorRow && <Piece url={WALL} position={[X_LEFT, 0, z]} rotationY={Math.PI / 2} />}
            <Piece url={WALL_ARCH} position={[X_LEFT, TILE, z]} rotationY={Math.PI / 2} />
            {/* droite */}
            {!isDoorRow && <Piece url={WALL} position={[X_RIGHT, 0, z]} rotationY={-Math.PI / 2} />}
            <Piece url={WALL_ARCH} position={[X_RIGHT, TILE, z]} rotationY={-Math.PI / 2} />
          </group>
        );
      })}

      {/* ─── MUR DU FOND (2 niveaux, ouvertures pour portes en x=-4,0,4) ─── */}
      {cols.map((x) => {
        const isDoorCol = x === -4 || x === 0 || x === 4;
        return (
          <group key={`wb-${x}`}>
            {!isDoorCol && <Piece url={WALL} position={[x, 0, Z_BACK]} rotationY={0} />}
            <Piece url={WALL} position={[x, TILE, Z_BACK]} rotationY={0} />
          </group>
        );
      })}

      {/* ─── LES 9 VRAIES PORTES ───
          Délais de reveal calibrés sur les waypoints du GuidedTour : la caméra
          regarde d'abord le fond, pivote à droite, puis à gauche, puis revient. */}
      {/* Fond (zones 0-2) — révélées en premier (camera spawn face au fond) */}
      {[-4, 0, 4].map((x, i) => {
        const delays = [0.4, 0.8, 1.2];
        return zones[i] ? <ChapterDoor key={`db-${i}`} zone={zones[i]} position={[x, 0, Z_BACK]} rotationY={0} revealDelay={delays[i]} /> : null;
      })}
      {/* Droite (zones 6-8) — révélées pendant le pan vers la droite (~3s) */}
      {[-10, -18, -26].map((z, i) => {
        const delays = [2.8, 3.4, 4.0];
        return zones[i + 6] ? <ChapterDoor key={`dr-${i}`} zone={zones[i + 6]} position={[X_RIGHT, 0, z]} rotationY={-Math.PI / 2} revealDelay={delays[i]} /> : null;
      })}
      {/* Gauche (zones 3-5) — révélées pendant le pan vers la gauche (~5-7s) */}
      {[-10, -18, -26].map((z, i) => {
        const delays = [5.4, 6.0, 6.6];
        return zones[i + 3] ? <ChapterDoor key={`dl-${i}`} zone={zones[i + 3]} position={[X_LEFT, 0, z]} rotationY={Math.PI / 2} revealDelay={delays[i]} /> : null;
      })}

      {/* ─── COLONNES le long des murs (sauf devant les portes latérales) ─── */}
      {rows.filter((_, i) => i % 2 === 0).map((z) => {
        const isDoorRow = z === -10 || z === -18 || z === -26;
        if (isDoorRow) return null; // pas de colonne devant une porte
        return (
          <group key={`col-${z}`}>
            <Piece url={COLUMN} position={[X_LEFT + 0.9, 0, z]} scale={1.6} />
            <Piece url={COLUMN} position={[X_RIGHT - 0.9, 0, z]} scale={1.6} />
          </group>
        );
      })}

      {/* ─── TORCHES murales + lumière chaude ─── */}
      {rows.filter((_, i) => i % 2 === 1).map((z, i) => (
        <group key={`t-${z}`}>
          <Piece url={TORCH} position={[X_LEFT + 0.55, 2.6, z]} rotationY={-Math.PI / 2} />
          <Piece url={TORCH} position={[X_RIGHT - 0.55, 2.6, z]} rotationY={Math.PI / 2} />
          <FlickerLight position={[X_LEFT + 1.4, 2.9, z]} base={9} amp={4} distance={11} />
          <FlickerLight position={[X_RIGHT - 1.4, 2.9, z]} base={9} amp={4} distance={11} />
        </group>
      ))}

      {/* ─── Lueur chaude derrière les fenêtres en ogive (jour dehors) ─── */}
      {rows.map((z) => (
        <group key={`win-${z}`}>
          <WindowGlow position={[X_LEFT - 0.35, 6, z]} rotationY={Math.PI / 2} />
          <WindowGlow position={[X_RIGHT + 0.35, 6, z]} rotationY={-Math.PI / 2} />
        </group>
      ))}
      {/* ─── Rais de lumière (god rays) côté soleil, plongeant vers la nef ─── */}
      {[-6, -14, -22, -30].map((z) => (
        <GodRayShaft key={`ray-${z}`} from={[9.4, 7, z]} to={[1.2, 0.1, z + 1.5]} />
      ))}

      {/* ─── BANNIÈRES ─── */}
      <Piece url={BANNER} position={[X_LEFT + 0.6, 5.5, -12]} rotationY={-Math.PI / 2} scale={1.4} />
      <Piece url={BANNER} position={[X_RIGHT - 0.6, 5.5, -12]} rotationY={Math.PI / 2} scale={1.4} />
      <Piece url={BANNER} position={[X_LEFT + 0.6, 5.5, -24]} rotationY={-Math.PI / 2} scale={1.4} />
      <Piece url={BANNER} position={[X_RIGHT - 0.6, 5.5, -24]} rotationY={Math.PI / 2} scale={1.4} />

      {/* ─── Éclairage d'ambiance ─── */}
      <ambientLight intensity={0.4} color="#5a4632" />
      <spotLight
        position={[0, 9, Z_BACK + 6]}
        target-position={[0, 1.5, Z_BACK]}
        color="#fff0d0"
        intensity={220}
        distance={26}
        angle={0.7}
        penumbra={0.7}
      />

      {/* ─── 4 grands braseros (2 entrée + 2 fond, symétriques) + personnages ─── */}
      <Brazier position={[-6, 0, -8]} />
      <Brazier position={[6, 0, -8]} />
      <Brazier position={[-6, 0, -30]} />
      <Brazier position={[6, 0, -30]} />

      {/* ─── LIVRE DU CHAPITRE PERDU suspendu dans le ciel, gardé par le dragon ─── */}
      <FloatingBook />

      {/* L'équipe en patrouille + dragon qui orbite autour du livre comme un protecteur. */}
      <CharacterGroup dragonGuardsBook />
    </group>
  );
}
