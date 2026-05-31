import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useProgress } from '@react-three/drei';
import { CastleScene } from './components/3d/CastleScene';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { CinematicOverlay } from './components/ui/CinematicOverlay';
import { SoundToggle } from './components/ui/SoundToggle';
import { ZonePanel } from './components/ui/ZonePanel';
import { useExperience } from './store';

const IS_CATHEDRAL = import.meta.env.BASE_URL.includes('v4');

// Bouton "← Retour au donjon" — uniquement dans la cathédrale, et masqué pendant l'intro guidée.
function BackToDungeon() {
  const tourPhase = useExperience((s) => s.tourPhase);
  if (!IS_CATHEDRAL) return null;
  if (tourPhase === 'cathedral') return null;
  return (
    <a
      href="/experience-v3/"
      className="font-display fixed left-5 top-5 z-50 inline-flex items-center gap-2 rounded-full border border-goldbright/50 bg-stone/70 px-4 py-2 text-xs uppercase tracking-[0.25em] text-parchment shadow-lg backdrop-blur-sm transition hover:scale-105 hover:bg-stone/85"
    >
      ◀ Retour au donjon
    </a>
  );
}

// Bouton "Passer l'intro" — visible pendant la visite guidée pour zapper le cinématique.
function SkipTour() {
  const tourPhase = useExperience((s) => s.tourPhase);
  const endTour = useExperience((s) => s.endTour);
  const setTourPhase = useExperience((s) => s.setTourPhase);
  if (tourPhase !== 'dungeon' && tourPhase !== 'cathedral') return null;
  const skip = () => {
    if (tourPhase === 'dungeon') {
      setTourPhase('done');
    } else {
      endTour();
    }
  };
  return (
    <button
      onClick={skip}
      className="font-display fixed bottom-5 right-5 z-50 rounded-full border border-goldbright/50 bg-stone/70 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-parchment shadow-lg backdrop-blur-sm transition hover:scale-105 hover:bg-stone/85"
    >
      Passer l'intro ▸▸
    </button>
  );
}

// Indice flottant qui apparaît à la fin du tour cathédrale, invitant à cliquer le livre.
function BookCallout() {
  const tourPhase = useExperience((s) => s.tourPhase);
  if (!IS_CATHEDRAL) return null;
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
  const setTourPhase = useExperience((s) => s.setTourPhase);
  const phase = useExperience((s) => s.phase);
  const { progress, active } = useProgress();

  // Le chargement réel est piloté par useProgress (drei) — il reflète le téléchargement
  // des assets (Sponza, etc.). Quand tout est prêt, on déverrouille la porte.
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

  // Auto-démarrage du tour cathédrale quand on arrive avec ?tour=1
  useEffect(() => {
    if (!IS_CATHEDRAL) return;
    if (phase !== 'inside') return;
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('tour') === '1') {
      // Léger délai pour laisser le rendu se stabiliser
      const id = setTimeout(() => setTourPhase('cathedral'), 300);
      return () => clearTimeout(id);
    }
  }, [phase, setTourPhase]);

  return (
    <>
      <CastleScene />
      <CinematicOverlay />
      <ZonePanel />
      <SoundToggle />
      <BackToDungeon />
      <SkipTour />
      <BookCallout />
      <LoadingScreen />
    </>
  );
}
