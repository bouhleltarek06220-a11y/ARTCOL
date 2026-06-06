"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "./LangProvider";

/* Compteur animé : part de 0 au montage, puis rejoint chaque nouvelle cible. */
function useCountTo(target, dur = 1000) {
  const [v, setV] = useState(0);
  const ref = useRef(0);
  useEffect(() => {
    const from = ref.current;
    const t0 = performance.now();
    let raf;
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      const cur = from + (target - from) * e;
      ref.current = cur;
      setV(cur);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, dur]);
  return v;
}

function fmt(value, meta, locale) {
  const s = value.toLocaleString(locale, {
    minimumFractionDigits: meta.decimals || 0,
    maximumFractionDigits: meta.decimals || 0,
  });
  return `${meta.prefix || ""}${s}${meta.suffix || ""}`;
}

function AnimatedStat({ target, meta, locale }) {
  const v = useCountTo(target);
  return <>{fmt(v, meta, locale)}</>;
}

/* Vues du tableau de bord (bilingue) */
const DASH = {
  fr: [
    {
      kpis: [
        { label: "Leads traités", base: 12480, decimals: 0, delta: "+24%" },
        { label: "Taux réponse", base: 38.5, decimals: 1, suffix: " %", delta: "+11%" },
        { label: "Tâches auto.", base: 1932, decimals: 0, delta: "+57%" },
      ],
      chart: { title: "Activité globale", range: "7 derniers jours", bars: [42, 68, 55, 88, 73, 95, 61] },
      status: { text: "Système opérationnel · tout est synchronisé", badge: "Live" },
    },
    {
      kpis: [
        { label: "Agents actifs", base: 12, decimals: 0, delta: "+3" },
        { label: "Auto-résolu", base: 92, decimals: 0, suffix: " %", delta: "+6%" },
        { label: "Tâches / agent", base: 161, decimals: 0, delta: "+57%" },
      ],
      chart: { title: "Performance des agents", range: "7 derniers jours", bars: [60, 72, 50, 84, 66, 92, 78] },
      status: { text: "3 agents en ligne · raisonnement en cours", badge: "Actif" },
    },
    {
      kpis: [
        { label: "Opportunités", base: 248, decimals: 0, delta: "+12%" },
        { label: "Valeur pipe", base: 1.2, decimals: 1, suffix: " M€", delta: "+15%" },
        { label: "Taux closing", base: 34, decimals: 0, suffix: " %", delta: "+9%" },
      ],
      chart: { title: "Évolution du pipeline", range: "30 derniers jours", bars: [30, 45, 52, 60, 68, 80, 92] },
      status: { text: "Pipeline mis à jour · 6 deals à relancer", badge: "Sync" },
    },
    {
      kpis: [
        { label: "Emails envoyés", base: 4510, decimals: 0, delta: "+40%" },
        { label: "Réponses", base: 1128, decimals: 0, delta: "+22%" },
        { label: "RDV pris", base: 86, decimals: 0, delta: "+31%" },
      ],
      chart: { title: "Réponses par jour", range: "7 derniers jours", bars: [80, 55, 70, 48, 85, 62, 90] },
      status: { text: "Séquences actives · relances automatiques", badge: "En cours" },
    },
    {
      kpis: [
        { label: "Revenu", base: 92, decimals: 0, suffix: " k€", delta: "+28%" },
        { label: "ROI", base: 4.3, decimals: 1, suffix: "x", delta: "+19%" },
        { label: "Coût / lead", base: 3.2, decimals: 1, suffix: " €", delta: "-14%" },
      ],
      chart: { title: "Tendance revenus", range: "12 derniers mois", bars: [50, 58, 66, 62, 78, 86, 99] },
      status: { text: "Rapport généré · objectifs dépassés", badge: "À jour" },
    },
  ],
  en: [
    {
      kpis: [
        { label: "Leads processed", base: 12480, decimals: 0, delta: "+24%" },
        { label: "Response rate", base: 38.5, decimals: 1, suffix: "%", delta: "+11%" },
        { label: "Auto. tasks", base: 1932, decimals: 0, delta: "+57%" },
      ],
      chart: { title: "Global activity", range: "Last 7 days", bars: [42, 68, 55, 88, 73, 95, 61] },
      status: { text: "System operational · everything in sync", badge: "Live" },
    },
    {
      kpis: [
        { label: "Active agents", base: 12, decimals: 0, delta: "+3" },
        { label: "Auto-resolved", base: 92, decimals: 0, suffix: "%", delta: "+6%" },
        { label: "Tasks / agent", base: 161, decimals: 0, delta: "+57%" },
      ],
      chart: { title: "Agent performance", range: "Last 7 days", bars: [60, 72, 50, 84, 66, 92, 78] },
      status: { text: "3 agents online · reasoning in progress", badge: "Active" },
    },
    {
      kpis: [
        { label: "Opportunities", base: 248, decimals: 0, delta: "+12%" },
        { label: "Pipe value", base: 1.2, decimals: 1, suffix: "M€", delta: "+15%" },
        { label: "Close rate", base: 34, decimals: 0, suffix: "%", delta: "+9%" },
      ],
      chart: { title: "Pipeline trend", range: "Last 30 days", bars: [30, 45, 52, 60, 68, 80, 92] },
      status: { text: "Pipeline updated · 6 deals to follow up", badge: "Sync" },
    },
    {
      kpis: [
        { label: "Emails sent", base: 4510, decimals: 0, delta: "+40%" },
        { label: "Replies", base: 1128, decimals: 0, delta: "+22%" },
        { label: "Meetings", base: 86, decimals: 0, delta: "+31%" },
      ],
      chart: { title: "Replies per day", range: "Last 7 days", bars: [80, 55, 70, 48, 85, 62, 90] },
      status: { text: "Active sequences · automatic follow-ups", badge: "Running" },
    },
    {
      kpis: [
        { label: "Revenue", base: 92, decimals: 0, suffix: "k€", delta: "+28%" },
        { label: "ROI", base: 4.3, decimals: 1, suffix: "x", delta: "+19%" },
        { label: "Cost / lead", base: 3.2, decimals: 1, suffix: "€", delta: "-14%" },
      ],
      chart: { title: "Revenue trend", range: "Last 12 months", bars: [50, 58, 66, 62, 78, 86, 99] },
      status: { text: "Report generated · targets exceeded", badge: "Updated" },
    },
  ],
};

