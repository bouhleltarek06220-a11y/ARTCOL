"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "./LangProvider";

const COPY = {
  fr: {
    prompt: "Traite les nouveaux leads du jour",
    agent: "Agent IA",
    steps: [
      "Analyse de la demande",
      "Recherche dans le CRM",
      "Rédaction de la réponse",
      "Envoi de l'email",
    ],
    done: "Tâche terminée",
  },
  en: {
    prompt: "Handle today's new leads",
    agent: "AI Agent",
    steps: [
      "Analyzing the request",
      "Searching the CRM",
      "Drafting the reply",
      "Sending the email",
    ],
    done: "Task completed",
  },
};

const PHASE_MS = 1300;
const PHASES = 6; // 0 = prompt/réflexion, 1-4 = étapes, 5 = terminé

function ThinkingDots() {
  return (
    <span className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-gold-bright"
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </span>
  );
}

function StepRow({ label, state }) {
  return (
    <div
      className={`flex items-center gap-2 text-[11px] transition-colors duration-300 sm:text-xs ${
        state === "pending" ? "text-muted-soft/60" : "text-paper/90"
      }`}
    >
      <span className="flex h-4 w-4 shrink-0 items-center justify-center">
        {state === "active" ? (
          <svg className="h-4 w-4 animate-spin text-gold-bright" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        ) : state === "done" ? (
          <svg className="h-4 w-4 text-gold-bright" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.16" />
            <path d="M7 12.5l3.2 3.2L17 9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <span className="h-3.5 w-3.5 rounded-full border border-white/20" />
        )}
      </span>
      <span>{label}</span>
    </div>
  );
}

export default function AgentDemo() {
  const { lang } = useLang();
  const c = COPY[lang] || COPY.fr;
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p + 1) % PHASES), PHASE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative flex aspect-video w-full flex-col gap-2 overflow-hidden rounded-xl border border-gold/25 bg-ink/60 bg-[radial-gradient(circle_at_25%_-10%,rgba(212,175,55,0.12),transparent_55%)] p-3 sm:p-4">
      {/* Demande de l'utilisateur */}
      <div className="flex items-start gap-2">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-soft">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5 0-9 2.5-9 5.5V21h18v-1.5c0-3-4-5.5-9-5.5z" />
          </svg>
        </span>
        <div className="rounded-lg rounded-tl-sm bg-white/[0.08] px-2.5 py-1.5 text-[11px] leading-snug text-paper/90 sm:text-xs">
          {c.prompt}
        </div>
      </div>

      {/* En-tête agent + réflexion */}
      <div className="flex items-center gap-2 pt-0.5">
        <span className="text-[11px] font-semibold text-gold-bright sm:text-xs">{c.agent}</span>
        {phase === 0 && <ThinkingDots />}
      </div>

      {/* Étapes exécutées */}
      <div className="flex flex-col gap-1.5">
        {c.steps.map((label, i) => {
          const state = phase < i + 1 ? "pending" : phase === i + 1 ? "active" : "done";
          return <StepRow key={label} label={label} state={state} />;
        })}
      </div>

      {/* Badge final */}
      <div className="mt-auto h-6">
        <AnimatePresence>
          {phase >= 5 && (
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 text-[10px] font-medium text-gold-bright"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {c.done}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
