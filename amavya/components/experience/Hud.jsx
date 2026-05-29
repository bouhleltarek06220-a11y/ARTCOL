"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MODULES, MODULE_LABEL, SECTIONS, STOP_TO_MODULE, STOPS } from "./data";

function Reticle({ className = "" }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" className={className} aria-hidden="true">
      <path d="M1 6V1h5M21 6V1h-5M1 16v5h5M21 16v5h-5" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export default function Hud({ stop, lang }) {
  const sections = (SECTIONS[lang] || SECTIONS.fr);
  const labels = MODULE_LABEL[lang] || MODULE_LABEL.fr;
  const cur = sections[stop];

  // Horloge live (pour l'effet "système en ligne")
  const [now, setNow] = useState("");
  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      setNow(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const activeModule = STOP_TO_MODULE[stop];

  return (
    <div className="pointer-events-none absolute inset-0 z-10 text-paper">
      {/* Réticules dans les coins */}
      <Reticle className="absolute left-4 top-4 text-white/30" />
      <Reticle className="absolute right-4 top-4 text-white/30 rotate-90" />
      <Reticle className="absolute left-4 bottom-4 text-white/30 -rotate-90" />
      <Reticle className="absolute right-4 bottom-4 text-white/30 rotate-180" />

      {/* Barre de statut */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 py-3 text-[10px] uppercase tracking-[0.25em]">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-bright opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-bright" />
          </span>
          <span className="text-paper/90 font-semibold">AMAVYA · AI Command Center</span>
          <span className="text-paper/40">v1.0</span>
        </div>
        <div className="hidden items-center gap-4 text-paper/60 sm:flex">
          <span>Neural core online</span>
          <span className="text-gold-bright tabular-nums">{now}</span>
        </div>
      </div>

      {/* Panneau de section (droite, centre) */}
      <div className="absolute right-0 top-1/2 max-w-md -translate-y-1/2 pr-5 sm:pr-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={stop}
            initial={{ opacity: 0, x: 24, filter: "blur(6px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0)" }}
            exit={{ opacity: 0, x: -16, filter: "blur(6px)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative ml-auto rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md sm:p-7"
            style={{ boxShadow: `0 24px 80px -28px ${cur.accent}55` }}
          >
            <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.32em]" style={{ color: cur.accent }}>
              <span className="h-px w-7 bg-current opacity-70" />
              {cur.tag}
            </div>
            <h2 className="text-2xl font-semibold leading-tight sm:text-4xl">
              {cur.title}
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/75 sm:text-base">
              {cur.text}
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-[10px] uppercase tracking-wider text-paper/55">
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">live</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">streaming</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">low latency</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Liste des modules (bas gauche) */}
      <div className="absolute bottom-6 left-5 hidden max-w-[260px] rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md sm:block">
        <div className="mb-3 flex items-center justify-between text-[9px] uppercase tracking-[0.32em] text-paper/55">
          <span>AI Modules</span>
          <span className="text-paper/40">06</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {MODULES.map((m, i) => {
            const on = activeModule === i;
            return (
              <div
                key={m.key}
                className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors duration-300"
                style={{
                  background: on ? `${m.color}1a` : "transparent",
                  borderLeft: `2px solid ${on ? m.color : "transparent"}`,
                }}
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: m.color, boxShadow: on ? `0 0 12px 2px ${m.color}` : "none" }}
                />
                <span className={`flex-1 text-[11px] ${on ? "text-paper" : "text-paper/55"}`}>
                  {labels[m.key]}
                </span>
                <span className="text-[9px] uppercase tracking-wide text-paper/40">{on ? "active" : "idle"}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progression verticale (bas droite) */}
      <div className="absolute bottom-6 right-5 hidden flex-col items-center gap-2 sm:flex">
        <span className="rotate-180 text-[9px] uppercase tracking-[0.32em] text-paper/45" style={{ writingMode: "vertical-rl" }}>
          Phase {stop + 1}/{STOPS}
        </span>
        <div className="flex h-32 w-1 flex-col-reverse overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="w-full rounded-full bg-gradient-to-t from-gold to-champagne"
            initial={false}
            animate={{ height: `${((stop + 1) / STOPS) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* Hint scroll (bas centre) */}
      <AnimatePresence>
        {stop === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-paper/60"
          >
            <span>Scroll to explore</span>
            <motion.svg width="16" height="22" viewBox="0 0 16 22" fill="none" animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
              <rect x="1" y="1" width="14" height="20" rx="7" stroke="currentColor" strokeWidth="1" />
              <circle cx="8" cy="7" r="1.6" fill="currentColor" />
            </motion.svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Retour vers le site (haut gauche supplémentaire, cliquable) */}
      <Link
        href="/"
        className="pointer-events-auto absolute left-5 top-12 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] text-paper/70 transition-colors hover:border-gold/40 hover:text-paper"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        amavya.cloud
      </Link>
    </div>
  );
}
