import { CharacterNPC, type CharacterDef } from './CharacterNPC';

// ── Personnages custom (Quaternius, anims embarquées, textures propres) ──
const C = '/assets/characters/custom';
const SC = 0.62;

// Marche (vitesse lente réaliste → cf. speed bas dans WALKERS)
const HOODED_WALK: CharacterDef = { url: `${C}/Hooded_Adventurer.glb`, scale: SC, animationName: 'CharacterArmature|Walk', timeScale: 1.0 };
const WITCH_WALK: CharacterDef = { url: `${C}/Witch.glb`, scale: 0.6, animationName: 'CharacterArmature|Walk', timeScale: 1.0 };
const ADV_WALK: CharacterDef = { url: `${C}/Adventurer.glb`, scale: SC, animationName: 'CharacterArmature|Walk', timeScale: 1.0 };
const ADV2_WALK: CharacterDef = { url: `${C}/Adventurer_2.glb`, scale: SC, animationName: 'CharacterArmature|Walk', timeScale: 1.0 };

// Idle (gardiens immobiles)
const KING_IDLE: CharacterDef = { url: `${C}/King.glb`, scale: 0.66, animationName: 'CharacterArmature|Idle', timeScale: 0.85 };
const WITCH_IDLE: CharacterDef = { url: `${C}/Witch.glb`, scale: 0.6, animationName: 'CharacterArmature|Idle', timeScale: 0.85 };
const ADV_IDLE: CharacterDef = { url: `${C}/Adventurer.glb`, scale: SC, animationName: 'CharacterArmature|Idle', timeScale: 0.85 };
const ADV2_IDLE: CharacterDef = { url: `${C}/Adventurer_2.glb`, scale: SC, animationName: 'CharacterArmature|Idle', timeScale: 0.85 };
const HOODED_IDLE: CharacterDef = { url: `${C}/Hooded_Adventurer.glb`, scale: SC, animationName: 'CharacterArmature|Idle', timeScale: 0.85 };
const KNIGHT_STATIC: CharacterDef = { url: `${C}/Knight.glb`, scale: SC };

// Dragon — pièce maîtresse qui plane au-dessus de la salle
const DRAGON: CharacterDef = { url: `${C}/Dragon_Evolved.glb`, scale: 1.3, animationName: 'CharacterArmature|Flying_Idle', timeScale: 0.8 };

// ── Gardiens : un devant chaque porte, orientés vers le centre ──
const CENTER: [number, number] = [0, -18];
const facing = (x: number, z: number) => Math.atan2(CENTER[0] - x, CENTER[1] - z);
// Cycle varié (Roi, Chevalier, Encapuchonné, Sorcière, Aventurier, Aventurier 2)
const IDLE_CYCLE = [KING_IDLE, KNIGHT_STATIC, HOODED_IDLE, WITCH_IDLE, ADV_IDLE, ADV2_IDLE];

const GUARDS: [number, number, number][] = [
  // Fond (portes x=-4,0,4)
  [-4, 0, -33.5], [0, 0, -33.5], [4, 0, -33.5],
  // Gauche (x=-10)
  [-7.5, 0, -10], [-7.5, 0, -18], [-7.5, 0, -26],
  // Droite (x=10)
  [7.5, 0, -10], [7.5, 0, -18], [7.5, 0, -26],
];

// ── Marcheurs : peu nombreux, variés, LENTS (speed ~0.1 = marche calme) ──
const WALKERS: { c: CharacterDef; path: [number, number][]; speed: number; offset: number }[] = [
  { c: HOODED_WALK, path: [[-2.4, -12], [-2.4, -26], [-1.6, -28], [-1.6, -14]], speed: 0.11, offset: 0 },
  { c: WITCH_WALK, path: [[2.4, -12], [2.4, -26], [1.6, -28], [1.6, -14]], speed: 0.1, offset: 1.5 },
  { c: ADV2_WALK, path: [[-2, -16], [2, -16], [2, -22], [-2, -22]], speed: 0.12, offset: 3.0 },
  { c: ADV_WALK, path: [[0, -10], [0, -30], [-1, -30], [-1, -10]], speed: 0.09, offset: 4.5 },
];

export function CharacterGroup() {
  return (
    <>
      {/* Dragon qui plane au-dessus de la nef (pièce maîtresse) */}
      <CharacterNPC character={DRAGON} position={[0, 8, -20]} rotationY={Math.PI} preserveTextures />

      {/* 9 gardiens fixes — un devant chaque porte */}
      {GUARDS.map((pos, i) => (
        <CharacterNPC
          key={`guard-${i}`}
          character={IDLE_CYCLE[i % IDLE_CYCLE.length]}
          position={pos}
          rotationY={facing(pos[0], pos[2])}
          offset={i * 0.7}
          preserveTextures
        />
      ))}

      {/* Marcheurs (peu, variés, lents) */}
      {WALKERS.map((w, i) => (
        <CharacterNPC
          key={`walk-${i}`}
          character={w.c}
          path={w.path}
          speed={w.speed}
          offset={w.offset}
          preserveTextures
        />
      ))}
    </>
  );
}
