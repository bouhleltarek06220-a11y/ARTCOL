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

/* ---------------------------------------------------------------------------
   Vues de l'Agent de Prospection IA AMAVYA.
   Chiffres dimensionnés pour un artisan / TPE / PME (échelle locale 06·83·13),
   pas pour une grosse boîte — pour que le visuel reste crédible.
   --------------------------------------------------------------------------- */
const DASH = {
  fr: [
    // 1. Prospects identifiés cette semaine
    {
      kpis: [
        { label: "Prospects identifiés", base: 142, decimals: 0, delta: "+18 cette semaine" },
        { label: "Zones couvertes", base: 3, decimals: 0, delta: "06 · 83 · 13" },
        { label: "Pertinence moy.", base: 87, decimals: 0, suffix: " %", delta: "+4 pts" },
      ],
      chart: { title: "Prospects ajoutés · 7 jours", range: "7 derniers jours", bars: [12, 22, 18, 28, 24, 32, 26] },
      status: { text: "L'agent ratisse votre zone · 06 / 83 / 13", badge: "En veille" },
    },
    // 2. Messages envoyés
    {
      kpis: [
        { label: "Messages envoyés", base: 286, decimals: 0, delta: "+42 cette semaine" },
        { label: "Personnalisés", base: 100, decimals: 0, suffix: " %", delta: "1 message = 1 prospect" },
        { label: "Heure d'envoi", base: 9, decimals: 0, suffix: "h-18h", delta: "Tranche optimale" },
      ],
      chart: { title: "Envois quotidiens", range: "7 derniers jours", bars: [38, 42, 36, 48, 44, 52, 40] },
      status: { text: "L'agent rédige des messages adaptés à votre métier", badge: "Actif" },
    },
    // 3. Réponses reçues
    {
      kpis: [
        { label: "Réponses reçues", base: 38, decimals: 0, delta: "+9 cette semaine" },
        { label: "Taux de réponse", base: 13.3, decimals: 1, suffix: " %", delta: "Cold outreach" },
        { label: "Réponses chaudes", base: 12, decimals: 0, delta: "Intentionnistes" },
      ],
      chart: { title: "Réponses · 7 jours", range: "7 derniers jours", bars: [4, 6, 5, 8, 7, 9, 6] },
      status: { text: "3 prospects ont répondu dans les 2 dernières heures", badge: "Live" },
    },
    // 4. Leads qualifiés à rappeler
    {
      kpis: [
        { label: "Leads qualifiés", base: 14, decimals: 0, delta: "Prêts à rappeler" },
        { label: "Score moyen", base: 82, decimals: 0, suffix: "/100", delta: "+6 vs sem. dernière" },
        { label: "À recontacter", base: 5, decimals: 0, delta: "Sous 24h" },
      ],
      chart: { title: "Qualification · 7 jours", range: "7 derniers jours", bars: [1, 3, 2, 4, 3, 5, 4] },
      status: { text: "Nouveau lead chaud · Plomberie Var · à rappeler ce matin", badge: "Priorité" },
    },
    // 5. Activité de l'agent
    {
      kpis: [
        { label: "Veille active", base: 24, decimals: 0, suffix: "h/24", delta: "Sans pause" },
        { label: "Relances auto.", base: 47, decimals: 0, delta: "Cette semaine" },
        { label: "Économisé", base: 11, decimals: 0, suffix: " h/sem.", delta: "Sur votre agenda" },
      ],
      chart: { title: "Activité de l'agent", range: "7 derniers jours", bars: [62, 70, 58, 78, 66, 82, 74] },
      status: { text: "L'agent prospecte pendant que vous êtes sur le terrain", badge: "24/7" },
    },
  ],
  // EN / ES : on garde la structure, traduction minimale (le marché cible est FR)
  en: [
    {
      kpis: [
        { label: "Prospects identified", base: 142, decimals: 0, delta: "+18 this week" },
        { label: "Areas covered", base: 3, decimals: 0, delta: "06 · 83 · 13" },
        { label: "Avg. relevance", base: 87, decimals: 0, suffix: "%", delta: "+4 pts" },
      ],
      chart: { title: "Prospects added · 7 days", range: "Last 7 days", bars: [12, 22, 18, 28, 24, 32, 26] },
      status: { text: "Agent scanning your area · 06 / 83 / 13", badge: "Scanning" },
    },
    {
      kpis: [
        { label: "Messages sent", base: 286, decimals: 0, delta: "+42 this week" },
        { label: "Personalised", base: 100, decimals: 0, suffix: "%", delta: "1 msg = 1 prospect" },
        { label: "Send window", base: 9, decimals: 0, suffix: "h-6pm", delta: "Optimal slot" },
      ],
      chart: { title: "Daily sends", range: "Last 7 days", bars: [38, 42, 36, 48, 44, 52, 40] },
      status: { text: "Agent writes messages tailored to your trade", badge: "Active" },
    },
    {
      kpis: [
        { label: "Replies received", base: 38, decimals: 0, delta: "+9 this week" },
        { label: "Reply rate", base: 13.3, decimals: 1, suffix: "%", delta: "Cold outreach" },
        { label: "Hot replies", base: 12, decimals: 0, delta: "Intent signal" },
      ],
      chart: { title: "Replies · 7 days", range: "Last 7 days", bars: [4, 6, 5, 8, 7, 9, 6] },
      status: { text: "3 prospects replied in the last 2 hours", badge: "Live" },
    },
    {
      kpis: [
        { label: "Qualified leads", base: 14, decimals: 0, delta: "Ready to call" },
        { label: "Avg. score", base: 82, decimals: 0, suffix: "/100", delta: "+6 vs last week" },
        { label: "To recontact", base: 5, decimals: 0, delta: "Within 24h" },
      ],
      chart: { title: "Qualified · 7 days", range: "Last 7 days", bars: [1, 3, 2, 4, 3, 5, 4] },
      status: { text: "New hot lead · Plumbing Var · callback this morning", badge: "Priority" },
    },
    {
      kpis: [
        { label: "Always on", base: 24, decimals: 0, suffix: "h/24", delta: "No breaks" },
        { label: "Auto follow-ups", base: 47, decimals: 0, delta: "This week" },
        { label: "Saved", base: 11, decimals: 0, suffix: " h/wk", delta: "On your calendar" },
      ],
      chart: { title: "Agent activity", range: "Last 7 days", bars: [62, 70, 58, 78, 66, 82, 74] },
      status: { text: "The agent prospects while you're on site", badge: "24/7" },
    },
  ],
  es: [
    {
      kpis: [
        { label: "Prospectos detectados", base: 142, decimals: 0, delta: "+18 esta semana" },
        { label: "Zonas cubiertas", base: 3, decimals: 0, delta: "06 · 83 · 13" },
        { label: "Relevancia media", base: 87, decimals: 0, suffix: " %", delta: "+4 pts" },
      ],
      chart: { title: "Prospectos añadidos · 7 días", range: "Últimos 7 días", bars: [12, 22, 18, 28, 24, 32, 26] },
      status: { text: "El agente explora tu zona · 06 / 83 / 13", badge: "Activo" },
    },
    {
      kpis: [
        { label: "Mensajes enviados", base: 286, decimals: 0, delta: "+42 esta semana" },
        { label: "Personalizados", base: 100, decimals: 0, suffix: " %", delta: "1 msj = 1 prospecto" },
        { label: "Franja de envío", base: 9, decimals: 0, suffix: "h-18h", delta: "Tramo óptimo" },
      ],
      chart: { title: "Envíos diarios", range: "Últimos 7 días", bars: [38, 42, 36, 48, 44, 52, 40] },
      status: { text: "El agente redacta mensajes adaptados a tu oficio", badge: "Activo" },
    },
    {
      kpis: [
        { label: "Respuestas recibidas", base: 38, decimals: 0, delta: "+9 esta semana" },
        { label: "Tasa de respuesta", base: 13.3, decimals: 1, suffix: " %", delta: "Cold outreach" },
        { label: "Respuestas calientes", base: 12, decimals: 0, delta: "Con intención" },
      ],
      chart: { title: "Respuestas · 7 días", range: "Últimos 7 días", bars: [4, 6, 5, 8, 7, 9, 6] },
      status: { text: "3 prospectos respondieron en las últimas 2 horas", badge: "Live" },
    },
    {
      kpis: [
        { label: "Leads cualificados", base: 14, decimals: 0, delta: "Listos para llamar" },
        { label: "Puntuación media", base: 82, decimals: 0, suffix: "/100", delta: "+6 vs sem. anterior" },
        { label: "Recontactar", base: 5, decimals: 0, delta: "En 24h" },
      ],
      chart: { title: "Cualificación · 7 días", range: "Últimos 7 días", bars: [1, 3, 2, 4, 3, 5, 4] },
      status: { text: "Nuevo lead caliente · Fontanería Var · llamar esta mañana", badge: "Prioridad" },
    },
    {
      kpis: [
        { label: "Vigilancia activa", base: 24, decimals: 0, suffix: "h/24", delta: "Sin pausas" },
        { label: "Reactivaciones auto.", base: 47, decimals: 0, delta: "Esta semana" },
        { label: "Ahorrado", base: 11, decimals: 0, suffix: " h/sem.", delta: "En tu agenda" },
      ],
      chart: { title: "Actividad del agente", range: "Últimos 7 días", bars: [62, 70, 58, 78, 66, 82, 74] },
      status: { text: "El agente prospecta mientras estás en el terreno", badge: "24/7" },
    },
  ],
};

