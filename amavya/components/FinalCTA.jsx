"use client";

import Reveal from "./Reveal";
import Button from "./Button";

export default function FinalCTA() {
  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5">
        <div className="glow-ring relative overflow-hidden rounded-[2rem] border border-gold/25 bg-[#0a0a0b] p-10 text-center sm:p-16">
          {/* Photo de fond */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/cta-bg.webp"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
          />
          {/* Voile sombre pour garder le texte lisible */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.74),rgba(5,5,5,0.58))]" />
          {/* Halo doré central */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(247,233,200,0.14),transparent_70%)] blur-2xl" />

          <div className="relative flex flex-col items-center gap-6">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-paper/80">
                Passez à l'action
              </span>
            </Reveal>

            <Reveal delay={0.05}>
              <h2 className="text-balance text-3xl font-semibold leading-tight sm:text-5xl">
                Prêt à transformer votre entreprise avec l'<span className="text-gradient">IA</span> ?
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="max-w-xl text-pretty text-base text-muted sm:text-lg">
                Discutons de vos enjeux et identifions ensemble les
                automatisations à plus fort impact pour votre activité.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button href="#contact" variant="primary">
                  Commencer maintenant
                </Button>
                <Button href="mailto:contact@amavya.cloud" variant="secondary">
                  Contacter AMAVYA
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
