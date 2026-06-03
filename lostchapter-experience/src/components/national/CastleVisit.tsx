import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const BASE = import.meta.env.BASE_URL + 'national/videos/';
// Visite enchaînée : entrée par la herse → couloir aux flambeaux → escalier de
// tour → remparts/fenêtres → grande salle. Un plan absent est simplement sauté.
const CLIPS = ['castle-gate.mp4', 'castle-corridor.mp4', 'castle-staircase.mp4', 'castle-ramparts.mp4', 'castle-hall.mp4'];

/** Visite cinématique first-person du château (plein cadre, aucun texte).
 *  À la fin (ou « Passer »), on débouche dans le hall. */
export function CastleVisit({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const next = () => {
    if (i + 1 < CLIPS.length) setI(i + 1);
    else onDone();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
      className="fixed inset-0 z-40 overflow-hidden bg-black"
    >
      <AnimatePresence>
        <motion.video
          key={i}
          src={BASE + CLIPS[i]} autoPlay muted playsInline preload="auto" onEnded={next} onError={next} aria-hidden
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
      <button
        onClick={onDone}
        className="font-display absolute bottom-6 right-6 z-10 rounded-full border border-goldbright/40 bg-black/40 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-parchment/70 backdrop-blur-sm transition hover:bg-black/60"
      >
        Passer la visite ▸▸
      </button>
    </motion.div>
  );
}
