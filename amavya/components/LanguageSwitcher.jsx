"use client";

import { useLang } from "./LangProvider";

/* Drapeau français : trois bandes verticales bleu / blanc / rouge. */
function FlagFR() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" aria-hidden="true" className="block rounded-[3px]">
      <rect width="22" height="16" rx="2" fill="#FFFFFF" />
      <rect width="7.33" height="16" rx="0" fill="#0055A4" />
      <rect x="14.67" width="7.33" height="16" fill="#EF4135" />
    </svg>
  );
}

/* Drapeau du Royaume-Uni : Union Jack simplifié. */
function FlagGB() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" aria-hidden="true" className="block rounded-[3px]">
      <clipPath id="ls-gb-clip">
        <rect width="22" height="16" rx="2" />
      </clipPath>
      <g clipPath="url(#ls-gb-clip)">
        <rect width="22" height="16" fill="#012169" />
        <path d="M0 0 L22 16 M22 0 L0 16" stroke="#FFFFFF" strokeWidth="3.2" />
        <path d="M0 0 L22 16" stroke="#C8102E" strokeWidth="1.6" clipPath="url(#ls-gb-clip)" />
        <path d="M22 0 L0 16" stroke="#C8102E" strokeWidth="1.6" />
        <rect x="9" width="4" height="16" fill="#FFFFFF" />
        <rect y="6" width="22" height="4" fill="#FFFFFF" />
        <rect x="9.8" width="2.4" height="16" fill="#C8102E" />
        <rect y="6.8" width="22" height="2.4" fill="#C8102E" />
      </g>
    </svg>
  );
}

/* Drapeau espagnol : trois bandes horizontales rouge / jaune (double) / rouge. */
function FlagES() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" aria-hidden="true" className="block rounded-[3px]">
      <rect width="22" height="16" rx="2" fill="#AA151B" />
      <rect y="4" width="22" height="8" fill="#F1BF00" />
    </svg>
  );
}

const FLAGS = {
  fr: { label: "Français", Flag: FlagFR },
  en: { label: "English", Flag: FlagGB },
  es: { label: "Español", Flag: FlagES },
};

export default function LanguageSwitcher({ className = "" }) {
  const { lang, setLang } = useLang();

  const btn = (active) =>
    `flex h-7 w-9 items-center justify-center rounded-md transition-all duration-200 ${
      active ? "opacity-100 ring-1 ring-gold/50" : "opacity-50 hover:opacity-80"
    }`;

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {Object.entries(FLAGS).map(([code, { label, Flag }]) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-label={label}
          aria-pressed={lang === code}
          className={btn(lang === code)}
        >
          <Flag />
        </button>
      ))}
    </div>
  );
}
