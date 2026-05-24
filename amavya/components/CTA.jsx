"use client";

import { ArrowRight, Mail } from "lucide-react";
import { Reveal } from "./ui/Reveal";
import { Button } from "./ui/Button";

export function CTA() {
  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 px-6 py-16 text-center sm:px-12 sm:py-24">
            {/* Background */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-electric-600/20 via-neon-600/15 to-transparent" />
            <div className="absolute inset-0 -z-10 grid-bg opacity-40" />
            <div className="absolute left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/3 rounded-full bg-neon-500/30 blur-[120px] animate-pulse-glow" />
            <div className="absolute bottom-0 right-1/4 -z-10 h-64 w-64 translate-y-1/3 rounded-full bg-electric-500/25 blur-[120px] animate-pulse-glow [animation-delay:-2s]" />

            <h2 className="mx-auto max-w-3xl text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              Prêt à transformer votre entreprise avec{" "}
              <span className="text-gradient-brand">l&apos;IA</span> ?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-base text-white/60 sm:text-lg">
              Discutons de vos enjeux et concevons ensemble les outils
              intelligents qui feront la différence.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                href="mailto:contact@amavya.com"
                variant="primary"
                icon={<ArrowRight className="h-4 w-4" />}
              >
                Commencer maintenant
              </Button>
              <Button
                href="mailto:contact@amavya.com"
                variant="secondary"
                icon={<Mail className="h-4 w-4" />}
              >
                Contacter AMAVYA
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
