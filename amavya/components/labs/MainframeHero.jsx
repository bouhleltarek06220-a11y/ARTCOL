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

const SERVICE_OPTIONS = ["Brand", "Digital", "Campaign", "Other"];
/* À remplacer par TA vidéo MP4 (Higgsfield/Kling/CloudFront perso).
   Mettre dans /public/labs/hero.mp4 puis pointer ici, ou passer une URL
   complète. Laisser vide affiche un fond clair sans vidéo. */
const VIDEO_URL = "";

export default function MainframeHero() {
  const videoRef = useRef(null);
  const prevXRef = useRef(null);
  const targetTimeRef = useRef(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [services, setServices] = useState([]);

  const headline = "let's build\nyour next move.";
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
    const onSeeked = () => {
      /* hook synchro : confirme la position courante */
    };
    window.addEventListener("mousemove", onMove);
    video.addEventListener("seeked", onSeeked);
    return () => {
      window.removeEventListener("mousemove", onMove);
      video.removeEventListener("seeked", onSeeked);
    };
  }, []);

  /* Mobile : autoplay normal car le scrubbing est désactivé. */
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
    <div className="relative bg-white text-neutral-900 font-sans selection:bg-[#EAECE9] selection:text-[#1C2E1E] antialiased overflow-x-hidden flex flex-col lg:block lg:min-h-screen">
      {/* Header / Navbar */}
      <header className="fixed top-0 inset-x-0 z-10 px-5 sm:px-8 py-4 sm:py-5 flex flex-row justify-between items-center bg-transparent">
        {/* Logo AMAVYA Labs */}
        <a href="/labs" className="flex flex-row items-center gap-3" aria-label="AMAVYA Labs">
          <span className="text-[21px] sm:text-[26px] tracking-tight text-black font-medium select-none">
            AMAVYA Labs
          </span>
          <span className="text-[25px] sm:text-[30px] text-black select-none tracking-[-0.02em] font-medium leading-none mb-1">
            &#10033;
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-row items-center text-[23px] text-black">
          {["Labs", "Studio", "Openings", "Shop"].map((link, i, arr) => (
            <span key={link} className="flex items-center">
              <a
                href="#"
                className="hover:opacity-60 transition-opacity"
              >
                {link}
              </a>
              {i < arr.length - 1 && (
                <span className="opacity-40">,&nbsp;</span>
              )}
            </span>
          ))}
        </nav>

        {/* Desktop CTA */}
        <a
          href="#"
          className="hidden md:inline text-[23px] text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
        >
          Get in touch
        </a>

        {/* Mobile burger */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          className="md:hidden flex flex-col items-center justify-center gap-1.5 p-2"
        >
          <span
            className={`block w-6 h-[2px] bg-black transition-all duration-300 ${
              isMobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span
            className={`block w-6 h-[2px] bg-black transition-all duration-300 ${
              isMobileMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-[2px] bg-black transition-all duration-300 ${
              isMobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </button>
      </header>

      {/* Mobile Nav Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-[9] bg-white/95 backdrop-blur-sm transition-opacity duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex h-full flex-col items-center justify-center gap-8 text-3xl text-black">
          {["Labs", "Studio", "Openings", "Shop", "Get in touch"].map((link) => (
            <a
              key={link}
              href="#"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:opacity-60 transition-opacity"
            >
              {link}
            </a>
          ))}
        </nav>
      </div>

      {/* Background video */}
      <div className="order-last lg:order-none relative lg:absolute lg:inset-0 lg:z-0 overflow-hidden pointer-events-none w-full aspect-square md:aspect-video lg:aspect-auto lg:h-full bg-neutral-50 lg:bg-transparent">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          ref={videoRef}
          src={VIDEO_URL}
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-right lg:object-right-bottom"
        />
      </div>

      {/* Content layer */}
      <div className="relative z-10 flex flex-col order-first lg:order-none w-full bg-white lg:bg-transparent pb-8 lg:pb-0 lg:min-h-screen">
        <main
          id="spade-hero"
          className="w-full max-w-7xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center"
        >
          {/* Headline avec typewriter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-[76px] font-normal tracking-tight text-black leading-[1.08] mb-8 select-none w-full whitespace-pre-wrap">
              {displayed}
              {!done && (
                <span className="inline-block w-[2px] h-[1.1em] bg-black align-middle ml-[2px] animate-blink" />
              )}
            </h1>
          </motion.div>

          {/* Secondary description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-lg md:text-xl text-[#5A635A] leading-relaxed font-normal mb-14 max-w-2xl">
              Tell us about your business, your bottlenecks, your ambitions.
              <br />
              We&apos;ll come back with a concrete plan — usually within 24 hours.
            </p>
          </motion.div>

          {/* Service pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-medium tracking-tight mb-2">
              What sort of service?
            </h2>
            <p className="opacity-85 text-[#738273] mb-8">
              Select all that apply
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
                        ? "bg-[#1C2E1E] text-white shadow-md shadow-emerald-950/5 transform"
                        : "bg-white text-[#1C2E1E] border border-[#F1F3F1] hover:bg-[#F1F3F1]/55"
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
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="italic text-xs text-neutral-700"
                    style={{ opacity: 0.5 }}
                  >
                    Please click to select services above.
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
                    <div className="bg-[#FAFBF9] border border-[#EAECE9] rounded-2xl p-5 flex items-center justify-between gap-4">
                      <p className="text-sm text-[#1C2E1E]">
                        Ready to inquire about:{" "}
                        <span className="font-medium">
                          {services.join(", ")}
                        </span>
                      </p>
                      <button
                        type="button"
                        className="flex items-center gap-1.5 text-[#4D6D47] uppercase text-xs font-medium tracking-wider hover:opacity-70 transition-opacity"
                      >
                        Let&apos;s Go
                        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </button>
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
