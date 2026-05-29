import { CharacterNPC, type CharacterDef } from './CharacterNPC';

// ── Personnages custom (Quaternius, anims embarquées, textures propres) ──
const C = '/assets/characters/custom';
const SC = 0.62;

// L'équipe (marche lente). Astronaute = Tarek, Sorcière = Myriam, Encapuchonnée = Julie.
const ASTRO_WALK: CharacterDef = { url: `${C}/Astronaut.glb`, scale: SC, animationName: 'CharacterArmature|Walk', timeScale: 1.0 };
const WITCH_WALK: CharacterDef = { url: `${C}/Witch.glb`, scale: 0.6, animationName: 'CharacterArmature|Walk', timeScale: 1.0 };
const HOODED_WALK: CharacterDef = { url: `${C}/Hooded_Adventurer.glb`, scale: SC, animationName: 'CharacterArmature|Walk', timeScale: 1.0 };

// Dragon — vole en cercle dans les airs au-dessus de la salle
const DRAGON: CharacterDef = { url: `${C}/Dragon_Evolved.glb`, scale: 1.3, animationName: 'CharacterArmature|Flying_Idle', timeScale: 1.0 };

// ── L'équipe nommée : 3 personnages avec bulle de nom ──
const TEAM: { c: CharacterDef; name: string; path: [number, number][]; speed: number; offset: number }[] = [
  { c: ASTRO_WALK, name: 'TAREK', path: [[-2.2, -12], [-2.2, -26], [-1.4, -28], [-1.4, -14]], speed: 0.11, offset: 0 },
  { c: WITCH_WALK, name: 'MYRIAM', path: [[2.2, -12], [2.2, -26], [1.4, -28], [1.4, -14]], speed: 0.1, offset: 1.5 },
  { c: HOODED_WALK, name: 'JULIE', path: [[-2, -16], [2, -16], [2, -22], [-2, -22]], speed: 0.12, offset: 3.0 },
];

export function CharacterGroup() {
  return (
    <>
      {/* Dragon en vol circulaire au-dessus de la nef (y constant = 7) */}
      <CharacterNPC
        character={DRAGON}
        path={[[-6, -12], [6, -12], [6, -30], [-6, -30]]}
        speed={0.12}
        position={[0, 7, 0]}
        preserveTextures
      />

      {/* L'équipe nommée (Tarek / Myriam / Julie) */}
      {TEAM.map((m, i) => (
        <CharacterNPC
          key={`team-${i}`}
          character={m.c}
          name={m.name}
          path={m.path}
          speed={m.speed}
          offset={m.offset}
          preserveTextures
        />
      ))}
    </>
  );
}
