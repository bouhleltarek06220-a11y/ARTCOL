import { AnimatePresence, motion } from 'framer-motion';
import { useExperience } from '../../store';
import { zones } from '../../data/zones';

export function ZonePanel() {
  const id = useExperience((s) => s.selectedZone);
  const close = useExperience((s) => s.closeZone);
  const z = zones.find((x) => x.id === id);

  return (
    <AnimatePresence>
      {z && (
        <motion.div
          key={z.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="pointer-events-auto fixed inset-0 z-[60] grid place-items-center bg-black/65 backdrop-blur-md"
          onClick={close}
        >
          <motion.div
            initial={{ y: 28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            onClick={(e) => e.stopPropagation()}
            className="mx-6 max-w-2xl rounded-xl border border-gold/40 bg-[#1a0f08]/90 p-8 text-center text-parchment shadow-[0_30px_120px_rgba(0,0,0,0.6)] md:p-12"
          >
            <p className="font-display text-xs uppercase tracking-[0.5em] text-gold">Chapitre</p>
            <h2
              className="font-medieval mt-4 text-4xl text-parchment md:text-5xl"
              style={{ textShadow: '0 0 28px rgba(229,199,136,0.42)' }}
            >
              {z.title}
            </h2>
            <div className="mx-auto my-6 h-[2px] w-16 bg-gradient-to-r from-transparent via-goldbright to-transparent" />
            <p className="font-ui text-base text-parchment/80 md:text-lg">{z.blurb}</p>
            <p className="font-ui mt-6 text-xs italic text-parchment/40">
              La salle se révèle bientôt — un prochain chapitre vous y accueillera.
            </p>
            <button
              onClick={close}
              className="font-display mt-8 rounded-md border border-goldbright/60 px-7 py-3 text-xs uppercase tracking-[0.3em] text-parchment transition hover:bg-goldbright hover:text-stone focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goldbright"
            >
              Retour au hall
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
