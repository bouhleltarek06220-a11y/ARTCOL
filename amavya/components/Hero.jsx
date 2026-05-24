"use client";

import { motion } from "framer-motion";
import Button from "./Button";
import DashboardMockup from "./DashboardMockup";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden pb-20 pt-36 sm:pt-44 lg:pb-28"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 lg:grid-cols-[1.05fr_1fr]">
        {/* Colonne texte */}
        <div className="flex flex-col items-start gap-7">
          <motion.span
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-muted backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold-bright animate-ticker" />
            SASU française · IA · Automatisation · SaaS
          </motion.span>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
          >
            L'intelligence artificielle au service des{" "}
            <span className="text-gradient">entreprises modernes.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg"
          >
            AMAVYA développe des solutions IA, SaaS et automatisations
            intelligentes pour transformer la prospection, la gestion et la
            productivité.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <Button href="#services" variant="primary">
              Découvrir nos solutions
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:translate-x-0.5">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Button>
            <Button href="#contact" variant="secondary">
              Réserver une démo
            </Button>
          </motion.div>

          {/* Mini preuve sociale */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-4 text-sm text-muted-soft"
          >
            <div>
              <p className="text-xl font-semibold text-paper">24/7</p>
              <p className="text-xs">Agents autonomes</p>
            </div>
            <div className="hidden h-8 w-px bg-white/10 sm:block" />
            <div>
              <p className="text-xl font-semibold text-paper">+50 %</p>
              <p className="text-xs">Productivité visée</p>
            </div>
            <div className="hidden h-8 w-px bg-white/10 sm:block" />
            <div>
              <p className="text-xl font-semibold text-paper">100 %</p>
              <p className="text-xs">Sur mesure</p>
            </div>
          </motion.div>
        </div>

        {/* Colonne visuelle */}
        <div className="relative">
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}
