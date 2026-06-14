import { AnimatePresence, motion } from 'framer-motion';
import { useExperience } from '../../store';

export function LoadingScreen() {
  const phase = useExperience((s) => s.phase);
  const progress = useExperience((s) => s.progress);

  return (
    <AnimatePresence>
      {phase === 'loading' && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-50 grid place-items-center bg-[#070402]"
        >
          <div className="text-center">
            <p className="title-medieval text-3xl text-parchment">Lost Chapter</p>
            <p className="font-ui mt-3 text-[11px] uppercase tracking-[0.4em] text-parchment/40">Le château s’éveille…</p>
            <div className="mx-auto mt-5 h-[3px] w-52 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-[#a07840] to-goldbright transition-[width] duration-200"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
