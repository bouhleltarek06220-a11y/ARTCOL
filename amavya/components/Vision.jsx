"use client";

import { motion } from "framer-motion";
import { Reveal } from "./ui/Reveal";
import { Pill } from "./ui/SectionHeading";

export function Vision() {
  return (
    <section id="vision" className="relative py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col items-start gap-6">
          <Reveal>
            <Pill>Notre vision</Pill>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              L&apos;IA doit{" "}
              <span className="text-gradient-brand">renforcer l&apos;humain</span>
              , pas le remplacer.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="text-pretty text-lg leading-relaxed text-white/65">
              Nous croyons que l&apos;intelligence artificielle doit renforcer
              l&apos;humain, et non le remplacer. AMAVYA construit des outils
              intelligents conçus pour aider les entreprises à travailler plus
              vite, mieux et avec plus d&apos;impact.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-2 grid grid-cols-3 gap-6">
              {[
                { value: "10×", label: "Productivité" },
                { value: "24/7", label: "Agents actifs" },
                { value: "100%", label: "Sur mesure" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-semibold text-gradient-gold sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-white/45">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} direction="left">
          <HoloIllustration />
        </Reveal>
      </div>
    </section>
  );
}

function HoloIllustration() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-tr from-electric-600/25 to-neon-600/25 blur-3xl" />

      {/* Orbiting rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute inset-6 rounded-full border border-white/10"
      >
        <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-electric-400 shadow-[0_0_14px_3px_rgba(91,141,255,0.7)]" />
      </motion.div>
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="absolute inset-16 rounded-full border border-white/10"
      >
        <span className="absolute top-1/2 -right-1.5 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-neon-400 shadow-[0_0_14px_3px_rgba(185,139,255,0.7)]" />
      </motion.div>

      {/* Center: human + AI handshake motif */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="glass-strong ring-glow flex h-44 w-44 flex-col items-center justify-center gap-3 rounded-[2rem] sm:h-52 sm:w-52"
        >
          <svg viewBox="0 0 120 120" className="h-20 w-20 sm:h-24 sm:w-24">
            <defs>
              <linearGradient id="holo-a" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#5b8dff" />
                <stop offset="100%" stopColor="#b98bff" />
              </linearGradient>
              <linearGradient id="holo-b" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f6dd9b" />
                <stop offset="100%" stopColor="#d4af37" />
              </linearGradient>
            </defs>
            {/* Human node */}
            <circle cx="38" cy="42" r="11" fill="none" stroke="url(#holo-b)" strokeWidth="2.5" />
            <path d="M22 78 a16 16 0 0 1 32 0" fill="none" stroke="url(#holo-b)" strokeWidth="2.5" strokeLinecap="round" />
            {/* AI node */}
            <rect x="70" y="32" width="22" height="22" rx="6" fill="none" stroke="url(#holo-a)" strokeWidth="2.5" />
            <circle cx="76" cy="43" r="1.8" fill="url(#holo-a)" />
            <circle cx="86" cy="43" r="1.8" fill="url(#holo-a)" />
            <path d="M81 54 v10" stroke="url(#holo-a)" strokeWidth="2.5" />
            <path d="M70 78 a16 16 0 0 1 22 -3" fill="none" stroke="url(#holo-a)" strokeWidth="2.5" strokeLinecap="round" />
            {/* Connection */}
            <path d="M50 50 L70 46" stroke="#fff" strokeWidth="2" strokeDasharray="3 3" opacity="0.7" />
            <circle cx="60" cy="48" r="2.5" fill="#fff" />
          </svg>
          <span className="text-xs font-medium tracking-wide text-white/70">
            Humain · IA
          </span>
        </motion.div>
      </div>

      {/* Floating data points */}
      {[
        { top: "8%", left: "14%", d: 0 },
        { top: "18%", right: "6%", d: 1.2 },
        { bottom: "12%", left: "8%", d: 2.1 },
        { bottom: "20%", right: "12%", d: 0.6 },
      ].map((p, i) => (
        <motion.span
          key={i}
          style={p}
          animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.4, 1] }}
          transition={{ duration: 3, repeat: Infinity, delay: p.d }}
          className="absolute h-1.5 w-1.5 rounded-full bg-white"
        />
      ))}
    </div>
  );
}
