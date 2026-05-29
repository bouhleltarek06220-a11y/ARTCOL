import { useEffect, useRef } from 'react';
import { useExperience } from '../../store';

// Musique médiévale (valse de tank — uploadée par l'utilisateur).
const TRACK = '/assets/sound/medieval_waltz.mp3';
export function SoundToggle() {
  const muted = useExperience((s) => s.muted);
  const toggle = useExperience((s) => s.toggleMute);
  const phase = useExperience((s) => s.phase);
  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const a = new Audio(TRACK);
    a.loop = true;
    a.volume = 0.45;
    audio.current = a;
    return () => {
      a.pause();
    };
  }, []);

  useEffect(() => {
    const a = audio.current;
    if (!a) return;
    if (!muted && phase !== 'loading') {
      a.play().catch(() => {});
    } else {
      a.pause();
    }
  }, [muted, phase]);

  if (phase === 'loading') return null;

  return (
    <button
      onClick={toggle}
      aria-label={muted ? 'Activer le son' : 'Couper le son'}
      className="fixed bottom-5 right-5 z-50 grid h-12 w-12 place-items-center rounded-full border border-goldbright/50 bg-gradient-to-br from-goldbright to-gold text-stone shadow-lg transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goldbright"
    >
      {muted ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M4 9v6h4l5 5V4L8 9H4zm14.5 3 2.7-2.7-1.4-1.4L17 10.6 14.3 7.9l-1.4 1.4L15.6 12l-2.7 2.7 1.4 1.4L17 13.4l2.7 2.7 1.4-1.4z" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M4 9v6h4l5 5V4L8 9H4zm12 .03c1.2.5 2 1.7 2 3 0 1.3-.8 2.5-2 3v-6z" />
        </svg>
      )}
    </button>
  );
}
