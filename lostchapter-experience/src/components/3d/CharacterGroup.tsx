import { CharacterNPC, type CharacterDef } from './CharacterNPC';

// ── Personnages custom (Quaternius, 24 anims embarquées, textures propres) ──
const C = '/assets/characters/custom';
const SC = 0.62;

// Variantes "marche"
const HOODED_WALK: CharacterDef = { url: `${C}/Hooded_Adventurer.glb`, scale: SC, animationName: 'CharacterArmature|Walk', timeScale: 1.0 };
const WITCH_WALK: CharacterDef = { url: `${C}/Witch.glb`, scale: 0.6, animationName: 'CharacterArmature|Walk', timeScale: 1.0 };
const ADV_WALK: CharacterDef = { url: `${C}/Adventurer.glb`, scale: SC, animationName: 'CharacterArmature|Walk', timeScale: 1.0 };

// Variantes "idle" (gardiens immobiles)
const KING_IDLE: CharacterDef = { url: `${C}/King.glb`, scale: 0.66, animationName: 'CharacterArmature|Idle', timeScale: 0.85 };
const WITCH_IDLE: CharacterDef = { url: `${C}/Witch.glb`, scale: 0.6, animationName: 'CharacterArmature|Idle', timeScale: 0.85 };
const ADV_IDLE: CharacterDef = { url: `${C}/Adventurer.glb`, scale: SC, animationName: 'CharacterArmature|Idle', timeScale: 0.85 };
const HOODED_IDLE: CharacterDef = { url: `${C}/Hooded_Adventurer.glb`, scale: SC, animationName: 'CharacterArmature|Idle', timeScale: 0.85 };
const KNIGHT_STATIC: CharacterDef = { url: `${C}/Knight.glb`, scale: SC }; // pas d'anim

// ── Gardiens : un devant chaque porte (orientés vers le centre de la salle) ──
const CENTER: [number, number] = [0, -18];
function facing(x: number, z: number) {
  return Math.atan2(CENTER[0] - x, CENTER[1] - z);
}
const IDLE_CYCLE = [KING_IDLE, KNIGHT_STATIC, HOODED_IDLE, WITCH_IDLE, ADV_IDLE];

// Position des 9 portes (cf. DungeonHall) → gardien posté 1.5–2 m devant, face salle
const GUARDS: { pos: [number, number, number]; rotY: number }[] = [
  // Fond (z=-36) → gardien à z=-33.5
  { pos: [-4, 0, -33.5], rotY: facing(-4, -33.5) },
  { pos: [0, 0, -33.5], rotY: facing(0, -33.5) },
  { pos: [4, 0, -33.5], rotY: facing(4, -33.5) },
  // Gauche (x=-10) → gardien à x=-7.5
  { pos: [-7.5, 0, -10], rotY: facing(-7.5, -10) },
  { pos: [-7.5, 0, -18], rotY: facing(-7.5, -18) },
  { pos: [-7.5, 0, -26], rotY: facing(-7.5, -26) },
  // Droite (x=10) → gardien à x=7.5
  { pos: [7.5, 0, -10], rotY: facing(7.5, -10) },
  { pos: [7.5, 0, -18], rotY: facing(7.5, -18) },
  { pos: [7.5, 0, -26], rotY: facing(7.5, -26) },
];

// ── Marcheurs (triplés) qui déambulent dans la nef centrale ──
const WALKERS: { c: CharacterDef; path: [number, number][]; speed: number; offset: number }[] = [
  { c: HOODED_WALK, path: [[-2.5, -8], [2.5, -8], [2.5, -9], [-2.5, -9]], speed: 0.5, offset: 0 },
  { c: WITCH_WALK, path: [[-2.5, -12], [-2.5, -24], [-1.8, -28], [-1.8, -14]], speed: 0.4, offset: 1.2 },
  { c: ADV_WALK, path: [[2.5, -12], [2.5, -24], [1.8, -28], [1.8, -14]], speed: 0.46, offset: 2.4 },
  { c: HOODED_WALK, path: [[-2, -16], [2, -16], [2, -22], [-2, -22]], speed: 0.42, offset: 3.6 },
  { c: WITCH_WALK, path: [[1.6, -10], [1.6, -30], [0.8, -30], [0.8, -10]], speed: 0.36, offset: 4.8 },
  { c: ADV_WALK, path: [[-1.6, -10], [-1.6, -30], [-0.8, -30], [-0.8, -10]], speed: 0.38, offset: 6.0 },
  { c: HOODED_WALK, path: [[-2.4, -20], [2.4, -20], [2.4, -21], [-2.4, -21]], speed: 0.48, offset: 1.8 },
  { c: WITCH_WALK, path: [[0, -12], [2.2, -18], [0, -26], [-2.2, -18]], speed: 0.34, offset: 3.0 },
  { c: ADV_WALK, path: [[0, -26], [2, -20], [0, -14], [-2, -20]], speed: 0.34, offset: 5.4 },
];

export function CharacterGroup() {
  return (
    <>
      {/* 9 gardiens fixes — un devant chaque porte */}
      {GUARDS.map((g, i) => (
        <CharacterNPC
          key={`guard-${i}`}
          character={IDLE_CYCLE[i % IDLE_CYCLE.length]}
          position={g.pos}
          rotationY={g.rotY}
          offset={i * 0.7}
          preserveTextures
        />
      ))}

      {/* Marcheurs triplés dans la nef */}
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
