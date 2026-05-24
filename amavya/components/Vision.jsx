"use client";

import { motion } from "framer-motion";
import Reveal from "./Reveal";

export default function Vision() {
  return (
    <section id="vision" className="relative py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 lg:grid-cols-2">
        {/* Texte storytelling */}
        <div className="flex flex-col gap-6">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-bright animate-ticker" />
              Notre vision
            </span>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="text-balance text-3xl font-semibold leading-tight sm:text-4xl">
              L'IA pour <span className="text-gradient">renforcer l'humain</span>, pas
              le remplacer.
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-pretty text-lg leading-relaxed text-muted">
              Nous croyons que l'intelligence artificielle doit renforcer
              l'humain, et non le remplacer. AMAVYA construit des outils
              intelligents conçus pour aider les entreprises à travailler plus
              vite, mieux et avec plus d'impact.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <ul className="flex flex-col gap-3 pt-2">
              {[
                "Une IA au service de décisions humaines éclairées",
                "Des automatisations qui libèrent du temps à forte valeur",
                "Une technologie élégante, fiable et maîtrisée",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-paper/90">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#2b6bff,#8b5cff)]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="m5 12 5 5 9-9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Illustration holographique humain + IA */}
        <Reveal delay={0.1}>
          <div className="relative mx-auto aspect-square w-full max-w-md">
            {/* Halo */}
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(79,139,255,0.25),transparent_65%)] blur-2xl" />

            {/* Anneaux orbitaux */}
            {[0, 1, 2].map((ring) => (
              <motion.div
                key={ring}
                className="absolute inset-0 rounded-full border border-white/10"
                style={{ scale: 1 - ring * 0.18 }}
                animate={{ rotate: ring % 2 === 0 ? 360 : -360 }}
                transition={{ duration: 30 + ring * 12, repeat: Infinity, ease: "linear" }}
              >
                <span
                  className="absolute h-2.5 w-2.5 rounded-full bg-cyan shadow-[0_0_18px_4px_rgba(63,224,255,0.7)]"
                  style={{ top: "-5px", left: "50%" }}
                />
              </motion.div>
            ))}

            {/* Noyau : deux mains / connexion humain-IA stylisée */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="glass-strong relative flex h-40 w-40 items-center justify-center rounded-full"
              >
                <div className="absolute inset-4 rounded-full bg-[conic-gradient(from_0deg,#2b6bff,#8b5cff,#3fe0ff,#2b6bff)] opacity-30 blur-md animate-pulse-glow" />
                <svg width="84" height="84" viewBox="0 0 96 96" fill="none">
                  <defs>
                    <linearGradient id="vision-grad" x1="0" y1="0" x2="96" y2="96">
                      <stop stopColor="#3fe0ff" />
                      <stop offset="1" stopColor="#a978ff" />
                    </linearGradient>
                  </defs>
                  {/* Nœud central + connexions (neurone) */}
                  <circle cx="48" cy="48" r="9" fill="url(#vision-grad)" />
                  {[
                    [20, 24],
                    [76, 22],
                    [18, 70],
                    [78, 72],
                    [48, 14],
                    [48, 82],
                  ].map(([x, y], i) => (
                    <g key={i}>
                      <line x1="48" y1="48" x2={x} y2={y} stroke="url(#vision-grad)" strokeWidth="1.5" opacity="0.5" />
                      <circle cx={x} cy={y} r="4" fill="#fff" opacity="0.85" />
                    </g>
                  ))}
                </svg>
              </motion.div>
            </div>

            {/* Particules flottantes */}
            <span className="animate-float-slow absolute left-2 top-10 h-2 w-2 rounded-full bg-violet-bright/70 blur-[1px]" />
            <span className="animate-float-slow absolute bottom-8 right-6 h-1.5 w-1.5 rounded-full bg-cyan/70 blur-[1px]" style={{ animationDelay: "-3s" }} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
