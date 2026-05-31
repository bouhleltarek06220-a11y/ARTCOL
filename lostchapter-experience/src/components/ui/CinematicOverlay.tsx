import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useExperience } from '../../store';

const INTRO_VIDEO = '/assets/video/lost-chapter-experience.mp4';

export function CinematicOverlay() {
  const phase = useExperience((s) => s.phase);
  const enter = useExperience((s) => s.enter);
  const startTour = useExperience((s) => s.startTour);
  const muted = useExperience((s) => s.muted);
  const toggleMute = useExperience((s) => s.toggleMute);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoUnmuted, setVideoUnmuted] = useState(false);

  const onEnter = () => {
    // Geste utilisateur : on déverrouille l'autoplay audio et on lance la musique.
    if (muted) toggleMute();
    startTour();
    enter();
  };

  const unmuteVideo = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.volume = 0.85;
    setVideoUnmuted(true);
    // En débloquant l'audio ici, on satisfait aussi l'autoplay policy pour la musique de fond.
    if (muted) toggleMute();
  };

  const skipVideo = () => {
    videoRef.current?.pause();
    setVideoEnded(true);
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      <AnimatePresence>
        {phase === 'gate' && (
          <motion.div
            key="gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.9 }}
            className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black"
          >
            {/* ── Vidéo cinématique d'intro (8s) ── */}
            {!videoEnded && (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  preload="auto"
                  onEnded={() => setVideoEnded(true)}
                  className="absolute inset-0 h-full w-full object-cover"
                  src={INTRO_VIDEO}
                />
                {/* Vignette pour dramatiser */}
                <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 55%, transparent 50%, rgba(0,0,0,0.55) 100%)' }} />
                {/* Activer le son */}
                {!videoUnmuted && (
                  <button
                    onClick={unmuteVideo}
                    className="font-display absolute bottom-6 left-6 rounded-full border border-goldbright/55 bg-stone/65 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-parchment/90 shadow-lg backdrop-blur-sm transition hover:scale-105 hover:bg-stone/85"
                  >
                    🔊 Activer le son
                  </button>
                )}
                {/* Passer la vidéo */}
                <button
                  onClick={skipVideo}
                  className="font-display absolute bottom-6 right-6 rounded-full border border-goldbright/40 bg-stone/55 px-4 py-2 text-[10px] uppercase tracking-[0.32em] text-parchment/70 backdrop-blur-sm transition hover:bg-stone/85"
                >
                  Passer ▸▸
                </button>
              </>
            )}

            {/* ── Bouton Entrer — apparaît à la fin de la vidéo ── */}
            {videoEnded && (
              <motion.button
                onClick={onEnter}
                initial={{ opacity: 0, y: 14, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
                className="font-display rounded-md border border-goldbright bg-gradient-to-br from-goldbright to-gold px-14 py-5 text-base font-bold uppercase tracking-[0.45em] text-stone shadow-[0_12px_36px_rgba(255,150,60,0.5)] transition hover:scale-[1.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-goldbright"
              >
                Entrer
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
