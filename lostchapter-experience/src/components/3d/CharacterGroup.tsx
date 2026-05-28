import { CharacterNPC, type CharacterDef } from './CharacterNPC';

// Pack KayKit Adventurers 2.0 (CC0) — rig partagé "Rig_Medium" + clips dans des GLB séparés
const BASE = '/assets/characters/kaykit-v2';
const ANIM_MOVE = `${BASE}/animations/Rig_Medium_MovementBasic.glb`;
const ANIM_GENERAL = `${BASE}/animations/Rig_Medium_General.glb`;

// Définitions par archétype + animation (scale réduit pour proportions humaines crédibles)
const SCALE = 1.0;
const KNIGHT_PATROL: CharacterDef = { url: `${BASE}/Knight.glb`, scale: SCALE, animationsUrl: ANIM_MOVE, animationName: 'Walking_A', timeScale: 0.9 };
const KNIGHT_IDLE:   CharacterDef = { url: `${BASE}/Knight.glb`, scale: SCALE, animationsUrl: ANIM_GENERAL, animationName: 'Idle_A', timeScale: 0.85 };
const MAGE_IDLE:     CharacterDef = { url: `${BASE}/Mage.glb`, scale: SCALE, animationsUrl: ANIM_GENERAL, animationName: 'Idle_B', timeScale: 0.8 };
const ROGUE_WALK:    CharacterDef = { url: `${BASE}/Rogue.glb`, scale: SCALE, animationsUrl: ANIM_MOVE, animationName: 'Walking_B', timeScale: 1.0 };
const ROGUE_HOODED:  CharacterDef = { url: `${BASE}/Rogue_Hooded.glb`, scale: SCALE, animationsUrl: ANIM_MOVE, animationName: 'Walking_C', timeScale: 0.7 };
const BARBARIAN_IDLE:CharacterDef = { url: `${BASE}/Barbarian.glb`, scale: SCALE, animationsUrl: ANIM_GENERAL, animationName: 'Idle_A', timeScale: 0.9 };
const RANGER_WALK:   CharacterDef = { url: `${BASE}/Ranger.glb`, scale: SCALE, animationsUrl: ANIM_MOVE, animationName: 'Walking_A', timeScale: 1.05 };

// ─────────────────────────────────────────────────────────────────────────────
// Palettes thématiques par archétype — coloration partie par partie
// ─────────────────────────────────────────────────────────────────────────────
const SKIN  = '#d6a987';
const SKIN_TANNED = '#c08a5e';
const SKIN_DARK = '#7a5638';

const PALETTE_KNIGHT: Record<string, string> = {
  Knight_Head:        SKIN,
  Knight_Helmet:      '#8e9099',          // acier poli
  Knight_HelmetVisor: '#2e2f36',          // visière sombre
  Knight_Body:        '#5d6068',          // cotte de mailles
  Knight_ArmLeft:     '#5d6068',
  Knight_ArmRight:    '#5d6068',
  Knight_LegLeft:     '#3a2a1c',          // bottes cuir
  Knight_LegRight:    '#3a2a1c',
  Knight_Cape:        '#7a1a1a',          // cape bordeaux héraldique
  default:            '#5d6068',
};

const PALETTE_MAGE: Record<string, string> = {
  Mage_Head:    SKIN,
  Mage_Hat:     '#1c1a3a',                // chapeau bleu nuit
  Mage_Body:    '#4a1c5e',                // robe pourpre
  Mage_ArmLeft: '#4a1c5e',
  Mage_ArmRight:'#4a1c5e',
  Mage_LegLeft: '#2d122e',
  Mage_LegRight:'#2d122e',
  Mage_Cape:    '#1a0d2a',                // cape étoilée violette
  default:      '#4a1c5e',
};

const PALETTE_ROGUE: Record<string, string> = {
  Rogue_Head:    SKIN_TANNED,
  Rogue_Body:    '#2c1a14',                // cuir noir
  Rogue_ArmLeft: '#2c1a14',
  Rogue_ArmRight:'#2c1a14',
  Rogue_LegLeft: '#1c100a',
  Rogue_LegRight:'#1c100a',
  Rogue_Cape:    '#0e0e0e',                // cape noire
  default:       '#1c100a',
};

