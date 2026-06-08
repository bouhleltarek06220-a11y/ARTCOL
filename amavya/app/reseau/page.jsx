"use client";

/* ============================================================
   AMAVYA — Réseau mondial d'agents IA connectés 24/7
   Reproduction de la capture « globe » — route /reseau
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import Logo from "@/components/Logo";

/* ---- icônes inline ---- */
const ico = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
const Icon = {
  bee: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><ellipse cx="12" cy="14" rx="4" ry="6" /><path d="M8 12h8M8 15h8M9 18h6" /><path d="M12 8c-2-3-6-3-7-1 0 2 3 3 5 3M12 8c2-3 6-3 7-1 0 2-3 3-5 3" /><path d="M12 8V6M10.5 4.5 12 6l1.5-1.5" /></svg>),
  building: (p) => (<svg {...ico} {...p}><rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M9 7h.01M15 7h.01M9 11h.01M15 11h.01M9 15h.01M15 15h.01" /></svg>),
  agents: (p) => (<svg {...ico} {...p}><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 11a3 3 0 1 0-1-5.83" /><path d="M21 20a6 6 0 0 0-5-5.91" /></svg>),
  target: (p) => (<svg {...ico} {...p}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1" /></svg>),
  mega: (p) => (<svg {...ico} {...p}><path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1Z" /><path d="M16 9a4 4 0 0 1 0 6" /></svg>),
  chat: (p) => (<svg {...ico} {...p}><path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2Z" /></svg>),
  bars: (p) => (<svg {...ico} {...p}><path d="M7 20V10M12 20V4M17 20v-7" /></svg>),
  gear: (p) => (<svg {...ico} {...p}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></svg>),
  clock: (p) => (<svg {...ico} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>),
  euro: (p) => (<svg {...ico} {...p}><path d="M18 7a7 7 0 1 0 0 10M4 10h8M4 14h7" /></svg>),
  rocket: (p) => (<svg {...ico} {...p}><path d="M9 15l-3-3a13 13 0 0 1 9-9c2 0 4 2 4 4a13 13 0 0 1-9 9l-1-1Z" /><path d="M9 15c-1 1-1.5 4-1.5 4s3-.5 4-1.5" /><circle cx="14.5" cy="9.5" r="1.5" /></svg>),
  check: (p) => (<svg {...ico} {...p}><path d="M20 6 9 17l-5-5" /></svg>),
  perf: (p) => (<svg {...ico} {...p}><path d="M3 3v18h18" /><path d="M7 14l3-4 4 3 5-7" /></svg>),
};

/* ---- compteur animé ---- */
function useCountUp(target, { decimals = 0, duration = 1600 } = {}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { setVal(target); return; }
    let raf; const start = performance.now();
    const tick = (now) => { const t = Math.min(1, (now - start) / duration); setVal(target * (1 - Math.pow(1 - t, 3))); if (t < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);
  return { ref, display: decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString("fr-FR") };
}
function Stat({ value, decimals = 0, prefix = "", suffix = "" }) {
  const { ref, display } = useCountUp(value, { decimals });
  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

/* ---- données ---- */
const REGIONS = [
  { name: "AMÉRIQUE DU NORD", ent: "487 entreprises", ag: "1,248 agents actifs", x: "20%", y: "30%" },
  { name: "EUROPE", ent: "1,024 entreprises", ag: "4,215 agents actifs", x: "60%", y: "22%" },
  { name: "ASIE", ent: "612 entreprises", ag: "2,487 agents actifs", x: "80%", y: "42%" },
  { name: "AMÉRIQUE DU SUD", ent: "312 entreprises", ag: "842 agents actifs", x: "28%", y: "66%" },
  { name: "AFRIQUE", ent: "210 entreprises", ag: "623 agents actifs", x: "55%", y: "62%" },
];

const FEED = [
  { icon: Icon.target, c: "#a78bfa", t: "Agent Prospection", d: "Nouveau prospect qualifié · TechNova Solutions" },
  { icon: Icon.agents, c: "#38bdf8", t: "Agent CRM", d: "Mise à jour de 32 contacts · base synchronisée" },
  { icon: Icon.mega, c: "#ec4899", t: "Agent Marketing", d: "Campagne LinkedIn lancée · ROI projeté 312%" },
  { icon: Icon.chat, c: "#22d3ee", t: "Agent Support", d: "89 conversations résolues · satisfaction 98%" },
  { icon: Icon.bars, c: "#34d399", t: "Agent Analyse", d: "Rapport de performance généré · croissance +28.4%" },
  { icon: Icon.gear, c: "#f0d27a", t: "Agent Automatisation", d: "14 tâches automatisées · temps économisé 12.5h" },
];

const TOOLS = ["HubSpot", "Salesforce", "Pipedrive", "Zoho", "Slack", "Mailchimp", "Google Ads", "Meta", "LinkedIn", "Shopify", "Stripe"];

const STATS = [
  { icon: Icon.clock, n: 125430, suffix: " h", label: "Temps économisé ce mois", c: "#f0d27a" },
  { icon: Icon.target, n: 8245, label: "Objectifs atteints ce mois", c: "#a78bfa" },
  { icon: Icon.euro, n: 2.4, decimals: 1, prefix: "€", suffix: "M+", label: "Revenus générés ce mois", c: "#34d399" },
  { icon: Icon.perf, n: 98.6, decimals: 1, suffix: "%", label: "Taux de satisfaction global", c: "#38bdf8" },
  { icon: Icon.rocket, n: 34.7, decimals: 1, prefix: "+", suffix: "%", label: "Croissance moyenne clients", c: "#f0d27a" },
];

/* ---- Globe SVG animé ---- */
function Globe() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[460px]">
      {/* halo */}
      <div className="absolute inset-0 rounded-full opacity-70 blur-2xl" style={{ background: "radial-gradient(circle, rgba(56,189,248,.18), rgba(217,164,65,.14), transparent 70%)" }} />
      {/* anneaux orbitaux */}
      <div className="absolute left-1/2 top-1/2 h-[112%] w-[112%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/15 animate-pulse-glow" />
      <div className="absolute left-1/2 top-1/2 h-[128%] w-[40%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-cyan-400/10" style={{ transform: "translate(-50%,-50%) rotate(60deg)" }} />

      <svg viewBox="0 0 200 200" className="relative h-full w-full">
        <defs>
          <radialGradient id="sphere" cx="38%" cy="34%" r="75%">
            <stop offset="0%" stopColor="#0e2a44" />
            <stop offset="60%" stopColor="#07182a" />
            <stop offset="100%" stopColor="#030a14" />
          </radialGradient>
          <linearGradient id="arc" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f0d27a" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>

        <circle cx="100" cy="100" r="78" fill="url(#sphere)" stroke="rgba(217,164,65,.3)" strokeWidth="0.6" />

        {/* méridiens / parallèles (wireframe) */}
        <g stroke="rgba(120,170,210,.18)" strokeWidth="0.5" fill="none">
          {[20, 40, 58, 70].map((ry, i) => (
            <ellipse key={"p" + i} cx="100" cy="100" rx="78" ry={ry} />
          ))}
          {[18, 40, 60, 78].map((rx, i) => (
            <ellipse key={"m" + i} cx="100" cy="100" rx={rx} ry="78" />
          ))}
          <line x1="22" y1="100" x2="178" y2="100" />
        </g>

        {/* points "terre" scintillants */}
        <g fill="#f0d27a">
          {[[70, 55], [120, 48], [150, 80], [60, 110], [110, 130], [95, 70], [135, 110], [80, 90]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="1.3" opacity="0.8">
              <animate attributeName="opacity" values="0.3;1;0.3" dur={`${2 + (i % 4)}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>

        {/* arcs animés entre continents */}
        <g fill="none" stroke="url(#arc)" strokeWidth="1.1" strokeLinecap="round">
          {[
            "M70 55 Q 100 10 150 80",
            "M60 110 Q 95 60 120 48",
            "M150 80 Q 120 120 110 130",
            "M70 55 Q 60 95 95 130",
            "M120 48 Q 160 90 135 110",
          ].map((d, i) => (
            <path key={i} d={d} strokeDasharray="4 60" opacity="0.9">
              <animate attributeName="stroke-dashoffset" from="64" to="0" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
            </path>
          ))}
        </g>

        {/* abeille centrale */}
        <g transform="translate(100 100)" className="text-gold-bright">
          <circle r="9" fill="rgba(240,210,122,.12)" stroke="rgba(240,210,122,.6)" strokeWidth="0.6" />
        </g>
      </svg>

      {/* abeille glow au centre */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gold-bright drop-shadow-[0_0_16px_rgba(240,210,122,.9)] animate-float-slow">
        <Icon.bee width={34} height={34} />
      </div>

      {/* étiquettes régions */}
      {REGIONS.map((r) => (
        <motion.div
          key={r.name}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="absolute hidden -translate-x-1/2 -translate-y-1/2 rounded-lg border border-white/10 bg-ink-800/80 px-2.5 py-1.5 backdrop-blur-sm sm:block"
          style={{ left: r.x, top: r.y }}
        >
          <div className="flex items-center gap-1.5 text-[8.5px] font-semibold tracking-wide text-paper">
            <span className="h-1 w-1 rounded-full bg-emerald-400" />{r.name}
          </div>
          <div className="text-[8px] text-muted">{r.ent}</div>
          <div className="text-[8px] text-gold-bright">{r.ag}</div>
        </motion.div>
      ))}
    </div>
  );
}

export default function ReseauPage() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden text-paper" style={{ background: "radial-gradient(120% 90% at 50% -10%, #0a1626 0%, #060b14 45%, #03060b 100%)" }}>
      <div className="pointer-events-none absolute inset-0 grid-mask opacity-40" />

      {/* NAV */}
      <header className="relative z-20 mx-auto flex max-w-[1500px] items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Logo size={42} showWordmark={false} />
          <div className="text-lg font-bold tracking-[0.2em] text-gradient">AMAVYA</div>
        </Link>
        <nav className="hidden items-center gap-7 text-[12px] font-medium tracking-wide text-silver lg:flex">
          <Link href="/" className="hover:text-paper">VISION</Link>
          <span className="hover:text-paper cursor-pointer">AGENTS IA</span>
          <span className="hover:text-paper cursor-pointer">SOLUTIONS</span>
          <span className="text-gold-bright">DÉMONSTRATION</span>
          <span className="hover:text-paper cursor-pointer">RESSOURCES</span>
          <span className="hover:text-paper cursor-pointer">CONTACT</span>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="rounded-lg border border-white/10 px-3 py-2 text-[12px] text-silver hover:text-paper">Se connecter</Link>
          <button className="glow-ring rounded-lg bg-gradient-to-r from-gold to-gold-bright px-4 py-2.5 text-[12px] font-semibold text-ink">PRENDRE RENDEZ-VOUS</button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-[1500px] px-6 pb-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr_320px]">
          {/* GAUCHE : texte + KPI */}
          <section className="flex flex-col justify-center">
            <div className="text-[11px] font-semibold tracking-[0.2em] text-gold-bright">◆ RÉSEAU AMAVYA</div>
            <h1 className="mt-3 text-3xl font-bold leading-[1.05] xl:text-4xl">
              UN RÉSEAU MONDIAL D'<span className="text-gradient">AGENTS IA</span> CONNECTÉS 24/7
            </h1>
            <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-muted">
              Nos agents intelligents collaborent entre eux et avec vos outils pour créer
              un écosystème puissant au service de votre croissance.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[12px] text-emerald-400">
              <span className="h-1.5 w-1.5 animate-ticker rounded-full bg-emerald-400" />
              RÉSEAU ACTIF · <span className="text-muted">99.99% de disponibilité</span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { icon: Icon.building, n: 2845, suffix: "+", label: "ENTREPRISES CONNECTÉES", trend: "+18.7% ce mois" },
                { icon: Icon.agents, n: 12458, label: "AGENTS IA ACTIFS", trend: "+24.3% ce mois" },
              ].map((k) => (
                <div key={k.label} className="glass rounded-xl p-4">
                  <span className="grid h-9 w-9 place-items-center rounded-lg border border-gold/20 bg-gold/5 text-gold-bright"><k.icon width={17} height={17} /></span>
                  <div className="mt-3 text-2xl font-bold text-paper"><Stat value={k.n} suffix={k.suffix || ""} /></div>
                  <div className="text-[9.5px] tracking-wide text-muted">{k.label}</div>
                  <div className="mt-1 text-[10px] font-medium text-emerald-400">{k.trend}</div>
                </div>
              ))}
            </div>

            <button className="glow-ring mt-5 inline-flex w-fit items-center gap-2 rounded-lg border border-gold/30 bg-gold/10 px-5 py-3 text-[12.5px] font-semibold text-gold-bright">
              EXPLORER LE RÉSEAU →
            </button>
          </section>

          {/* CENTRE : globe */}
          <section className="flex items-center justify-center py-4">
            <Globe />
          </section>

          {/* DROITE : flux d'activité */}
          <aside className="glass h-fit rounded-2xl p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[11px] font-semibold tracking-[0.16em] text-paper">FLUX D'ACTIVITÉ EN TEMPS RÉEL</h3>
              <span className="text-emerald-400"><Icon.perf width={15} height={15} /></span>
            </div>
            <div className="space-y-2.5">
              {FEED.map((f, i) => (
                <motion.div
                  key={f.t}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-2.5"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg" style={{ background: `${f.c}1a`, color: f.c }}><f.icon width={15} height={15} /></span>
                  <div className="min-w-0">
                    <div className="text-[11.5px] font-semibold text-paper">{f.t}</div>
                    <div className="truncate text-[10px] text-muted">{f.d}</div>
                  </div>
                  <span className="ml-auto text-[9px] text-muted-soft">10:24</span>
                </motion.div>
              ))}
            </div>
            <button className="mt-3 w-full rounded-lg border border-gold/25 bg-gold/5 py-2.5 text-[11px] font-semibold text-gold-bright">VOIR TOUS LES FLUX →</button>
          </aside>
        </div>

        {/* INTÉGRATIONS */}
        <section className="glass mt-6 rounded-2xl p-5">
          <div className="text-[12px] font-semibold tracking-wide text-paper">
            INTÉGRATION PARFAITE AVEC <span className="text-gold-bright">VOS OUTILS</span>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {TOOLS.map((t) => (
              <span key={t} className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-[12px] font-semibold text-silver transition-colors hover:border-gold/40 hover:text-gold-bright">
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* STATS BAS */}
        <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {STATS.map((s) => (
            <div key={s.label} className="glass rounded-xl p-4">
              <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: `${s.c}1a`, color: s.c }}><s.icon width={17} height={17} /></span>
              <div className="mt-2.5 text-xl font-bold text-paper"><Stat value={s.n} decimals={s.decimals || 0} prefix={s.prefix || ""} suffix={s.suffix || ""} /></div>
              <div className="text-[10.5px] text-muted">{s.label}</div>
            </div>
          ))}
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/5 px-6 py-5 text-center text-[11px] text-muted">
        AMAVYA · Réseau mondial — page de démonstration ·{" "}
        <Link href="/command-center" className="text-gold-bright hover:underline">Voir le centre de commande →</Link>
      </footer>
    </div>
  );
}
