"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Reveal from "./Reveal";
import { useLang } from "./LangProvider";

export default function Vision() {
  const { t } = useLang();
  const v = t.vision;
  return (
    <section id="vision" className="relative py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 lg:grid-cols-2">
        {/* Texte storytelling */}
        <div className="flex flex-col gap-6">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-silver-bright animate-ticker" />
              {v.eyebrow}
            </span>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="text-balance text-3xl font-semibold leading-tight sm:text-4xl">
              {v.titleLead} <span className="text-gradient">{v.titleHighlight}</span>{v.titleTail}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-pretty text-lg leading-relaxed text-muted">
              {v.paragraph}
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <ul className="flex flex-col gap-3 pt-2">
              {v.points.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="group flex items-start gap-3 text-sm text-paper/90"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#a87f2e,#d4af37)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[8deg]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="m5 12 5 5 9-9" stroke="#0a0a0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="transition-colors duration-300 group-hover:text-paper">{item}</span>
                </motion.li>
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
                <motion.span
                  className="absolute h-2.5 w-2.5 rounded-full bg-gold-bright shadow-[0_0_18px_4px_rgba(240,210,122,0.6)]"
                  style={{ top: "-5px", left: "50%" }}
                  animate={{
                    boxShadow: [
                      "0 0 18px 4px rgba(240,210,122,0.5)",
                      "0 0 28px 8px rgba(240,210,122,0.8)",
                      "0 0 18px 4px rgba(240,210,122,0.5)",
                    ],
                  }}
                  transition={{ duration: 3 + ring * 0.7, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            ))}

            {/* Noyau : logo AMAVYA dans l'orbe — cliquable, ouvre /vision */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Link
                href="/vision"
                aria-label={t.vision.ctaAria || "Voir la vision AMAVYA en 60s"}
                className="group relative"
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  whileHover={{ scale: 1.1 }}
                  className="glass-strong relative flex h-40 w-40 cursor-pointer items-center justify-center rounded-full transition-shadow duration-500 group-hover:shadow-[0_0_60px_8px_rgba(240,210,122,0.55)]"
                >
                  <div className="absolute inset-4 rounded-full bg-[conic-gradient(from_0deg,#a87f2e,#d4af37,#e6e9f0,#a87f2e)] opacity-30 blur-md animate-pulse-glow transition-opacity duration-500 group-hover:opacity-60" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo-mark.png"
                    alt="AMAVYA"
                    className="relative z-10 h-28 w-28 rounded-full border border-white/10 object-cover shadow-[0_0_30px_-6px_rgba(240,210,122,0.5)] transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Anneau d'invitation au clic, apparait au hover */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-3 rounded-full border-2 border-gold/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                </motion.div>

                {/* Indication "Cliquez pour découvrir notre vision en 60s" */}
                <div className="pointer-events-none absolute left-1/2 top-full mt-5 -translate-x-1/2 whitespace-nowrap text-center">
                  <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-black/60 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.22em] text-gold-bright backdrop-blur opacity-90 transition-all duration-500 group-hover:opacity-100 group-hover:-translate-y-1">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-bright opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold-bright" />
                    </span>
                    {t.vision.ctaLabel || "Voir notre vision en 60s"}
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </div>
              </Link>
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
