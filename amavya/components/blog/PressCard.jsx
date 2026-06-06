"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/components/LangProvider";
import { PRESS_UI } from "@/lib/press-coverage";

export default function PressCard({ item, onClose }) {
  const { lang } = useLang();
  const t = PRESS_UI[lang] || PRESS_UI.fr;

  useEffect(() => {
    if (!item) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [item, onClose]);

  const isRTL = item?.lang === "ar";
  const isCJK = item?.lang === "ja" || item?.lang === "zh";

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
        >
          <button
            type="button"
            aria-label={t.closeLabel}
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border border-gold/30 bg-black/85 p-6 backdrop-blur-xl shadow-[0_28px_80px_-20px_rgba(212,175,55,0.55)] sm:p-8"
            dir={isRTL ? "rtl" : "ltr"}
            lang={item.lang}
            style={{
              fontFamily: isCJK
                ? "system-ui, 'Noto Sans CJK JP', 'Hiragino Sans', sans-serif"
                : isRTL
                  ? "system-ui, 'Noto Sans Arabic', sans-serif"
                  : undefined,
            }}
          >
            {/* Bouton fermer */}
            <button
              type="button"
              aria-label={t.closeLabel}
              onClick={onClose}
              className={`absolute top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-muted transition-colors hover:text-paper ${
                isRTL ? "left-4" : "right-4"
              }`}
              dir="ltr"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* DRAPEAU XL en haut centré */}
            <div
              className="mb-4 flex flex-col items-center gap-2 text-center"
              dir="ltr"
            >
              <div
                aria-hidden="true"
                className="text-6xl leading-none drop-shadow-[0_8px_24px_rgba(0,0,0,0.7)] sm:text-7xl"
                style={{ filter: "drop-shadow(0 0 12px rgba(240,210,122,0.25))" }}
              >
                {item.countryFlag}
              </div>
              <div className="text-[10px] uppercase tracking-[0.32em] text-gold-bright">
                {t.eyebrow}
              </div>
            </div>

            {/* Ville · pays */}
            <div
              className="text-center text-sm font-medium uppercase tracking-[0.18em] text-paper/90"
              dir="ltr"
            >
              {item.city} · {item.country}
            </div>

            {/* Source + date */}
            <div
              className={`mt-1 text-center text-xs text-muted ${isRTL ? "" : ""}`}
              dir="ltr"
            >
              {item.source} · {item.date}
            </div>

            {/* Titre dans la langue d'origine */}
            <h2
              className={`mt-5 text-balance text-xl font-semibold leading-snug text-paper sm:text-2xl ${
                isCJK ? "leading-relaxed" : ""
              } ${isRTL ? "text-right" : ""}`}
            >
              {item.title}
            </h2>

            {/* Résumé dans la langue d'origine */}
            <p
              className={`mt-4 leading-relaxed text-muted ${
                isCJK ? "text-sm leading-loose" : "text-sm"
              } ${isRTL ? "text-right" : ""}`}
            >
              {item.summary}
            </p>

            {/* Trait fin doré */}
            <div className="my-6 h-px bg-[linear-gradient(90deg,transparent,rgba(240,210,122,0.5),transparent)]" />

            {/* CTA vers la source originale */}
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              dir="ltr"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(110deg,#a87f2e,#f0d27a_55%,#d4af37)] px-5 py-3 text-sm font-semibold text-ink shadow-[0_8px_40px_-12px_rgba(212,175,55,0.7)] transition-all hover:-translate-y-0.5"
            >
              {item.ctaText || t.defaultCta}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              >
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            {/* Mention légale courte */}
            <p
              className={`mt-5 text-[10px] uppercase tracking-wider text-muted-soft ${isRTL ? "text-right" : ""}`}
            >
              {t.legalNote}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
