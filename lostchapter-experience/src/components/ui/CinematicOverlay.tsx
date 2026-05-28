import { AnimatePresence, motion } from 'framer-motion';
import { useExperience } from '../../store';

// Overlay narratif : grand titre + CTA à l'extérieur du château, indices subtils dans le hall.
// La navigation principale du hall se fait via les portails 3D interactifs.
export function CinematicOverlay() {
  const phase = useExperience((s) => s.phase);
  const enter = useExperience((s) => s.enter);
  const skip = useExperience((s) => s.skip);

  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      <AnimatePresence>
        {phase === 'gate' && (
          <motion.div
            key="gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.9 }}
            className="pointer-events-auto absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          >
            <p className="font-display mb-5 text-xs uppercase tracking-[0.5em] text-gold">
              Réveillez l'Histoire
            </p>
            <h1 className="title-medieval text-parchment text-[clamp(44px,12vw,140px)] leading-[0.9]">
              Lost Chapter
            </h1>
            <p className="font-ui mt-5 max-w-md italic text-parchment/70">
              Derrière ces portes dort un chapitre oublié. Poussez-les — et entrez.
            </p>
            <button
              onClick={enter}
              className="font-display mt-10 rounded-md border border-goldbright bg-gradient-to-br from-goldbright to-gold px-9 py-4 text-sm font-bold uppercase tracking-[0.25em] text-stone transition hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-goldbright"
            >
              Entrer dans le château
            </button>
            <button
              onClick={skip}
              className="font-ui mt-5 text-[11px] uppercase tracking-[0.2em] text-parchment/40 transition hover:text-goldbright"
            >
              Passer l'intro
            </button>
          </motion.div>
        )}

        {phase === 'inside' && (
          <motion.div
            key="inside-hint"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="pointer-events-none absolute inset-x-0 top-24 flex justify-center"
          >
            <p className="font-display rounded-full border border-gold/30 bg-stone/55 px-5 py-2 text-[10px] uppercase tracking-[0.4em] text-parchment/75 backdrop-blur-sm">
              Survolez un portail pour révéler son chapitre
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