const clamp = (n) => Math.max(8, Math.min(100, n));

export default function DashboardMockup() {
  const { t, lang } = useLang();
  const d = t.dashboard;
  const locale = lang === "fr" ? "fr-FR" : "en-US";
  const views = DASH[lang] || DASH.fr;

  const [view, setView] = useState(0);
  const [live, setLive] = useState([0, 0, 0]); // micro-incréments KPI
  const [jitter, setJitter] = useState([0, 0, 0, 0, 0, 0, 0]); // variation graphe

  // Défilement automatique des vues
  useEffect(() => {
    const id = setInterval(() => setView((v) => (v + 1) % views.length), 5000);
    return () => clearInterval(id);
  }, [views.length]);

  // Reset des variations live à chaque changement de vue
  useEffect(() => {
    setLive([0, 0, 0]);
    setJitter([0, 0, 0, 0, 0, 0, 0]);
  }, [view]);

  // Pouls "temps réel" : les chiffres montent et le graphe respire
  useEffect(() => {
    const id = setInterval(() => {
      setLive((p) => p.map((x, i) => (i === 1 ? x : x + Math.round(Math.random() * 6))));
      setJitter(() => Array.from({ length: 7 }, () => (Math.random() - 0.5) * 12));
    }, 1900);
    return () => clearInterval(id);
  }, []);

  const cur = views[view];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 12 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full"
      style={{ perspective: 1200 }}
    >
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.3),transparent_70%)] blur-2xl" />

      <div className="glow-ring glass-strong overflow-hidden rounded-3xl">
        {/* Barre de fenêtre */}
        <div className="flex items-center gap-2 border-b border-white/5 px-5 py-3.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]/80" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]/80" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]/80" />
          <div className="ml-3 flex items-center gap-2 rounded-md bg-white/5 px-3 py-1 text-[11px] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-bright animate-ticker" />
            console.amavya.ai
          </div>
        </div>

        {/* Corps */}
        <div className="grid grid-cols-12 gap-4 p-5">
          {/* Sidebar avec surlignage glissant */}
          <div className="col-span-3 hidden flex-col gap-1.5 sm:flex">
            {d.sidebar.map((item, i) => {
              const on = i === view;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setView(i)}
                  className="relative rounded-lg px-3 py-2 text-left text-[11px] font-medium"
                >
                  {on && (
                    <motion.span
                      layoutId="dashNavActive"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      className="absolute inset-0 rounded-lg bg-[linear-gradient(110deg,rgba(168,127,46,0.55),rgba(212,175,55,0.35))]"
                    />
                  )}
                  <span className={`relative z-10 transition-colors duration-300 ${on ? "text-ink" : "text-muted/80"}`}>
                    {item}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Contenu principal (transition entre vues) */}
          <div className="col-span-12 sm:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-4"
              >
                {/* KPIs — légère élévation + bord doré au hover */}
                <div className="grid grid-cols-3 gap-3">
                  {cur.kpis.map((kpi, i) => (
                    <div
                      key={kpi.label}
                      className="glass group relative cursor-default overflow-hidden rounded-xl p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/30 hover:shadow-[0_8px_24px_-12px_rgba(240,210,122,0.5)]"
                    >
                      {/* Halo doré qui apparaît au coin haut-droit */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-[radial-gradient(circle,rgba(240,210,122,0.4),transparent_70%)] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
                      />
                      <p className="truncate text-[10px] uppercase tracking-wide text-muted">{kpi.label}</p>
                      <p className="mt-1 text-base font-semibold tabular-nums text-paper sm:text-lg">
                        <AnimatedStat target={kpi.base + (live[i] || 0)} meta={kpi} locale={locale} />
                      </p>
                      <p className="text-[10px] font-medium text-emerald-400">{kpi.delta}</p>
                    </div>
                  ))}
                </div>

                {/* Graphe vivant */}
                <div className="glass rounded-xl p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-[11px] font-medium text-paper">{cur.chart.title}</p>
                    <span className="flex items-center gap-1.5 text-[10px] text-muted">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      </span>
                      {cur.chart.range}
                    </span>
                  </div>
                  <div className="group/chart flex h-28 items-end justify-between gap-2">
                    {cur.chart.bars.map((h, i) => {
                      const height = clamp(h + (jitter[i] || 0));
                      const isLast = i === cur.chart.bars.length - 1;
                      return (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 0.7, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
                          className={`relative w-full origin-bottom rounded-t-md bg-[linear-gradient(to_top,#a87f2e,#f0d27a)] transition-transform duration-500 hover:scale-y-110 ${isLast ? "shadow-[0_0_16px_-2px_rgba(240,210,122,0.7)]" : ""}`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Statut / activité live */}
                <div className="glass flex items-center gap-3 rounded-xl p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#a87f2e,#d4af37)] text-xs font-bold text-ink">
                    IA
                  </div>
                  <div className="min-w-0 flex-1">
                    <motion.div initial={{ width: 0 }} animate={{ width: "70%" }} transition={{ duration: 0.9, ease: "easeOut" }} className="h-2 rounded-full bg-white/15" />
                    <p className="mt-1.5 truncate text-[10px] text-muted">{cur.status.text}</p>
                  </div>
                  <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-medium text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {cur.status.badge}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Carte flottante "agent en ligne" */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="glass-strong absolute -bottom-6 -left-4 hidden items-center gap-3 rounded-2xl px-4 py-3 sm:flex"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-bright opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold-bright" />
        </span>
        <div>
          <p className="text-[11px] font-semibold text-paper">{d.floatTitle}</p>
          <p className="text-[10px] text-muted">{d.floatSubtitle}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
