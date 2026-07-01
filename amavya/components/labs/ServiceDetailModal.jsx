"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

export default function ServiceDetailModal({ service, onClose }) {
  useEffect(() => {
    if (!service) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [service, onClose]);

  return (
    <AnimatePresence>
      {service && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={service.label}
        >
          <button
            type="button"
            aria-label="Fermer"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-black/85 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-gold/30 bg-black/90 p-6 shadow-[0_28px_80px_-20px_rgba(212,175,55,0.55)] backdrop-blur-xl sm:p-8"
          >
            <button
              type="button"
              aria-label="Fermer"
              onClick={onClose}
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-muted transition-colors hover:text-paper"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="text-xs uppercase tracking-[0.32em] text-gold-bright">
              Solution AMAVYA
            </div>

            <h2
              className="mt-3 text-3xl font-semibold leading-tight text-paper sm:text-4xl"
              style={{
                fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
              }}
            >
              {service.label}
            </h2>
            <p className="mt-2 text-sm font-medium text-gold-bright">
              {service.tagline}
            </p>

            {/* Définition */}
            <p className="mt-6 text-sm leading-relaxed text-paper/85 sm:text-base">
              {service.definition}
            </p>

            {/* Trait fin doré */}
            <div className="my-7 h-px bg-[linear-gradient(90deg,transparent,rgba(240,210,122,0.5),transparent)]" />

            {/* Bénéfices business */}
            <h3 className="text-xs uppercase tracking-[0.22em] text-gold-bright">
              Ce que ça apporte concrètement
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {service.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-paper/90">
                  <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#a87f2e,#d4af37)]">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path
                        d="m5 12 5 5 9-9"
                        stroke="#0a0a0b"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>

            {/* Customisation par secteur */}
            <div className="my-7 h-px bg-[linear-gradient(90deg,transparent,rgba(240,210,122,0.5),transparent)]" />
            <h3 className="text-xs uppercase tracking-[0.22em] text-gold-bright">
              Personnalisation par secteur d&apos;activité
            </h3>
            <p className="mt-2 text-xs italic text-muted-soft">
              Chaque déploiement est ajusté à votre métier. Voici quelques
              exemples de cas d&apos;usage adaptés.
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {service.sectors.map((s, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-gold/40"
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-bright">
                    {s.sector}
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-paper/85">
                    {s.useCase}
                  </p>
                </div>
              ))}
            </div>

            {/* KPI suivis */}
            {service.kpi && service.kpi.length > 0 && (
              <>
                <div className="my-7 h-px bg-[linear-gradient(90deg,transparent,rgba(240,210,122,0.5),transparent)]" />
                <h3 className="text-xs uppercase tracking-[0.22em] text-gold-bright">
                  Ce qu&apos;on mesure ensemble
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {service.kpi.map((k, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[11px] text-paper/80"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </>
            )}

            {/* Exemple concret : un vrai produit AMAVYA en ligne */}
            {(service.example || service.examples) && (
              <>
                <div className="my-7 h-px bg-[linear-gradient(90deg,transparent,rgba(240,210,122,0.5),transparent)]" />
                <h3 className="text-xs uppercase tracking-[0.22em] text-gold-bright">
                  Un produit AMAVYA déjà en ligne
                </h3>

                {service.example && (
                  <a
                    href={service.example.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-4 flex items-center justify-between gap-4 rounded-2xl border border-gold/30 bg-[linear-gradient(135deg,rgba(212,175,55,0.10),rgba(212,175,55,0.02))] p-4 transition-all hover:-translate-y-0.5 hover:border-gold/60"
                  >
                    <span className="min-w-0">
                      <span
                        className="block text-base font-semibold text-paper"
                        style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
                      >
                        {service.example.name}
                      </span>
                      <span className="mt-0.5 block text-sm text-paper/70">
                        {service.example.tagline}
                      </span>
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-gold-bright">
                      Voir la présentation
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2.4} />
                    </span>
                  </a>
                )}

                {service.examples && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {service.examples.map((ex, i) => (
                      <a
                        key={i}
                        href={ex.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between gap-3 rounded-2xl border border-gold/25 bg-[linear-gradient(135deg,rgba(212,175,55,0.08),rgba(212,175,55,0.01))] p-3.5 transition-all hover:-translate-y-0.5 hover:border-gold/60"
                      >
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-paper">{ex.name}</span>
                          <span className="mt-0.5 block truncate text-xs text-paper/65">{ex.tagline}</span>
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-gold-bright transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2.4} />
                      </a>
                    ))}
                  </div>
                )}

                {service.soon && (
                  <p className="mt-3 text-xs italic text-muted-soft">Bientôt : {service.soon}</p>
                )}
              </>
            )}

            {/* CTA final */}
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <a
                href={`/#contact`}
                onClick={onClose}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(110deg,#a87f2e,#f0d27a_55%,#d4af37)] px-6 py-3 text-sm font-semibold text-ink shadow-[0_8px_40px_-12px_rgba(212,175,55,0.7)] transition-all hover:-translate-y-0.5"
              >
                Réserver une démo pour {service.label}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2.4} />
              </a>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-white/5"
              >
                Fermer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
