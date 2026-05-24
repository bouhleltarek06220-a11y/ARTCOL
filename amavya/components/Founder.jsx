"use client";

import { motion } from "framer-motion";
import { Reveal } from "./ui/Reveal";
import { Pill } from "./ui/SectionHeading";
import { Cpu, Zap, Code2, Briefcase } from "lucide-react";

const badges = [
  { icon: Zap, label: "20 ans terrain · courant fort/faible" },
  { icon: Code2, label: "Développeur iOS · WordPress" },
  { icon: Briefcase, label: "Business developer" },
  { icon: Cpu, label: "Vision IA + humain" },
];

export function Founder() {
  return (
    <section id="founder" className="relative py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal direction="right">
          <FounderPortrait />
        </Reveal>

        <div className="flex flex-col items-start gap-6">
          <Reveal>
            <Pill>Le fondateur</Pill>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              Tarek Bouhlel
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="text-pretty text-lg leading-relaxed text-white/65">
              Entre expérience terrain, développement technologique et vision
              business, AMAVYA est née d&apos;une volonté simple : créer des
              outils IA réellement utiles.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {badges.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-electric-500/20 to-neon-500/20 text-white">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm text-white/65">{label}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.32}>
            <div className="mt-2 flex items-center gap-4">
              <Signature />
              <div className="text-sm">
                <p className="font-medium text-white">Tarek Bouhlel</p>
                <p className="text-white/45">Fondateur · AMAVYA SASU</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FounderPortrait() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-electric-600/25 to-neon-600/25 blur-3xl" />
      <div className="glass-strong ring-glow relative aspect-[4/5] overflow-hidden rounded-[2rem] p-1.5">
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-surface to-night">
          {/* Placeholder portrait */}
          <svg viewBox="0 0 200 250" className="h-full w-full opacity-90">
            <defs>
              <linearGradient id="portrait" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.35" />
              </linearGradient>
            </defs>
            <rect width="200" height="250" fill="url(#portrait)" />
            <circle cx="100" cy="92" r="38" fill="#0a0b14" opacity="0.6" />
            <path d="M40 230 a60 60 0 0 1 120 0z" fill="#0a0b14" opacity="0.6" />
            <circle cx="100" cy="92" r="38" fill="none" stroke="#5b8dff" strokeWidth="1.5" opacity="0.5" />
            <path d="M40 230 a60 60 0 0 1 120 0" fill="none" stroke="#b98bff" strokeWidth="1.5" opacity="0.5" />
          </svg>

          {/* Scan line */}
          <motion.div
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="pointer-events-none absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-electric-400/15 to-transparent"
          />

          <span className="absolute bottom-4 left-4 rounded-full bg-black/40 px-3 py-1 text-[11px] text-white/60 backdrop-blur-md">
            Photo · à venir
          </span>
        </div>
      </div>
    </div>
  );
}

function Signature() {
  return (
    <svg width="92" height="44" viewBox="0 0 92 44" fill="none" className="text-gold-400">
      <path
        d="M4 30c6-14 10-20 13-20s2 18 5 18 5-22 9-22 3 24 7 24 6-16 9-16 2 10 5 10 7-8 11-8 6 4 11 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
