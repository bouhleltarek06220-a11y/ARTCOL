"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "./Reveal";
import { useLang } from "./LangProvider";

export default function Founder() {
  const { t } = useLang();
  const f = t.founder;

  // Parallaxe douce : le portrait monte légèrement plus lentement que le reste au scroll.
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const portraitY = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <section
      ref={sectionRef}
      id="fondateur"
      className="relative py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5">
        <div className="glass-strong glow-ring relative overflow-hidden rounded-3xl p-8 sm:p-12">
          {/* Fond : réseau mondial doré */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/founder-bg.webp"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-95 brightness-110 contrast-110 saturate-150"
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,rgba(8,8,11,0.3),rgba(8,8,11,0.45)_50%,rgba(8,8,11,0.72))]" />

          {/* Lueur d'ambiance — respiration douce */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(168,127,46,0.4),transparent_70%)] blur-3xl"
            animate={{ opacity: [0.55, 1, 0.55], scale: [0.95, 1.1, 0.95] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative grid items-center gap-10 lg:grid-cols-[auto_1fr]">
            {/* Portrait premium avec parallaxe et halo respirant */}
            <Reveal>
              <motion.div style={{ y: portraitY }} className="relative mx-auto">
                <motion.div
                  className="absolute -inset-3 rounded-3xl bg-[linear-gradient(135deg,#a87f2e,#d4af37)] blur-xl"
                  animate={{ opacity: [0.35, 0.55, 0.35] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="group relative flex h-44 w-44 items-center justify-center overflow-hidden rounded-3xl border border-gold/20 bg-[linear-gradient(160deg,#17171b,#0a0a0b)] transition-transform duration-700 hover:scale-[1.03] sm:h-52 sm:w-52">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/founder.webp"
                    alt="Tarek Bouhlel, fondateur d'AMAVYA"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  {/* Reflet doré qui passe au survol */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent_30%,rgba(240,210,122,0.18)_50%,transparent_70%)] transition-transform duration-1000 group-hover:translate-x-full"
                  />
                </div>
              </motion.div>
            </Reveal>

            {/* Texte */}
            <div className="flex flex-col gap-5">
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-bright animate-ticker" />
                  {f.eyebrow}
                </span>
              </Reveal>

              <Reveal delay={0.05}>
                <h2 className="text-3xl font-semibold sm:text-4xl">{f.name}</h2>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="text-pretty text-lg leading-relaxed text-muted">
                  {f.paragraphLead}{" "}
                  <span className="text-paper">{f.paragraphHighlight}</span>
                </p>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="flex flex-wrap gap-2.5">
                  {f.facets.map((facet, i) => (
                    <motion.span
                      key={facet}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{
                        duration: 0.5,
                        delay: 0.25 + i * 0.07,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      whileHover={{ y: -2, borderColor: "rgba(240,210,122,0.4)" }}
                      className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-paper/80 transition-colors"
                    >
                      {facet}
                    </motion.span>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="mt-1 flex flex-col gap-3">
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-soft">
                    {f.contactLabel}
                  </span>
                  <div className="flex items-center gap-3">
                    <SocialLink
                      href="https://www.linkedin.com/in/tarek-bouhlel"
                      label="LinkedIn"
                      hoverBg="rgba(10,102,194,0.18)"
                    >
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6.94 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM3.5 8.5h3V21h-3zM10 8.5h2.9v1.7h.04c.4-.76 1.4-1.56 2.9-1.56 3.1 0 3.66 2 3.66 4.7V21h-3v-5.2c0-1.24-.02-2.84-1.74-2.84-1.74 0-2 1.36-2 2.76V21h-3z" />
                      </svg>
                    </SocialLink>
                    <SocialLink
                      href="https://wa.me/33665687757"
                      label="WhatsApp"
                      hoverBg="rgba(37,211,102,0.18)"
                    >
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.1.55 4.15 1.6 5.96L2 22l4.25-1.69c1.74.95 3.7 1.45 5.7 1.45h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.8 14.13c-.24.68-1.42 1.32-1.96 1.36-.5.05-.97.23-3.27-.68-2.76-1.09-4.51-3.92-4.65-4.1-.14-.18-1.12-1.48-1.12-2.83 0-1.35.71-2.01.96-2.29.24-.27.53-.34.71-.34l.5.01c.16.01.38-.06.59.45.24.58.81 2 .88 2.14.07.14.12.3.02.48-.09.18-.14.3-.27.45l-.41.48c-.14.14-.28.29-.12.57.16.27.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.21 1.37.27.14.43.12.59-.07.16-.18.68-.79.86-1.06.18-.27.36-.23.61-.14.25.09 1.59.75 1.86.89.27.14.45.2.52.32.07.11.07.66-.17 1.34z" />
                      </svg>
                    </SocialLink>
                    <SocialLink
                      href="mailto:contact@amavya.cloud"
                      label="Email"
                      hoverBg="rgba(240,210,122,0.18)"
                    >
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 2v.4l8 5 8-5V6H4zm16 2.45-7.47 4.67a1 1 0 0 1-1.06 0L4 8.45V18h16V8.45z" />
                      </svg>
                    </SocialLink>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Bouton social avec micro-couleur de marque au hover + élévation. */
function SocialLink({ href, label, hoverBg, children }) {
  const isExternal = href.startsWith("http");
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      aria-label={label}
      className="group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 text-muted transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:text-paper hover:shadow-[0_8px_24px_-8px_rgba(240,210,122,0.5)]"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: hoverBg }}
      />
      <span className="relative">{children}</span>
    </a>
  );
}
