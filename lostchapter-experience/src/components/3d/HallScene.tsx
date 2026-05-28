import { Suspense, useMemo } from 'react';
import * as THREE from 'three';
import { DoorPortal } from './DoorPortal';
import { CharacterGroup } from './CharacterGroup';
import { AnimatedBanner } from './AnimatedBanner';
import { Brazier } from './Brazier';
import { KnightArmor } from './KnightArmor';
import { zones } from '../../data/zones';

// Dimensions de la grande salle de château
const ROOM_W = 20;          // largeur (X)
const ROOM_H = 11;          // hauteur (Y)
const ROOM_D = 36;          // profondeur (Z)
const Z_BACK = -ROOM_D;     // mur du fond
const Z_FRONT = 0;          // mur d'entrée
const Z_MID = (Z_BACK + Z_FRONT) / 2;

// ─── La salle de château proprement dite : sol pierre + tapis royal +
// murs avec plinthes/corniches + plafond à poutres + colonnes adossées.
function CastleHall() {
  const stoneFloor = { color: '#3d2e20', roughness: 0.92, metalness: 0.04 };
  const stoneWall = { color: '#4a3828', roughness: 0.95, metalness: 0.04 };
  const stoneColumn = { color: '#5a4632', roughness: 0.95 };
  const wood = { color: '#2a1709', roughness: 0.85, metalness: 0.05 };
  const gold = { color: '#c99b5c', metalness: 0.9, roughness: 0.35 };

  // Pavés de sol (motif damier subtil via deux teintes alternées)
  const tileGrid = useMemo(() => {
    const tiles: JSX.Element[] = [];
    const tileSize = 2;
    const nx = Math.floor(ROOM_W / tileSize);
    const nz = Math.floor(ROOM_D / tileSize);
    for (let i = 0; i < nx; i++) {
      for (let j = 0; j < nz; j++) {
        if ((i + j) % 2 === 0) continue;
        const x = -ROOM_W / 2 + tileSize / 2 + i * tileSize;
        const z = Z_FRONT - tileSize / 2 - j * tileSize;
        tiles.push(
          <mesh key={`${i}-${j}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.005, z]}>
            <planeGeometry args={[tileSize - 0.05, tileSize - 0.05]} />
            <meshStandardMaterial color="#332518" roughness={0.95} />
          </mesh>,
        );
      }
    }
    return tiles;
  }, []);

  // Poutres de plafond transversales (style château médiéval)
  const beams = useMemo(() => {
    const arr: JSX.Element[] = [];
    const step = 3.6;
    for (let z = Z_FRONT - 1.5; z > Z_BACK; z -= step) {
      arr.push(
        <mesh key={z} position={[0, ROOM_H - 0.25, z]} castShadow>
          <boxGeometry args={[ROOM_W - 0.5, 0.4, 0.45]} />
          <meshStandardMaterial color="#1c100a" roughness={0.9} metalness={0.04} />
        </mesh>,
      );
    }
    // 2 longerons centraux
    [-(ROOM_W / 4), ROOM_W / 4].forEach((x) => {
      arr.push(
        <mesh key={`long-${x}`} position={[x, ROOM_H - 0.55, Z_MID]}>
          <boxGeometry args={[0.3, 0.3, ROOM_D - 1]} />
          <meshStandardMaterial color="#1a0e08" roughness={0.9} />
        </mesh>,
      );
    });
    return arr;
  }, []);

  return (
    <group>
      {/* ─── SOL ──────────────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, Z_MID]} receiveShadow>
        <planeGeometry args={[ROOM_W, ROOM_D]} />
        <meshStandardMaterial {...stoneFloor} />
      </mesh>
      {tileGrid}

      {/* Grand tapis royal rouge bordé d'or, du seuil aux portes */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, Z_MID]} receiveShadow>
        <planeGeometry args={[3.4, ROOM_D - 1.2]} />
        <meshStandardMaterial color="#5a1a1a" roughness={0.92} metalness={0.06} />
      </mesh>
      {/* Bordure dorée du tapis (cadre fin) */}
      {[-1.6, 1.6].map((s) => (
        <mesh key={`carpet-edge-${s}`} rotation={[-Math.PI / 2, 0, 0]} position={[s, 0.014, Z_MID]}>
          <planeGeometry args={[0.12, ROOM_D - 1.2]} />
          <meshStandardMaterial {...gold} roughness={0.5} />
        </mesh>
      ))}
      {/* Bordure dorée aux extrémités */}
      {[Z_FRONT - 0.6, Z_BACK + 0.6].map((z) => (
        <mesh key={`carpet-end-${z}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.014, z]}>
          <planeGeometry args={[3.4, 0.12]} />
          <meshStandardMaterial {...gold} roughness={0.5} />
        </mesh>
      ))}

      {/* ─── PLAFOND + POUTRES ───────────────────── */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM_H, Z_MID]}>
        <planeGeometry args={[ROOM_W, ROOM_D]} />
        <meshStandardMaterial color="#1f160f" roughness={1} />
      </mesh>
      {beams}

      {/* ─── MURS ─────────────────────────────────── */}
      {/* Mur du fond */}
      <mesh position={[0, ROOM_H / 2, Z_BACK]} receiveShadow>
        <planeGeometry args={[ROOM_W, ROOM_H]} />
        <meshStandardMaterial {...stoneWall} />
      </mesh>
      {/* Mur d'entrée */}
      <mesh rotation={[0, Math.PI, 0]} position={[0, ROOM_H / 2, Z_FRONT]}>
        <planeGeometry args={[ROOM_W, ROOM_H]} />
        <meshStandardMaterial color="#2c1d12" roughness={1} />
      </mesh>
      {/* Mur gauche */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-ROOM_W / 2, ROOM_H / 2, Z_MID]} receiveShadow>
        <planeGeometry args={[ROOM_D, ROOM_H]} />
        <meshStandardMaterial {...stoneWall} />
      </mesh>
      {/* Mur droit */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[ROOM_W / 2, ROOM_H / 2, Z_MID]} receiveShadow>
        <planeGeometry args={[ROOM_D, ROOM_H]} />
        <meshStandardMaterial {...stoneWall} />
      </mesh>

      {/* Plinthes en bas des murs latéraux */}
      {[-1, 1].map((s) => (
        <mesh key={`plinth-${s}`} position={[s * (ROOM_W / 2 - 0.06), 0.25, Z_MID]}>
          <boxGeometry args={[0.12, 0.5, ROOM_D]} />
          <meshStandardMaterial color="#1c1108" roughness={1} />
        </mesh>
      ))}
      {/* Corniche en haut des murs latéraux (moulure) */}
      {[-1, 1].map((s) => (
        <mesh key={`cornice-${s}`} position={[s * (ROOM_W / 2 - 0.06), ROOM_H - 0.4, Z_MID]}>
          <boxGeometry args={[0.18, 0.3, ROOM_D]} />
          <meshStandardMaterial color="#241608" roughness={0.9} />
        </mesh>
      ))}

      {/* ─── COLONNES adossées aux murs (6 paires) ─── */}
      {Array.from({ length: 6 }).map((_, i) => {
        const z = Z_FRONT - 3 - i * 5.5;
        if (z <= Z_BACK + 2) return null;
        return [-1, 1].map((s) => (
          <group key={`col-${i}-${s}`} position={[s * (ROOM_W / 2 - 0.6), 0, z]}>
            {/* Socle (base) */}
            <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.1, 0.5, 1.1]} />
              <meshStandardMaterial {...stoneColumn} />
            </mesh>
            {/* Fût */}
            <mesh position={[0, ROOM_H / 2, 0]} castShadow>
              <cylinderGeometry args={[0.36, 0.42, ROOM_H - 1.0, 18]} />
              <meshStandardMaterial {...stoneColumn} />
            </mesh>
            {/* Cannelure (anneaux fins) */}
            {[0.25, 0.55, 0.85].map((f) => (
              <mesh key={f} position={[0, ROOM_H * f, 0]}>
                <torusGeometry args={[0.42, 0.025, 8, 22]} />
                <meshStandardMaterial color="#3a2a1c" metalness={0.1} roughness={0.85} />
              </mesh>
            ))}
            {/* Chapiteau (corbeille décorée) */}
            <mesh position={[0, ROOM_H - 0.7, 0]} castShadow>
              <boxGeometry args={[1.2, 0.4, 1.2]} />
              <meshStandardMaterial {...stoneColumn} />
            </mesh>
            <mesh position={[0, ROOM_H - 0.35, 0]} castShadow>
              <boxGeometry args={[1.3, 0.3, 1.3]} />
              <meshStandardMaterial color="#3a2a1c" roughness={0.95} />
            </mesh>
          </group>
        ));
      })}

      {/* ─── Lustre suspendu central (couronne de bougies) ─── */}
      <group position={[0, ROOM_H - 1.2, Z_MID]}>
        {/* Chaîne */}
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1.2, 6]} />
          <meshStandardMaterial color="#15100a" metalness={0.85} roughness={0.4} />
        </mesh>
        {/* Couronne */}
        <mesh>
          <torusGeometry args={[0.85, 0.05, 12, 36]} />
          <meshStandardMaterial color="#c99b5c" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* 8 bougies allumées sur la couronne */}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          const x = Math.cos(a) * 0.85;
          const z = Math.sin(a) * 0.85;
          return (
            <group key={i} position={[x, 0.1, z]}>
              <mesh>
                <cylinderGeometry args={[0.04, 0.04, 0.2, 8]} />
                <meshStandardMaterial color="#e5e0c8" roughness={0.6} />
              </mesh>
              <mesh position={[0, 0.16, 0]}>
                <sphereGeometry args={[0.04, 8, 8]} />
                <meshBasicMaterial color="#fff0a0" />
              </mesh>
            </group>
          );
        })}
        {/* Lumière chaude diffuse du lustre */}
        <pointLight color="#ffd28a" intensity={28} distance={20} decay={2} />
      </group>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export function HallScene() {
  // Positions X des 9 portes le long du mur du fond
  const doorXs = useMemo(() => {
    return zones.map((_, i) => {
      const t = zones.length === 1 ? 0.5 : i / (zones.length - 1);
      return THREE.MathUtils.lerp(-8.0, 8.0, t);
    });
  }, []);

  // Positions X des armures : entre les portes (8 emplacements)
  const armorXs = useMemo(() => {
    const xs: number[] = [];
    for (let i = 0; i < doorXs.length - 1; i++) {
      xs.push((doorXs[i] + doorXs[i + 1]) / 2);
    }
    return xs;
  }, [doorXs]);

  return (
    <group>
      <CastleHall />

      {/* ─── Éclairage chaud baignant la salle ─────────────────── */}
      <ambientLight intensity={0.6} color="#6a5238" />
      {/* Lampes au plafond (en plus du lustre) */}
      {[-12, -4, 4].map((zx) => (
        <pointLight
          key={zx}
          position={[0, ROOM_H - 1.5, Z_MID + zx]}
          color="#ffb066"
          intensity={28}
          distance={26}
          decay={2}
        />
      ))}
      {/* Faisceau focal sur le mur du fond et les portes */}
      <spotLight
        position={[0, ROOM_H - 1, Z_BACK + 8]}
        target-position={[0, 2.5, Z_BACK + 0.2]}
        color="#fff0d0"
        intensity={500}
        distance={32}
        angle={0.75}
        penumbra={0.7}
      />

      {/* ─── 4 BRASEROS allumés aux coins de la salle ───────────── */}
      <Brazier position={[-ROOM_W / 2 + 1.6, 0, Z_FRONT - 2.5]} />
      <Brazier position={[ROOM_W / 2 - 1.6, 0, Z_FRONT - 2.5]} />
      <Brazier position={[-ROOM_W / 2 + 1.6, 0, Z_BACK + 3.5]} />
      <Brazier position={[ROOM_W / 2 - 1.6, 0, Z_BACK + 3.5]} />

      {/* ─── Bannières héraldiques sur les murs latéraux ──────── */}
      {[[-ROOM_W / 2 + 0.2, -10], [ROOM_W / 2 - 0.2, -10], [-ROOM_W / 2 + 0.2, -18], [ROOM_W / 2 - 0.2, -18], [-ROOM_W / 2 + 0.2, -26], [ROOM_W / 2 - 0.2, -26]].map(
        ([x, z], i) => (
          <AnimatedBanner key={i} position={[x, ROOM_H - 3.4, z]} phase={i * 0.7} />
        ),
      )}

      {/* ─── 9 portes médiévales contre le mur du fond ─────────── */}
      {zones.map((zone, i) => (
        <DoorPortal key={zone.id} zone={zone} position={[doorXs[i], 0, Z_BACK + 0.18]} />
      ))}

      {/* ─── 8 armures de chevalier entre les portes ───────────── */}
      {armorXs.map((x, i) => (
        <KnightArmor
          key={i}
          position={[x, 0, Z_BACK + 2.4]}
          rotationY={Math.PI} // face à la salle
          plumeColor={i % 2 === 0 ? '#7a1a1a' : '#3a1a4a'}
        />
      ))}

      {/* ─── Personnages 3D animés (au sol uniquement) ─────────── */}
      <Suspense fallback={null}>
        <CharacterGroup />
      </Suspense>
    </group>
  );
}
