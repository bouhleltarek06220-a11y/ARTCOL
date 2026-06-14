import { useState } from 'react';
import { CinematicIntro } from './CinematicIntro';
import { CastleVisit } from './CastleVisit';
import { FinalTableau } from './FinalTableau';

type Mode = 'intro' | 'visiting' | 'final';

/** Expérience LOST CHAPTER — pur flux cinématique (plus de hall/carte/portails) :
 *  intro château (sans texte) → visite first-person du château → tableau final
 *  (la grande salle, l'équipe autour de la table, le livre cliquable). */
export default function LostChapterExperience() {
  const [mode, setMode] = useState<Mode>('intro');

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {mode === 'intro' && <CinematicIntro onEnter={() => setMode('visiting')} />}
      {mode === 'visiting' && <CastleVisit onDone={() => setMode('final')} />}
      {mode === 'final' && <FinalTableau />}
    </div>
  );
}