const clamp = (n) => Math.max(8, Math.min(100, n));

export default function DashboardMockup() {
  const { t, lang } = useLang();
  const d = t.dashboard;
  const locale = lang === "fr" ? "fr-FR" : lang === "es" ? "es-ES" : "en-US";
  const views = DASH[lang] || DASH.fr;

  const [view, setView] = useState(0);
  const [live, setLive] = useState([0, 0, 0]);
  const [jitter, setJitter] = useState([0, 0, 0, 0, 0, 0, 0]);

  // Défilement automatique des vues
  useEffect(() => {
    const id = setInterval(() => setView((v) => (v + 1) % views.length), 5500);
    return () => clearInterval(id);
  }, [views.length]);

  useEffect(() => {
    setLive([0, 0, 0]);
    setJitter([0, 0, 0, 0, 0, 0, 0]);
  }, [view]);

  // Pulsations légères pour donner l'impression de "live"
  useEffect(() => {
    const id = setInterval(() => {
      setLive((p) => p.map((x, i) => (i === 1 ? x : x + Math.round(Math.random() * 2))));
      setJitter(() => Array.from({ length: 7 }, () => (Math.random() - 0.5) * 8));
    }, 2200);
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
            agent-prospection.amavya.cloud
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

          {/* Contenu principal */}
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
                {/* KPIs */}
                <div className="grid grid-cols-3 gap-3">
                  {cur.kpis.map((kpi, i) => (
                    <div
                      key={kpi.label}
                      className="glass group relative cursor-default overflow-hidden rounded-xl p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/30 hover:shadow-[0_8px_24px_-12px_rgba(240,210,122,0.5)]"
                    >
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

                {/* Graphe */}
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

                {/* Bandeau statut */}
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

      {/* Carte flottante : agent toujours actif */}
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
