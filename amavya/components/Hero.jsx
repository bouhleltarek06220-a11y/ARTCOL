"use client";

import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";
import { Button } from "./ui/Button";
import { DashboardMockup } from "./DashboardMockup";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center pt-32 pb-20"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-start gap-6"
        >
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-white/70 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-gold-400" />
              Startup IA française · SaaS &amp; Automatisation
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            L&apos;intelligence artificielle au service des{" "}
            <span className="text-gradient-brand">entreprises modernes</span>.
          </motion.h1>

          <motion.p
            variants={item}
            className="max-w-xl text-pretty text-base leading-relaxed text-white/60 sm:text-lg"
          >
            AMAVYA développe des solutions IA, SaaS et automatisations
            intelligentes pour transformer la prospection, la gestion et la
            productivité.
          </motion.p>

          <motion.div
            variants={item}
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button
              href="#services"
              variant="primary"
              icon={<ArrowRight className="h-4 w-4" />}
            >
              Découvrir nos solutions
            </Button>
            <Button
              href="#contact"
              variant="secondary"
              icon={<PlayCircle className="h-4 w-4" />}
            >
              Réserver une démo
            </Button>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-2 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-white/45"
          >
            {[
              "Agents IA autonomes",
              "CRM intelligent",
              "Automatisation métier",
            ].map((label) => (
              <span key={label} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-electric-400 to-neon-400" />
                {label}
              </span>
            ))}
          </motion.div>
        </motion.div>

        <div className="relative">
          <DashboardMockup />
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 lg:block"
      >
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-white/15 p-1.5">
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="h-1.5 w-1 rounded-full bg-white/50"
          />
        </div>
      </motion.div>
    </section>
  );
}
