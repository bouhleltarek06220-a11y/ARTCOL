"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

const cards = [
  {
    icon: "📞",
    text: "Les appels et les formulaires restent sans réponse, faute de temps.",
  },
  {
    icon: "🔁",
    text: "Vous ne relancez jamais — et l'essentiel des ventes se joue à la relance.",
  },
  {
    icon: "🌙",
    text: "Prospecter à la main, le soir, après 10 h de chantier : intenable.",
  },
];

export default function Probleme() {
  return (
    <section id="probleme" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mx-auto max-w-3xl text-balance text-center text-3xl font-semibold tracking-tight text-paper sm:text-4xl"
        >
          Vous perdez des clients pendant que vous travaillez.
        </motion.h2>

        <div className="mt-12 grid gap-5 sm:mt-16 sm:grid-cols-3">
          {cards.map((c, i) => (
            <motion.div
              key={c.text}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, ease: EASE, delay: i * 0.12 }}
              className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur"
            >
              <span aria-hidden="true" className="text-3xl">
                {c.icon}
              </span>
              <p className="text-pretty text-base leading-relaxed text-paper/90">
                {c.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
