"use client";

import { motion } from "framer-motion";

function mmss(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

/**
 * HUD du showreel : bandes cinéma + timer + label scène + boutons.
 */
export default function ShowreelHud({
  sceneLabel,
  totalElapsedMs,
  totalDurationMs,
  isPlaying,
  isMuted,
  onTogglePlay,
  onToggleMute,
  onSkip,
  onClose,
  onReplay,
  t,
  watermark = "amavya.cloud",
  showReplay = false,
}) {
  return (
    <>
      {/* Bandes cinéma — uniquement desktop */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[95] hidden h-[7vh] bg-black md:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[95] hidden h-[7vh] bg-black md:block"
      />

      {/* HUD : label scène + timer + close */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex items-start justify-between p-4 md:p-5">
        <motion.div
          key={sceneLabel}
          initial={{ opacity: 0, y: -6, letterSpacing: "0.5em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.32em" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-full border border-gold/30 bg-black/70 px-3.5 py-1.5 text-[10px] uppercase text-gold-bright backdrop-blur"
          style={{ letterSpacing: "0.32em" }}
        >
          {sceneLabel}
        </motion.div>

        <div className="flex items-center gap-2">
          <div
            aria-label="Timer"
            className="rounded-full border border-white/15 bg-black/70 px-3.5 py-1.5 text-[11px] font-medium text-paper backdrop-blur"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {mmss(totalElapsedMs)} / {mmss(totalDurationMs)}
          </div>
          <HudIcon onClick={onClose} label={t.close}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </HudIcon>
        </div>
      </div>

      {/* Controls bas-droite : play / mute / skip / replay */}
      <div className="pointer-events-none fixed bottom-0 right-0 z-[100] flex items-end gap-2 p-4 md:p-5">
        <HudIcon onClick={onToggleMute} label={isMuted ? t.unmute : t.mute}>
          {isMuted ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M11 5L6 9H3v6h3l5 4V5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M11 5L6 9H3v6h3l5 4V5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="M16 9c1.5 1 1.5 5 0 6M19 6c3 2.5 3 9.5 0 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </HudIcon>
        <HudIcon onClick={onTogglePlay} label={isPlaying ? t.pause : t.play}>
          {isPlaying ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </HudIcon>
        {showReplay ? (
          <HudIcon onClick={onReplay} label={t.replay}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M4 4v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20 14a8 8 0 1 1-2.5-7.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </HudIcon>
        ) : (
          <HudIcon onClick={onSkip} label={t.skip}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 5l8 7-8 7zM16 5h2v14h-2z" />
            </svg>
          </HudIcon>
        )}
      </div>

      {/* Watermark bas-gauche */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-3 left-4 z-[100] text-[10px] uppercase tracking-[0.4em] text-paper/40 md:bottom-5 md:left-5"
      >
        {watermark}
      </div>

      {/* Progress bar */}
      <div className="pointer-events-none fixed inset-x-0 bottom-[7vh] z-[99] hidden h-[2px] overflow-hidden bg-white/8 md:block">
        <div
          className="h-full bg-[linear-gradient(90deg,#a87f2e,#f0d27a,#d4af37)]"
          style={{
            width: `${Math.min(100, (totalElapsedMs / totalDurationMs) * 100)}%`,
            transition: "width 80ms linear",
          }}
        />
      </div>
      {/* Sur mobile : progress bar tout en bas */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[99] h-[2px] overflow-hidden bg-white/8 md:hidden">
        <div
          className="h-full bg-[linear-gradient(90deg,#a87f2e,#f0d27a,#d4af37)]"
          style={{
            width: `${Math.min(100, (totalElapsedMs / totalDurationMs) * 100)}%`,
            transition: "width 80ms linear",
          }}
        />
      </div>
    </>
  );
}

function HudIcon({ children, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/70 text-paper backdrop-blur transition-colors hover:border-gold/50 hover:text-gold-bright"
    >
      {children}
    </button>
  );
}
