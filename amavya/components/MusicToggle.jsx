"use client";

import { useRef, useState } from "react";

/**
 * Bouton flottant pour activer/couper la musique d'ambiance.
 * Pas d'autoplay (bloqué par les navigateurs + respect de l'utilisateur) :
 * la musique démarre au clic.
 */
export default function MusicToggle() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.volume = 0.35;
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/ambient.mp3" loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Couper la musique" : "Activer la musique d'ambiance"}
        aria-pressed={playing}
        className="glass-strong fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 text-gold-bright shadow-[0_8px_30px_-8px_rgba(212,175,55,0.6)] transition-all hover:-translate-y-0.5"
      >
        {playing ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5 6 9H2v6h4l5 4z" fill="currentColor" stroke="none" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M18.5 5.5a9 9 0 0 1 0 13" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5 6 9H2v6h4l5 4z" fill="currentColor" stroke="none" />
            <path d="m23 9-6 6M17 9l6 6" />
          </svg>
        )}
      </button>
    </>
  );
}
