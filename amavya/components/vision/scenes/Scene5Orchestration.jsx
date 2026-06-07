"use client";

import { motion } from "framer-motion";
import BlurFade from "@/components/showreel/ui/BlurFade";
import TextGenerateEffect from "@/components/showreel/ui/TextGenerateEffect";

const AGENTS_LAYOUT = [
  { x: 50, y: 18, name: "Prospection", color: "#7dd3fc" },
  { x: 84, y: 42, name: "Marketing", color: "#fbbf24" },
  { x: 72, y: 78, name: "CRM", color: "#c084fc" },
  { x: 28, y: 78, name: "Support", color: "#86efac" },
  { x: 16, y: 42, name: "Analyse", color: "#f0d27a" },
];

const CENTER = { x: 50, y: 50 };

export default function Scene5Orchestration({ t }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#03050d]">
      {/* Grille de fond */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(rgba(240,210,122,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(240,210,122,0.18) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Halo doré central pulsant */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: "60vmin",
          height: "60vmin",
          background:
            "radial-gradient(circle, rgba(240,210,122,0.35), transparent 65%)",
          filter: "blur(40px)",
        }}
        animate={{ opacity: [0.5, 0.9, 0.5], scale: [0.95, 1.1, 0.95] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <BlurFade delay={0.2} duration={0.7}>
        <div className="absolute left-1/2 top-[8%] -translate-x-1/2 text-center text-[10px] uppercase tracking-[0.45em] text-gold-bright">
          {t.s5.eyebrow}
        </div>
      </BlurFade>

      {/* SVG : agents en pentagone reliés au centre par des lignes animées */}
      <svg
        className="absolute inset-0 z-10 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          {AGENTS_LAYOUT.map((a, i) => (
            <linearGradient
              key={i}
              id={`agent-line-${i}`}
              x1="0"
              y1="0"
              x2="100%"
              y2="0"
            >
              <stop offset="0%" stopColor={a.color} stopOpacity="0.6" />
              <stop offset="100%" stopColor="#f0d27a" stopOpacity="0.6" />
            </linearGradient>
          ))}
        </defs>

        {/* Lignes agents → centre */}
        {AGENTS_LAYOUT.map((a, i) => (
          <motion.line
            key={`line-${i}`}
            x1={a.x}
            y1={a.y}
            x2={CENTER.x}
            y2={CENTER.y}
            stroke={`url(#agent-line-${i})`}
            strokeWidth="0.25"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.6 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}

        {/* Particules qui circulent le long des lignes (data flow) */}
        {AGENTS_LAYOUT.map((a, i) => (
          <motion.circle
            key={`flow-${i}`}
            r="0.6"
            fill={a.color}
            initial={{ cx: a.x, cy: a.y, opacity: 0 }}
            animate={{
              cx: [a.x, CENTER.x, a.x],
              cy: [a.y, CENTER.y, a.y],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2.2,
              delay: 1.4 + i * 0.18,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ filter: `drop-shadow(0 0 2px ${a.color})` }}
          />
        ))}

        {/* Lignes entre agents (mesh) */}
        {AGENTS_LAYOUT.map((a, i) => {
          const next = AGENTS_LAYOUT[(i + 1) % AGENTS_LAYOUT.length];
          return (
            <motion.line
              key={`mesh-${i}`}
              x1={a.x}
              y1={a.y}
              x2={next.x}
              y2={next.y}
              stroke="rgba(240,210,122,0.25)"
              strokeWidth="0.1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 1.8 + i * 0.08 }}
            />
          );
        })}
      </svg>

      {/* Noeuds agents en HTML (pour le glow + label) */}
      {AGENTS_LAYOUT.map((a, i) => (
        <motion.div
          key={a.name}
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${a.x}%`, top: `${a.y}%` }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative flex flex-col items-center gap-2">
            <div
              className="h-4 w-4 rounded-full"
              style={{
                background: a.color,
                boxShadow: `0 0 24px 4px ${a.color}aa`,
              }}
            />
            <div
              className="text-[10px] font-medium uppercase tracking-[0.18em]"
              style={{ color: a.color }}
            >
              {a.name}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Noyau central AMAVYA */}
      <motion.div
        className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="flex h-20 w-20 items-center justify-center rounded-full sm:h-24 sm:w-24"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, #f8e8b8, #a87f2e 80%)",
            boxShadow:
              "0 0 60px rgba(240,210,122,0.7), inset -8px -12px 18px rgba(0,0,0,0.4)",
          }}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span
            className="font-bold text-ink"
            style={{
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            }}
          >
            A
          </span>
        </motion.div>
      </motion.div>

      {/* Texte final */}
      <BlurFade delay={4} duration={0.9} yOffset={20}>
        <div className="absolute inset-x-0 bottom-[10%] z-30 px-6 text-center">
          <h2
            className="text-balance text-2xl font-semibold leading-tight text-paper sm:text-3xl lg:text-[3.4vw]"
            style={{
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
              filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.85))",
            }}
          >
            <span>{t.s5.title} </span>
            <span className="bg-[linear-gradient(110deg,#a87f2e,#f0d27a_50%,#d4af37)] bg-clip-text text-transparent">
              {t.s5.strong}
            </span>
          </h2>
          <p className="mt-3 text-sm text-paper/70 sm:text-base">
            <TextGenerateEffect words={t.s5.sub} stagger={0.06} delay={4.9} />
          </p>
        </div>
      </BlurFade>
    </div>
  );
}
