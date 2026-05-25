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
              <span className="h-1.5 w-1.5 rounded-full bg-silver-bright animate-ticker" />
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
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#a87f2e,#d4af37)]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="m5 12 5 5 9-9" stroke="#0a0a0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
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
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.22),transparent_65%)] blur-2xl" />

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
                  className="absolute h-2.5 w-2.5 rounded-full bg-gold-bright shadow-[0_0_18px_4px_rgba(240,210,122,0.6)]"
                  style={{ top: "-5px", left: "50%" }}
                />
              </motion.div>
            ))}

            {/* Noyau : logo AMAVYA dans l'orbe */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="glass-strong relative flex h-40 w-40 items-center justify-center rounded-full"
              >
                <div className="absolute inset-4 rounded-full bg-[conic-gradient(from_0deg,#a87f2e,#d4af37,#e6e9f0,#a87f2e)] opacity-30 blur-md animate-pulse-glow" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo-mark.png"
                  alt="AMAVYA"
                  className="relative z-10 h-28 w-28 rounded-full border border-white/10 object-cover shadow-[0_0_30px_-6px_rgba(240,210,122,0.5)]"
                />
              </motion.div>
            </div>

            {/* Particules flottantes */}
            <span className="animate-float-slow absolute left-2 top-10 h-2 w-2 rounded-full bg-gold/70 blur-[1px]" />
            <span className="animate-float-slow absolute bottom-8 right-6 h-1.5 w-1.5 rounded-full bg-silver-bright/70 blur-[1px]" style={{ animationDelay: "-3s" }} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
