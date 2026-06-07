"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

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

/* Les 6 vraies solutions AMAVYA. */
const SERVICE_OPTIONS = [
  "Agents IA",
  "CRM intelligent",
  "Automatisation",
  "Prospection IA",
  "SaaS sur mesure",
  "Formation",
];

/* Vidéo de fond — à remplir avec ta vidéo (Higgsfield/Kling). */
const VIDEO_URL = "";

export default function MainframeHero() {
  const videoRef = useRef(null);
  const prevXRef = useRef(null);
  const targetTimeRef = useRef(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [services, setServices] = useState([]);

  const headline = "parlons de\nvotre prochain palier.";
  const { displayed, done } = useTypewriter(headline, 38, 600);

  /* Scrubbing souris (desktop ≥ 1024). */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onMove = (e) => {
      if (window.innerWidth < 1024) return;
      const duration = video.duration;
      if (!duration || Number.isNaN(duration)) return;
      if (prevXRef.current == null) {
        prevXRef.current = e.clientX;
        return;
      }
      const delta = e.clientX - prevXRef.current;
      prevXRef.current = e.clientX;
      const seek = (delta / window.innerWidth) * 0.8 * duration;
      let next = (targetTimeRef.current || video.currentTime) + seek;
      next = Math.max(0, Math.min(duration, next));
      targetTimeRef.current = next;
      try {
        video.currentTime = next;
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  /* Mobile : autoplay normal. */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.innerWidth < 1024) {
      video.autoplay = true;
      video.play().catch(() => {});
    }
  }, []);

  const toggleService = (label) => {
    setServices((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label],
    );
  };

  return (
    <div className="relative bg-[#050505] text-paper font-sans selection:bg-gold/30 selection:text-paper antialiased overflow-x-hidden flex flex-col lg:block lg:min-h-screen">
      {/* Header / Navbar */}
      <header className="fixed top-0 inset-x-0 z-20 px-5 sm:px-8 py-4 sm:py-5 flex flex-row justify-between items-center bg-transparent">
        {/* Logo AMAVYA Labs */}
        <a href="/labs" className="flex flex-row items-center gap-3" aria-label="AMAVYA Labs">
          <span className="text-[21px] sm:text-[26px] tracking-tight text-paper font-medium select-none">
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

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-row items-center text-[18px] text-paper/85">
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

        {/* Desktop CTA */}
        <a
          href="/#contact"
          className="hidden md:inline text-[18px] text-gold-bright underline underline-offset-4 decoration-gold/40 hover:decoration-gold transition-colors"
        >
          Réserver une démo
        </a>

        {/* Mobile burger */}
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

      {/* Mobile Nav Overlay */}
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

      {/* Background : vidéo si fournie, sinon halo doré subtil */}
      <div className="order-last lg:order-none relative lg:absolute lg:inset-0 lg:z-0 overflow-hidden pointer-events-none w-full aspect-square md:aspect-video lg:aspect-auto lg:h-full bg-[#050505]">
        {VIDEO_URL ? (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video
            ref={videoRef}
            src={VIDEO_URL}
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover object-right lg:object-right-bottom"
          />
        ) : (
          /* Placeholder élégant en attendant la vidéo : halo doré + grille */
          <div className="relative h-full w-full">
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 70% 60% at 75% 50%, rgba(240,210,122,0.20), transparent 70%)",
              }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(240,210,122,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(240,210,122,0.16) 1px, transparent 1px)",
                backgroundSize: "80px 80px",
              }}
            />
          </div>
        )}
      </div>

      {/* Voile sombre pour lisibilité texte sur fond vidéo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          background:
            "linear-gradient(90deg, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.65) 45%, rgba(5,5,5,0) 75%)",
        }}
      />

      {/* Content layer */}
      <div className="relative z-10 flex flex-col order-first lg:order-none w-full bg-transparent pb-8 lg:pb-0 lg:min-h-screen">
        <main
          id="amavya-labs-hero"
          className="w-full max-w-7xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-gold-bright backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-bright animate-ticker" />
              Sandbox AMAVYA
            </div>
          </motion.div>

          {/* Headline avec typewriter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              className="text-5xl md:text-6xl lg:text-[76px] font-normal tracking-tight text-paper leading-[1.05] mb-8 select-none w-full whitespace-pre-wrap"
              style={{
                fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
              }}
            >
              {displayed}
              {!done && (
                <span className="inline-block w-[3px] h-[1.1em] bg-gold-bright align-middle ml-[2px] animate-blink" />
              )}
            </h1>
          </motion.div>

          {/* Secondary description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-lg md:text-xl text-muted leading-relaxed font-light mb-14 max-w-2xl">
              Présentez-nous votre activité, vos points de friction, vos ambitions.
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
              className="text-2xl font-medium tracking-tight mb-2 text-paper"
              style={{
                fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
              }}
            >
              Quels sujets vous intéressent ?
            </h2>
            <p className="text-muted-soft mb-8 text-sm">
              Cochez tout ce qui s&apos;applique
            </p>

            <div className="flex flex-wrap gap-3">
              {SERVICE_OPTIONS.map((label) => {
                const active = services.includes(label);
                return (
                  <motion.button
                    key={label}
                    type="button"
                    onClick={() => toggleService(label)}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-[linear-gradient(110deg,#a87f2e,#f0d27a_55%,#d4af37)] text-ink shadow-[0_8px_28px_-10px_rgba(240,210,122,0.7)]"
                        : "bg-white/5 text-paper border border-white/15 hover:border-gold/40 hover:bg-white/8"
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

            {/* Feedback banner contingent */}
            <div className="mt-8">
              <AnimatePresence mode="wait">
                {services.length === 0 ? (
                  <motion.p
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.55 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="italic text-xs text-muted-soft"
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
                    <div className="bg-white/5 border border-gold/25 rounded-2xl p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
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
        </main>
      </div>
    </div>
  );
}
