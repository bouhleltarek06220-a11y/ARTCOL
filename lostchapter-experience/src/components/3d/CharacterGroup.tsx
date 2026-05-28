import { CharacterNPC, type CharacterDef } from './CharacterNPC';

// Pack KayKit Adventurers 2.0 (CC0) — rig partagé "Rig_Medium" + clips dans des GLB séparés
const BASE = '/assets/characters/kaykit-v2';
const ANIM_MOVE = `${BASE}/animations/Rig_Medium_MovementBasic.glb`;   // Walking_A/B/C, Running_A/B
const ANIM_GENERAL = `${BASE}/animations/Rig_Medium_General.glb`;     // Idle_A/B, Hit_A, ...

// Définitions par archétype + animation
const KNIGHT_PATROL: CharacterDef = { url: `${BASE}/Knight.glb`, scale: 1.2, animationsUrl: ANIM_MOVE, animationName: 'Walking_A', timeScale: 0.9 };
const KNIGHT_IDLE:   CharacterDef = { url: `${BASE}/Knight.glb`, scale: 1.2, animationsUrl: ANIM_GENERAL, animationName: 'Idle_A', timeScale: 0.85 };

const MAGE_IDLE:     CharacterDef = { url: `${BASE}/Mage.glb`, scale: 1.2, animationsUrl: ANIM_GENERAL, animationName: 'Idle_B', timeScale: 0.8 };

const ROGUE_WALK:    CharacterDef = { url: `${BASE}/Rogue.glb`, scale: 1.2, animationsUrl: ANIM_MOVE, animationName: 'Walking_B', timeScale: 1.0 };

const ROGUE_HOODED:  CharacterDef = { url: `${BASE}/Rogue_Hooded.glb`, scale: 1.2, animationsUrl: ANIM_MOVE, animationName: 'Walking_C', timeScale: 0.7 };

const BARBARIAN_IDLE: CharacterDef = { url: `${BASE}/Barbarian.glb`, scale: 1.2, animationsUrl: ANIM_GENERAL, animationName: 'Idle_A', timeScale: 0.9 };

const RANGER_WALK:   CharacterDef = { url: `${BASE}/Ranger.glb`, scale: 1.2, animationsUrl: ANIM_MOVE, animationName: 'Walking_A', timeScale: 1.05 };

// Roster narratif — Lost Chapter
export function CharacterGroup() {
  return (
    <>
      {/* GARDE MÉDIÉVAL — patrouille la nef */}
      <CharacterNPC
        character={KNIGHT_PATROL}
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

      {/* ÉRUDIT / CHERCHEUR — Mage idle face à un portail */}
      <CharacterNPC
        character={MAGE_IDLE}
        position={[-3.0, 0, -20]}
        rotationY={Math.PI * 0.15}
        preserveTextures
      />

      {/* RÔDEUR / VISITEUR — Rogue qui déambule */}
      <CharacterNPC
        character={ROGUE_WALK}
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

      {/* SILHOUETTE MYSTÉRIEUSE — Rogue encapuchonné, marche lente, ombré */}
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

      {/* BÉNÉVOLE / GARDIEN DU SEUIL — Barbarian idle */}
      <CharacterNPC
        character={BARBARIAN_IDLE}
        position={[3.2, 0, -19]}
        rotationY={-Math.PI * 0.2}
        offset={2.3}
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

      {/* RANGER — éclaireur curieux qui traverse */}
      <CharacterNPC
        character={RANGER_WALK}
        path={[
          [-3.2, -28],
          [3.2, -28],
          [3.2, -29],
          [-3.2, -29],
        ]}
        speed={0.36}
        offset={4.7}
        preserveTextures
      />
    </>
  );
}
