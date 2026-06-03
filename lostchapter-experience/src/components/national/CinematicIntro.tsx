import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const POSTER = import.meta.env.BASE_URL + 'national/intro.png';
const VIDEO = import.meta.env.BASE_URL + 'national/videos/intro.mp4';

/** Intro : la séquence cinématique du château en plein cadre, AUCUN texte par-
 *  dessus — seulement un bouton « Entrer » discret en bas pour lancer la visite. */
export function CinematicIntro({ onEnter }: { onEnter: () => void }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setReady(true), 2400);
    return () => clearTimeout(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.04 }} transition={{ duration: 1 }}
      className="fixed inset-0 z-40 flex items-end justify-center overflow-hidden bg-black pb-16"
    >
      <video
        src={VIDEO} poster={POSTER} autoPlay muted loop playsInline preload="auto" aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Fin fondu en bas, uniquement pour la lisibilité du bouton (ne masque pas le château) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,.65), transparent)' }} />

      <AnimatePresence>
        {ready && (
          <motion.button
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            onClick={onEnter}
            className="font-display relative z-10 rounded-md border border-goldbright bg-gradient-to-br from-goldbright to-gold px-12 py-4 text-base font-bold uppercase tracking-[0.4em] text-stone shadow-[0_12px_36px_rgba(255,150,60,0.5)] transition hover:scale-[1.06]"
          >
            Entrer dans le château
          </motion.button>
        )}
      </AnimatePresence>

      <button
        onClick={onEnter}
        className="font-display absolute bottom-6 right-6 z-10 rounded-full border border-goldbright/40 bg-black/40 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-parchment/70 backdrop-blur-sm transition hover:bg-black/60"
      >
        Passer ▸▸
      </button>
    </motion.div>
  );
}
