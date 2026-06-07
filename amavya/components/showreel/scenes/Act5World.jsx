"use client";

import "flag-icons/css/flag-icons.min.css";
import { motion } from "framer-motion";
import Marquee from "../ui/Marquee";
import BlurFade from "../ui/BlurFade";
import TextGenerateEffect from "../ui/TextGenerateEffect";

const FLAGS = [
  "fr", "us", "ca", "es", "it", "gb", "ru", "cn", "jp", "eg",
  "in", "th", "au", "mx", "cl", "br", "za", "ke", "be", "ar",
];

/**
 * Acte 5 — LE MONDE
 * Au lieu d'un globe 3D complet (poids), on présente un grand cercle
 * stylisé avec drapeaux qui défilent + titres journaux + texte final.
 */
export default function Act5World({ t }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#020208]">
      {/* Eyebrow */}
      <BlurFade delay={0.3} duration={0.8}>
        <div className="absolute inset-x-0 top-[10%] z-10 text-center text-[10px] uppercase tracking-[0.45em] text-gold-bright">
          {t.act5.pre}
        </div>
      </BlurFade>

      {/* Anneau d'orbite avec drapeaux qui flottent */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="relative h-[55vmin] w-[55vmin]"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full border border-gold/30"
            style={{
              boxShadow: "0 0 80px -10px rgba(240,210,122,0.4) inset",
            }}
          />
          {FLAGS.map((code, i) => {
            const angle = (i * 360) / FLAGS.length;
            return (
              <div
                key={code + i}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `rotate(${angle}deg) translateY(-27.5vmin) rotate(-${angle}deg)`,
                }}
              >
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.4 + i * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`fi fi-${code} fis block`}
                  style={{
                    width: "3rem",
                    height: "3rem",
                    borderRadius: "12px",
                    boxShadow:
                      "0 6px 18px -4px rgba(0,0,0,0.7), 0 0 0 1px rgba(240,210,122,0.4)",
                    backgroundSize: "cover",
                  }}
                />
              </div>
            );
          })}

          {/* Centre : disque or */}
          <motion.div
            className="absolute left-1/2 top-1/2 h-[16vmin] w-[16vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 35% 35%, #f8e8b8, #a87f2e 80%)",
              boxShadow:
                "0 0 50px rgba(240,210,122,0.6), inset -8px -12px 18px rgba(0,0,0,0.4)",
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </div>

      {/* Texte final */}
      <motion.div
        className="absolute inset-x-0 bottom-[18%] z-10 text-center"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 5.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="text-[5vmin] font-bold leading-[1.05] text-paper sm:text-4xl"
          style={{
            fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
          }}
        >
          <div>
            <TextGenerateEffect words={t.act5.title} stagger={0.07} delay={5.8} />
          </div>
          <div className="mt-1">
            <TextGenerateEffect
              words={t.act5.title2}
              stagger={0.07}
              delay={6.7}
              className="bg-[linear-gradient(110deg,#a87f2e,#f0d27a_50%,#d4af37)] bg-clip-text text-transparent"
            />
          </div>
        </div>
      </motion.div>

      {/* Marquee des titres en bas */}
      <div className="absolute inset-x-0 bottom-[8%] z-10 hidden md:block">
        <Marquee
          durationS={22}
          itemClassName="text-xs uppercase tracking-[0.35em] text-paper/70"
          items={t.act5.ticker}
        />
      </div>
    </div>
  );
}
