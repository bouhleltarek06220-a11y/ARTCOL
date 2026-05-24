"use client";

import Reveal from "./Reveal";

const FACETS = [
  "20 ans de terrain · courant fort/faible",
  "Dev & architecture app & web",
  "Business developer orienté IA",
];

export default function Founder() {
  return (
    <section id="fondateur" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="glass-strong glow-ring relative overflow-hidden rounded-3xl p-8 sm:p-12">
          {/* Lueur d'ambiance */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(168,127,46,0.3),transparent_70%)] blur-3xl" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[auto_1fr]">
            {/* Portrait placeholder premium */}
            <Reveal>
              <div className="relative mx-auto">
                <div className="absolute -inset-3 rounded-3xl bg-[linear-gradient(135deg,#a87f2e,#d4af37)] opacity-40 blur-xl" />
                <div className="relative flex h-44 w-44 items-center justify-center overflow-hidden rounded-3xl border border-gold/20 bg-[linear-gradient(160deg,#17171b,#0a0a0b)] sm:h-52 sm:w-52">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/founder.webp"
                    alt="Tarek Bouhlel, fondateur d'AMAVYA"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </div>
            </Reveal>

            {/* Texte */}
            <div className="flex flex-col gap-5">
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-bright animate-ticker" />
                  Le fondateur
                </span>
              </Reveal>

              <Reveal delay={0.05}>
                <h2 className="text-3xl font-semibold sm:text-4xl">
                  Tarek Bouhlel
                </h2>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="text-pretty text-lg leading-relaxed text-muted">
                  Entre expérience terrain, développement technologique et
                  vision business, AMAVYA est née d'une volonté simple :{" "}
                  <span className="text-paper">créer des outils IA réellement utiles.</span>
                </p>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="flex flex-wrap gap-2.5">
                  {FACETS.map((f) => (
                    <span
                      key={f}
                      className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-paper/80"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
