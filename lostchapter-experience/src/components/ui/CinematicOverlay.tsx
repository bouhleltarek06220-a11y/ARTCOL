import { AnimatePresence, motion } from 'framer-motion';
import { useExperience } from '../../store';

// Intro minimaliste : juste "LOST CHAPTER" animé lettre par lettre + un seul bouton.
const TITLE = 'LOST CHAPTER';

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
            className="pointer-events-auto absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          >
            <motion.h1
              className="title-medieval text-parchment text-[clamp(56px,14vw,180px)] leading-[0.9] tracking-[0.04em] drop-shadow-[0_0_28px_rgba(255,180,80,0.35)]"
              aria-label={TITLE}
            >
              {TITLE.split('').map((ch, i) => (
                <motion.span
                  key={`${ch}-${i}`}
                  initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    textShadow: [
                      '0 0 10px rgba(255,170,70,0.0)',
                      '0 0 28px rgba(255,170,70,0.55)',
                      '0 0 16px rgba(255,170,70,0.25)',
                    ],
                  }}
                  transition={{
                    delay: 0.15 + i * 0.08,
                    duration: 1,
                    ease: [0.22, 0.61, 0.36, 1],
                    textShadow: { duration: 3.5, repeat: Infinity, repeatType: 'mirror', delay: 1.4 + i * 0.05 },
                  }}
                  className="inline-block"
                  style={ch === ' ' ? { width: '0.4em' } : undefined}
                >
                  {ch === ' ' ? ' ' : ch}
                </motion.span>
              ))}
            </motion.h1>

            <motion.button
              onClick={enter}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
              className="font-display mt-12 rounded-md border border-goldbright bg-gradient-to-br from-goldbright to-gold px-10 py-4 text-sm font-bold uppercase tracking-[0.35em] text-stone shadow-[0_8px_28px_rgba(255,150,60,0.35)] transition hover:scale-[1.05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-goldbright"
            >
              Entrer
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
