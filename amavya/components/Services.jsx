"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Database,
  Workflow,
  Target,
  Boxes,
  GraduationCap,
  ArrowUpRight,
} from "lucide-react";
import { SectionHeading } from "./ui/SectionHeading";
import { StaggerGroup, staggerItem } from "./ui/Reveal";

const services = [
  {
    icon: Bot,
    title: "Agents IA",
    description:
      "Des agents autonomes qui exécutent vos tâches, répondent à vos clients et raisonnent en continu, 24/7.",
  },
  {
    icon: Database,
    title: "CRM intelligent",
    description:
      "Un CRM augmenté par l'IA qui enrichit, scorise et priorise automatiquement vos contacts et opportunités.",
  },
  {
    icon: Workflow,
    title: "Automatisation métier",
    description:
      "Connectez vos outils et automatisez vos processus internes pour éliminer les tâches répétitives.",
  },
  {
    icon: Target,
    title: "Prospection automatisée",
    description:
      "Identifiez, ciblez et engagez vos prospects idéaux grâce à des séquences pilotées par l'IA.",
  },
  {
    icon: Boxes,
    title: "SaaS sur mesure",
    description:
      "Des applications web et mobiles scalables, conçues sur mesure pour vos enjeux business.",
  },
  {
    icon: GraduationCap,
    title: "Formation IA & Business",
    description:
      "Accompagnement et formation pour faire monter vos équipes en compétence sur l'IA et l'automatisation.",
  },
];

export function Services() {
  return (
    <section id="services" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Nos solutions"
          title="Une suite d'outils intelligents, pensés pour l'impact"
          description="De l'agent IA au CRM augmenté, AMAVYA couvre toute la chaîne de valeur pour automatiser, accélérer et fiabiliser votre activité."
        />

        <StaggerGroup className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

function ServiceCard({ icon: Icon, title, description }) {
  return (
    <motion.article
      variants={staggerItem}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-7 backdrop-blur-md"
    >
      {/* Hover glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-electric-500/0 to-neon-500/0 blur-2xl transition-all duration-500 group-hover:from-electric-500/30 group-hover:to-neon-500/30" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-electric-500/15 to-neon-500/15 transition-transform duration-500 group-hover:scale-110">
        <Icon className="h-6 w-6 text-white" />
        <span className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-electric-500/40 to-neon-500/40 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <h3 className="mt-5 flex items-center gap-1.5 text-lg font-semibold text-white">
        {title}
        <ArrowUpRight className="h-4 w-4 -translate-x-1 text-white/40 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
      </h3>
      <p className="mt-2.5 text-sm leading-relaxed text-white/55">
        {description}
      </p>
    </motion.article>
  );
}
