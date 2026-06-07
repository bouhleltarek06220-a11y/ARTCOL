"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BlurFade from "@/components/showreel/ui/BlurFade";

/* Compteur animé pour un KPI. */
function Counter({ to, duration = 1400 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf;
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <>{v.toLocaleString()}</>;
}

/* SVG icon par agent (unique). */
function AgentIcon({ kind, color }) {
  const stroke = color;
  const s = 56;
  switch (kind) {
    case 0: // Prospection — radar
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="26" stroke={stroke} strokeWidth="2" opacity="0.4" />
          <circle cx="32" cy="32" r="17" stroke={stroke} strokeWidth="2" opacity="0.6" />
          <circle cx="32" cy="32" r="8" stroke={stroke} strokeWidth="2" />
          <circle cx="32" cy="32" r="2.5" fill={stroke} />
          <path d="M32 32 L52 22" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 1: // Marketing — étincelle
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
          <path
            d="M32 6 L36 26 L56 32 L36 38 L32 58 L28 38 L8 32 L28 26 Z"
            fill={stroke}
            fillOpacity="0.15"
            stroke={stroke}
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 2: // CRM — réseau
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="14" r="5" fill={stroke} />
          <circle cx="14" cy="44" r="5" fill={stroke} />
          <circle cx="50" cy="44" r="5" fill={stroke} />
          <circle cx="32" cy="50" r="5" stroke={stroke} strokeWidth="2" />
          <line x1="32" y1="14" x2="14" y2="44" stroke={stroke} strokeWidth="2" />
          <line x1="32" y1="14" x2="50" y2="44" stroke={stroke} strokeWidth="2" />
          <line x1="14" y1="44" x2="32" y2="50" stroke={stroke} strokeWidth="2" />
          <line x1="50" y1="44" x2="32" y2="50" stroke={stroke} strokeWidth="2" />
        </svg>
      );
    case 3: // Support — dialogue
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
          <rect x="6" y="14" width="40" height="28" rx="6" stroke={stroke} strokeWidth="2" fill={stroke} fillOpacity="0.1" />
          <path d="M16 42 L20 50 L26 42" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
          <rect x="20" y="22" width="36" height="22" rx="5" stroke={stroke} strokeWidth="2" fill="none" />
          <circle cx="30" cy="33" r="1.5" fill={stroke} />
          <circle cx="38" cy="33" r="1.5" fill={stroke} />
          <circle cx="46" cy="33" r="1.5" fill={stroke} />
        </svg>
      );
    case 4: // Analyse — graphique
    default:
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
          <path d="M8 50 V14" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
          <path d="M8 50 H56" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
          <path
            d="M14 42 L22 30 L30 36 L38 18 L48 24 L56 14"
            stroke={stroke}
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="22" cy="30" r="2.5" fill={stroke} />
          <circle cx="38" cy="18" r="2.5" fill={stroke} />
          <circle cx="56" cy="14" r="2.5" fill={stroke} />
        </svg>
      );
  }
}

/* Hexagones de fond. */
function HexBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-12"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='92' viewBox='0 0 80 92'><polygon points='40,2 78,24 78,68 40,90 2,68 2,24' fill='none' stroke='rgba(240,210,122,0.18)' stroke-width='1'/></svg>\")",
        backgroundSize: "80px 92px",
      }}
    />
  );
}

const PER_AGENT_MS = 2400;

export default function Scene4Agents({ t }) {
  const agents = t.s4.agents;
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i < agents.length - 1 ? i + 1 : i));
    }, PER_AGENT_MS);
    return () => clearInterval(id);
  }, [agents.length]);

  const agent = agents[idx];

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#03050d]">
      <HexBackground />

      {/* Halo coloré qui suit l'agent courant */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        animate={{
          background: `radial-gradient(circle, ${agent.color}55, transparent 65%)`,
        }}
        transition={{ duration: 0.6 }}
      />

      <BlurFade delay={0.2} duration={0.7}>
        <div className="absolute left-1/2 top-[10%] -translate-x-1/2 text-center text-[10px] uppercase tracking-[0.45em] text-gold-bright">
          {t.s4.eyebrow}
        </div>
      </BlurFade>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.6, filter: "blur(20px)", rotate: -6 }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)", rotate: 0 }}
            exit={{ opacity: 0, scale: 1.2, filter: "blur(14px)", rotate: 6 }}
            transition={{ duration: 0.55, ease: [0.85, 0, 0.15, 1] }}
            className="flex flex-col items-center gap-7"
          >
            {/* Icône agent en grand */}
            <div
              className="flex h-32 w-32 items-center justify-center rounded-3xl border sm:h-40 sm:w-40"
              style={{
                borderColor: `${agent.color}60`,
                background: `linear-gradient(135deg, ${agent.color}25, ${agent.color}08)`,
                boxShadow: `0 30px 80px -20px ${agent.color}99`,
                color: agent.color,
              }}
            >
              <AgentIcon kind={idx} color={agent.color} />
            </div>

            {/* Nom */}
            <div
              className="text-[6vmin] font-bold leading-tight tracking-tight text-paper sm:text-5xl"
              style={{
                fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                filter: "drop-shadow(0 6px 30px rgba(0,0,0,0.7))",
              }}
            >
              {agent.name}
            </div>

            {/* Mission */}
            <div
              className="max-w-md text-sm uppercase tracking-[0.2em] text-paper/85 sm:text-base"
              style={{ color: agent.color }}
            >
              {agent.mission}
            </div>

            {/* KPI animé */}
            <div className="mt-4 flex flex-col items-center gap-1">
              <div
                className="font-mono text-4xl font-semibold tabular-nums text-paper sm:text-5xl"
                style={{
                  filter: `drop-shadow(0 0 20px ${agent.color}77)`,
                }}
              >
                <Counter to={agent.kpi.value} />
              </div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-paper/60">
                {agent.kpi.label}
              </div>
            </div>

            {/* Compteur d'agent */}
            <div className="mt-2 text-xs uppercase tracking-[0.35em] text-gold-bright/80">
              0{idx + 1} / 0{agents.length}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
