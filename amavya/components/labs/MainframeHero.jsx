"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { SplineScene } from "@/components/ui/splite";
import LabsCodeBackground from "./LabsCodeBackground";

/* Même scène Spline que /matrix : humanoïde 3D qui suit le curseur. */
const SPLINE_SCENE = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

/* Hook custom : tape une chaîne caractère par caractère.
   Retourne { displayed, done }. */
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

const SERVICE_OPTIONS = [
  "Agents IA",
  "CRM intelligent",
  "Automatisation",
  "Prospection IA",
  "SaaS sur mesure",
  "Formation",
];

/**
 * Humanoïde ancré à droite + tracking du curseur sur TOUT l'écran.
 *
 * Idée : le canvas Spline est positionné dans la moitié droite (figure
 * naturellement centrée dans le canvas → visible à ~72% horizontal).
 * Le conteneur a `pointer-events: none` pour ne pas bloquer les clics
 * du formulaire. On écoute la souris au niveau de la fenêtre et on
 * dispatch un PointerEvent synthétique sur le <canvas> avec la position
 * réelle du curseur (clientX/Y inchangés). Spline calcule alors sa
 * rotation par rapport à son bounding rect → la tête regarde dans la
 * direction du curseur quel que soit l'endroit où il est sur l'écran.
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [services, setServices] = useState([]);

  const headline = "parlons de\nvotre prochain palier.";
  const { displayed, done } = useTypewriter(headline, 38, 600);

  const toggleService = (label) => {
    setServices((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label],
    );
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-paper font-sans selection:bg-gold/30 selection:text-paper antialiased overflow-x-hidden">
      {/* ===== Fond global (z-0) : code coloré qui défile derrière TOUT ===== */}
      <LabsCodeBackground />

      {/* Voile noir global pour atténuer le code et garantir la lisibilité (z-1) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] hidden bg-black/55 lg:block"
      />

      {/* ===== Humanoïde Spline (z-2) : ancré à DROITE, suit le curseur global ===== */}
      <SplineHumanoidRight scene={SPLINE_SCENE} />


      {/* Voile dégradé gauche pour le formulaire (z-3) — assombrit derrière
          le texte sans découper visuellement, l'humanoïde reste bien visible
          à droite. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[3] hidden lg:block"
        style={{
          background:
            "linear-gradient(90deg, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.78) 28%, rgba(5,5,5,0.4) 50%, rgba(5,5,5,0) 75%)",
        }}
      />

      {/* ===== Navbar (z-20) ===== */}
      <header className="fixed top-0 inset-x-0 z-20 px-5 sm:px-8 py-4 sm:py-5 flex flex-row justify-between items-center bg-transparent">
        <a href="/labs" className="flex flex-row items-center gap-3" aria-label="AMAVYA Labs">
          <span className="text-[21px] sm:text-[26px] tracking-tight text-paper font-medium select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            AMAVYA Labs
          </span>
          <span
            className="text-[25px] sm:text-[30px] select-none tracking-[-0.02em] font-medium leading-none mb-1"
            style={{
              background:
                "linear-gradient(110deg, #a87f2e, #f0d27a 55%, #d4af37)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            &#10033;
          </span>
        </a>

        <nav className="hidden md:flex flex-row items-center text-[18px] text-paper drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          {[
            { label: "Accueil", href: "/" },
            { label: "Solutions", href: "/#services" },
            { label: "Cosmos", href: "/blog" },
            { label: "Showreel", href: "/showreel" },
          ].map((link, i, arr) => (
            <span key={link.href} className="flex items-center">
              <a
                href={link.href}
                className="hover:text-gold-bright transition-colors"
              >
                {link.label}
              </a>
              {i < arr.length - 1 && (
                <span className="opacity-30">,&nbsp;</span>
              )}
            </span>
          ))}
        </nav>

        <a
          href="/#contact"
          className="hidden md:inline text-[18px] text-gold-bright underline underline-offset-4 decoration-gold/40 hover:decoration-gold transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
        >
          Réserver une démo
        </a>

        <button
          type="button"
          aria-label="Ouvrir le menu"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          className="md:hidden flex flex-col items-center justify-center gap-1.5 p-2"
        >
          <span
            className={`block w-6 h-[2px] bg-paper transition-all duration-300 ${
              isMobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span
            className={`block w-6 h-[2px] bg-paper transition-all duration-300 ${
              isMobileMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-[2px] bg-paper transition-all duration-300 ${
              isMobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </button>
      </header>

      {/* Mobile Nav Overlay (z-19) */}
      <div
        className={`md:hidden fixed inset-0 z-[19] bg-black/95 backdrop-blur transition-opacity duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex h-full flex-col items-center justify-center gap-8 text-2xl text-paper">
          {[
            { label: "Accueil", href: "/" },
            { label: "Solutions", href: "/#services" },
            { label: "Cosmos", href: "/blog" },
            { label: "Showreel", href: "/showreel" },
            { label: "Réserver une démo", href: "/#contact" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-gold-bright transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      {/* ===== Contenu (z-10) : formulaire à gauche, l'humanoïde derrière à droite reste bien visible ===== */}
      <div className="relative z-10 flex min-h-screen w-full flex-col">
        <main
          id="amavya-labs-hero"
          className="pointer-events-none flex w-full flex-1 items-center px-6 pt-32 pb-12 sm:px-10 lg:pt-0"
        >
          <div className="pointer-events-auto w-full max-w-2xl lg:max-w-xl lg:ml-[4vw] xl:ml-[8vw]">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-black/60 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-gold-bright backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-bright animate-ticker" />
                Sandbox AMAVYA
              </div>
            </motion.div>

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
                ambitions.
                <br />
                Nous revenons avec un plan concret — généralement sous 24 heures.
              </p>
            </motion.div>

            {/* Service pills */}
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
                Quels sujets vous intéressent ?
              </h2>
              <p
                className="text-muted-soft mb-6 text-sm"
                style={{ textShadow: "0 2px 12px rgba(0,0,0,0.85)" }}
              >
                Cochez tout ce qui s&apos;applique
              </p>

              <div className="flex flex-wrap gap-2.5">
                {SERVICE_OPTIONS.map((label) => {
                  const active = services.includes(label);
                  return (
                    <motion.button
                      key={label}
                      type="button"
                      onClick={() => toggleService(label)}
                      whileTap={{ scale: 0.97 }}
                      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium backdrop-blur transition-colors ${
                        active
                          ? "bg-[linear-gradient(110deg,#a87f2e,#f0d27a_55%,#d4af37)] text-ink shadow-[0_8px_28px_-10px_rgba(240,210,122,0.7)]"
                          : "bg-black/60 text-paper border border-white/15 hover:border-gold/40 hover:bg-black/75"
                      }`}
                      aria-pressed={active}
                    >
                      <AnimatePresence>
                        {active && (
                          <motion.span
                            key="check"
                            initial={{ scale: 0, y: -6, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="inline-flex"
                          >
                            <Check className="h-4 w-4" strokeWidth={2.5} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                      <span>{label}</span>
                    </motion.button>
                  );
                })}
              </div>

              <div className="mt-6">
                <AnimatePresence mode="wait">
                  {services.length === 0 ? (
                    <motion.p
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="italic text-xs text-paper/70"
                      style={{ textShadow: "0 2px 10px rgba(0,0,0,0.85)" }}
                    >
                      Sélectionnez un ou plusieurs sujets ci-dessus.
                    </motion.p>
                  ) : (
                    <motion.div
                      key="active"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 24 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-black/70 backdrop-blur border border-gold/30 rounded-2xl p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
                        <p className="text-sm text-paper">
                          Sujet(s) sélectionné(s) :{" "}
                          <span className="font-medium text-gold-bright">
                            {services.join(", ")}
                          </span>
                        </p>
                        <a
                          href="/#contact"
                          className="flex items-center gap-1.5 self-start rounded-full bg-[linear-gradient(110deg,#a87f2e,#f0d27a_55%,#d4af37)] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ink shadow-[0_8px_28px_-10px_rgba(240,210,122,0.7)] transition-transform duration-300 hover:-translate-y-0.5 sm:self-auto"
                        >
                          Demander un échange
                          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
