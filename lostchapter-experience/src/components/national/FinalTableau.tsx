import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Fond de la scène finale : la grande salle (la table + la cheminée). Sera
// remplacé par la scène générée avec Tarek / Julie / Myriam autour de la table.
const HALL = import.meta.env.BASE_URL + 'national/videos/castle-hall.mp4';

// Où s'ouvre la soutenance quand on clique le livre.
// (À pointer vers l'URL finale du deck quand le projet soutenance sera en place.)
const SOUTENANCE_URL = 'https://lostchapter.vercel.app/Soutenance';

/** Tableau final : on est arrivé dans la grande salle. Un livre ouvert qui
 *  rayonne et pulse, cliquable → ouvre la présentation de la soutenance. */
export function FinalTableau() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setReady(true), 1400);
    return () => clearTimeout(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
      className="fixed inset-0 overflow-hidden bg-black"
    >
      <video src={HALL} autoPlay muted loop playsInline preload="auto" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 75% 60% at 50% 78%, transparent 30%, rgba(0,0,0,.72) 100%)' }} />

      <AnimatePresence>
        {ready && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
            className="absolute inset-x-0 bottom-[14%] z-10 flex flex-col items-center"
          >
            <button
              onClick={() => window.open(SOUTENANCE_URL, '_blank')}
              className="group relative flex flex-col items-center"
              aria-label="Ouvrir la soutenance"
            >
              <span className="text-[64px] leading-none transition-transform duration-300 group-hover:scale-110" style={{ filter: 'drop-shadow(0 0 22px rgba(229,199,136,.9)) drop-shadow(0 0 50px rgba(229,199,136,.5))' }}>📖</span>
              <span className="font-display mt-4 rounded-md border border-goldbright bg-gradient-to-br from-goldbright to-gold px-8 py-3 text-sm font-bold uppercase tracking-[0.32em] text-stone shadow-[0_10px_30px_rgba(229,199,136,.45)] transition group-hover:scale-105">
                Ouvrir la soutenance
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
