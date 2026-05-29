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

// Garde à l'épée : Adventurer en pose Idle_Sword (animé — plus de T-pose)
const SWORD_GUARD: CharacterDef = { url: `${C}/Adventurer.glb`, scale: SC, animationName: 'CharacterArmature|Idle_Sword', timeScale: 0.8 };

// Dragon — plane au-dessus des portes du fond, face à l'entrée (regarde le visiteur)
const DRAGON: CharacterDef = { url: `${C}/Dragon_Evolved.glb`, scale: 1.3, animationName: 'CharacterArmature|Flying_Idle', timeScale: 0.8 };

// ── Gardiens à l'épée (Knight) devant chaque porte, orientés vers le centre ──
const CENTER: [number, number] = [0, -18];
const facing = (x: number, z: number) => Math.atan2(CENTER[0] - x, CENTER[1] - z);

// Le chevalier à l'épée garde CHAQUE porte. La porte principale (fond centre)
// en a DEUX : un à gauche, un à droite.
const GUARDS: [number, number, number][] = [
  // Fond : porte gauche (x=-4), PORTE PRINCIPALE (x=0 → 2 gardes flanquants), porte droite (x=4)
  [-4, 0, -33.5],
  [-1.4, 0, -33.5], [1.4, 0, -33.5], // les deux gardes de la porte principale
  [4, 0, -33.5],
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
      {/* Dragon qui plane au-dessus des portes du fond, face à l'entrée */}
      <CharacterNPC character={DRAGON} position={[0, 6, -32]} rotationY={0} preserveTextures />

      {/* (Gardiens devant les portes retirés — soutenance épurée) */}

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
