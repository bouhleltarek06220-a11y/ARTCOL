"use client";

/* ============================================================
   AMAVYA — Page de démonstration « Centre de commande / La Ruche »
   Reproduction du dashboard holographique doré (agents IA en ruche).
   Page autonome : route /command-center
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Logo from "@/components/Logo";

/* ----------------------------------------------------------------
   Icônes inline (stroke, style ligne) — pas de dépendance externe
   ---------------------------------------------------------------- */
const ico = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const Icon = {
  grid: (p) => (
    <svg {...ico} {...p}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  agents: (p) => (
    <svg {...ico} {...p}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <path d="M16 11a3 3 0 1 0-1-5.83" />
      <path d="M21 20a6 6 0 0 0-5-5.91" />
    </svg>
  ),
  perf: (p) => (
    <svg {...ico} {...p}>
      <path d="M3 3v18h18" />
      <path d="M7 14l3-4 4 3 5-7" />
    </svg>
  ),
  bolt: (p) => (
    <svg {...ico} {...p}>
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
    </svg>
  ),
  flow: (p) => (
    <svg {...ico} {...p}>
      <path d="M3 12c4 0 4-7 8-7s4 7 8 7" />
      <circle cx="3" cy="12" r="1.4" />
      <circle cx="21" cy="12" r="1.4" />
    </svg>
  ),
  plug: (p) => (
    <svg {...ico} {...p}>
      <path d="M9 2v6M15 2v6M7 8h10v3a5 5 0 0 1-10 0V8ZM12 16v6" />
    </svg>
  ),
  gear: (p) => (
    <svg {...ico} {...p}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </svg>
  ),
  target: (p) => (
    <svg {...ico} {...p}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  ),
  mega: (p) => (
    <svg {...ico} {...p}>
      <path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1Z" />
      <path d="M16 9a4 4 0 0 1 0 6" />
    </svg>
  ),
  chat: (p) => (
    <svg {...ico} {...p}>
      <path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2Z" />
    </svg>
  ),
  bars: (p) => (
    <svg {...ico} {...p}>
      <path d="M7 20V10M12 20V4M17 20v-7" />
    </svg>
  ),
  pen: (p) => (
    <svg {...ico} {...p}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  ),
  play: (p) => (
    <svg {...ico} {...p}>
      <path d="M8 5v14l11-7L8 5Z" fill="currentColor" stroke="none" />
    </svg>
  ),
  chevron: (p) => (
    <svg {...ico} {...p}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  ),
  building: (p) => (
    <svg {...ico} {...p}>
      <rect x="4" y="3" width="16" height="18" rx="1.5" />
      <path d="M9 7h.01M15 7h.01M9 11h.01M15 11h.01M9 15h.01M15 15h.01" />
    </svg>
  ),
  check: (p) => (
    <svg {...ico} {...p}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  clock: (p) => (
    <svg {...ico} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  euro: (p) => (
    <svg {...ico} {...p}>
      <path d="M18 7a7 7 0 1 0 0 10M4 10h8M4 14h7" />
    </svg>
  ),
  star: (p) => (
    <svg {...ico} {...p}>
      <path d="m12 3 2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.9 6.8 19l1-5.8-4.2-4.1 5.8-.8L12 3Z" />
    </svg>
  ),
  bee: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <ellipse cx="12" cy="14" rx="4" ry="6" />
      <path d="M8 12h8M8 15h8M9 18h6" />
      <path d="M12 8c-2-3-6-3-7-1 0 2 3 3 5 3M12 8c2-3 6-3 7-1 0 2-3 3-5 3" />
      <path d="M12 8V6M10.5 4.5 12 6l1.5-1.5" />
    </svg>
  ),
};

/* ----------------------------------------------------------------
   Compteur animé déclenché à l'entrée dans le viewport
   ---------------------------------------------------------------- */
function useCountUp(target, { duration = 1600, decimals = 0 } = {}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVal(target);
      return;
    }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setVal(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  const display =
    decimals > 0
      ? val.toFixed(decimals)
      : Math.round(val).toLocaleString("fr-FR");
  return { ref, display };
}

function Stat({ value, decimals = 0, prefix = "", suffix = "" }) {
  const { ref, display } = useCountUp(value, { decimals });
  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/* ----------------------------------------------------------------
   Données
   ---------------------------------------------------------------- */
const NAV = ["VISION", "AGENTS IA", "SOLUTIONS", "DÉMONSTRATION", "RESSOURCES", "À PROPOS", "CONTACT"];

const SIDE_MENU = [
  { icon: Icon.grid, label: "Vue d'ensemble", active: true },
  { icon: Icon.agents, label: "Tous les agents" },
  { icon: Icon.perf, label: "Performance" },
  { icon: Icon.bolt, label: "Automatisations" },
  { icon: Icon.flow, label: "Flux de données" },
  { icon: Icon.plug, label: "Intégrations" },
  { icon: Icon.gear, label: "Paramètres" },
];

const REALTIME = [
  { icon: Icon.agents, big: "128", label: "Agents en mission" },
  { icon: Icon.clock, big: "24/7", label: "Opérationnels" },
  { icon: Icon.perf, big: "99.99%", label: "Disponibilité" },
  { icon: Icon.bolt, big: "0", label: "Interruption" },
];

// Cellules de la ruche : positions hexagonales autour du cœur central.
const HIVE = [
  { id: "prospection", label: "PROSPECTION", icon: Icon.target, color: "#a78bfa", x: 0, y: -150 },
  { id: "marketing", label: "MARKETING", icon: Icon.mega, color: "#ec4899", x: 132, y: -76 },
  { id: "crm", label: "CRM", icon: Icon.agents, color: "#38bdf8", x: 132, y: 76 },
  { id: "contenu", label: "CONTENU", icon: Icon.pen, color: "#f0d27a", x: 0, y: 150 },
  { id: "analyse", label: "ANALYSE & KPI", icon: Icon.bars, color: "#34d399", x: -132, y: 76 },
  { id: "support", label: "SUPPORT CLIENT", icon: Icon.chat, color: "#22d3ee", x: -132, y: -76 },
  { id: "automatisation", label: "AUTOMATISATION", icon: Icon.gear, color: "#f0d27a", x: -132, y: 0, hidden: true },
];

const MISSIONS = [
  { label: "Recherche de prospects", value: "847 en cours", pct: 82 },
  { label: "Qualification intelligente", value: "532 en cours", pct: 64 },
  { label: "Envoi de séquences", value: "312 en cours", pct: 44 },
  { label: "Relances automatiques", value: "156 en cours", pct: 28 },
];

const GLOBAL = [
  { icon: Icon.building, n: 1248, label: "Entreprises servies", trend: "+28.4% ce mois", c: "#38bdf8" },
  { icon: Icon.check, n: 24563, label: "Tâches exécutées", trend: "+18.7% ce mois", c: "#34d399" },
  { icon: Icon.clock, n: 125430, suffix: " h", label: "Temps économisé", trend: "+34.2% ce mois", c: "#f0d27a" },
  { icon: Icon.euro, n: 2.4, decimals: 1, prefix: "€", suffix: "M+", label: "Revenus générés", trend: "+29.8% ce mois", c: "#a78bfa" },
  { icon: Icon.star, n: 98.6, decimals: 1, suffix: "%", label: "Satisfaction clients", trend: "+6.2% ce mois", c: "#f0d27a" },
];

const ACTIVITY = [
  { icon: Icon.check, t: "Nouveau prospect qualifié", s: "TechNova Solutions - France", time: "Il y a 2 min" },
  { icon: Icon.agents, t: "Rendez-vous confirmé", s: "Innovatech SARL", time: "Il y a 5 min" },
  { icon: Icon.mega, t: "Campagne lancée", s: "LinkedIn Outreach", time: "Il y a 8 min" },
  { icon: Icon.euro, t: "Opportunité gagnée", s: "€25,430", time: "Il y a 15 min" },
  { icon: Icon.gear, t: "Automatisation créée", s: "Workflow CRM", time: "Il y a 18 min" },
];

/* ----------------------------------------------------------------
   Hexagone (cellule cliquable, flat-top, glow doré)
   ---------------------------------------------------------------- */
function HexCell({ cell, active, onHover, delay = 0 }) {
  if (cell.hidden) return null;
  const isActive = active === cell.id;
  return (
    // Wrapper : positionnement uniquement (transform non touché par Motion)
    <div
      className="absolute left-1/2 top-1/2"
      style={{ transform: `translate(-50%,-50%) translate(${cell.x}px, ${cell.y}px)` }}
    >
      <motion.button
        type="button"
        onMouseEnter={() => onHover(cell.id)}
        onMouseLeave={() => onHover(null)}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.06 }}
        transition={{ delay, type: "spring", stiffness: 140, damping: 15 }}
        className="group grid place-items-center"
        style={{
          width: 130,
          height: 148,
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          background: isActive
            ? `linear-gradient(160deg, ${cell.color}40, rgba(7,17,31,.85))`
            : `linear-gradient(160deg, ${cell.color}1f, rgba(10,20,34,.82))`,
          border: `1.5px solid ${cell.color}${isActive ? "" : "aa"}`,
          boxShadow: isActive
            ? `0 0 42px ${cell.color}77, inset 0 0 26px ${cell.color}33`
            : `0 0 16px ${cell.color}33, inset 0 0 16px rgba(0,0,0,.35)`,
          transition: "box-shadow .35s, background .35s, border-color .35s",
          backdropFilter: "blur(6px)",
        }}
      >
        <span className="flex flex-col items-center gap-1.5 px-2 text-center">
          <span style={{ color: cell.color }} className="drop-shadow-[0_0_8px_currentColor]">
            <cell.icon width={26} height={26} />
          </span>
          <span className="text-[10px] font-semibold tracking-wider text-paper">
            {cell.label}
          </span>
          <span className="flex items-center gap-1 text-[8px] font-semibold tracking-widest text-emerald-400">
            <span className="h-1 w-1 rounded-full bg-emerald-400" />
            ACTIF
          </span>
        </span>
      </motion.button>
    </div>
  );
}

/* ----------------------------------------------------------------
   Jauge radiale (anneau de progression SVG)
   ---------------------------------------------------------------- */
function RadialGauge({ value = 98.6, size = 116 }) {
  const r = size / 2 - 9;
  const c = 2 * Math.PI * r;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const offset = inView ? c - (value / 100) * c : c;
  return (
    <div ref={ref} className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="gauge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="55%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="7" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#gauge)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(.22,1,.36,1)" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-xl font-bold text-paper">
          <Stat value={98.6} decimals={1} suffix="%" />
        </div>
        <div className="text-[9px] tracking-wide text-muted">Efficacité globale</div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
   Petits blocs réutilisables
   ---------------------------------------------------------------- */
function PanelTitle({ children }) {
  return (
    <h3 className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-gold-bright">
      {children}
    </h3>
  );
}

/* ================================================================
   PAGE
   ================================================================ */
export default function CommandCenterPage() {
  const [hover, setHover] = useState("prospection");

  return (
    <div
      className="relative min-h-screen w-full overflow-x-hidden text-paper"
      style={{
        background:
          "radial-gradient(120% 90% at 50% -10%, #0a1626 0%, #060b14 45%, #03060b 100%)",
      }}
    >
      {/* halos d'ambiance */}
      <div className="pointer-events-none absolute inset-0 grid-mask opacity-40" />
      <div
        className="pointer-events-none absolute left-1/2 top-[42%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl animate-pulse-glow"
        style={{ background: "radial-gradient(circle, rgba(217,164,65,.28), transparent 65%)" }}
      />

      {/* ============ NAV ============ */}
      <header className="relative z-20 flex items-center justify-between border-b border-white/5 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Logo size={42} showWordmark={false} />
          <div className="leading-none">
            <div className="text-lg font-bold tracking-[0.2em] text-gradient">AMAVYA</div>
            <div className="mt-0.5 text-[8px] tracking-[0.25em] text-muted">
              ARCHITECTES D'AGENTS INTELLIGENTS
            </div>
          </div>
        </div>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <a
              key={n}
              href="#"
              className={`relative text-[12px] font-medium tracking-wide transition-colors ${
                n === "AGENTS IA" ? "text-gold-bright" : "text-silver hover:text-paper"
              }`}
            >
              {n}
              {n === "AGENTS IA" && (
                <span className="absolute -bottom-2 left-0 h-0.5 w-full rounded-full bg-gradient-to-r from-violet-400 to-gold" />
              )}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button className="glow-ring flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold to-gold-bright px-4 py-2.5 text-[12px] font-semibold text-ink shadow-lg shadow-gold/20">
            <Icon.clock width={15} height={15} />
            PRENDRE RENDEZ-VOUS
          </button>
          <button className="rounded-lg border border-white/10 px-3 py-2 text-[12px] text-silver">
            FR ▾
          </button>
        </div>
      </header>

      {/* ============ LAYOUT 3 colonnes ============ */}
      <div className="relative z-10 mx-auto grid max-w-[1500px] grid-cols-1 gap-4 px-4 py-5 xl:grid-cols-[250px_1fr_330px]">

        {/* ---------- SIDEBAR GAUCHE ---------- */}
        <aside className="glass hidden h-fit rounded-2xl p-4 xl:block">
          <div className="mb-4">
            <div className="text-[10px] font-semibold tracking-[0.18em] text-paper">
              LA RUCHE AMAVYA
            </div>
            <div className="mt-1 flex items-center gap-2 text-[10px] text-emerald-400">
              <span className="h-1.5 w-1.5 animate-ticker rounded-full bg-emerald-400" />
              SYSTÈME ACTIF
            </div>
          </div>

          <nav className="space-y-1">
            {SIDE_MENU.map((m) => (
              <button
                key={m.label}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[12.5px] transition-colors ${
                  m.active
                    ? "bg-gold/10 text-gold-bright ring-1 ring-gold/25"
                    : "text-silver hover:bg-white/5 hover:text-paper"
                }`}
              >
                <m.icon width={18} height={18} />
                {m.label}
              </button>
            ))}
          </nav>

          <div className="my-4 h-px bg-white/5" />

          <div className="text-[9.5px] font-semibold tracking-[0.16em] text-muted">
            AGENTS ACTIFS EN TEMPS RÉEL
          </div>
          <div className="mt-3 space-y-3">
            {REALTIME.map((r) => (
              <div key={r.label} className="flex items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-gold/20 bg-gold/5 text-gold-bright">
                  <r.icon width={15} height={15} />
                </span>
                <div className="leading-tight">
                  <span className="text-[13px] font-bold text-paper">{r.big}</span>{" "}
                  <span className="text-[11px] text-muted">{r.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="my-4 h-px bg-white/5" />

          <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-gold to-gold-deep text-sm font-bold text-ink">
              TH
            </div>
            <div className="leading-tight">
              <div className="text-[12.5px] font-semibold text-paper">Tarek Haffaf</div>
              <div className="text-[10px] text-muted">Fondateur &amp; CEO</div>
              <div className="mt-0.5 flex items-center gap-1 text-[9px] text-emerald-400">
                <span className="h-1 w-1 rounded-full bg-emerald-400" /> En ligne
              </div>
            </div>
          </div>
        </aside>

        {/* ---------- CENTRE ---------- */}
        <main className="space-y-5">
          {/* Hero texte + ruche */}
          <section className="glass relative overflow-hidden rounded-2xl p-6">
            <div className="relative z-10 max-w-md">
              <div className="text-[11px] font-semibold tracking-[0.2em] text-gold-bright">
                NOTRE FORCE
              </div>
              <h1 className="mt-2 text-2xl font-bold leading-tight md:text-3xl">
                UNE RUCHE.<br />
                <span className="text-gradient">DES CENTAINES D'AGENTS.</span><br />
                UNE INTELLIGENCE COLLECTIVE.
              </h1>
              <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-muted">
                Chaque agent IA est spécialisé dans une mission précise et travaille en
                parfaite collaboration avec les autres pour atteindre vos objectifs.
              </p>
              <button className="glow-ring mt-4 inline-flex items-center gap-2 rounded-lg border border-gold/30 bg-gold/10 px-4 py-2.5 text-[12px] font-semibold text-gold-bright">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-gold text-ink">
                  <Icon.play width={11} height={11} />
                </span>
                DÉCOUVRIR LE FONCTIONNEMENT
              </button>
            </div>

            {/* Ruche hexagonale */}
            <div className="relative mx-auto mt-6 h-[420px] w-full max-w-[460px]">
              {/* anneaux orbitaux */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/10" />
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/10 animate-pulse-glow" />

              {/* cellules satellites */}
              {HIVE.map((cell, i) => (
                <HexCell key={cell.id} cell={cell} active={hover} onHover={setHover} delay={0.15 + i * 0.07} />
              ))}

              {/* cœur central — abeille dorée
                  (3 niveaux : positionnement → flottaison → scale, pour
                   éviter que Motion n'écrase le transform de centrage) */}
              <div className="absolute left-1/2 top-1/2" style={{ transform: "translate(-50%,-50%)" }}>
                <div className="animate-float-slow">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 120, damping: 12 }}
                    className="grid place-items-center"
                    style={{
                      width: 138,
                      height: 156,
                      clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                      background: "linear-gradient(160deg, rgba(240,210,122,.3), rgba(7,17,31,.6))",
                      border: "1.5px solid rgba(240,210,122,.8)",
                      boxShadow: "0 0 60px rgba(240,210,122,.55), inset 0 0 30px rgba(240,210,122,.3)",
                    }}
                  >
                    <span className="text-gold-bright drop-shadow-[0_0_18px_rgba(240,210,122,.9)]">
                      <Icon.bee width={56} height={56} />
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>

          {/* Données globales de la ruche */}
          <section className="glass rounded-2xl p-5">
            <h2 className="mb-4 text-[12px] font-semibold tracking-[0.18em] text-paper">
              DONNÉES GLOBALES DE LA RUCHE
            </h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
              {GLOBAL.map((g) => (
                <motion.div
                  key={g.label}
                  whileHover={{ y: -4 }}
                  className="rounded-xl border border-white/5 bg-white/[0.03] p-3"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: `${g.c}1a`, color: g.c }}>
                    <g.icon width={17} height={17} />
                  </span>
                  <div className="mt-2.5 text-lg font-bold text-paper">
                    <Stat value={g.n} decimals={g.decimals || 0} prefix={g.prefix || ""} suffix={g.suffix || ""} />
                  </div>
                  <div className="text-[11px] text-muted">{g.label}</div>
                  <div className="mt-1 text-[10px] font-medium text-emerald-400">{g.trend}</div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Activité en temps réel (ticker) */}
          <section className="glass rounded-2xl p-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wider text-gold-bright">
                <span className="h-2 w-2 animate-ticker rounded-full bg-emerald-400" />
                ACTIVITÉ EN TEMPS RÉEL
              </div>
              {ACTIVITY.map((a) => (
                <div key={a.t} className="flex items-center gap-2">
                  <span className="text-emerald-400/80">
                    <a.icon width={15} height={15} />
                  </span>
                  <div className="leading-tight">
                    <div className="text-[11px] font-medium text-paper">{a.t}</div>
                    <div className="text-[9.5px] text-muted">
                      {a.s} · {a.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* ---------- PANNEAU DROIT ---------- */}
        <aside className="space-y-4">
          {/* Agent prospection */}
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-bold tracking-wide text-gradient">
                AGENT PROSPECTION
              </h3>
              <span className="flex items-center gap-1 text-[9px] font-semibold tracking-widest text-emerald-400">
                ACTIF <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
            </div>
            <p className="mt-2 text-[11.5px] leading-relaxed text-muted">
              Identifie, qualifie et engage vos futurs clients en continu pour alimenter
              votre pipeline.
            </p>

            <div className="mt-4">
              <PanelTitle>MISSIONS EN COURS</PanelTitle>
              <div className="space-y-3">
                {MISSIONS.map((m, i) => (
                  <div key={m.label}>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-paper">{m.label}</span>
                      <span className="text-muted">{m.value}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${m.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 via-gold to-gold-bright"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="glow-ring mt-4 flex w-full items-center justify-between rounded-lg border border-gold/25 bg-gold/5 px-4 py-2.5 text-[11px] font-semibold tracking-wide text-gold-bright">
              VOIR LE RAPPORT COMPLET
              <Icon.chevron width={15} height={15} />
            </button>
          </div>

          {/* Performance agent */}
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <PanelTitle>PERFORMANCE AGENT</PanelTitle>
              <span className="rounded-md border border-white/10 px-2 py-1 text-[10px] text-silver">
                Cette semaine ▾
              </span>
            </div>
            <div className="flex items-center gap-4">
              <RadialGauge />
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-bold text-emerald-400">+1,250</div>
                  <div className="text-[10px] text-muted">Prospects identifiés</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-emerald-400">+312</div>
                  <div className="text-[10px] text-muted">Rendez-vous générés</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-emerald-400">+24.8%</div>
                  <div className="text-[10px] text-muted">Taux de conversion</div>
                </div>
              </div>
            </div>
          </div>

          {/* Flux de données */}
          <div className="glass relative overflow-hidden rounded-2xl p-4">
            <PanelTitle>FLUX DE DONNÉES EN TEMPS RÉEL</PanelTitle>
            <div className="relative h-28 w-full">
              <svg viewBox="0 0 320 110" className="h-full w-full">
                <defs>
                  <linearGradient id="flowA" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f0d27a" stopOpacity="0" />
                    <stop offset="50%" stopColor="#f0d27a" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="flowB" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#a78bfa" stopOpacity="0" />
                    <stop offset="50%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0, 1, 2, 3].map((i) => (
                  <path
                    key={i}
                    d={`M0 55 C 80 ${20 + i * 12}, 160 ${90 - i * 12}, 320 55`}
                    fill="none"
                    stroke={i % 2 ? "url(#flowB)" : "url(#flowA)"}
                    strokeWidth="1.5"
                    strokeDasharray="6 10"
                    opacity={0.8 - i * 0.12}
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="0"
                      to="-160"
                      dur={`${2.4 + i * 0.5}s`}
                      repeatCount="indefinite"
                    />
                  </path>
                ))}
                <circle cx="160" cy="55" r="4" fill="#f0d27a">
                  <animate attributeName="r" from="3" to="7" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="1" to="0.2" dur="1.8s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[10px] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Données sécurisées &amp; cryptées
            </div>
          </div>
        </aside>
      </div>

      <footer className="relative z-10 border-t border-white/5 px-6 py-5 text-center text-[11px] text-muted">
        AMAVYA · Centre de commande — page de démonstration ·{" "}
        <span className="text-gold-bright">La Ruche d'agents IA</span>
      </footer>
    </div>
  );
}
