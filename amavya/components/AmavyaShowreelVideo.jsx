"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "./LangProvider";

// Player vidéo plein écran pour le showreel AMAVYA.
// Le texte (typewriter) est déjà gravé dans le MP4 — pas de track VTT pour éviter le doublon.
const DEFAULT_SRC = "/showreel-amavya.mp4";

const LABELS = {
  fr: { skip: "Passer", mute: "Couper le son", unmute: "Activer le son", close: "Fermer", missing: "La vidéo arrive bientôt.", cta: "Réserver une démo" },
  en: { skip: "Skip", mute: "Mute", unmute: "Unmute", close: "Close", missing: "Video coming soon.", cta: "Book a demo" },
  es: { skip: "Saltar", mute: "Silenciar", unmute: "Activar sonido", close: "Cerrar", missing: "El vídeo llega pronto.", cta: "Reservar una demo" },
};

export default function AmavyaShowreelVideo({
  src = DEFAULT_SRC,
  onClose,
}) {
  const { lang } = useLang();
  const t = LABELS[lang] || LABELS.fr;
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [missing, setMissing] = useState(false);
  const [ended, setEnded] = useState(false);

  // ESC pour fermer
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lecture forcée (best-effort) — le navigateur permet l'autoplay si muet
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
  }, []);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !v.muted;
    v.muted = next;
    setMuted(next);
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-black">
      {/* Vidéo en plein écran (sous-titres déjà gravés dans le montage) */}
      {!missing && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          ref={videoRef}
          src={src}
          autoPlay
          muted={muted}
          playsInline
          preload="auto"
          onError={() => setMissing(true)}
          onEnded={() => setEnded(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Fallback gracieux si la vidéo manque */}
      {missing && (
        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="AMAVYA"
            className="h-auto w-[28vmin] max-w-[320px]"
            style={{
              filter:
                "drop-shadow(0 12px 40px rgba(240,210,122,0.55))",
            }}
          />
          <p className="text-sm uppercase tracking-[0.35em] text-gold-bright">
            {t.missing}
          </p>
        </div>
      )}

      {/* Voile sombre haut/bas pour les contrôles */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-black/70 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-black/70 to-transparent"
      />

      {/* Bouton fermer (haut-droite) */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label={t.close}
          className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/60 text-paper backdrop-blur transition-colors hover:border-gold/50 hover:text-gold-bright"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </button>
      )}

      {/* Bouton son (bas-droite) */}
      {!missing && (
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? t.unmute : t.mute}
          className="absolute bottom-6 right-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/60 text-paper backdrop-blur transition-colors hover:border-gold/50 hover:text-gold-bright"
        >
          {muted ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M11 5L6 9H3v6h3l5 4V5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M11 5L6 9H3v6h3l5 4V5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="M16 9c1.5 1 1.5 5 0 6M19 6c3 2.5 3 9.5 0 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      )}

      {/* Bouton Skip (bas-centre) */}
      {!missing && !ended && (
        <button
          type="button"
          onClick={() => onClose?.()}
          className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/15 bg-black/60 px-5 py-2 text-xs uppercase tracking-[0.3em] text-paper/85 backdrop-blur transition-colors hover:border-gold/50 hover:text-gold-bright"
        >
          {t.skip}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="ml-2 inline">
            <path d="M6 5l8 7-8 7zM16 5h2v14h-2z" />
          </svg>
        </button>
      )}

      {/* Fallback CTA si la vidéo se termine sans onClose */}
      {ended && !onClose && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-x-0 bottom-12 z-20 flex justify-center"
        >
          <a
            href="/#contact"
            className="rounded-full bg-[linear-gradient(110deg,#a87f2e,#f0d27a_55%,#d4af37)] px-6 py-3 text-sm font-semibold text-ink shadow-[0_8px_40px_-12px_rgba(212,175,55,0.7)] transition-transform hover:-translate-y-0.5"
          >
            {t.cta}
          </a>
        </motion.div>
      )}
    </div>
  );
}
