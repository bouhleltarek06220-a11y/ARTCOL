import { AnimatePresence, motion } from 'framer-motion';
import { useExperience } from '../../store';

// Intro minimaliste : un seul bouton "Entrer", pas de texte.
export function CinematicOverlay() {
  const phase = useExperience((s) => s.phase);
  const enter = useExperience((s) => s.enter);

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
            className="pointer-events-auto absolute inset-0 flex items-center justify-center px-6"
          >
            <motion.button
              onClick={enter}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
              className="font-display rounded-md border border-goldbright bg-gradient-to-br from-goldbright to-gold px-12 py-4 text-sm font-bold uppercase tracking-[0.4em] text-stone shadow-[0_8px_28px_rgba(255,150,60,0.4)] transition hover:scale-[1.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-goldbright"
            >
              Entrer
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
