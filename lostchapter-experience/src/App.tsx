import { useEffect } from 'react';
import { useProgress } from '@react-three/drei';
import { CastleScene } from './components/3d/CastleScene';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { CinematicOverlay } from './components/ui/CinematicOverlay';
import { SoundToggle } from './components/ui/SoundToggle';
import { ZonePanel } from './components/ui/ZonePanel';
import { useExperience } from './store';

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
      <LoadingScreen />
    </>
  );
}
