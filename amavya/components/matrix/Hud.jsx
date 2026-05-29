"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { DIMENSIONS, PHRASES, UI, lerpColor } from "./data";
import DecodeText from "./DecodeText";

function Bracket({ className }) {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" className={className} aria-hidden="true">
      <path d="M2 8V2h6M24 8V2h-6M2 18v6h6M24 18v6h-6" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export default function Hud({
  progress,
  playing,
  onTogglePlay,
  onScrub,
  onReplay,
  lang,
  setLang,
}) {
  const dims = DIMENSIONS[lang] || DIMENSIONS.fr;
  const phrases = PHRASES[lang] || PHRASES.fr;
  const ui = UI[lang] || UI.fr;

  const col = lerpColor(progress).css;
  const dim = lerpColor(Math.min(1, progress + 0.12)).css;

  // Dimension active
  const activeIdx = useMemo(() => {
    let idx = 0;
    dims.forEach((d, i) => {
      if (progress >= d.at - 0.001) idx = i;
    });
    return idx;
  }, [progress, dims]);

  // Phrase decode active
  const phrase = useMemo(() => {
    let chosen = null;
    phrases.forEach((p) => {
      if (progress >= p.at - 0.04 && progress < p.at + 0.14) chosen = p;
    });
    return chosen;
  }, [progress, phrases]);

  const ended = progress > 0.985;
  const pct = Math.round(progress * 100);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 select-none font-mono text-paper">
      {/* Scanlines + grain (CSS) */}
      <div
        className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 3px)",
        }}
      />
      <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 220px 40px rgba(0,0,0,0.85)" }} />

      {/* Crochets coins */}
      <Bracket className="absolute left-3 top-3 text-white/25" />
      <Bracket className="absolute right-3 top-3 rotate-90 text-white/25" />
      <Bracket className="absolute left-3 bottom-3 -rotate-90 text-white/25" />
      <Bracket className="absolute right-3 bottom-3 rotate-180 text-white/25" />

      {/* Brand + statut (haut gauche) */}
      <div className="absolute left-6 top-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em]" style={{ color: dim }}>
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70" style={{ backgroundColor: col }} />
          <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: col }} />
        </span>
        <span>{ui.brand}</span>
        <span className="text-white/30">/ REC {pct}%</span>
      </div>

      {/* Langue + retour (haut droite) */}
      <div className="pointer-events-auto absolute right-6 top-6 flex items-center gap-3">
        <div className="flex overflow-hidden rounded-full border" style={{ borderColor: `${col}44` }}>
          {["fr", "en"].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className="px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] transition-colors"
              style={{
                color: lang === l ? "#050505" : dim,
                background: lang === l ? col : "transparent",
              }}
            >
              {l}
            </button>
          ))}
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] backdrop-blur transition-transform hover:scale-105"
          style={{ borderColor: `${col}44`, color: dim }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {ui.back}
        </Link>
      </div>

      {/* Rail vertical de progression (gauche, centré) — points seuls */}
      <div className="absolute left-7 top-1/2 hidden -translate-y-1/2 flex-col gap-4 sm:flex">
        {dims.map((d, i) => {
          const on = i === activeIdx;
          const passed = i < activeIdx;
          return (
            <span
              key={d.id}
              className="block h-2.5 w-2.5 rounded-full border transition-all duration-500"
              style={{
                borderColor: on || passed ? col : "rgba(255,255,255,0.25)",
                background: on ? col : passed ? `${col}66` : "transparent",
                boxShadow: on ? `0 0 12px ${col}` : "none",
                transform: on ? "scale(1.5)" : "scale(1)",
              }}
            />
          );
        })}
      </div>

      {/* Sous-titre decode (centre-bas) */}
      <div className="absolute inset-x-0 bottom-32 flex justify-center px-6">
        <AnimatePresence mode="wait">
          {phrase && (
            <motion.p
              key={phrase.text}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="text-center text-sm tracking-[0.42em] sm:text-base"
              style={{ color: col, textShadow: `0 0 18px ${col}66` }}
            >
              <DecodeText target={phrase.text} active duration={1300} />
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* CTA final */}
      <AnimatePresence>
        {ended && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="pointer-events-auto absolute inset-x-0 bottom-28 flex flex-col items-center gap-4"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 rounded-full bg-[linear-gradient(110deg,#a87f2e,#f0d27a_55%,#d4af37)] px-8 py-3.5 text-sm font-bold uppercase tracking-[0.32em] text-ink shadow-[0_10px_60px_-10px_rgba(240,210,122,0.85)] transition-transform hover:-translate-y-0.5"
            >
              {ui.cta}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <button
              onClick={onReplay}
              className="text-[10px] uppercase tracking-[0.3em] text-white/50 transition-colors hover:text-white"
            >
              ↺ {ui.replay}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Barre de contrôle (bas) : play/pause + timeline scrubbable */}
      <div className="pointer-events-auto absolute inset-x-0 bottom-7 flex items-center justify-center gap-4 px-6">
        <button
          onClick={onTogglePlay}
          aria-label={playing ? ui.pause : ui.play}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border backdrop-blur transition-transform hover:scale-110"
          style={{ borderColor: `${col}55`, color: col }}
        >
          {playing ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="4" width="5" height="16" rx="1" /><rect x="14" y="4" width="5" height="16" rx="1" /></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l13 8-13 8z" /></svg>
          )}
        </button>

        <div className="flex w-full max-w-xl items-center gap-3">
          <span className="text-[10px] tabular-nums tracking-widest text-white/45">{ui.timeline}</span>
          <div className="relative h-6 flex-1">
            {/* piste */}
            <div className="absolute top-1/2 h-[3px] w-full -translate-y-1/2 rounded-full bg-white/12" />
            {/* remplissage */}
            <div
              className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full"
              style={{ width: `${progress * 100}%`, background: col, boxShadow: `0 0 10px ${col}` }}
            />
            {/* marqueurs de dimensions */}
            {dims.map((d) => (
              <span
                key={d.id}
                className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-white/30"
                style={{ left: `${d.at * 100}%` }}
              />
            ))}
            {/* curseur */}
            <div
              className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-black"
              style={{ left: `${progress * 100}%`, background: col, boxShadow: `0 0 12px ${col}` }}
            />
            {/* input range invisible pour le scrub */}
            <input
              type="range"
              min={0}
              max={1000}
              value={Math.round(progress * 1000)}
              onChange={(e) => onScrub(Number(e.target.value) / 1000)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              aria-label={ui.timeline}
            />
          </div>
          <span className="text-[10px] tabular-nums tracking-widest" style={{ color: col }}>
            {String(pct).padStart(3, "0")}
          </span>
        </div>
      </div>

      {/* Hint contrôles (bas, discret) */}
      <div className="absolute inset-x-0 bottom-[4.6rem] flex justify-center">
        <span className="text-[9px] uppercase tracking-[0.34em] text-white/35">
          {ui.drag} &nbsp;·&nbsp; {ui.zoom}
        </span>
      </div>
    </div>
  );
}
