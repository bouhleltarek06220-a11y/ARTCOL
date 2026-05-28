import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { CharacterGroup } from './CharacterGroup';
import { Brazier } from './Brazier';

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

      {/* ─── MURS LATÉRAUX (2 niveaux : bas plein, haut arches-fenêtres) ─── */}
      {rows.map((z) => (
        <group key={`wl-${z}`}>
          {/* gauche */}
          <Piece url={WALL} position={[X_LEFT, 0, z]} rotationY={Math.PI / 2} />
          <Piece url={WALL_ARCH} position={[X_LEFT, TILE, z]} rotationY={Math.PI / 2} />
          {/* droite */}
          <Piece url={WALL} position={[X_RIGHT, 0, z]} rotationY={-Math.PI / 2} />
          <Piece url={WALL_ARCH} position={[X_RIGHT, TILE, z]} rotationY={-Math.PI / 2} />
        </group>
      ))}

      {/* ─── MUR DU FOND (avec ouvertures de porte) ─── */}
      {cols.map((x) => (
        <group key={`wb-${x}`}>
          <Piece url={x === 0 ? WALL_DOOR : WALL} position={[x, 0, Z_BACK]} rotationY={0} />
          <Piece url={WALL} position={[x, TILE, Z_BACK]} rotationY={0} />
        </group>
      ))}

      {/* ─── COLONNES le long des murs (rythme) ─── */}
      {rows.filter((_, i) => i % 2 === 0).map((z) => (
        <group key={`col-${z}`}>
          <Piece url={COLUMN} position={[X_LEFT + 0.9, 0, z]} scale={1.6} />
          <Piece url={COLUMN} position={[X_RIGHT - 0.9, 0, z]} scale={1.6} />
        </group>
      ))}

      {/* ─── TORCHES murales + lumière chaude ─── */}
      {rows.filter((_, i) => i % 2 === 1).map((z, i) => (
        <group key={`t-${z}`}>
          <Piece url={TORCH} position={[X_LEFT + 0.55, 2.6, z]} rotationY={-Math.PI / 2} />
          <Piece url={TORCH} position={[X_RIGHT - 0.55, 2.6, z]} rotationY={Math.PI / 2} />
          <pointLight position={[X_LEFT + 1.4, 2.9, z]} color="#ff9d4d" intensity={9} distance={11} decay={2} />
          <pointLight position={[X_RIGHT - 1.4, 2.9, z]} color="#ff9d4d" intensity={9} distance={11} decay={2} />
        </group>
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

      {/* ─── 2 grands braseros + personnages ─── */}
      <Brazier position={[-6, 0, -8]} />
      <Brazier position={[6, 0, -8]} />
      <CharacterGroup />
    </group>
  );
}
