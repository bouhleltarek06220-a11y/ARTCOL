"use client";

import { motion } from "framer-motion";
import { useLang } from "../LangProvider";

const EASE = [0.22, 1, 0.36, 1];

// Version compacte des 6 services AMAVYA, reléguée en bas de page.
// Le message principal reste l'Agent de Prospection IA — ces autres
// expertises sont là pour signaler la profondeur, pas pour concurrencer.
export default function OtherExpertises() {
  const { t } = useLang();
  const cards = t?.services?.cards || [];

  return (
    <section id="autres-expertises" className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center"
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-muted-soft">
            AMAVYA
          </p>
          <h2 className="mt-2 text-balance text-2xl font-semibold tracking-tight text-paper sm:text-3xl">
            Autres expertises
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted">
            Au-delà de la prospection, AMAVYA conçoit aussi des CRM, des
            automatisations et des SaaS sur mesure pour les TPE et PME.
          </p>
        </motion.div>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            <motion.li
              key={c.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.05 }}
              className="rounded-xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur transition-colors hover:border-gold/30"
            >
              <p className="text-sm font-semibold text-paper">{c.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                {c.desc}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
