import { useEffect } from 'react';
import { useProgress } from '@react-three/drei';
import { CastleScene } from './components/3d/CastleScene';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { CinematicOverlay } from './components/ui/CinematicOverlay';
import { SoundToggle } from './components/ui/SoundToggle';
import { ZonePanel } from './components/ui/ZonePanel';
import { useExperience } from './store';

// Petit bouton "← Retour au donjon" affiché uniquement dans la cathédrale
// (/experience-v4/) pour permettre de revenir au monde précédent.
function BackToDungeon() {
  if (!import.meta.env.BASE_URL.includes('v4')) return null;
  return (
    <a
      href="/experience-v3/"
      className="font-display fixed left-5 top-5 z-50 inline-flex items-center gap-2 rounded-full border border-goldbright/50 bg-stone/70 px-4 py-2 text-xs uppercase tracking-[0.25em] text-parchment shadow-lg backdrop-blur-sm transition hover:scale-105 hover:bg-stone/85"
    >
      ◀ Retour au donjon
    </a>
  );
}

export default function App() {
  const setProgress = useExperience((s) => s.setProgress);
  const ready = useExperience((s) => s.ready);
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

  // Garde-fou : si aucun asset à charger (mobile sans Sponza, ou échec de chargement),
  // on débloque la porte au bout de 7s pour ne pas laisser l'utilisateur coincé.
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
      <BackToDungeon />
      <LoadingScreen />
    </>
  );
}
