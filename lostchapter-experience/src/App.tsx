import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useProgress } from '@react-three/drei';
import { CastleScene } from './components/3d/CastleScene';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { CinematicOverlay } from './components/ui/CinematicOverlay';
import { SoundToggle } from './components/ui/SoundToggle';
import { ZonePanel } from './components/ui/ZonePanel';
import { useExperience } from './store';

// Bouton "Passer l'intro" — visible pendant la visite caméra guidée.
function SkipTour() {
  const tourPhase = useExperience((s) => s.tourPhase);
  const endTour = useExperience((s) => s.endTour);
  if (tourPhase !== 'dungeon' && tourPhase !== 'cathedral') return null;
  return (
    <button
      onClick={endTour}
      className="font-display fixed bottom-5 right-5 z-50 rounded-full border border-goldbright/50 bg-stone/70 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-parchment shadow-lg backdrop-blur-sm transition hover:scale-105 hover:bg-stone/85"
    >
      Passer l'intro ▸▸
    </button>
  );
}

// Indice flottant qui apparaît à la fin de la visite, invitant à cliquer le livre flottant.
function BookCallout() {
  const tourPhase = useExperience((s) => s.tourPhase);
  if (tourPhase !== 'done') return null;
  return (
    <AnimatePresence>
      <motion.div
        key="book-callout"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="pointer-events-none fixed bottom-12 left-1/2 z-40 -translate-x-1/2"
      >
        <div className="parchment-panel font-display rounded-full px-6 py-3 text-xs uppercase tracking-[0.35em] text-[#2a1810] shadow-2xl">
          <span className="mr-2 animate-pulse">✦</span>
          Cliquez sur le livre pour ouvrir la soutenance
          <span className="ml-2 animate-pulse">✦</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const setProgress = useExperience((s) => s.setProgress);
  const ready = useExperience((s) => s.ready);
  const { progress, active } = useProgress();

  // Le chargement réel est piloté par useProgress (drei) : il reflète le téléchargement
  // des assets (Sponza, Dungeon, etc.). Quand tout est prêt, on déverrouille la porte.
  useEffect(() => {
    setProgress(progress / 100);
    if (!active && progress >= 99.99) {
      const id = setTimeout(ready, 400);
      return () => clearTimeout(id);
    }
  }, [progress, active, setProgress, ready]);

  // Garde-fou : si aucun asset à charger, on débloque au bout de 7s.
  useEffect(() => {
    const fallback = setTimeout(ready, 7000);
    return () => clearTimeout(fallback);
  }, [ready]);

  return (
    <>
      <CastleScene />
      <CinematicOverlay />
      <ZonePanel />
      <SoundToggle />
      <SkipTour />
      <BookCallout />
      <LoadingScreen />
    </>
  );
}
