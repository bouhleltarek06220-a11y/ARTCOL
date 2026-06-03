import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const POSTER = import.meta.env.BASE_URL + 'national/intro.png';
const VIDEO = import.meta.env.BASE_URL + 'national/videos/intro.mp4';
const LINES = [
  'Chaque pierre cache une mémoire.',
  'Chaque lieu attend son chapitre.',
  'Entrez dans LOST CHAPTER.',
];

/** Plan-large cinématique d'ouverture : forteresse au crépuscule, tirades qui
 *  apparaissent l'une après l'autre, puis bouton « Entrer ». */
export function CinematicIntro({ onEnter }: { onEnter: () => void }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => Math.min(s + 1, LINES.length)), 1700);
    return () => clearInterval(id);
  }, []);
  const ready = step >= LINES.length;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.04 }} transition={{ duration: 1 }}
      className="fixed inset-0 z-40 flex flex-col items-center justify-center overflow-hidden bg-black"
    >
      <video
        src={VIDEO} poster={POSTER} autoPlay muted loop playsInline preload="auto" aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 110% 85% at 50% 52%, rgba(0,0,0,.20) 28%, rgba(0,0,0,.88) 100%)' }} />

      <div className="relative z-10 px-6 text-center">
        {LINES.map((l, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={step > i ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.1, ease: [0.22, 0.61, 0.36, 1] }}
            className="font-display"
            style={{ fontSize: 'clamp(20px,3.4vw,40px)', color: '#f3e6c4', letterSpacing: '0.08em', lineHeight: 1.55, textShadow: '0 2px 30px rgba(0,0,0,.85)' }}
          >
            {l}
          </motion.p>
        ))}

        <AnimatePresence>
          {ready && (
            <motion.button
              initial={{ opacity: 0, y: 14, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8 }}
              onClick={onEnter}
              className="font-display mt-10 rounded-md border border-goldbright bg-gradient-to-br from-goldbright to-gold px-12 py-4 text-base font-bold uppercase tracking-[0.4em] text-stone shadow-[0_12px_36px_rgba(255,150,60,0.5)] transition hover:scale-[1.06]"
            >
              Entrer
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={onEnter}
        className="font-display absolute bottom-6 right-6 z-10 rounded-full border border-goldbright/40 bg-black/40 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-parchment/70 backdrop-blur-sm transition hover:bg-black/60"
      >
        Passer ▸▸
      </button>
    </motion.div>
  );
}
