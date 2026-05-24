"use client";

import { motion } from "framer-motion";
import { Bot, TrendingUp, Sparkles, Zap, Users } from "lucide-react";

const bars = [42, 68, 55, 80, 62, 94, 73];

export function DashboardMockup() {
  return (
    <div className="relative">
      {/* Glow halo */}
      <div className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-electric-600/30 via-neon-600/20 to-transparent blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 12 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="glass-strong ring-glow relative overflow-hidden rounded-3xl p-4 sm:p-5"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] text-white/50">
            <Sparkles className="h-3 w-3 text-gold-400" />
            console.amavya.ai
          </div>
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-electric-500 to-neon-500" />
        </div>

        {/* Body */}
        <div className="grid grid-cols-12 gap-3 pt-4">
          {/* Sidebar */}
          <div className="col-span-3 hidden flex-col gap-2 sm:flex">
            {[Bot, Users, TrendingUp, Zap].map((Icon, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs ${
                  i === 0
                    ? "bg-gradient-to-r from-electric-500/30 to-neon-500/20 text-white"
                    : "text-white/45"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="h-1.5 w-12 rounded-full bg-current opacity-30" />
              </div>
            ))}
          </div>

          {/* Main */}
          <div className="col-span-12 flex flex-col gap-3 sm:col-span-9">
            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Leads qualifiés", value: "1 284", trend: "+38%" },
                { label: "Tâches automatisées", value: "9 712", trend: "+62%" },
                { label: "Temps gagné", value: "214 h", trend: "+27%" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.12 }}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-3"
                >
                  <p className="text-[10px] uppercase tracking-wide text-white/40">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {stat.value}
                  </p>
                  <p className="text-[10px] font-medium text-emerald-400">
                    {stat.trend}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Chart */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium text-white/70">
                  Performance des agents IA
                </p>
                <span className="rounded-full bg-electric-500/15 px-2 py-0.5 text-[10px] text-electric-400">
                  Temps réel
                </span>
              </div>
              <div className="flex h-28 items-end justify-between gap-2">
                {bars.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{
                      delay: 0.7 + i * 0.08,
                      duration: 0.6,
                      ease: "easeOut",
                    }}
                    className="w-full rounded-t-md bg-gradient-to-t from-electric-600/40 to-neon-400"
                  />
                ))}
              </div>
            </div>

            {/* AI assistant row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-r from-neon-600/15 to-electric-600/10 p-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-electric-500 to-neon-500">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="h-1.5 w-3/4 rounded-full bg-white/30" />
                <div className="mt-1.5 h-1.5 w-1/2 rounded-full bg-white/15" />
              </div>
              <span className="hidden rounded-lg bg-white/10 px-2 py-1 text-[10px] text-white/60 sm:block">
                Agent actif
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Floating badges */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-4 top-1/4 hidden glass rounded-2xl px-3 py-2 sm:flex"
      >
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-gold-400" />
          <span className="text-xs font-medium text-white/80">
            Automatisation active
          </span>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -right-4 bottom-10 hidden glass rounded-2xl px-3 py-2 sm:flex"
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-medium text-white/80">+38% de leads</span>
        </div>
      </motion.div>
    </div>
  );
}
