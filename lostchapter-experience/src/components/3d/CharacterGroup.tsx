import { CharacterNPC, type CharacterDef } from './CharacterNPC';

// Définitions des modèles 3D humanoïdes disponibles. Chaque type aura sa tenue
// quand des assets médiévaux dédiés seront déposés dans /assets/characters/.
const HUMANOID_CESIUM: CharacterDef = {
  url: '/assets/characters/CesiumMan.glb',
  scale: 1.25,
  rotationOffset: Math.PI, // CesiumMan pointe vers -Z par défaut
  timeScale: 0.85,
};

const STYLIZED_BRAINSTEM: CharacterDef = {
  url: '/assets/characters/BrainStem.glb',
  scale: 1.0,
  timeScale: 0.9,
};

// Placement narratif : chaque silhouette joue un rôle (garde, érudit, visiteur, etc.).
// Quand de vrais modèles spécifiques seront fournis, il suffira de changer `url`.
interface NPCInstance {
  role: string; // documentaire — affiché plus tard via une infobulle si besoin
  character: CharacterDef;
  path: [number, number][];
  speed: number;
  offset: number;
  darkenColor?: string;
}

const ROSTER: NPCInstance[] = [
  {
    role: 'garde-medieval',
    character: HUMANOID_CESIUM,
    path: [[-2.2, -14], [2.2, -19], [-1.8, -24], [1.8, -16]],
    speed: 0.5,
    offset: 0,
    darkenColor: '#1c1208',
  },
  {
    role: 'erudit-chercheur',
    character: HUMANOID_CESIUM,
    path: [[2.2, -13], [2.5, -22], [-1, -25], [-2.2, -15]],
    speed: 0.36,
    offset: 1.4,
    darkenColor: '#180e07',
  },
  {
    role: 'visiteur-contemplatif',
    character: HUMANOID_CESIUM,
    path: [[0, -25], [-2, -21], [2, -21], [0, -25]],
    speed: 0.32,
    offset: 2.8,
    darkenColor: '#211408',
  },
  {
    role: 'silhouette-mysterieuse',
    character: STYLIZED_BRAINSTEM,
    path: [[-2.6, -28], [2.6, -28], [2.6, -29], [-2.6, -29]],
    speed: 0.28,
    offset: 1.8,
    darkenColor: '#0f0805',
  },
];

export function CharacterGroup() {
  return (
    <>
      {ROSTER.map((n, i) => (
        <CharacterNPC
          key={i}
          character={n.character}
          path={n.path}
          speed={n.speed}
          offset={n.offset}
          darkenColor={n.darkenColor}
        />
      ))}
    </>
  );
}
