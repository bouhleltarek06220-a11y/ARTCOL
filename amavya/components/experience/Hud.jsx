"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CHAPTERS, STOPS } from "./data";

function Reticle({ className = "" }) {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" className={className} aria-hidden="true">
      <path d="M1 6V1h5M21 6V1h-5M1 16v5h5M21 16v5h-5" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export default function Hud({ stop, lang }) {
  const chapters = CHAPTERS[lang] || CHAPTERS.fr;
  const cur = chapters[stop] || chapters[0];

  const [now, setNow] = useState("");
  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      setNow(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 text-paper">
      {/* Cadres d'angle */}
      <Reticle className="absolute left-4 top-4 text-white/30" />
      <Reticle className="absolute right-4 top-4 text-white/30 rotate-90" />
      <Reticle className="absolute left-4 bottom-4 text-white/30 -rotate-90" />
      <Reticle className="absolute right-4 bottom-4 text-white/30 rotate-180" />

      {/* Brand chip (haut gauche) */}
      <div className="absolute left-5 top-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.32em]">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-bright opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-bright" />
        </span>
        <span className="text-paper/90 font-semibold">AMAVYA · The Living Planet</span>
        <span className="hidden text-paper/40 sm:inline">·</span>
        <span className="hidden text-gold-bright tabular-nums sm:inline">{now}</span>
      </div>

      {/* Retour (haut droite) */}
      <Link
        href="/"
        className="pointer-events-auto absolute right-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] text-paper/75 backdrop-blur transition-colors hover:border-gold/40 hover:text-paper"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        amavya.cloud
      </Link>

      {/* Légende cinéma (bas centre) */}
      <div className="absolute inset-x-0 bottom-16 flex justify-center px-4 sm:bottom-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={stop}
            initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl text-center"
          >
            <div className="mb-3 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.42em] text-gold-bright">
              <span className="h-px w-8 bg-gold-bright/60" />
              {cur.tag}
              <span className="h-px w-8 bg-gold-bright/60" />
            </div>
            <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
              {cur.title}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-pretty text-sm text-paper/70 sm:text-base">
              {cur.text}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Points de chapitre (bas droite) */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2">
        {Array.from({ length: STOPS }).map((_, i) => (
          <span
            key={i}
            className="block h-1 rounded-full transition-all duration-500"
            style={{
              width: i === stop ? "28px" : "8px",
              background: i === stop ? "#f0d27a" : "rgba(255,255,255,0.18)",
              boxShadow: i === stop ? "0 0 10px #f0d27a88" : "none",
            }}
          />
        ))}
      </div>

      {/* Hint scroll (chapter 0) */}
      <AnimatePresence>
        {stop === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[9px] uppercase tracking-[0.42em] text-paper/55"
          >
            <span>Scroll to enter</span>
            <motion.svg width="16" height="22" viewBox="0 0 16 22" fill="none" animate={{ y: [0, 5, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
              <rect x="1" y="1" width="14" height="20" rx="7" stroke="currentColor" strokeWidth="1" />
              <circle cx="8" cy="7" r="1.6" fill="currentColor" />
            </motion.svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
