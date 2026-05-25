"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "./LangProvider";
import AgentDemo from "./AgentDemo";

/* ---------- Helpers partagés ---------- */

function usePhases(count, ms = 1200) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p + 1) % count), ms);
    return () => clearInterval(id);
  }, [count, ms]);
  return phase;
}

function useCountUp(target, active, duration = 1100) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) {
      setVal(0);
      return;
    }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      setVal(Math.round(target * p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return val;
}

function DemoFrame({ children }) {
  return (
    <div className="relative flex aspect-video w-full flex-col overflow-hidden rounded-xl border border-gold/25 bg-ink/60 bg-[radial-gradient(circle_at_25%_-10%,rgba(212,175,55,0.12),transparent_55%)] p-3 sm:p-4">
      {children}
    </div>
  );
}

function DoneBadge({ show, label }) {
  return (
    <div className="mt-auto h-6 pt-1">
      <AnimatePresence>
        {show && (
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 text-[10px] font-medium text-gold-bright"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- 1. CRM intelligent : scoring + tri automatique ---------- */

const CRM_COPY = {
  fr: { header: "Scoring automatique", tiers: ["Chaud", "Tiède", "Froid"], top: "Prioritaire" },
  en: { header: "Automatic scoring", tiers: ["Hot", "Warm", "Cold"], top: "Top lead" },
};

const CRM_CONTACTS = [
  { id: "a", name: "Julien R.", org: "Novora", score: 68, tier: 1 },
  { id: "b", name: "Marie L.", org: "TechCorp", score: 92, tier: 0 },
  { id: "c", name: "Inès B.", org: "Atlas", score: 45, tier: 2 },
];

function CrmDemo() {
  const { lang } = useLang();
  const c = CRM_COPY[lang] || CRM_COPY.fr;
  const phase = usePhases(4, 1300);
  const showScore = phase >= 1;
  const sorted = phase >= 2;
  const tierColor = ["text-gold-bright", "text-paper/80", "text-muted-soft"];

  const rows = sorted
    ? [...CRM_CONTACTS].sort((a, b) => b.score - a.score)
    : CRM_CONTACTS;

  return (
    <DemoFrame>
      <p className="mb-2 text-[11px] font-semibold text-gold-bright sm:text-xs">{c.header}</p>
      <div className="flex flex-col gap-1.5">
        {rows.map((ct, i) => {
          const isTop = sorted && i === 0;
          return (
            <motion.div
              layout
              key={ct.id}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 transition-colors duration-300 ${
                isTop ? "border-gold/50 bg-gold/10" : "border-white/8 bg-white/[0.04]"
              }`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/8 text-[10px] font-semibold text-paper/80">
                {ct.name[0]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-medium text-paper/90 sm:text-xs">{ct.name}</p>
                <p className="truncate text-[9px] text-muted-soft">{ct.org}</p>
              </div>
              {isTop && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="hidden items-center gap-1 rounded-full bg-gold/15 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-gold-bright sm:inline-flex"
                >
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1 3-1 4-1 6a3 3 0 0 0 6 .5c2 2 2 4.5 2 6a7 7 0 1 1-14 0c0-3 2-5 3-7 0 2 1 3 2 3 1.5 0 1-4 0-6 1 0 2 1.5 2 1.5S11 4 12 2z" /></svg>
                  {c.top}
                </motion.span>
              )}
              <AnimatePresence>
                {showScore && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`w-7 text-right text-[12px] font-bold tabular-nums sm:text-sm ${tierColor[ct.tier]}`}
                  >
                    {ct.score}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </DemoFrame>
  );
}

/* ---------- 2. Automatisation : outils connectés + workflow ---------- */

const AUTO_COPY = {
  fr: { nodes: ["Email reçu", "Analyse IA", "Mise à jour CRM", "Notif. Slack"], done: "Workflow exécuté" },
  en: { nodes: ["Email received", "AI analysis", "CRM update", "Slack notif."], done: "Workflow executed" },
};

const AUTO_ICONS = [
  "M4 6h16v12H4zM4 7l8 6 8-6", // email
  "M12 3v4M12 17v4M3 12h4M17 12h4M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z", // ia/core
  "M5 7h14M5 12h14M5 17h9", // crm/list
  "M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6z", // bell
];

function AutomationDemo() {
  const { lang } = useLang();
  const c = AUTO_COPY[lang] || AUTO_COPY.fr;
  const phase = usePhases(6, 1000);
  const fill = `${(Math.min(phase, 3) / 3) * 100}%`;

  return (
    <DemoFrame>
      <div className="relative flex flex-1 items-center justify-between px-1">
        {/* Rail de connexion */}
        <div className="absolute left-[12%] right-[12%] top-[38%] h-0.5 -translate-y-1/2 rounded bg-white/10" />
        <motion.div
          className="absolute left-[12%] top-[38%] h-0.5 -translate-y-1/2 rounded bg-[linear-gradient(90deg,#a87f2e,#f0d27a)]"
          animate={{ width: fill }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ maxWidth: "76%" }}
        />
        {c.nodes.map((label, i) => {
          const active = phase === i;
          const done = phase > i;
          return (
            <div key={label} className="relative z-10 flex w-1/4 flex-col items-center gap-1.5">
              <motion.div
                animate={{ scale: active ? 1.18 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors duration-300 ${
                  active || done
                    ? "border-gold/50 bg-gold/15 text-gold-bright shadow-[0_0_18px_-4px_rgba(240,210,122,0.6)]"
                    : "border-white/10 bg-white/[0.04] text-muted-soft"
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d={AUTO_ICONS[i]} />
                </svg>
              </motion.div>
              <span className={`text-center text-[8.5px] leading-tight transition-colors duration-300 sm:text-[10px] ${active || done ? "text-paper/90" : "text-muted-soft/70"}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
      <DoneBadge show={phase >= 4} label={c.done} />
    </DemoFrame>
  );
}

/* ---------- 3. Prospection : séquence d'emails + réponses ---------- */

const PROSPECT_COPY = {
  fr: {
    steps: ["Email 1 envoyé", "Relance envoyée", "Relance 2 envoyée"],
    reply: "Nouvelle réponse reçue",
    stat: "Réponses",
  },
  en: {
    steps: ["Email 1 sent", "Follow-up sent", "Follow-up 2 sent"],
    reply: "New reply received",
    stat: "Replies",
  },
};

function ProspectionDemo() {
  const { lang } = useLang();
  const c = PROSPECT_COPY[lang] || PROSPECT_COPY.fr;
  const phase = usePhases(6, 1100);
  const replies = useCountUp(3, phase >= 3, 700);

  return (
    <DemoFrame>
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold text-gold-bright sm:text-xs">Sequence</p>
        <span className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] tabular-nums text-paper/80">
          {c.stat}: <span className="font-bold text-gold-bright">{replies}</span>
        </span>
      </div>

      <div className="mt-2 flex flex-col gap-1.5">
        {c.steps.map((label, i) => {
          const sending = phase === i;
          const sent = phase > i;
          return (
            <div key={label} className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 transition-colors duration-300 ${sent || sending ? "border-gold/30 bg-white/[0.05]" : "border-white/8 bg-white/[0.03]"}`}>
              <span className="flex h-4 w-4 shrink-0 items-center justify-center text-gold-bright">
                {sent ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                ) : (
                  <motion.svg
                    width="14" height="14" viewBox="0 0 24 24" fill="currentColor"
                    animate={sending ? { x: [0, 3, 0], opacity: [0.5, 1, 0.5] } : { opacity: 0.4 }}
                    transition={{ duration: 0.9, repeat: sending ? Infinity : 0 }}
                  >
                    <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
                  </motion.svg>
                )}
              </span>
              <span className={`text-[11px] sm:text-xs ${sent || sending ? "text-paper/90" : "text-muted-soft/70"}`}>{label}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-auto h-7 pt-1">
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-medium text-emerald-300"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16v12H4z" strokeLinejoin="round" /><path d="M4 7l8 6 8-6" strokeLinecap="round" /></svg>
              {c.reply}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DemoFrame>
  );
}

/* ---------- 4. SaaS sur mesure : dashboard qui se construit ---------- */

const SAAS_COPY = {
  fr: { caption: "Tableau de bord en temps réel", k1: "Utilisateurs", k2: "MRR" },
  en: { caption: "Real-time dashboard", k1: "Users", k2: "MRR" },
};

const SAAS_BARS = [42, 68, 54, 88, 72];

function SaasDemo() {
  const { lang } = useLang();
  const c = SAAS_COPY[lang] || SAAS_COPY.fr;
  const phase = usePhases(4, 1200);
  const built = phase !== 0;
  const users = useCountUp(1240, built, 1100);
  const mrr = useCountUp(38, built, 1100);

  return (
    <DemoFrame>
      <p className="mb-2 text-[11px] font-semibold text-gold-bright sm:text-xs">{c.caption}</p>
      <div className="mb-2 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-white/8 bg-white/[0.04] px-2.5 py-1.5">
          <p className="text-[8.5px] uppercase tracking-wide text-muted-soft">{c.k1}</p>
          <p className="text-sm font-bold tabular-nums text-paper sm:text-base">{users.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-white/8 bg-white/[0.04] px-2.5 py-1.5">
          <p className="text-[8.5px] uppercase tracking-wide text-muted-soft">{c.k2}</p>
          <p className="text-sm font-bold tabular-nums text-gold-bright sm:text-base">{mrr}k€</p>
        </div>
      </div>
      <div className="flex flex-1 items-end gap-1.5 rounded-lg border border-white/8 bg-white/[0.03] p-2">
        {SAAS_BARS.map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-t bg-[linear-gradient(180deg,#f0d27a,#a87f2e)]"
            initial={false}
            animate={{ height: built ? `${h}%` : "6%" }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </div>
    </DemoFrame>
  );
}

/* ---------- 5. Formation : compétences débloquées + progression ---------- */

const FORM_COPY = {
  fr: { header: "Progression", skills: ["Prompting", "Agents IA", "Automatisation", "Data"], done: "Niveau atteint" },
  en: { header: "Progress", skills: ["Prompting", "AI agents", "Automation", "Data"], done: "Level reached" },
};

function FormationDemo() {
  const { lang } = useLang();
  const c = FORM_COPY[lang] || FORM_COPY.fr;
  const phase = usePhases(6, 1000);
  const frac = Math.min(phase, 4) / 4;
  const percent = Math.round(frac * 100);
  const R = 26;
  const CIRC = 2 * Math.PI * R;

  return (
    <DemoFrame>
      <p className="mb-1 text-[11px] font-semibold text-gold-bright sm:text-xs">{c.header}</p>
      <div className="flex flex-1 items-center gap-4">
        {/* Anneau de progression */}
        <div className="relative h-[68px] w-[68px] shrink-0">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
            <circle
              cx="32" cy="32" r={R} fill="none"
              stroke="url(#formGrad)" strokeWidth="5" strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (1 - frac)}
              style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(0.22,1,0.36,1)" }}
            />
            <defs>
              <linearGradient id="formGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a87f2e" />
                <stop offset="100%" stopColor="#f0d27a" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold tabular-nums text-paper">
            {percent}%
          </span>
        </div>

        {/* Compétences débloquées */}
        <div className="flex flex-1 flex-col gap-1.5">
          {c.skills.map((skill, i) => {
            const unlocked = phase >= i + 1;
            return (
              <div key={skill} className="flex items-center gap-2">
                <motion.span
                  animate={{ scale: unlocked ? 1 : 0.85, opacity: unlocked ? 1 : 0.5 }}
                  className={`flex h-4 w-4 items-center justify-center rounded-full border ${unlocked ? "border-gold/50 bg-gold/15 text-gold-bright" : "border-white/15 text-transparent"}`}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </motion.span>
                <span className={`text-[11px] transition-colors duration-300 sm:text-xs ${unlocked ? "text-paper/90" : "text-muted-soft/60"}`}>{skill}</span>
              </div>
            );
          })}
        </div>
      </div>
      <DoneBadge show={phase >= 5} label={c.done} />
    </DemoFrame>
  );
}

/* ---------- Sélecteur ---------- */

const DEMOS = [AgentDemo, CrmDemo, AutomationDemo, ProspectionDemo, SaasDemo, FormationDemo];

export default function ServiceDemo({ index }) {
  const Demo = DEMOS[index];
  return Demo ? <Demo /> : null;
}
