import { CharacterNPC, type CharacterDef } from './CharacterNPC';

// Personnages médiévaux CC0 du pack KayKit Adventurers (rigged + 75 animations)
// — chaque archétype incarne un rôle de l'univers Lost Chapter.
const KNIGHT: CharacterDef = {
  url: '/assets/characters/kaykit/Knight.glb',
  scale: 1.2,
  animationName: 'Walking_A',
  timeScale: 0.9,
};
const KNIGHT_IDLE: CharacterDef = { ...KNIGHT, animationName: 'Idle' };

const MAGE: CharacterDef = {
  url: '/assets/characters/kaykit/Mage.glb',
  scale: 1.2,
  animationName: 'Idle',
  timeScale: 0.85,
};

const ROGUE: CharacterDef = {
  url: '/assets/characters/kaykit/Rogue.glb',
  scale: 1.2,
  animationName: 'Walking_A',
  timeScale: 0.95,
};

const ROGUE_HOODED: CharacterDef = {
  url: '/assets/characters/kaykit/Rogue_Hooded.glb',
  scale: 1.2,
  animationName: 'Walking_C',
  timeScale: 0.7,
};

const BARBARIAN: CharacterDef = {
  url: '/assets/characters/kaykit/Barbarian.glb',
  scale: 1.2,
  animationName: 'Idle',
  timeScale: 0.9,
};

// Roster narratif — chaque personnage occupe un rôle dans l'univers Lost Chapter.
export function CharacterGroup() {
  return (
    <>
      {/* GARDE MÉDIÉVAL — patrouille la nef (textures conservées : armure) */}
      <CharacterNPC
        character={KNIGHT}
        path={[
          [-2.4, -14],
          [2.4, -19],
          [-1.8, -24],
          [1.8, -16],
        ]}
        speed={0.5}
        offset={0}
        preserveTextures
      />

      {/* ÉRUDIT / CHERCHEUR — contemple un portail (idle, robe de mage) */}
      <CharacterNPC
        character={MAGE}
        position={[-3.0, 0, -20]}
        rotationY={Math.PI * 0.15}
        preserveTextures
      />

      {/* VISITEUR CURIEUX — Rogue qui déambule */}
      <CharacterNPC
        character={ROGUE}
        path={[
          [2.4, -13],
          [2.6, -22],
          [-1, -25],
          [-2.4, -15],
        ]}
        speed={0.42}
        offset={1.4}
        preserveTextures
      />

      {/* SILHOUETTE MYSTÉRIEUSE — Rogue encapuchonné, marche lente, ombré (silhouette) */}
      <CharacterNPC
        character={ROGUE_HOODED}
        path={[
          [0, -26],
          [-2.5, -22],
          [2.5, -22],
          [0, -26],
        ]}
        speed={0.32}
        offset={2.8}
        darkenColor="#120907"
      />

      {/* BÉNÉVOLE / GARDIEN DU SEUIL — Barbarian idle à l'entrée du hall */}
      <CharacterNPC
        character={BARBARIAN}
        position={[3.2, 0, -19]}
        rotationY={-Math.PI * 0.2}
        preserveTextures
      />

      {/* SECOND GARDE en faction (idle) */}
      <CharacterNPC
        character={KNIGHT_IDLE}
        position={[-3.4, 0, -29]}
        rotationY={Math.PI * 0.18}
        offset={3.5}
        preserveTextures
      />
    </>
  );
}
