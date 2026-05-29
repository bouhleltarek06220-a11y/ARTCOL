import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useExperience } from '../../store';
import { zones } from '../../data/zones';

export function ZonePanel() {
  const id = useExperience((s) => s.selectedZone);
  const close = useExperience((s) => s.closeZone);
  const step = useExperience((s) => s.stepZone);
  const idx = zones.findIndex((x) => x.id === id);
  const z = idx >= 0 ? zones[idx] : null;

  // Navigation clavier : ← → pour défiler les slides, Échap pour fermer
  useEffect(() => {
    if (!z) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [z, step, close]);

  return (
    <AnimatePresence mode="wait">
      {z && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-auto fixed inset-0 z-[60] grid place-items-center bg-black/70 backdrop-blur-md"
          onClick={close}
        >
          <motion.div
            key={z.id}
            initial={{ y: 26, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.45 }}
            onClick={(e) => e.stopPropagation()}
            className="parchment-panel relative mx-6 w-full max-w-3xl rounded-2xl p-8 md:p-14"
          >
            {/* Numéro de section */}
            <p className="font-display text-xs uppercase tracking-[0.5em] text-[#7a4a18]">
              Chapitre {idx + 1} / {zones.length}
            </p>
            <h2 className="font-medieval mt-3 text-5xl text-[#2a1810] md:text-6xl">
              {z.title}
            </h2>
            <div className="mt-5 h-[2px] w-20 bg-gradient-to-r from-transparent via-[#7a4a18] to-transparent" />
            <p className="font-ui mt-5 text-lg italic text-[#3a2412]/80">{z.blurb}</p>

            {/* Contenu de la slide */}
            <ul className="font-ui mt-7 space-y-3">
              {z.content.map((line, i) => (
                <li key={i} className="flex items-start gap-3 text-base text-[#2a1810] md:text-lg">
                  <span className="mt-2 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#7a4a18]" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            {/* Barre de navigation */}
            <div className="mt-10 flex items-center justify-between">
              <button
                onClick={() => step(-1)}
                className="font-display rounded-md border border-[#3a2412]/50 px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-[#2a1810] transition hover:bg-[#3a2412]/15"
              >
                ◀ Précédent
              </button>

              {/* Pastilles de progression */}
              <div className="flex gap-1.5">
                {zones.map((zz, i) => (
                  <span
                    key={zz.id}
                    className={`h-1.5 w-1.5 rounded-full ${i === idx ? 'bg-[#7a4a18]' : 'bg-[#3a2412]/25'}`}
                  />
                ))}
              </div>

              <button
                onClick={() => step(1)}
                className="font-display rounded-md border border-[#3a2412] bg-[#3a2412] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-parchment transition hover:bg-[#1a0f08] hover:scale-[1.03]"
              >
                Suivant ▶
              </button>
            </div>

            {/* Fermer */}
            <button
              onClick={close}
              aria-label="Fermer"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-[#3a2412]/40 text-[#3a2412] transition hover:bg-[#3a2412]/15"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
