"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "./LangProvider";

/**
 * Formulaire de contact AMAVYA. S'ouvre quand l'URL passe à #contact.
 * Les soumissions vont vers /api/contact qui : sauve le lead dans Supabase
 * (CRM) ET envoie une notification email sur contact@amavya.cloud.
 *
 * 4 champs de qualification (FR) servent à pré-qualifier le lead avant
 * rappel : type d'entreprise, secteur d'activité, ville, code postal.
 * Ces infos sont concaténées dans le champ `message` côté API pour ne
 * pas toucher au schéma Supabase existant.
 */
const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY = {
  full_name: "",
  email: "",
  phone: "",
  company: "",
  type_entreprise: "",
  secteur: "",
  ville: "",
  code_postal: "",
  message: "",
};

// Listes FR — affichées tel quel quel que soit `lang` (le marché cible est PACA)
const TYPES_ENTREPRISE = [
  "Artisan",
  "Indépendant / Freelance",
  "TPE (1-9 salariés)",
  "PME (10-49 salariés)",
  "Commerce / Boutique",
  "Profession libérale",
  "Association",
  "Autre",
];

const SECTEURS = [
  "BTP / Travaux",
  "Plomberie / Chauffage",
  "Électricité",
  "Menuiserie / Ébénisterie",
  "Auto / Moto / Garage",
  "Restauration / Hôtellerie",
  "Beauté / Bien-être / Coiffure",
  "Santé / Paramédical",
  "Services aux entreprises",
  "Commerce / Distribution",
  "Immobilier",
  "Conseil / Formation",
  "Numérique / Tech",
  "Autre",
];

