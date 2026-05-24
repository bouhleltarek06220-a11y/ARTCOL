"use client";

import { SectionHeading } from "./ui/SectionHeading";
import { Reveal } from "./ui/Reveal";

const techs = [
  { name: "OpenAI", icon: OpenAIIcon },
  { name: "Claude", icon: ClaudeIcon },
  { name: "Supabase", icon: SupabaseIcon },
  { name: "Vercel", icon: VercelIcon },
  { name: "Next.js", icon: NextIcon },
  { name: "React", icon: ReactIcon },
  { name: "Node.js", icon: NodeIcon },
  { name: "PostgreSQL", icon: PostgresIcon },
];

export function Technologies() {
  const loop = [...techs, ...techs];

  return (
    <section id="technologies" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Technologies"
          title="Construit sur une stack moderne et éprouvée"
          description="Nous combinons les meilleurs modèles d'IA et les frameworks les plus performants pour livrer des produits rapides, fiables et scalables."
        />
      </div>

      <Reveal delay={0.1} className="relative mt-14">
        {/* Edge fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-void to-transparent sm:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-void to-transparent sm:w-40" />

        <div className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused]">
          {loop.map((tech, i) => (
            <TechChip key={`${tech.name}-${i}`} {...tech} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function TechChip({ name, icon: Icon }) {
  return (
    <div className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] px-6 py-4 backdrop-blur-md transition-colors duration-300 hover:border-white/20">
      <span className="text-white/55 transition-all duration-300 group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(91,141,255,0.7)]">
        <Icon />
      </span>
      <span className="whitespace-nowrap text-sm font-medium text-white/55 transition-colors duration-300 group-hover:text-white">
        {name}
      </span>
    </div>
  );
}

/* --- Monochrome brand glyphs (currentColor) --- */

function OpenAIIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 3.5l6 3.5v7l-6 3.5-6-3.5v-7l6-3.5z" />
      <path d="M12 8.5v7M6 7l6 3.5 6-3.5M6 14l6-3.5 6 3.5" />
    </svg>
  );
}

function ClaudeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M12 4v16M4 12h16M6.3 6.3l11.4 11.4M17.7 6.3L6.3 17.7" />
    </svg>
  );
}

function SupabaseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2L4 13.2c-.5.6 0 1.5.8 1.5H12v7.3c0 .9 1.2 1.2 1.7.5L21 11.3c.5-.6 0-1.5-.8-1.5H13V2.5c0-.6-.7-.9-1-.5z" opacity="0.9" />
    </svg>
  );
}

function VercelIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3l10 17H2L12 3z" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 8v8M8.5 8l7.5 9M15.5 8v5" />
    </svg>
  );
}

function ReactIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="10" ry="4.2" />
      <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
    </svg>
  );
}

function NodeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M12 2.5l8.5 4.9v9.2L12 21.5l-8.5-4.9V7.4L12 2.5z" />
      <path d="M9.5 14.5c0 1.2 1 2 2.5 2s2.5-.8 2.5-2-1-1.6-2.5-2-2.3-.8-2.3-1.7c0-.9.8-1.5 2.1-1.5s2.1.6 2.1 1.5" strokeWidth="1.2" />
    </svg>
  );
}

function PostgresIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <ellipse cx="12" cy="5.5" rx="7" ry="3" />
      <path d="M5 5.5v13c0 1.7 3.1 3 7 3s7-1.3 7-3v-13" />
      <path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" />
    </svg>
  );
}
