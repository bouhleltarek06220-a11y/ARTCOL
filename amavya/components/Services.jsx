"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import Button from "./Button";
import ServiceDemo from "./ServiceDemos";
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

function Card({ icon: Icon, title, desc, learnMore, index, onOpen }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      onClick={() => onOpen(index)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(index);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={title}
      className="glow-ring group glass relative flex cursor-pointer flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 p-6 outline-none transition-[border-color,box-shadow] duration-500 hover:border-gold/40 hover:shadow-[0_20px_60px_-25px_rgba(212,175,55,0.45)] focus-visible:ring-2 focus-visible:ring-gold/60"
    >
      {/* Halo doré qui apparaît au hover (suit le coin haut-droit) */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.4),transparent_70%)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/20 bg-[linear-gradient(135deg,rgba(168,127,46,0.28),rgba(212,175,55,0.18))] text-gold-bright transition-all duration-500 group-hover:scale-110 group-hover:rotate-[6deg] group-hover:text-champagne">
        <Icon width={24} height={24} />
      </div>

      <h3 className="text-lg font-semibold text-paper">{title}</h3>
      <p className="text-sm leading-relaxed text-muted">{desc}</p>

      <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-gold-bright opacity-70 transition-all duration-300 group-hover:opacity-100">
        {learnMore}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </motion.article>
  );
}

function ServiceModal({ service, Icon, labels, demo, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={service.title}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="glass-strong relative z-10 max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-gold/20 p-7 sm:p-9"
      >
        <button
          type="button"
          aria-label={labels.close}
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-muted transition-colors hover:text-paper"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="flex items-center gap-4 pr-8">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-[linear-gradient(135deg,rgba(168,127,46,0.28),rgba(212,175,55,0.18))] text-gold-bright">
            {Icon ? <Icon width={24} height={24} /> : null}
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-paper">{service.title}</h3>
            <p className="text-sm text-gold-bright">{service.tagline}</p>
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-muted">{service.long}</p>

        {/* Démo animée (si disponible) ou emplacement réservé à la future vidéo */}
        <div className="mt-6">
          {demo ? (
            demo
          ) : (
            <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gold/30 bg-white/[0.04] text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold-bright">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-soft">
                {labels.videoSoon}
              </p>
            </div>
          )}
        </div>

        <h4 className="mt-6 text-sm font-semibold text-paper">{labels.featuresTitle}</h4>
        <ul className="mt-3 flex flex-col gap-2.5">
          {service.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-muted">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0 text-gold-bright" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <Button href="/reserver" variant="primary" onClick={onClose} className="mt-7 w-full">
          {labels.modalCta}
        </Button>
      </motion.div>
    </motion.div>
  );
}

export default function Services() {
  const { t } = useLang();
  const s = t.services;
  const [active, setActive] = useState(null);
  const service = active != null ? s.cards[active] : null;

  useEffect(() => {
    if (active == null) return;
    const onKey = (e) => e.key === "Escape" && setActive(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

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
              onOpen={setActive}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {service && (
          <ServiceModal
            service={service}
            Icon={ICONS[active]}
            labels={s}
            demo={<ServiceDemo index={active} />}
            onClose={() => setActive(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
