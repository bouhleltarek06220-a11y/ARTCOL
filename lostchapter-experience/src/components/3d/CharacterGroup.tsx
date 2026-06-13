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

// Placement statique de l'équipe devant l'autel pour la cathédrale (mode soutenance).
// Trois personnages debout en arc, face caméra (qui arrive depuis +z), prêts à présenter.
const STATIC_POS: Record<string, [number, number, number]> = {
  julie:  [-2.8, 0, -52.5],
  tarek:  [0,    0, -51],
  myriam: [2.8,  0, -52.5],
};
const STATIC_ROT: Record<string, number> = {
  julie:  0.18,
  tarek:  0,
  myriam: -0.18,
};

export function CharacterGroup({
  showDragon = true,
  dragonGuardsBook = false,
  staticPlacement = false,
}: {
  showDragon?: boolean;
  /** Si true, le dragon ne patrouille plus mais orbite autour du livre flottant
   *  ([0, 11, -22]) à hauteur du ciel, comme un gardien. */
  dragonGuardsBook?: boolean;
  staticPlacement?: boolean;
} = {}) {
  // Path circulaire serré autour du livre (rayon ~5, centré sur x=0 z=-22).
  // Quand le dragon ne garde pas le livre, il fait un grand circuit dans la salle.
  const dragonPath: [number, number][] = dragonGuardsBook
    ? [[-5, -22], [-3.5, -25.5], [0, -27], [3.5, -25.5], [5, -22], [3.5, -18.5], [0, -17], [-3.5, -18.5]]
    : [[-6, -12], [6, -12], [6, -30], [-6, -30]];
  const dragonY = dragonGuardsBook ? 10.5 : 7;
  const dragonSpeed = dragonGuardsBook ? 0.18 : 0.12;
  return (
    <>
      {showDragon && (
        <CharacterNPC
          character={DRAGON}
          path={dragonPath}
          speed={dragonSpeed}
          position={[0, dragonY, 0]}
          preserveTextures
        />
      )}

      {/* L'équipe — soit en patrouille (donjon), soit figée devant l'autel (cathédrale) */}
      {TEAM.map((m) => (
        <CharacterNPC
          key={m.id}
          character={m.c}
          interaction={{ id: m.id, displayName: m.displayName, lines: m.lines }}
          preserveTextures
          {...(staticPlacement
            ? { position: STATIC_POS[m.id], rotationY: STATIC_ROT[m.id], forceIdle: true }
            : { path: m.path, speed: m.speed, offset: m.offset })}
        />
      ))}
    </>
  );
}
