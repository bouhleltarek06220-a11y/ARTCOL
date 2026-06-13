"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

const steps = [
  {
    n: "01",
    text: "Il identifie vos prospects idéaux dans votre zone.",
  },
  {
    n: "02",
    text: "Il rédige et envoie des messages personnalisés, adaptés à votre métier.",
  },
  {
    n: "03",
    text: "Il relance automatiquement et vous prévient dès qu'un prospect répond.",
  },
];

export default function Solution() {
  return (
    <section id="solution" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mx-auto max-w-3xl text-balance text-center text-3xl font-semibold tracking-tight text-paper sm:text-4xl"
        >
          L'Agent de Prospection IA d'AMAVYA fait le travail ingrat.
        </motion.h2>

        <ol className="mt-12 grid gap-5 sm:mt-16 sm:grid-cols-3">
          {steps.map((s, i) => (
            <motion.li
              key={s.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, ease: EASE, delay: i * 0.12 }}
              className="relative flex flex-col gap-4 rounded-2xl border border-gold/15 bg-gradient-to-b from-white/[0.04] to-transparent p-7 backdrop-blur"
            >
              <span
                aria-hidden="true"
                className="text-gradient bg-[length:200%_auto] text-4xl font-bold tracking-tight"
              >
                {s.n}
              </span>
              <p className="text-pretty text-base leading-relaxed text-paper/90">
                {s.text}
              </p>
            </motion.li>
          ))}
        </ol>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.4 }}
          className="mt-12 flex justify-center"
        >
          <a
            href="/agent-prospection"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(110deg,#a87f2e,#f0d27a_55%,#d4af37)] px-6 py-3 text-sm font-semibold text-ink shadow-[0_8px_40px_-12px_rgba(212,175,55,0.7)] transition-transform duration-300 hover:-translate-y-0.5"
          >
            Tester la démo gratuite
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
