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

// ── L'équipe : 3 personnages CLIQUABLES avec dialogue de présentation ──
const TEAM: {
  c: CharacterDef;
  id: string;
  displayName: string;
  lines: string[];
  path: [number, number][];
  speed: number;
  offset: number;
}[] = [
  {
    c: ASTRO_WALK,
    id: 'tarek',
    displayName: 'Tarek',
    lines: [
      "Bonjour, je suis Tarek.",
      "Je me suis occupé de réaliser toute la partie dev et technique du projet Lost Chapter — du moteur 3D web à l'expérience immersive que vous traversez en ce moment.",
    ],
    path: [[-2.2, -12], [-2.2, -26], [-1.4, -28], [-1.4, -14]],
    speed: 0.11,
    offset: 0,
  },
  {
    c: WITCH_WALK,
    id: 'myriam',
    displayName: 'Myriam',
    lines: [
      "Bonjour, je suis Myriam.",
      "Je me suis occupée des calls pour Lost Chapter — la prospection, la qualification des contacts et le pilotage de nos échanges avec partenaires et institutions.",
    ],
    path: [[2.2, -12], [2.2, -26], [1.4, -28], [1.4, -14]],
    speed: 0.1,
    offset: 1.5,
  },
  {
    c: HOODED_WALK,
    id: 'julie',
    displayName: 'Julie',
    lines: [
      "Bonjour, je suis Julie.",
      "Je me suis occupée des mailings pour Lost Chapter — la rédaction, l'envoi et le suivi de nos campagnes d'emails pour faire rayonner le projet.",
    ],
    path: [[-2, -16], [2, -16], [2, -22], [-2, -22]],
    speed: 0.12,
    offset: 3.0,
  },
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

      {/* L'équipe — cliquable, dialogue qui s'ouvre + zoom caméra */}
      {TEAM.map((m) => (
        <CharacterNPC
          key={m.id}
          character={m.c}
          interaction={{ id: m.id, displayName: m.displayName, lines: m.lines }}
          path={m.path}
          speed={m.speed}
          offset={m.offset}
          preserveTextures
        />
      ))}
    </>
  );
}