export default function ContactModal() {
  const { t } = useLang();
  const c = t.contact;
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [hp, setHp] = useState("");

  const close = useCallback(() => {
    setOpen(false);
    if (window.location.hash === "#contact") {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, []);

  useEffect(() => {
    const sync = () => setOpen(window.location.hash === "#contact");
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  const validateField = (k, v) => {
    const s = (v || "").trim();
    if (k === "full_name" && s.length < 2) return c.errors.fullName;
    if (k === "email" && !EMAIL_RX.test(s)) return c.errors.email;
    if (k === "message" && s.length < 2) return c.errors.message;
    if (k === "code_postal" && s.length > 0 && !/^\d{5}$/.test(s)) return "Code postal à 5 chiffres.";
    return null;
  };

  const set = (k) => (e) => {
    const v = e.target.value;
    setData((d) => ({ ...d, [k]: v }));
    setErrors((er) => {
      if (!er[k]) return er;
      const msg = validateField(k, v);
      if (msg) return er;
      const { [k]: _drop, ...rest } = er;
      return rest;
    });
  };

  const blur = (k) => () => {
    const msg = validateField(k, data[k]);
    setErrors((er) => {
      if (msg) return { ...er, [k]: msg };
      const { [k]: _drop, ...rest } = er;
      return rest;
    });
  };

  const validate = () => {
    const er = {};
    ["full_name", "email", "message", "code_postal"].forEach((k) => {
      const m = validateField(k, data[k]);
      if (m) er[k] = m;
    });
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (status === "loading") return;
    if (!validate()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          company: data.company,
          type_entreprise: data.type_entreprise,
          secteur: data.secteur,
          ville: data.ville,
          code_postal: data.code_postal,
          message: data.message,
          honeypot: hp,
          page_url: location.href,
          referrer: document.referrer,
        }),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      setStatus("success");
      setData(EMPTY);
    } catch (err) {
      console.error("[AMAVYA] contact submit error", err);
      setStatus("error");
    }
  };

  const field =
    "w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-paper placeholder:text-muted-soft outline-none transition-colors focus:border-gold/60";
  const selectField = `${field} appearance-none cursor-pointer pr-10`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={c.dialogAria}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={close} />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-gold/20 p-7 sm:p-9"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/form-bg.webp"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgba(6,9,18,0.86),rgba(6,9,18,0.78))]" />

            <button
              type="button"
              aria-label={c.closeAria}
              onClick={close}
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-muted transition-colors hover:text-paper"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            <div className="relative z-10">
              {status === "success" ? (
                <div className="flex flex-col items-center gap-4 py-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12.5l4.5 4.5L19 7.5" stroke="#f0d27a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gradient">{c.success.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{c.success.text}</p>
                  <button
                    type="button"
                    onClick={close}
                    className="mt-2 rounded-full border border-white/10 px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-white/5"
                  >
                    {c.success.close}
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-gold-bright">
                    {c.eyebrow}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold sm:text-3xl">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{c.subtitle}</p>

                  <form onSubmit={submit} className="mt-6 flex flex-col gap-4" noValidate>
                    {/* Identité */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-muted">{c.labels.fullName}</label>
                        <input
                          value={data.full_name}
                          onChange={set("full_name")}
                          onBlur={blur("full_name")}
                          aria-invalid={!!errors.full_name}
                          placeholder={c.placeholders.fullName}
                          className={`${field} ${errors.full_name ? "border-red-500/60" : "border-white/10"}`}
                        />
                        {errors.full_name && (
                          <span className="text-xs text-red-400">{errors.full_name}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-muted">{c.labels.company}</label>
                        <input
                          value={data.company}
                          onChange={set("company")}
                          placeholder={c.placeholders.company}
                          className={`${field} border-white/10`}
                        />
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-muted">{c.labels.email}</label>
                        <input
                          type="email"
                          value={data.email}
                          onChange={set("email")}
                          onBlur={blur("email")}
                          aria-invalid={!!errors.email}
                          placeholder={c.placeholders.email}
                          className={`${field} ${errors.email ? "border-red-500/60" : "border-white/10"}`}
                        />
                        {errors.email && (
                          <span className="text-xs text-red-400">{errors.email}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-muted">{c.labels.phone}</label>
                        <input
                          value={data.phone}
                          onChange={set("phone")}
                          placeholder={c.placeholders.phone}
                          className={`${field} border-white/10`}
                        />
                      </div>
                    </div>

                    {/* Bloc qualification — sert à pré-qualifier le lead avant rappel */}
                    <div className="mt-1 rounded-xl border border-gold/15 bg-white/[0.02] p-4">
                      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold-bright/80">
                        Qualification rapide
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        Ces infos nous aident à préparer votre rappel et à
                        identifier les bons prospects pour votre métier.
                      </p>

                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div className="relative flex flex-col gap-1.5">
                          <label className="text-xs text-muted">Type d'entreprise</label>
                          <select
                            value={data.type_entreprise}
                            onChange={set("type_entreprise")}
                            className={`${selectField} border-white/10`}
                          >
                            <option value="">— Sélectionner —</option>
                            {TYPES_ENTREPRISE.map((opt) => (
                              <option key={opt} value={opt} className="bg-ink">
                                {opt}
                              </option>
                            ))}
                          </select>
                          <span className="pointer-events-none absolute right-4 top-9 text-muted">▾</span>
                        </div>

                        <div className="relative flex flex-col gap-1.5">
                          <label className="text-xs text-muted">Secteur d'activité</label>
                          <select
                            value={data.secteur}
                            onChange={set("secteur")}
                            className={`${selectField} border-white/10`}
                          >
                            <option value="">— Sélectionner —</option>
                            {SECTEURS.map((opt) => (
                              <option key={opt} value={opt} className="bg-ink">
                                {opt}
                              </option>
                            ))}
                          </select>
                          <span className="pointer-events-none absolute right-4 top-9 text-muted">▾</span>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4 sm:grid-cols-[2fr_1fr]">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs text-muted">Ville</label>
                          <input
                            value={data.ville}
                            onChange={set("ville")}
                            placeholder="Antibes, Toulon, Marseille…"
                            className={`${field} border-white/10`}
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs text-muted">Code postal</label>
                          <input
                            inputMode="numeric"
                            maxLength={5}
                            value={data.code_postal}
                            onChange={set("code_postal")}
                            onBlur={blur("code_postal")}
                            aria-invalid={!!errors.code_postal}
                            placeholder="06600"
                            className={`${field} ${errors.code_postal ? "border-red-500/60" : "border-white/10"}`}
                          />
                          {errors.code_postal && (
                            <span className="text-xs text-red-400">{errors.code_postal}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Besoin */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-muted">{c.labels.message}</label>
                      <textarea
                        value={data.message}
                        onChange={set("message")}
                        onBlur={blur("message")}
                        aria-invalid={!!errors.message}
                        rows={4}
                        placeholder={c.placeholders.message}
                        className={`${field} resize-none ${errors.message ? "border-red-500/60" : "border-white/10"}`}
                      />
                      {errors.message && (
                        <span className="text-xs text-red-400">{errors.message}</span>
                      )}
                    </div>

                    {/* Honeypot anti-bot */}
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={hp}
                      onChange={(e) => setHp(e.target.value)}
                      className="absolute -left-[9999px] h-0 w-0 opacity-0"
                      aria-hidden="true"
                    />

                    {status === "error" && (
                      <p className="text-sm text-red-400">
                        {c.submitError.lead}{" "}
                        <a href="mailto:contact@amavya.cloud" className="underline">
                          contact@amavya.cloud
                        </a>
                        {c.submitError.after}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(110deg,#a87f2e,#f0d27a_55%,#d4af37)] px-6 py-3 text-sm font-semibold text-ink shadow-[0_8px_40px_-12px_rgba(212,175,55,0.7)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {status === "loading" && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="animate-spin" aria-hidden="true">
                          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
                          <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                      )}
                      {status === "loading" ? c.submitting : c.submit}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
