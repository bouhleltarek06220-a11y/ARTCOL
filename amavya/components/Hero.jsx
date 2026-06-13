"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import DashboardMockup from "./DashboardMockup";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, delay, ease: EASE },
  },
});

function useGentleParallax(ref, strength = 14) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let target = { x: 0, y: 0 };
    let current = { x: 0, y: 0 };
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      target = { x: nx * strength, y: ny * strength };
    };
    const onLeave = () => {
      target = { x: 0, y: 0 };
    };
    const tick = () => {
      current = {
        x: current.x + (target.x - current.x) * 0.08,
        y: current.y + (target.y - current.y) * 0.08,
      };
      setPos({ x: current.x, y: current.y });
      raf = requestAnimationFrame(tick);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [ref, strength]);
  return pos;
}

export default function Hero() {
  const heroRef = useRef(null);
  const parallax = useGentleParallax(heroRef, 18);

  return (
    <section
      ref={heroRef}
      id="top"
      className="relative overflow-hidden pb-20 pt-36 sm:pt-44 lg:pb-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(240,210,122,0.10),transparent_60%)] blur-2xl md:block"
        style={{
          transform: `translate(calc(-50% + ${parallax.x}px), calc(-50% + ${parallax.y}px))`,
          transition: "transform 0.05s linear",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 lg:grid-cols-[1.05fr_1fr]">
        {/* Colonne texte */}
        <motion.div
          initial="hidden"
          animate="show"
          className="flex flex-col items-start gap-7 text-left"
        >
          <motion.span
            variants={fadeUp(0)}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-muted backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold-bright animate-ticker" />
            Agent de Prospection IA · artisans, indépendants &amp; PME · 06 · 83 · 13
          </motion.span>

          <motion.h1
            variants={fadeUp(0.12)}
            className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Votre prospection tourne toute seule.{" "}
            <span className="text-gradient bg-[length:200%_auto] [animation:hero-sheen_14s_ease-in-out_infinite]">
              Vous, vous fermez les ventes.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp(0.26)}
            className="max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg"
          >
            AMAVYA installe un Agent de Prospection IA qui identifie vos prospects,
            rédige des messages personnalisés et relance automatiquement — pendant
            que vous êtes sur le terrain. Conçu pour les artisans, indépendants et
            PME de la région PACA.
          </motion.p>

          {/* CTA unique : on récupère les leads via le formulaire, pas via démo live */}
          <motion.div variants={fadeUp(0.42)} className="flex flex-col items-start gap-3 pt-2 sm:flex-row sm:items-center sm:gap-4">
            <a
              href="/reserver"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(110deg,#a87f2e,#f0d27a_55%,#d4af37)] px-6 py-3 text-sm font-semibold text-ink shadow-[0_8px_40px_-12px_rgba(212,175,55,0.7)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Réserver ma démo (audit gratuit)
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </motion.div>

          {/* Ligne de réassurance */}
          <motion.p
            variants={fadeUp(0.52)}
            className="text-xs text-muted-soft sm:text-sm"
          >
            Sans engagement · Mise en place en 7 jours · Basé en région 06/83/13
          </motion.p>

          {/* Bouton showreel discret */}
          <motion.div variants={fadeUp(0.65)} className="pt-1">
            <a
              href="/showreel"
              className="group inline-flex items-center gap-3 rounded-full border border-gold/20 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-gold-bright/80 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/50 hover:text-gold-bright"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-bright opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-bright" />
              </span>
              Voir AMAVYA en 60s
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="transition-transform duration-300 group-hover:translate-x-0.5">
                <path d="M8 5v14l11-7z" />
              </svg>
            </a>
          </motion.div>
        </motion.div>

        {/* Colonne visuelle : aperçu de l'Agent de Prospection IA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: EASE }}
          className="relative"
        >
          <DashboardMockup />
        </motion.div>
      </div>
    </section>
  );
}
