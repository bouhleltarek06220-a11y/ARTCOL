import { AnimatePresence, motion } from 'framer-motion';
import { useExperience } from '../../store';
import { zones } from '../../data/zones';

const accentText: Record<string, string> = {
  torch: 'text-torch',
  twitch: 'text-twitch',
  gold: 'text-goldbright',
};

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
            <p className="font-display mb-5 text-xs uppercase tracking-[0.5em] text-gold">Réveillez l’Histoire</p>
            <h1 className="title-medieval text-parchment text-[clamp(44px,12vw,140px)] leading-[0.9]">Lost Chapter</h1>
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
              Passer l’intro
            </button>
          </motion.div>
        )}

        {phase === 'inside' && (
          <motion.div
            key="inside"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="pointer-events-auto absolute inset-x-0 bottom-0 p-5 sm:p-6"
          >
            <div className="mx-auto max-w-5xl">
              <p className="font-display text-center text-xs uppercase tracking-[0.4em] text-gold">
                Le Hall — choisissez une voie
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {zones.map((z) => (
                  <button
                    key={z.id}
                    className="group rounded-lg border border-gold/30 bg-stone/60 p-4 text-left backdrop-blur-sm transition hover:border-goldbright hover:bg-stone/80"
                  >
                    <span className={`font-medieval block text-base ${accentText[z.accent]}`}>{z.title}</span>
                    <span className="font-ui mt-1 block text-[12px] leading-snug text-parchment/55">{z.blurb}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
