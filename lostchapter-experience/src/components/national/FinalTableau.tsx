import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BASE = import.meta.env.BASE_URL + 'national/';
const TABLE_VIDEO = BASE + 'videos/final-table.mp4';
const TABLE_POSTER = BASE + 'final-table.png';

// Le livre ouvre la soutenance servie sur le MÊME hôte privé (jury-only) que
// l'expérience — même lien protégé, rien sur le site public. Chemin relatif à
// l'origine pour rester valable quel que soit le domaine de preview.
const SOUTENANCE_URL = '/Soutenance';

/** Tableau final : l'équipe (Tarek / Julie / Myriam) autour de la table dans la
 *  grande salle, le livre ouvert lumineux au centre. Cliquer le livre → ouvre la
 *  présentation de la soutenance. */
export function FinalTableau() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setReady(true), 1600);
    return () => clearTimeout(id);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.1 }} className="fixed inset-0 overflow-hidden bg-black">
      <video src={TABLE_VIDEO} poster={TABLE_POSTER} autoPlay muted loop playsInline preload="auto" aria-hidden className="absolute inset-0 h-full w-full object-cover" />

      {/* Zone cliquable posée sur le livre lumineux (centre de la table) */}
      <AnimatePresence>
        {ready && (
          <motion.button
            onClick={() => window.open(SOUTENANCE_URL, '_blank')}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
            className="group absolute left-1/2 top-[72%] z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{ width: 'min(22vw, 280px)', height: 'min(10vw, 130px)' }}
            aria-label="Ouvrir la soutenance"
          >
            <span className="absolute inset-0 animate-pulse rounded-[45%]" style={{ boxShadow: '0 0 44px 14px rgba(255,210,120,.5)', background: 'radial-gradient(ellipse, rgba(255,214,128,.22), transparent 70%)' }} />
            <span className="absolute inset-[-6%] rounded-[45%] border-2 border-transparent transition duration-300 group-hover:border-goldbright/80 group-hover:shadow-[0_0_30px_rgba(229,199,136,.7)]" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Invitation au clic */}
      <AnimatePresence>
        {ready && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3 }}
            className="pointer-events-none absolute inset-x-0 bottom-[9%] z-10 text-center"
          >
            <span className="font-display rounded-full border border-goldbright/60 bg-black/45 px-6 py-2 text-xs uppercase tracking-[0.32em] text-parchment backdrop-blur-sm" style={{ textShadow: '0 0 12px rgba(255,210,120,.6)' }}>
              <span className="animate-pulse">✦</span>&nbsp; Cliquez le livre pour ouvrir la soutenance &nbsp;<span className="animate-pulse">✦</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
