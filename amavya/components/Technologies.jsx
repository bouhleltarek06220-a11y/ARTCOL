"use client";

import { useState } from "react";
import SectionHeading from "./SectionHeading";
import { useLang } from "./LangProvider";

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
      <span className="h-2 w-2 rounded-full bg-gold/60 transition-all duration-300 group-hover:scale-150 group-hover:bg-gold-bright group-hover:shadow-[0_0_14px_3px_rgba(240,210,122,0.7)]" />
      <span className="relative whitespace-nowrap text-lg font-medium text-muted/70 transition-colors duration-300 group-hover:text-paper">
        {name}
        {/* Soulignement doré qui apparaît au hover */}
        <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-0 bg-[linear-gradient(90deg,transparent,#f0d27a,transparent)] transition-all duration-500 group-hover:w-full" />
      </span>
    </div>
  );
}

export default function Technologies() {
  const { t } = useLang();
  const tech = t.technologies;
  const [paused, setPaused] = useState(false);
  const loop = [...TECHS, ...TECHS];
  return (
    <section id="technologies" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow={tech.eyebrow}
          title={tech.title}
          description={tech.description}
        />
      </div>

      {/* Marquee infini — pause au survol pour permettre la lecture */}
      <div
        className="relative mt-14 overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Glow de fond */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_100%_at_50%_50%,rgba(212,175,55,0.1),transparent_70%)]" />

        {/* Masques latéraux */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-ink to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-ink to-transparent" />

        <div
          className="flex w-max animate-marquee"
          style={{ animationPlayState: paused ? "paused" : "running" }}
        >
          {loop.map((name, i) => (
            <TechPill key={`${name}-${i}`} name={name} />
          ))}
        </div>
      </div>
    </section>
  );
}
