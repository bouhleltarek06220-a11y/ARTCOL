"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "./LangProvider";

/* ============================================================
   Moteur de démos narratives (~30s) : 4 scènes par solution
   Problème quotidien → Solution en action → Résultat concret
   ============================================================ */

const SCENE_MS = 7500;

const TAG = {
  fr: { pain: "Le quotidien", sol: "Avec AMAVYA", win: "Le résultat" },
  en: { pain: "Daily reality", sol: "With AMAVYA", win: "The result" },
  es: { pain: "El día a día", sol: "Con AMAVYA", win: "El resultado" },
};

const tagStyle = {
  pain: "bg-rose-500/15 text-rose-300",
  sol: "bg-gold/15 text-gold-bright",
  win: "bg-emerald-500/15 text-emerald-300",
};

/* ---------- Helpers ---------- */

function useStep(max, ms) {
  const [s, setS] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setS((v) => (v < max ? v + 1 : v)), ms);
    return () => clearInterval(id);
  }, [max, ms]);
  return s;
}

function Counter({ to, dur = 1300 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      setV(Math.round(to * p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, dur]);
  return <>{v.toLocaleString()}</>;
}

function Check({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ThinkingDots() {
  return (
    <span className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span key={i} className="h-1.5 w-1.5 rounded-full bg-gold-bright" animate={{ opacity: [0.25, 1, 0.25] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
      ))}
    </span>
  );
}

/* ---------- Stage ---------- */

function SceneStage({ steps, lang }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % steps.length), SCENE_MS);
    return () => clearInterval(id);
  }, [steps.length]);

  const step = steps[i];
  const tags = TAG[lang] || TAG.fr;

  return (
    <div className="relative flex aspect-[4/3] w-full flex-col overflow-hidden rounded-xl border border-gold/25 bg-ink/70 bg-[radial-gradient(circle_at_25%_-10%,rgba(212,175,55,0.12),transparent_55%)] p-3 sm:p-4">
      {/* Progression type lecteur vidéo */}
      <div className="mb-2.5 flex gap-1">
        {steps.map((_, idx) => (
          <div key={idx} className="h-0.5 flex-1 overflow-hidden rounded bg-white/12">
            <motion.div
              key={`${i}-${idx}`}
              className="h-full bg-gold-bright"
              initial={{ width: idx < i ? "100%" : "0%" }}
              animate={{ width: idx <= i ? "100%" : "0%" }}
              transition={{ duration: idx === i ? SCENE_MS / 1000 : 0, ease: "linear" }}
            />
          </div>
        ))}
      </div>

      {/* Visuel */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            {step.body}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Légende explicative */}
      <div className="mt-2 min-h-[36px]">
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="flex items-start gap-2">
            <span className={`mt-px shrink-0 rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide ${tagStyle[step.tag]}`}>
              {tags[step.tag]}
            </span>
            <p className="text-[11px] leading-snug text-paper/85 sm:text-xs">{step.caption}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- Briques visuelles ---------- */

function PainScene({ iconPath, metric, chips }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-400/30 bg-rose-400/10 text-rose-300">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d={iconPath} />
        </svg>
        {metric && (
          <span className="absolute -right-2 -top-2 rounded-full bg-rose-500/90 px-1.5 py-0.5 text-[9px] font-bold text-white">{metric}</span>
        )}
      </div>
      <div className="flex w-full max-w-[300px] flex-col gap-1.5">
        {chips.map((ch, i) => (
          <motion.div key={ch} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.55 }} className="flex items-center gap-2 rounded-md border border-white/8 bg-white/[0.04] px-2.5 py-1.5 text-[10px] text-muted-soft sm:text-[11px]">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400/70" />
            {ch}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function FireList({ items }) {
  return (
    <div className="mx-auto flex w-full max-w-[300px] flex-col gap-1.5">
      {items.map((it, i) => (
        <motion.div key={it} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.7, duration: 0.4 }} className="flex items-center gap-2 rounded-lg border border-gold/25 bg-white/[0.05] px-2.5 py-1.5">
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.25 + i * 0.7 + 0.25, type: "spring", stiffness: 380, damping: 16 }} className="text-gold-bright">
            <Check />
          </motion.span>
          <span className="text-[11px] text-paper/90 sm:text-xs">{it}</span>
        </motion.div>
      ))}
    </div>
  );
}

