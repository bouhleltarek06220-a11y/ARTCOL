"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "./Reveal";
import Button from "./Button";
import { useLang } from "./LangProvider";

export default function FinalCTA() {
  const { t } = useLang();
  const c = t.cta;

  // Parallaxe douce sur l'image de fond (le visuel descend plus lentement que le scroll).
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-24 sm:py-32"
    >
      <div className="mx-auto max-w-5xl px-5">
        <div className="glow-ring relative overflow-hidden rounded-[2rem] border border-gold/25 bg-[#0a0a0b] p-10 text-center sm:p-16">
          {/* Photo de fond avec parallaxe douce */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            src="/cta-bg.webp"
            alt=""
            aria-hidden="true"
            style={{ y: bgY }}
            className="pointer-events-none absolute inset-0 h-[110%] w-full select-none object-cover"
          />
          {/* Voile sombre pour garder le texte lisible */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.74),rgba(5,5,5,0.58))]" />
          {/* Halo doré central — respiration */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(247,233,200,0.20),transparent_70%)] blur-2xl"
            animate={{ opacity: [0.6, 1, 0.6], scale: [0.92, 1.08, 0.92] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative flex flex-col items-center gap-6">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-paper/80">
                {c.eyebrow}
              </span>
            </Reveal>

            <Reveal delay={0.05}>
              <h2 className="text-balance text-3xl font-semibold leading-tight sm:text-5xl">
                {c.titleLead}
                <span className="text-gradient bg-[length:200%_auto] [animation:hero-sheen_14s_ease-in-out_infinite]">
                  {c.titleHighlight}
                </span>
                {c.titleTail}
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="max-w-xl text-pretty text-base text-muted sm:text-lg">
                {c.paragraph}
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="relative flex flex-col gap-3 sm:flex-row">
                {/* Halo doré qui respire derrière le bouton */}
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[radial-gradient(circle,rgba(240,210,122,0.45),transparent_70%)] blur-2xl"
                  animate={{ opacity: [0.5, 0.9, 0.5], scale: [0.95, 1.15, 0.95] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <Button href="/reserver" variant="primary">
                  {c.button}
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
