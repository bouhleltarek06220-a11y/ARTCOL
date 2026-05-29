"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MESSAGES, BRAND, HINT, CTA, STOPS } from "./data";
import DecodeText from "./DecodeText";

function Reticle({ className = "" }) {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" className={className} aria-hidden="true">
      <path d="M1 6V1h5M21 6V1h-5M1 16v5h5M21 16v5h-5" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export default function Hud({ progress, stop, lang }) {
  const messages = MESSAGES[lang] || MESSAGES.fr;
  const brand = BRAND[lang] || BRAND.fr;
  const hint = HINT[lang] || HINT.fr;
  const cta = CTA[lang] || CTA.fr;

  // Détermine le message courant : le dernier dont `at` est <= progress + petite marge
  const active = (() => {
    let chosen = null;
    for (const m of messages) {
      if (progress >= m.at - 0.01 && progress < m.at + 0.18) chosen = m;
    }
    // Le dernier message (AMAVYA) reste affiché jusqu'à la fin
    if (!chosen && progress >= messages[messages.length - 1].at) {
      chosen = messages[messages.length - 1];
    }
    return chosen;
  })();

  // Couleur progressive vert → or
  const colorFor = (p) => {
    const r = Math.round(0 + p * 240);
    const g = Math.round(255 - p * 45);
    const b = Math.round(65 + p * 57);
    return `rgb(${r},${g},${b})`;
  };
  const txtColor = colorFor(progress);
  const dimColor = colorFor(Math.min(1, progress + 0.1));

  return (
    <div className="pointer-events-none absolute inset-0 z-10 text-paper">
      {/* Réticules */}
      <Reticle className="absolute left-4 top-4 text-white/20" />
      <Reticle className="absolute right-4 top-4 text-white/20 rotate-90" />
      <Reticle className="absolute left-4 bottom-4 text-white/20 -rotate-90" />
      <Reticle className="absolute right-4 bottom-4 text-white/20 rotate-180" />

      {/* Brand chip (haut gauche) */}
      <div
        className="absolute left-5 top-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.32em]"
        style={{ color: dimColor }}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ backgroundColor: txtColor }} />
          <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: txtColor }} />
        </span>
        <span className="font-mono">{brand}</span>
      </div>

      {/* Retour vers le site (haut droite) */}
      <Link
        href="/"
        className="pointer-events-auto absolute right-5 top-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] backdrop-blur transition-all hover:scale-105"
        style={{
          borderColor: `${txtColor}55`,
          color: dimColor,
        }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        amavya.cloud
      </Link>

      {/* Message central qui se compose */}
      <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center px-4">
        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active.text}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <p
                className={`font-mono tracking-[0.3em] ${active.big ? "text-6xl sm:text-8xl" : "text-2xl sm:text-4xl"} font-bold`}
                style={{
                  color: txtColor,
                  textShadow: `0 0 20px ${txtColor}88, 0 0 40px ${txtColor}44`,
                }}
              >
                <DecodeText target={active.text} active={true} duration={active.big ? 1800 : 1400} />
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hint initial (visible avant 5% de scroll) */}
      <AnimatePresence>
        {progress < 0.05 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="absolute bottom-12 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
            style={{ color: txtColor }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.42em]">{hint}</span>
            <motion.svg width="16" height="22" viewBox="0 0 16 22" fill="none" animate={{ y: [0, 5, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
              <rect x="1" y="1" width="14" height="20" rx="7" stroke="currentColor" strokeWidth="1" />
              <circle cx="8" cy="7" r="1.6" fill="currentColor" />
            </motion.svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA final (apparaît à la fin) */}
      <AnimatePresence>
        {progress > 0.96 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2"
          >
            <Link
              href="/"
              className="pointer-events-auto inline-flex items-center gap-2.5 rounded-full bg-[linear-gradient(110deg,#a87f2e,#f0d27a_55%,#d4af37)] px-7 py-3 text-sm font-bold uppercase tracking-[0.32em] text-ink shadow-[0_8px_50px_-8px_rgba(240,210,122,0.8)] transition-transform hover:-translate-y-0.5"
            >
              {cta}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progression discrète en bas */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {Array.from({ length: STOPS }).map((_, i) => (
          <span
            key={i}
            className="block h-0.5 rounded-full transition-all duration-500"
            style={{
              width: i === stop ? "32px" : "8px",
              background: i <= stop ? txtColor : "rgba(255,255,255,0.15)",
              boxShadow: i === stop ? `0 0 8px ${txtColor}aa` : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}