function ResultScene({ stats }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16 }} className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-400/10 text-emerald-300">
        <Check size={20} />
      </motion.div>
      <div className="flex items-start justify-center gap-5">
        {stats.map((s) => (
          <div key={s.label} className="flex w-24 flex-col items-center text-center">
            <span className="text-2xl font-bold tabular-nums text-gold-bright sm:text-3xl">
              {s.prefix || ""}
              <Counter to={s.to} />
              {s.suffix || ""}
            </span>
            <span className="mt-1 text-[9px] leading-tight text-muted-soft sm:text-[10px]">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AgentReason({ avatar, prompt, agent, lines }) {
  return (
    <div className="mx-auto w-full max-w-[320px]">
      <div className="flex items-start gap-2">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-soft">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5 0-9 2.5-9 5.5V21h18v-1.5c0-3-4-5.5-9-5.5z" /></svg>
        </span>
        <div className="rounded-lg rounded-tl-sm bg-white/[0.08] px-2.5 py-1.5 text-[11px] leading-snug text-paper/90 sm:text-xs">{prompt}</div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-[11px] font-semibold text-gold-bright sm:text-xs">{agent}</span>
        <ThinkingDots />
      </div>
      <div className="mt-1.5 flex flex-col gap-1">
        {lines.map((l, i) => (
          <motion.div key={l} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.85 }} className="flex items-center gap-1.5 text-[10px] text-paper/75 sm:text-[11px]">
            <span className="text-gold-bright">→</span>
            {l}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function EnrichCard({ name, badge, fields }) {
  return (
    <div className="mx-auto w-full max-w-[280px] rounded-xl border border-gold/25 bg-white/[0.04] p-3">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/15 text-[11px] font-semibold text-gold-bright">{name[0]}</span>
        <span className="flex-1 text-[12px] font-medium text-paper/90 sm:text-sm">{name}</span>
        <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.4, repeat: Infinity }} className="rounded-full bg-gold/15 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-gold-bright">
          {badge}
        </motion.span>
      </div>
      <div className="mt-2 flex flex-col gap-1">
        {fields.map((f, i) => (
          <motion.div key={f.k} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.7 }} className="flex items-center justify-between rounded bg-white/[0.03] px-2 py-1 text-[10px] sm:text-[11px]">
            <span className="text-muted-soft">{f.k}</span>
            <motion.span initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.7 + 0.2 }} className="font-medium text-paper/90">{f.v}</motion.span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ScoreSortMini({ header, top, contacts }) {
  const step = useStep(2, 1300); // 0 apparition, 1 scores, 2 tri
  const showScore = step >= 1;
  const sorted = step >= 2;
  const tierColor = ["text-gold-bright", "text-paper/80", "text-muted-soft"];
  const rows = sorted ? [...contacts].sort((a, b) => b.score - a.score) : contacts;

  return (
    <div className="mx-auto w-full max-w-[300px]">
      <p className="mb-1.5 text-[11px] font-semibold text-gold-bright sm:text-xs">{header}</p>
      <div className="flex flex-col gap-1.5">
        {rows.map((ct, i) => {
          const isTop = sorted && i === 0;
          return (
            <motion.div layout key={ct.id} transition={{ type: "spring", stiffness: 380, damping: 32 }} className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 ${isTop ? "border-gold/50 bg-gold/10" : "border-white/8 bg-white/[0.04]"}`}>
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/8 text-[10px] font-semibold text-paper/80">{ct.name[0]}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-medium text-paper/90 sm:text-xs">{ct.name}</p>
                <p className="truncate text-[9px] text-muted-soft">{ct.org}</p>
              </div>
              {isTop && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="hidden items-center gap-1 rounded-full bg-gold/15 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-gold-bright sm:inline-flex">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1 3-1 4-1 6a3 3 0 0 0 6 .5c2 2 2 4.5 2 6a7 7 0 1 1-14 0c0-3 2-5 3-7 0 2 1 3 2 3 1.5 0 1-4 0-6 1 0 2 1.5 2 1.5S11 4 12 2z" /></svg>
                  {top}
                </motion.span>
              )}
              <AnimatePresence>
                {showScore && (
                  <motion.span initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} className={`w-7 text-right text-[12px] font-bold tabular-nums sm:text-sm ${tierColor[ct.tier]}`}>
                    {ct.score}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

const TOOL_ICONS = [
  "M4 6h16v12H4zM4 7l8 6 8-6",
  "M12 3v4M12 17v4M3 12h4M17 12h4M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  "M5 7h14M5 12h14M5 17h9",
  "M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6z",
];

function ToolsConnect({ nodes }) {
  const step = useStep(nodes.length, 750);
  return (
    <div className="relative mx-auto flex w-full max-w-[320px] items-center justify-between px-1">
      <div className="absolute left-[12%] right-[12%] top-1/2 h-0.5 -translate-y-1/2 rounded bg-white/10" />
      <motion.div className="absolute left-[12%] top-1/2 h-0.5 -translate-y-1/2 rounded bg-[linear-gradient(90deg,#a87f2e,#f0d27a)]" animate={{ width: `${(Math.min(step, nodes.length - 1) / (nodes.length - 1)) * 76}%` }} transition={{ duration: 0.5 }} />
      {nodes.map((label, i) => {
        const on = step >= i;
        return (
          <motion.div key={label} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: on ? 1 : 0.85, opacity: on ? 1 : 0.5 }} transition={{ type: "spring", stiffness: 300, damping: 18 }} className="relative z-10 flex w-1/4 flex-col items-center gap-1.5">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${on ? "border-gold/50 bg-gold/15 text-gold-bright shadow-[0_0_18px_-4px_rgba(240,210,122,0.6)]" : "border-white/10 bg-white/[0.04] text-muted-soft"}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={TOOL_ICONS[i]} /></svg>
            </div>
            <span className="text-center text-[8.5px] leading-tight text-paper/80 sm:text-[10px]">{label}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

function ToolsExecute({ nodes, flow }) {
  const step = useStep(nodes.length + 1, 1000);
  return (
    <div className="mx-auto w-full max-w-[320px]">
      <div className="relative flex items-center justify-between px-1">
        <div className="absolute left-[12%] right-[12%] top-1/2 h-0.5 -translate-y-1/2 rounded bg-white/10" />
        <motion.div className="absolute left-[12%] top-1/2 h-0.5 -translate-y-1/2 rounded bg-[linear-gradient(90deg,#a87f2e,#f0d27a)]" animate={{ width: `${(Math.min(step, nodes.length - 1) / (nodes.length - 1)) * 76}%` }} transition={{ duration: 0.5 }} style={{ maxWidth: "76%" }} />
        {nodes.map((label, i) => {
          const active = step === i;
          const done = step > i;
          return (
            <div key={label} className="relative z-10 flex w-1/4 flex-col items-center gap-1.5">
              <motion.div animate={{ scale: active ? 1.18 : 1 }} transition={{ type: "spring", stiffness: 300, damping: 18 }} className={`flex h-9 w-9 items-center justify-center rounded-xl border ${active || done ? "border-gold/50 bg-gold/15 text-gold-bright shadow-[0_0_18px_-4px_rgba(240,210,122,0.6)]" : "border-white/10 bg-white/[0.04] text-muted-soft"}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={TOOL_ICONS[i]} /></svg>
              </motion.div>
              <span className={`text-center text-[8.5px] leading-tight sm:text-[10px] ${active || done ? "text-paper/90" : "text-muted-soft/70"}`}>{label}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 h-5 text-center">
        <AnimatePresence>
          {step >= nodes.length && (
            <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 text-[10px] font-medium text-gold-bright">
              <Check /> {flow}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Funnel({ layers }) {
  return (
    <div className="mx-auto flex w-full max-w-[270px] flex-col items-center gap-1.5">
      {layers.map((ly, i) => (
        <motion.div key={ly.label} initial={{ opacity: 0, scaleX: 0.6 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.3 + i * 0.7 }} style={{ width: `${100 - i * 25}%` }} className="flex items-center justify-between rounded-md border border-gold/25 bg-gold/[0.08] px-2.5 py-1.5 text-[10px] text-paper/85 sm:text-[11px]">
          <span className="truncate">{ly.label}</span>
          <span className="ml-2 shrink-0 font-bold text-gold-bright">{ly.value}</span>
        </motion.div>
      ))}
    </div>
  );
}

function EmailSequence({ header, statLabel, steps, reply }) {
  const step = useStep(steps.length + 1, 1100);
  const replies = step >= steps.length ? 3 : 0;
  return (
    <div className="mx-auto w-full max-w-[300px]">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold text-gold-bright sm:text-xs">{header}</p>
        <span className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] tabular-nums text-paper/80">
          {statLabel}: <span className="font-bold text-gold-bright">{replies}</span>
        </span>
      </div>
      <div className="mt-2 flex flex-col gap-1.5">
        {steps.map((label, i) => {
          const sending = step === i;
          const sent = step > i;
          return (
            <div key={label} className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 ${sent || sending ? "border-gold/30 bg-white/[0.05]" : "border-white/8 bg-white/[0.03]"}`}>
              <span className="flex h-4 w-4 shrink-0 items-center justify-center text-gold-bright">
                {sent ? <Check size={14} /> : (
                  <motion.svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" animate={sending ? { x: [0, 3, 0], opacity: [0.5, 1, 0.5] } : { opacity: 0.4 }} transition={{ duration: 0.9, repeat: sending ? Infinity : 0 }}>
                    <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
                  </motion.svg>
                )}
              </span>
              <span className={`text-[11px] sm:text-xs ${sent || sending ? "text-paper/90" : "text-muted-soft/70"}`}>{label}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 h-7">
        <AnimatePresence>
          {step >= steps.length && (
            <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-medium text-emerald-300">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16v12H4z" strokeLinejoin="round" /><path d="M4 7l8 6 8-6" strokeLinecap="round" /></svg>
              {reply}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Wireframe() {
  const block = (delay, cls) => (
    <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay, type: "spring", stiffness: 300, damping: 20 }} className={cls} />
  );
  return (
    <div className="mx-auto w-full max-w-[260px] rounded-lg border border-gold/25 bg-white/[0.03] p-2">
      {block(0.2, "mb-1.5 h-3 rounded bg-gold/25")}
      <div className="flex gap-1.5">
        {block(0.5, "h-[60px] w-9 shrink-0 rounded bg-white/10")}
        <div className="grid flex-1 grid-cols-2 gap-1.5">
          {block(0.8, "h-7 rounded bg-white/8")}
          {block(1.0, "h-7 rounded bg-white/8")}
          {block(1.2, "h-7 rounded bg-gold/15")}
          {block(1.4, "h-7 rounded bg-white/8")}
        </div>
      </div>
    </div>
  );
}

const DASH_BARS = [42, 68, 54, 88, 72];

function DashboardLive({ k1, k2 }) {
  return (
    <div className="mx-auto w-full max-w-[300px]">
      <div className="mb-2 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-white/8 bg-white/[0.04] px-2.5 py-1.5">
          <p className="text-[8.5px] uppercase tracking-wide text-muted-soft">{k1}</p>
          <p className="text-sm font-bold tabular-nums text-paper sm:text-base"><Counter to={1240} /></p>
        </div>
        <div className="rounded-lg border border-white/8 bg-white/[0.04] px-2.5 py-1.5">
          <p className="text-[8.5px] uppercase tracking-wide text-muted-soft">{k2}</p>
          <p className="text-sm font-bold tabular-nums text-gold-bright sm:text-base"><Counter to={38} />k€</p>
        </div>
      </div>
      <div className="flex h-[70px] items-end gap-1.5 rounded-lg border border-white/8 bg-white/[0.03] p-2">
        {DASH_BARS.map((h, i) => (
          <motion.div key={i} className="flex-1 rounded-t bg-[linear-gradient(180deg,#f0d27a,#a87f2e)]" initial={{ height: "6%" }} animate={{ height: `${h}%` }} transition={{ duration: 0.7, delay: 0.2 + i * 0.12, ease: [0.22, 1, 0.36, 1] }} />
        ))}
      </div>
    </div>
  );
}

function SkillRing({ skills, done }) {
  const step = useStep(skills.length + 1, 950);
  const frac = Math.min(step, skills.length) / skills.length;
  const percent = Math.round(frac * 100);
  const R = 26;
  const CIRC = 2 * Math.PI * R;
  return (
    <div className="mx-auto flex w-full max-w-[300px] items-center gap-4">
      <div className="relative h-[68px] w-[68px] shrink-0">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
          <circle cx="32" cy="32" r={R} fill="none" stroke="url(#skillGrad)" strokeWidth="5" strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - frac)} style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(0.22,1,0.36,1)" }} />
          <defs>
            <linearGradient id="skillGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a87f2e" />
              <stop offset="100%" stopColor="#f0d27a" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold tabular-nums text-paper">{percent}%</span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        {skills.map((skill, i) => {
          const on = step >= i + 1;
          return (
            <div key={skill} className="flex items-center gap-2">
              <motion.span animate={{ scale: on ? 1 : 0.85, opacity: on ? 1 : 0.5 }} className={`flex h-4 w-4 items-center justify-center rounded-full border ${on ? "border-gold/50 bg-gold/15 text-gold-bright" : "border-white/15 text-transparent"}`}>
                <Check size={10} />
              </motion.span>
              <span className={`text-[11px] sm:text-xs ${on ? "text-paper/90" : "text-muted-soft/60"}`}>{skill}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   Contenus par solution (bilingue)
   ============================================================ */

const CONTENT = {
  fr: {
    agents: [
      { tag: "pain", caption: "Chaque jour, des heures perdues sur des tâches répétitives.", body: <PainScene iconPath="M4 6h16v12H4zM4 7l8 6 8-6" metric="47" chips={["Trier et répondre aux emails", "Relancer les clients", "Mettre à jour le CRM"]} /> },
      { tag: "sol", caption: "L'agent comprend la demande et raisonne tout seul.", body: <AgentReason avatar prompt="Réponds aux nouveaux leads du jour" agent="Agent IA" lines={["Lecture des messages reçus", "Recherche du contexte client", "Choix de la meilleure réponse"]} /> },
      { tag: "sol", caption: "Puis il agit directement sur vos outils, 24h/24.", body: <FireList items={["Réponse personnalisée envoyée", "Fiche CRM mise à jour", "Rendez-vous planifié"]} /> },
      { tag: "win", caption: "Vos tâches traitées en continu, sans intervention.", body: <ResultScene stats={[{ to: 32, label: "tâches/jour automatisées" }, { to: 4, suffix: "h", label: "économisées / jour" }]} /> },
    ],
    crm: [
      { tag: "pain", caption: "100 nouveaux contacts. Lequel rappeler en premier ?", body: <PainScene iconPath="M5 7h14M5 12h14M5 17h9" metric="100+" chips={["Données de contact incomplètes", "Aucune priorité claire", "Leads chauds vite oubliés"]} /> },
      { tag: "sol", caption: "Chaque contact est enrichi automatiquement.", body: <EnrichCard name="Marie L." badge="Enrichi" fields={[{ k: "Poste", v: "Dir. Marketing" }, { k: "Entreprise", v: "TechCorp" }, { k: "Secteur", v: "SaaS B2B" }, { k: "LinkedIn", v: "Profil trouvé" }]} /> },
      { tag: "sol", caption: "L'IA score et priorise vos leads en temps réel.", body: <ScoreSortMini header="Scoring automatique" top="Prioritaire" contacts={[{ id: "a", name: "Julien R.", org: "Novora", score: 68, tier: 1 }, { id: "b", name: "Marie L.", org: "TechCorp", score: 92, tier: 0 }, { id: "c", name: "Inès B.", org: "Atlas", score: 45, tier: 2 }]} /> },
      { tag: "win", caption: "Vous appelez les bons leads, au bon moment.", body: <ResultScene stats={[{ to: 38, prefix: "+", suffix: "%", label: "de taux de conversion" }, { to: 2, suffix: "s", label: "pour détecter un lead chaud" }]} /> },
    ],
    automation: [
      { tag: "pain", caption: "Copier-coller entre vos outils, toute la journée.", body: <PainScene iconPath="M9 9h10v10H9zM5 5h10v2M5 5v10h2" metric="5 outils" chips={["Ressaisie manuelle des données", "Erreurs fréquentes", "Process qui traînent"]} /> },
      { tag: "sol", caption: "Vous connectez vos outils en quelques clics.", body: <ToolsConnect nodes={["Email", "IA", "CRM", "Slack"]} /> },
      { tag: "sol", caption: "Ensuite, le workflow s'exécute tout seul.", body: <ToolsExecute nodes={["Email", "IA", "CRM", "Slack"]} flow="Workflow exécuté" /> },
      { tag: "win", caption: "Zéro saisie manuelle, zéro erreur.", body: <ResultScene stats={[{ to: 12, suffix: "h", label: "économisées / semaine" }, { to: 0, label: "erreur de ressaisie" }]} /> },
    ],
    prospection: [
      { tag: "pain", caption: "Prospecter à la main : long, irrégulier, épuisant.", body: <PainScene iconPath="M3 4h18l-7 8v6l-4 2v-8z" metric="0 RDV" chips={["Recherche manuelle des prospects", "Relances oubliées", "Pipeline vide"]} /> },
      { tag: "sol", caption: "On cible automatiquement vos prospects idéaux.", body: <Funnel layers={[{ label: "Prospects analysés", value: "1 000" }, { label: "Correspondent à votre cible", value: "120" }, { label: "Prospects idéaux retenus", value: "18" }]} /> },
      { tag: "sol", caption: "Séquences et relances partent automatiquement.", body: <EmailSequence header="Séquence" statLabel="Réponses" steps={["Jour 1 · Email d'accroche", "Jour 3 · Relance", "Jour 6 · Dernière relance"]} reply="Nouvelle réponse reçue" /> },
      { tag: "win", caption: "Un pipeline qui se remplit tout seul.", body: <ResultScene stats={[{ to: 24, prefix: "+", label: "RDV qualifiés / mois" }, { to: 3, suffix: "x", label: "plus de réponses" }]} /> },
    ],
    saas: [
      { tag: "pain", caption: "Des outils génériques qui ne collent pas à votre métier.", body: <PainScene iconPath="M4 7l5-3 5 3-5 3zM4 7v6l5 3M14 7v6l-5 3" metric="!" chips={["Fonctions inutiles", "L'essentiel manque", "Difficile à faire évoluer"]} /> },
      { tag: "sol", caption: "On conçoit une plateforme taillée pour vous.", body: <Wireframe /> },
      { tag: "sol", caption: "Performante, élégante et prête à grandir.", body: <DashboardLive k1="Utilisateurs" k2="MRR" /> },
      { tag: "win", caption: "Votre produit, à votre image, web & mobile.", body: <ResultScene stats={[{ to: 100, suffix: "%", label: "adapté à votre métier" }, { to: 3, suffix: "x", label: "plus rapide à lancer" }]} /> },
    ],
    formation: [
      { tag: "pain", caption: "Vos équipes veulent l'IA mais ne savent pas par où commencer.", body: <PainScene iconPath="M6 10V8a6 6 0 1 1 12 0v2M5 10h14v10H5z" metric="?" chips={["Outils mal maîtrisés", "Peur de se lancer", "Potentiel inexploité"]} /> },
      { tag: "sol", caption: "Des ateliers pratiques sur vos cas réels.", body: <FireList items={["Maîtrise des outils d'IA générative", "Cas d'usage de votre métier", "Bonnes pratiques de prompting"]} /> },
      { tag: "sol", caption: "Vos équipes montent en compétence, pas à pas.", body: <SkillRing skills={["Prompting", "Agents IA", "Automatisation", "Data & IA"]} /> },
      { tag: "win", caption: "Des équipes autonomes sur l'IA, au quotidien.", body: <ResultScene stats={[{ to: 100, suffix: "%", label: "de l'équipe formée" }, { to: 4, label: "compétences clés acquises" }]} /> },
    ],
  },
  en: {
    agents: [
      { tag: "pain", caption: "Every day, hours lost on repetitive tasks.", body: <PainScene iconPath="M4 6h16v12H4zM4 7l8 6 8-6" metric="47" chips={["Sorting and replying to emails", "Following up with clients", "Updating the CRM"]} /> },
      { tag: "sol", caption: "The agent understands the request and reasons on its own.", body: <AgentReason avatar prompt="Reply to today's new leads" agent="AI Agent" lines={["Reading the incoming messages", "Looking up client context", "Picking the best reply"]} /> },
      { tag: "sol", caption: "Then it acts directly on your tools, around the clock.", body: <FireList items={["Personalized reply sent", "CRM record updated", "Meeting scheduled"]} /> },
      { tag: "win", caption: "Your tasks handled continuously, hands-free.", body: <ResultScene stats={[{ to: 32, label: "tasks/day automated" }, { to: 4, suffix: "h", label: "saved per day" }]} /> },
    ],
    crm: [
      { tag: "pain", caption: "100 new contacts. Which one to call first?", body: <PainScene iconPath="M5 7h14M5 12h14M5 17h9" metric="100+" chips={["Incomplete contact data", "No clear priority", "Hot leads quickly forgotten"]} /> },
      { tag: "sol", caption: "Every contact is enriched automatically.", body: <EnrichCard name="Marie L." badge="Enriched" fields={[{ k: "Role", v: "Marketing Dir." }, { k: "Company", v: "TechCorp" }, { k: "Industry", v: "B2B SaaS" }, { k: "LinkedIn", v: "Profile found" }]} /> },
      { tag: "sol", caption: "AI scores and prioritizes your leads in real time.", body: <ScoreSortMini header="Automatic scoring" top="Top lead" contacts={[{ id: "a", name: "Julien R.", org: "Novora", score: 68, tier: 1 }, { id: "b", name: "Marie L.", org: "TechCorp", score: 92, tier: 0 }, { id: "c", name: "Inès B.", org: "Atlas", score: 45, tier: 2 }]} /> },
      { tag: "win", caption: "You call the right leads, at the right time.", body: <ResultScene stats={[{ to: 38, prefix: "+", suffix: "%", label: "conversion rate" }, { to: 2, suffix: "s", label: "to spot a hot lead" }]} /> },
    ],
    automation: [
      { tag: "pain", caption: "Copy-pasting between your tools, all day long.", body: <PainScene iconPath="M9 9h10v10H9zM5 5h10v2M5 5v10h2" metric="5 tools" chips={["Manual data re-entry", "Frequent errors", "Processes that drag on"]} /> },
      { tag: "sol", caption: "You connect your tools in a few clicks.", body: <ToolsConnect nodes={["Email", "AI", "CRM", "Slack"]} /> },
      { tag: "sol", caption: "Then the workflow runs entirely on its own.", body: <ToolsExecute nodes={["Email", "AI", "CRM", "Slack"]} flow="Workflow executed" /> },
      { tag: "win", caption: "Zero manual entry, zero errors.", body: <ResultScene stats={[{ to: 12, suffix: "h", label: "saved per week" }, { to: 0, label: "data-entry errors" }]} /> },
    ],
    prospection: [
      { tag: "pain", caption: "Prospecting by hand: slow, irregular, exhausting.", body: <PainScene iconPath="M3 4h18l-7 8v6l-4 2v-8z" metric="0 mtg" chips={["Manual prospect research", "Forgotten follow-ups", "Empty pipeline"]} /> },
      { tag: "sol", caption: "We automatically target your ideal prospects.", body: <Funnel layers={[{ label: "Prospects analyzed", value: "1,000" }, { label: "Match your target", value: "120" }, { label: "Ideal prospects kept", value: "18" }]} /> },
      { tag: "sol", caption: "Sequences and follow-ups go out automatically.", body: <EmailSequence header="Sequence" statLabel="Replies" steps={["Day 1 · Opening email", "Day 3 · Follow-up", "Day 6 · Last follow-up"]} reply="New reply received" /> },
      { tag: "win", caption: "A pipeline that fills itself.", body: <ResultScene stats={[{ to: 24, prefix: "+", label: "qualified meetings / month" }, { to: 3, suffix: "x", label: "more replies" }]} /> },
    ],
    saas: [
      { tag: "pain", caption: "Generic tools that don't fit your business.", body: <PainScene iconPath="M4 7l5-3 5 3-5 3zM4 7v6l5 3M14 7v6l-5 3" metric="!" chips={["Useless features", "Missing the essentials", "Hard to scale"]} /> },
      { tag: "sol", caption: "We design a platform built just for you.", body: <Wireframe /> },
      { tag: "sol", caption: "High-performance, elegant and ready to grow.", body: <DashboardLive k1="Users" k2="MRR" /> },
      { tag: "win", caption: "Your product, your way, web & mobile.", body: <ResultScene stats={[{ to: 100, suffix: "%", label: "tailored to your business" }, { to: 3, suffix: "x", label: "faster to launch" }]} /> },
    ],
    formation: [
      { tag: "pain", caption: "Your teams want AI but don't know where to start.", body: <PainScene iconPath="M6 10V8a6 6 0 1 1 12 0v2M5 10h14v10H5z" metric="?" chips={["Tools poorly mastered", "Afraid to get started", "Untapped potential"]} /> },
      { tag: "sol", caption: "Hands-on workshops on your real use cases.", body: <FireList items={["Mastering generative AI tools", "Use cases from your business", "Prompting best practices"]} /> },
      { tag: "sol", caption: "Your teams build up skills, step by step.", body: <SkillRing skills={["Prompting", "AI agents", "Automation", "Data & AI"]} /> },
      { tag: "win", caption: "Teams that own AI in their daily work.", body: <ResultScene stats={[{ to: 100, suffix: "%", label: "of the team trained" }, { to: 4, label: "key skills acquired" }]} /> },
    ],
  },
};

const KEYS = ["agents", "crm", "automation", "prospection", "saas", "formation"];

export default function ServiceDemo({ index }) {
  const { lang } = useLang();
  const key = KEYS[index];
  if (!key) return null;
  const steps = (CONTENT[lang] || CONTENT.fr)[key];
  return <SceneStage steps={steps} lang={lang} />;
}