const PALETTE_HOODED: Record<string, string> = {
  Rogue_Hooded_Head:    SKIN_DARK,         // visage à peine visible
  Rogue_Hooded_Body:    '#0c0a06',
  Rogue_Hooded_ArmLeft: '#0c0a06',
  Rogue_Hooded_ArmRight:'#0c0a06',
  Rogue_Hooded_LegLeft: '#0a0805',
  Rogue_Hooded_LegRight:'#0a0805',
  Rogue_Hooded_Cape:    '#080604',         // capuchon ombre profonde
  default:              '#080604',
};

const PALETTE_BARBARIAN: Record<string, string> = {
  Barbarian_Head:     SKIN_TANNED,
  Barbarian_Body:     '#3a2a18',           // fourrures brunes
  Barbarian_ArmLeft:  SKIN_TANNED,          // bras nus
  Barbarian_ArmRight: SKIN_TANNED,
  Barbarian_LegLeft:  '#4a3624',           // pantalon cuir
  Barbarian_LegRight: '#4a3624',
  Barbarian_Cape:     '#2a1a0a',
  default:            '#3a2a18',
};

const PALETTE_RANGER: Record<string, string> = {
  Ranger_Head:    SKIN,
  Ranger_Body:    '#3a4a2a',               // veste vert kaki
  Ranger_ArmLeft: '#3a4a2a',
  Ranger_ArmRight:'#3a4a2a',
  Ranger_LegLeft: '#5a4632',               // pantalon cuir
  Ranger_LegRight:'#5a4632',
  Ranger_Cape:    '#2a3a1c',               // cape vert forêt
  Ranger_Quiver:  '#5a3a24',               // carquois cuir
  default:        '#3a4a2a',
};

// ─────────────────────────────────────────────────────────────────────────────
// Roster narratif Lost Chapter
// ─────────────────────────────────────────────────────────────────────────────
export function CharacterGroup() {
  return (
    <>
      {/* GARDE MÉDIÉVAL — patrouille la nef */}
      <CharacterNPC
        character={KNIGHT_PATROL}
        path={[[-2.4, -14], [2.4, -19], [-1.8, -24], [1.8, -16]]}
        speed={0.5}
        offset={0}
        meshColors={PALETTE_KNIGHT}
      />

      {/* ÉRUDIT / CHERCHEUR — Mage idle face à un portail */}
      <CharacterNPC
        character={MAGE_IDLE}
        position={[-3.0, 0, -20]}
        rotationY={Math.PI * 0.15}
        meshColors={PALETTE_MAGE}
      />

      {/* RÔDEUR / VISITEUR — Rogue qui déambule */}
      <CharacterNPC
        character={ROGUE_WALK}
        path={[[2.4, -13], [2.6, -22], [-1, -25], [-2.4, -15]]}
        speed={0.42}
        offset={1.4}
        meshColors={PALETTE_ROGUE}
      />

      {/* SILHOUETTE MYSTÉRIEUSE — Rogue encapuchonné, lente, ombré */}
      <CharacterNPC
        character={ROGUE_HOODED}
        path={[[0, -26], [-2.5, -22], [2.5, -22], [0, -26]]}
        speed={0.32}
        offset={2.8}
        meshColors={PALETTE_HOODED}
      />

      {/* BÉNÉVOLE / GARDIEN DU SEUIL — Barbarian idle */}
      <CharacterNPC
        character={BARBARIAN_IDLE}
        position={[3.2, 0, -19]}
        rotationY={-Math.PI * 0.2}
        offset={2.3}
        meshColors={PALETTE_BARBARIAN}
      />

      {/* SECOND GARDE en faction (idle) */}
      <CharacterNPC
        character={KNIGHT_IDLE}
        position={[-3.4, 0, -29]}
        rotationY={Math.PI * 0.18}
        offset={3.5}
        meshColors={PALETTE_KNIGHT}
      />

      {/* RANGER — éclaireur curieux qui traverse */}
      <CharacterNPC
        character={RANGER_WALK}
        path={[[-3.2, -28], [3.2, -28], [3.2, -29], [-3.2, -29]]}
        speed={0.36}
        offset={4.7}
        meshColors={PALETTE_RANGER}
      />
    </>
  );
}
