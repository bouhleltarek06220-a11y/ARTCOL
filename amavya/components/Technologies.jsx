"use client";

import SectionHeading from "./SectionHeading";

/* Wordmarks monochromes simples (texte stylisé) pour rester légal et léger. */
const TECHS = [
  "OpenAI",
  "Claude",
  "Supabase",
  "Vercel",
  "Next.js",
  "React",
  "Node.js",
  "PostgreSQL",
];

function TechPill({ name }) {
  return (
    <div className="group flex shrink-0 items-center gap-2.5 px-8 py-2">
      <span className="h-2 w-2 rounded-full bg-electric/60 transition-all duration-300 group-hover:bg-cyan group-hover:shadow-[0_0_12px_2px_rgba(63,224,255,0.7)]" />
      <span className="whitespace-nowrap text-lg font-medium text-muted/70 transition-colors duration-300 group-hover:text-paper">
        {name}
      </span>
    </div>
  );
}

export default function Technologies() {
  const loop = [...TECHS, ...TECHS];
  return (
    <section id="technologies" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="Stack technologique"
          title="Construit sur les meilleures technologies du marché"
          description="AMAVYA s'appuie sur un socle moderne, performant et éprouvé pour livrer des produits fiables."
        />
      </div>

      {/* Marquee infini */}
      <div className="relative mt-14 overflow-hidden">
        {/* Glow de fond */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_100%_at_50%_50%,rgba(79,139,255,0.12),transparent_70%)]" />

        {/* Masques latéraux */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-ink to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-ink to-transparent" />

        <div className="flex w-max animate-marquee">
          {loop.map((name, i) => (
            <TechPill key={`${name}-${i}`} name={name} />
          ))}
        </div>
      </div>
    </section>
  );
}
