"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { translations } from "@/lib/i18n";

const STORAGE_KEY = "amavya-lang";
const LangContext = createContext(null);

export default function LangProvider({ children }) {
  const [lang, setLangState] = useState("fr");

  // Lecture de la préférence au montage.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "fr" || stored === "en") {
        setLangState(stored);
      }
    } catch {
      /* localStorage indisponible : on garde le défaut. */
    }
  }, []);

  // Persistance + mise à jour de l'attribut lang du document.
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
    if (next === "fr" || next === "en") setLangState(next);
  };

  const value = { lang, setLang, t: translations[lang] };

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) {
    // Repli sûr si un composant est rendu hors provider.
    return { lang: "fr", setLang: () => {}, t: translations.fr };
  }
  return ctx;
}
