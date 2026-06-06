"use client";

import { motion } from "framer-motion";
import Reveal from "./Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}) {
  const alignment =
    align === "center" ? "items-center text-center mx-auto" : "items-start text-left";
  return (
    <div className={`flex max-w-2xl flex-col gap-4 ${alignment}`}>
      {eyebrow && (
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-bright animate-ticker" />
            {eyebrow}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className="text-balance text-3xl font-semibold leading-tight sm:text-4xl md:text-[2.75rem]">
          {title}
        </h2>
      </Reveal>
      {/* Trait fin doré qui s'étend sous le titre */}
      <motion.div
        aria-hidden="true"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: align === "center" ? "center" : "left" }}
        className="h-px w-16 bg-[linear-gradient(90deg,transparent,rgba(240,210,122,0.7),transparent)]"
      />
      {description && (
        <Reveal delay={0.15}>
          <p className="text-pretty text-base leading-relaxed text-muted sm:text-lg">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
