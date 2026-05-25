"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "./LangProvider";

/**
 * Formulaire de contact AMAVYA. S'ouvre quand l'URL passe à #contact
 * (tous les boutons href="#contact" l'ouvrent). Les soumissions sont
 * envoyées dans Supabase (table partner_leads) → alimente le CRM.
 * La clé est une clé anon publique protégée par RLS (insertion seule).
 */
const SUPA_URL = "https://dmztalsmreugfwojsaar.supabase.co";
const SUPA_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtenRhbHNtcmV1Z2Z3b2pzYWFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NTA3MzMsImV4cCI6MjA5MTMyNjczM30.6UVnPjYKYm81S-DNGHwunllBMgwB-B0FS7fFNhBUEaw";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY = { full_name: "", email: "", phone: "", company: "", message: "" };

export default function ContactModal() {
  const { t } = useLang();
  const c = t.contact;
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [hp, setHp] = useState(""); // honeypot

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

  const set = (k) => (e) => setData((d) => ({ ...d, [k]: e.target.value }));

  const validate = () => {
    const er = {};
    if (data.full_name.trim().length < 2) er.full_name = c.errors.fullName;
    if (!EMAIL_RX.test(data.email.trim())) er.email = c.errors.email;
    if (data.message.trim().length < 2) er.message = c.errors.message;
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (status === "loading") return;
    if (!validate()) return;
    setStatus("loading");
    try {
      const res = await fetch(SUPA_URL + "/rest/v1/partner_leads", {
        method: "POST",
        headers: {
          apikey: SUPA_ANON,
          Authorization: "Bearer " + SUPA_ANON,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          full_name: data.full_name.trim().slice(0, 120),
          structure:
            data.company.trim().length >= 2
              ? data.company.trim().slice(0, 200)
              : "Particulier",
          email: data.email.trim().slice(0, 250),
          phone: data.phone.trim().slice(0, 30),
          support_type: "autre",
          message: ("[AMAVYA — Contact site] " + data.message.trim()).slice(0, 3000),
          honeypot_filled: hp.length > 0,
          user_agent: navigator.userAgent.slice(0, 500),
          page_url: location.href.slice(0, 500),
          referrer: document.referrer.slice(0, 500),
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
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={close}
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-gold/20 p-7 sm:p-9"
          >
            {/* Fond : continents connectés */}
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
                <p className="text-sm leading-relaxed text-muted">
                  {c.success.text}
                </p>
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
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {c.subtitle}
                </p>

                <form onSubmit={submit} className="mt-6 flex flex-col gap-4" noValidate>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-muted">{c.labels.fullName}</label>
                      <input
                        value={data.full_name}
                        onChange={set("full_name")}
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

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-muted">{c.labels.email}</label>
                      <input
                        type="email"
                        value={data.email}
                        onChange={set("email")}
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

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-muted">{c.labels.message}</label>
                    <textarea
                      value={data.message}
                      onChange={set("message")}
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
                    className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(110deg,#a87f2e,#f0d27a_55%,#d4af37)] px-6 py-3 text-sm font-semibold text-ink shadow-[0_8px_40px_-12px_rgba(212,175,55,0.7)] transition-all hover:-translate-y-0.5 disabled:opacity-60"
                  >
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
