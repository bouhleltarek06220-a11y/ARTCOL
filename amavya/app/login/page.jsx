"use client";

/* ============================================================
   AMAVYA — Page de connexion (entrée de la plateforme)
   Route : /login
   ============================================================ */

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";

const ico = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const Bee = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <ellipse cx="12" cy="14" rx="4" ry="6" />
    <path d="M8 12h8M8 15h8M9 18h6" />
    <path d="M12 8c-2-3-6-3-7-1 0 2 3 3 5 3M12 8c2-3 6-3 7-1 0 2-3 3-5 3" />
    <path d="M12 8V6M10.5 4.5 12 6l1.5-1.5" />
  </svg>
);
const Mail = (p) => (
  <svg {...ico} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);
const Lock = (p) => (
  <svg {...ico} {...p}>
    <rect x="4" y="11" width="16" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);
const Eye = (p) => (
  <svg {...ico} {...p}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="2.5" />
  </svg>
);
const Google = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...p}>
    <path fill="#FFC107" d="M43.6 20.5h-1.9V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.5 5 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.4-.4-3.5Z" />
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.5 7 29.6 5 24 5 16 5 9.1 9.5 6.3 14.7Z" />
    <path fill="#4CAF50" d="M24 45c5.2 0 9.9-2 13.5-5.2l-6.2-5.2C29.2 36 26.7 37 24 37c-5.3 0-9.7-2.6-11.3-7l-6.5 5C9 40.4 15.9 45 24 45Z" />
    <path fill="#1976D2" d="M43.6 20.5H24v8h11.3c-.8 2.3-2.3 4.2-4.1 5.6l6.2 5.2C41.9 36.3 45 30.7 45 24c0-1.2-.1-2.4-.4-3.5Z" />
  </svg>
);

export default function LoginPage() {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative grid min-h-screen w-full place-items-center overflow-hidden px-4 py-10 text-paper"
      style={{
        background:
          "radial-gradient(120% 90% at 50% -10%, #0a1626 0%, #060b14 45%, #03060b 100%)",
      }}
    >
      {/* fond : grille + halos + abeilles flottantes */}
      <div className="pointer-events-none absolute inset-0 grid-mask opacity-40" />
      <div
        className="pointer-events-none absolute -left-32 top-0 h-[420px] w-[420px] rounded-full opacity-50 blur-3xl animate-drift"
        style={{ background: "radial-gradient(circle, rgba(217,164,65,.28), transparent 65%)" }}
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-[380px] w-[380px] rounded-full opacity-40 blur-3xl animate-drift"
        style={{ background: "radial-gradient(circle, rgba(56,189,248,.22), transparent 65%)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative grid w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 md:grid-cols-2"
      >
        {/* ---- Colonne gauche : branding ---- */}
        <div
          className="relative hidden flex-col justify-between p-9 md:flex"
          style={{ background: "linear-gradient(160deg, rgba(217,164,65,.14), rgba(7,17,31,.6))" }}
        >
          <div className="flex items-center gap-3">
            <Logo size={48} showWordmark={false} />
            <div className="leading-none">
              <div className="text-lg font-bold tracking-[0.2em] text-gradient">AMAVYA</div>
              <div className="mt-1 text-[8px] tracking-[0.25em] text-muted">
                ARCHITECTES D'AGENTS INTELLIGENTS
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold leading-tight">
              Vos agents IA<br />
              <span className="text-gradient">travaillent pendant</span><br />
              que vous développez votre vision.
            </h2>
            <p className="mt-3 text-[13px] leading-relaxed text-muted">
              Connectez-vous à votre ruche : prospects, campagnes, automatisations
              et performance — en un seul endroit.
            </p>
            <div className="mt-5 flex gap-5">
              {[["+50", "Agents IA"], ["24/7", "Actifs"], ["98.6%", "Satisfaction"]].map(([n, l]) => (
                <div key={l}>
                  <div className="text-lg font-bold text-gold-bright">{n}</div>
                  <div className="text-[10px] text-muted">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---- Colonne droite : formulaire ---- */}
        <div className="glass-strong p-8 md:p-9">
          <div className="mb-6 md:hidden">
            <div className="text-xl font-bold tracking-[0.2em] text-gradient">AMAVYA</div>
          </div>

          <h1 className="text-xl font-bold">Connexion à votre espace</h1>
          <p className="mt-1 text-[12.5px] text-muted">
            Accédez à votre centre de commande AMAVYA.
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = "/command-center";
            }}
          >
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-medium tracking-wide text-silver">
                Adresse e-mail
              </span>
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 focus-within:border-gold/50">
                <span className="text-muted"><Mail /></span>
                <input
                  type="email"
                  required
                  placeholder="vous@entreprise.com"
                  className="w-full bg-transparent text-[13px] text-paper placeholder:text-muted-soft focus:outline-none"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[11px] font-medium tracking-wide text-silver">
                Mot de passe
              </span>
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 focus-within:border-gold/50">
                <span className="text-muted"><Lock /></span>
                <input
                  type={show ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full bg-transparent text-[13px] text-paper placeholder:text-muted-soft focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="text-muted hover:text-paper"
                  aria-label="Afficher le mot de passe"
                >
                  <Eye />
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between text-[11.5px]">
              <label className="flex items-center gap-2 text-muted">
                <input type="checkbox" className="accent-[#d4af37]" /> Se souvenir de moi
              </label>
              <a href="#" className="text-gold-bright hover:underline">Mot de passe oublié ?</a>
            </div>

            <button
              type="submit"
              className="glow-ring w-full rounded-lg bg-gradient-to-r from-gold to-gold-bright py-3 text-[13px] font-semibold text-ink shadow-lg shadow-gold/20 transition-transform hover:scale-[1.01]"
            >
              Se connecter
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-[10px] text-muted-soft">
            <span className="h-px flex-1 bg-white/10" /> OU <span className="h-px flex-1 bg-white/10" />
          </div>

          <button className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] py-2.5 text-[12.5px] font-medium text-paper hover:bg-white/[0.06]">
            <Google /> Continuer avec Google
          </button>

          <p className="mt-6 text-center text-[12px] text-muted">
            Pas encore de compte ?{" "}
            <a href="#" className="font-medium text-gold-bright hover:underline">
              Demander un accès
            </a>
          </p>

          <div className="mt-4 text-center">
            <Link
              href="/command-center"
              className="text-[11px] text-silver underline-offset-2 hover:text-gold-bright hover:underline"
            >
              → Voir la démo sans se connecter
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
