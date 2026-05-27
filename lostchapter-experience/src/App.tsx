import { useEffect } from 'react';
import { CastleScene } from './components/3d/CastleScene';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { CinematicOverlay } from './components/ui/CinematicOverlay';
import { SoundToggle } from './components/ui/SoundToggle';
import { useExperience } from './store';

export default function App() {
  const setProgress = useExperience((s) => s.setProgress);
  const ready = useExperience((s) => s.ready);

  // Phase 1 : pas encore de gros modèle 3D -> chargement simulé court.
  // (Sera remplacé par un vrai suivi de chargement quand les modèles seront intégrés.)
  useEffect(() => {
    let p = 0;
    const id = setInterval(() => {
      p = Math.min(1, p + 0.08 + Math.random() * 0.06);
      setProgress(p);
      if (p >= 1) {
        clearInterval(id);
        setTimeout(ready, 300);
      }
    }, 120);
    return () => clearInterval(id);
  }, [setProgress, ready]);

  return (
    <>
      <CastleScene />
      <CinematicOverlay />
      <SoundToggle />
      <LoadingScreen />
    </>
  );
}
