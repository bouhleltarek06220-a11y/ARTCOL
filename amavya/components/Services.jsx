"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { useLang } from "./LangProvider";
import {
  IconAgent,
  IconCRM,
  IconAutomation,
  IconProspection,
  IconSaaS,
  IconFormation,
} from "./Icons";

const ICONS = [
  IconAgent,
  IconCRM,
  IconAutomation,
  IconProspection,
  IconSaaS,
  IconFormation,
];

function Card({ icon: Icon, title, desc, learnMore, index }) {
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
        {learnMore}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </motion.article>
  );
}

export default function Services() {
  const { t } = useLang();
  const s = t.services;
  return (
    <section id="services" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow={s.eyebrow}
          title={s.title}
          description={s.description}
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {s.cards.map((card, i) => (
            <Card
              key={card.title}
              index={i}
              icon={ICONS[i]}
              title={card.title}
              desc={card.desc}
              learnMore={s.learnMore}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
