import { AnimatePresence, motion } from 'framer-motion';
import { useExperience } from '../../store';

// Bulle de dialogue qui s'ouvre quand on clique sur un perso de l'équipe.
// Fond parchemin (image + fallback CSS), texte ink médiéval.
export function CharacterDialogue() {
  const character = useExperience((s) => s.selectedCharacter);
  const close = useExperience((s) => s.closeCharacter);

  return (
    <AnimatePresence>
      {character && (
        <motion.div
          key="dialogue-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="pointer-events-auto fixed inset-0 z-[70] flex items-end justify-center pb-12 md:items-center md:pb-0"
          onClick={close}
        >
          <motion.div
            key={character.id}
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={(e) => e.stopPropagation()}
            className="parchment-panel relative mx-4 w-full max-w-2xl rounded-lg p-7 md:p-10"
          >
            {/* Onglet nom (bandeau parchemin foncé) */}
            <div className="font-medieval mb-4 inline-block rounded-md border border-[#3a2412]/30 bg-[#3a2412] px-4 py-1.5 text-sm font-bold uppercase tracking-[0.3em] text-parchment shadow">
              {character.name}
            </div>
            {/* Texte du dialogue */}
            <div className="font-ui space-y-3 text-[#2a1810]">
              {character.lines.map((line, i) => (
                <p
                  key={i}
                  className={i === 0 ? 'text-lg font-semibold md:text-xl' : 'text-base leading-relaxed md:text-lg'}
                >
                  {line}
                </p>
              ))}
            </div>
            {/* Fermer (×) */}
            <button
              onClick={close}
              aria-label="Fermer"
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-[#3a2412]/30 bg-[#1a0f08]/10 text-[#3a2412] transition hover:bg-[#3a2412]/20"
            >
              ✕
            </button>
            {/* CTA continuer */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={close}
                className="font-display rounded-md border border-[#3a2412]/40 bg-[#3a2412] px-5 py-2 text-xs uppercase tracking-[0.25em] text-parchment transition hover:bg-[#1a0f08]"
              >
                Continuer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
