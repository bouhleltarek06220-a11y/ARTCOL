"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SplineScene } from "@/components/ui/splite";
import Navbar from "@/components/Navbar";
import LabsCodeBackground from "./LabsCodeBackground";
import ServiceDetailModal from "./ServiceDetailModal";
import { LABS_SERVICES } from "@/lib/labs-services";

const SPLINE_SCENE = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

/* Hook custom : tape une chaîne caractère par caractère. */
function useTypewriter(text, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let cancelled = false;
    const startTimer = setTimeout(() => {
      let i = 0;
      const id = setInterval(() => {
        if (cancelled) {
          clearInterval(id);
          return;
        }
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(id);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(id);
    }, startDelay);
    return () => {
      cancelled = true;
      clearTimeout(startTimer);
    };
  }, [text, speed, startDelay]);
  return { displayed, done };
}

/**
 * Humanoïde ancré à droite + tracking du curseur sur TOUT l'écran.
 * Le canvas est positionné à droite, pointer-events: none.
 * Un listener window pointermove dispatche des événements synthétiques
 * sur le <canvas> pour que la tête suive le curseur quel que soit
 * l'endroit où il est sur l'écran.
 */
function SplineHumanoidRight({ scene }) {
  const wrapperRef = useRef(null);
  const frameRef = useRef(0);
  const canvasRef = useRef(null);

  useEffect(() => {
    const tryFindCanvas = () => {
      const wrap = wrapperRef.current;
      if (!wrap) return null;
      return wrap.querySelector("canvas");
    };

    const dispatchSynthetic = (e) => {
      if (!canvasRef.current) canvasRef.current = tryFindCanvas();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ev = new PointerEvent("pointermove", {
        clientX: e.clientX,
        clientY: e.clientY,
        bubbles: false,
        cancelable: true,
        pointerType: "mouse",
        isPrimary: true,
      });
      canvas.dispatchEvent(ev);
    };

    const onMove = (e) => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => dispatchSynthetic(e));
    };

    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-none absolute inset-y-0 right-0 z-[2] hidden h-full w-[58vw] lg:block"
      aria-hidden="true"
    >
      <SplineScene scene={scene} className="h-full w-full" />
    </div>
  );
}

export default function MainframeHero() {
  const [openService, setOpenService] = useState(null);

  const headline = "parlons de\nvotre prochain palier.";
  const { displayed, done } = useTypewriter(headline, 38, 600);

  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-paper font-sans selection:bg-gold/30 selection:text-paper antialiased overflow-x-hidden">
      {/* z-0 : code coloré qui défile en fond global */}
      <LabsCodeBackground />

      {/* z-1 : voile noir 55% pour atténuer le code */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] hidden bg-black/55 lg:block"
      />

      {/* z-2 : humanoïde Spline à droite, suit le curseur global */}
      <SplineHumanoidRight scene={SPLINE_SCENE} />

      {/* z-3 : voile dégradé gauche pour la lisibilité du formulaire */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[3] hidden lg:block"
        style={{
          background:
            "linear-gradient(90deg, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.78) 28%, rgba(5,5,5,0.4) 50%, rgba(5,5,5,0) 75%)",
        }}
      />

      {/* z-50 : Navbar officielle AMAVYA (Logo, Langue, CTA Réserver une démo) */}
      <Navbar />

      {/* z-10 : Contenu (formulaire à gauche) */}
      <div className="relative z-10 flex min-h-screen w-full flex-col">
        <main
          id="amavya-labs-hero"
          className="pointer-events-none flex w-full flex-1 items-center px-6 pt-32 pb-12 sm:px-10 lg:pt-0"
        >
          <div className="pointer-events-auto w-full max-w-2xl lg:max-w-xl lg:ml-[4vw] xl:ml-[8vw]">
            {/* Headline typewriter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1
                className="text-4xl md:text-5xl lg:text-[64px] font-normal tracking-tight text-paper leading-[1.05] mb-7 select-none w-full whitespace-pre-wrap"
                style={{
                  fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                  textShadow: "0 4px 24px rgba(0,0,0,0.85)",
                }}
              >
                {displayed}
                {!done && (
                  <span className="inline-block w-[3px] h-[1.05em] bg-gold-bright align-middle ml-[2px] animate-blink" />
                )}
              </h1>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p
                className="text-base md:text-lg text-paper/85 leading-relaxed font-light mb-10 max-w-xl"
                style={{ textShadow: "0 2px 12px rgba(0,0,0,0.85)" }}
              >
                Présentez-nous votre activité, vos points de friction, vos
                ambitions. Nous revenons avec un plan concret — généralement
                sous 24 heures.
              </p>
            </motion.div>

            {/* Pills services — CLIC = ouvre la modale détaillée */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2
                className="text-xl md:text-2xl font-medium tracking-tight mb-2 text-paper"
                style={{
                  fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                  textShadow: "0 2px 12px rgba(0,0,0,0.85)",
                }}
              >
                Cliquez pour découvrir nos solutions
              </h2>
              <p
                className="text-muted-soft mb-6 text-sm"
                style={{ textShadow: "0 2px 12px rgba(0,0,0,0.85)" }}
              >
                Chaque solution s&apos;adapte à votre secteur d&apos;activité.
              </p>

              <div className="flex flex-wrap gap-2.5">
                {LABS_SERVICES.map((service) => (
                  <motion.button
                    key={service.id}
                    type="button"
                    onClick={() => setOpenService(service)}
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ y: -2 }}
                    className="group relative flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-4 py-2 text-sm font-medium text-paper backdrop-blur transition-all hover:border-gold/50 hover:bg-black/75 hover:shadow-[0_8px_24px_-10px_rgba(240,210,122,0.5)]"
                  >
                    {/* Pastille pulsante dorée pour signaler "cliquable" */}
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-bright opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold-bright" />
                    </span>
                    <span>{service.label}</span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-gold-bright transition-transform duration-300 group-hover:translate-x-0.5"
                    >
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Modale détaillée du service cliqué */}
      <ServiceDetailModal
        service={openService}
        onClose={() => setOpenService(null)}
      />
    </div>
  );
}
