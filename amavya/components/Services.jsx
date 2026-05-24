"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import {
  IconAgent,
  IconCRM,
  IconAutomation,
  IconProspection,
  IconSaaS,
  IconFormation,
} from "./Icons";

const SERVICES = [
  {
    icon: IconAgent,
    title: "Agents IA",
    desc: "Des agents autonomes qui exécutent vos tâches métiers, raisonnent et agissent 24/7.",
  },
  {
    icon: IconCRM,
    title: "CRM intelligent",
    desc: "Un CRM augmenté par l'IA qui qualifie, priorise et enrichit vos contacts en continu.",
  },
  {
    icon: IconAutomation,
    title: "Automatisation métier",
    desc: "Connectez vos outils et automatisez vos workflows répétitifs sans friction.",
  },
  {
    icon: IconProspection,
    title: "Prospection automatisée",
    desc: "Identification, séquençage et relance de prospects pilotés par l'intelligence artificielle.",
  },
  {
    icon: IconSaaS,
    title: "SaaS sur mesure",
    desc: "Des plateformes web et mobiles conçues pour votre activité, scalables et élégantes.",
  },
  {
    icon: IconFormation,
    title: "Formation IA & Business",
    desc: "Accompagnement et montée en compétences pour intégrer l'IA dans vos équipes.",
  },
];

function Card({ icon: Icon, title, desc, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="glow-ring group glass relative flex flex-col gap-4 overflow-hidden rounded-2xl p-6"
    >
      {/* Lueur au hover */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.35),transparent_70%)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/20 bg-[linear-gradient(135deg,rgba(168,127,46,0.28),rgba(212,175,55,0.18))] text-gold-bright transition-transform duration-500 group-hover:scale-110 group-hover:text-champagne">
        <Icon width={24} height={24} />
      </div>

      <h3 className="text-lg font-semibold text-paper">{title}</h3>
      <p className="text-sm leading-relaxed text-muted">{desc}</p>

      <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-gold-bright opacity-0 transition-all duration-300 group-hover:opacity-100">
        En savoir plus
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </motion.article>
  );
}

export default function Services() {
  return (
    <section id="services" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="Nos solutions"
          title="Des outils IA conçus pour passer à l'échelle"
          description="Une suite complète pour automatiser, prospecter et piloter votre activité avec l'intelligence artificielle."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Card key={s.title} index={i} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
