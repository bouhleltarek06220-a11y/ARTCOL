"use client";

import { motion } from "framer-motion";

const bars = [42, 68, 55, 88, 73, 95, 61];

export default function DashboardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 12 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full"
      style={{ perspective: 1200 }}
    >
      {/* Lueur projetée */}
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-[radial-gradient(circle_at_50%_30%,rgba(79,139,255,0.35),transparent_70%)] blur-2xl" />

      <div className="glow-ring glass-strong overflow-hidden rounded-3xl">
        {/* Barre de fenêtre */}
        <div className="flex items-center gap-2 border-b border-white/5 px-5 py-3.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]/80" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]/80" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]/80" />
          <div className="ml-3 flex items-center gap-2 rounded-md bg-white/5 px-3 py-1 text-[11px] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-ticker" />
            console.amavya.ai
          </div>
        </div>

        {/* Corps */}
        <div className="grid grid-cols-12 gap-4 p-5">
          {/* Sidebar */}
          <div className="col-span-3 hidden flex-col gap-2 sm:flex">
            {["Vue d'ensemble", "Agents IA", "Pipeline", "Prospection", "Analytics"].map(
              (item, i) => (
                <div
                  key={item}
                  className={`rounded-lg px-3 py-2 text-[11px] font-medium ${
                    i === 1
                      ? "bg-[linear-gradient(110deg,rgba(43,107,255,0.5),rgba(139,92,255,0.4))] text-white"
                      : "text-muted/80"
                  }`}
                >
                  {item}
                </div>
              ),
            )}
          </div>

          {/* Contenu principal */}
          <div className="col-span-12 flex flex-col gap-4 sm:col-span-9">
            {/* KPIs */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { k: "Leads traités", v: "12 480", d: "+24%" },
                { k: "Taux réponse", v: "38,5 %", d: "+11%" },
                { k: "Tâches auto.", v: "1 932", d: "+57%" },
              ].map((kpi) => (
                <div key={kpi.k} className="glass rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-wide text-muted">{kpi.k}</p>
                  <p className="mt-1 text-base font-semibold text-paper sm:text-lg">{kpi.v}</p>
                  <p className="text-[10px] font-medium text-emerald-400">{kpi.d}</p>
                </div>
              ))}
            </div>

            {/* Graphe */}
            <div className="glass rounded-xl p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[11px] font-medium text-paper">Performance des agents</p>
                <p className="text-[10px] text-muted">7 derniers jours</p>
              </div>
              <div className="flex h-28 items-end justify-between gap-2">
                {bars.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{
                      duration: 0.8,
                      delay: 0.6 + i * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="w-full rounded-t-md bg-[linear-gradient(to_top,#2b6bff,#a978ff)]"
                  />
                ))}
              </div>
            </div>

            {/* Ligne d'agent IA */}
            <div className="glass flex items-center gap-3 rounded-xl p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#2b6bff,#8b5cff)] text-xs font-bold text-white">
                IA
              </div>
              <div className="min-w-0 flex-1">
                <div className="h-2 w-2/3 rounded-full bg-white/15" />
                <div className="mt-2 h-2 w-5/6 rounded-full bg-white/10" />
              </div>
              <span className="shrink-0 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-medium text-emerald-400">
                Actif
              </span>
            </div>
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
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan" />
        </span>
        <div>
          <p className="text-[11px] font-semibold text-paper">3 agents en ligne</p>
          <p className="text-[10px] text-muted">Automatisation 24/7</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
