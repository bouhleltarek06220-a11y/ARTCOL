"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { translations, SUPPORTED_LANGS } from "@/lib/i18n";

const STORAGE_KEY = "amavya-lang";
const DEFAULT_LANG = "fr";
const LangContext = createContext(null);

function detectBrowserLang() {
  if (typeof navigator === "undefined") return DEFAULT_LANG;
  const candidates = [
    ...(Array.isArray(navigator.languages) ? navigator.languages : []),
    navigator.language,
  ].filter(Boolean);
  for (const raw of candidates) {
    const code = String(raw).toLowerCase().split("-")[0];
    if (SUPPORTED_LANGS.includes(code)) return code;
  }
  return DEFAULT_LANG;
}

export default function LangProvider({ children }) {
  const [lang, setLangState] = useState(DEFAULT_LANG);

  // 1er chargement : préférence sauvegardée > langue navigateur > FR.
  useEffect(() => {
    let chosen = null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (SUPPORTED_LANGS.includes(stored)) chosen = stored;
    } catch {
      /* localStorage indisponible */
    }
    if (!chosen) chosen = detectBrowserLang();
    if (chosen !== DEFAULT_LANG) setLangState(chosen);
  }, []);

  // Persistance + maj de l'attribut lang du document (a11y + SEO).
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = (next) => {
    if (SUPPORTED_LANGS.includes(next)) setLangState(next);
  };

  const value = { lang, setLang, t: translations[lang] || translations[DEFAULT_LANG] };

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) {
    // Repli sûr si un composant est rendu hors provider.
    return { lang: DEFAULT_LANG, setLang: () => {}, t: translations[DEFAULT_LANG] };
  }
  return ctx;
}
