"use client";

/* ============================================================
   AMAVYA — Agent Prospection (Qualification IA en direct)
   Vrai appel à Claude via /api/qualify. Route : /agent-prospection
   ============================================================ */

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";

const ico = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
const I = {
  target: (p) => (<svg {...ico} {...p}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1" /></svg>),
  mail: (p) => (<svg {...ico} {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>),
  building: (p) => (<svg {...ico} {...p}><rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M9 7h.01M15 7h.01M9 11h.01M15 11h.01M9 15h.01M15 15h.01" /></svg>),
  spark: (p) => (<svg {...ico} {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" /></svg>),
  copy: (p) => (<svg {...ico} {...p}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>),
  check: (p) => (<svg {...ico} {...p}><path d="M20 6 9 17l-5-5" /></svg>),
  arrow: (p) => (<svg {...ico} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>),
  bee: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><ellipse cx="12" cy="14" rx="4" ry="6" /><path d="M8 12h8M8 15h8M9 18h6" /><path d="M12 8c-2-3-6-3-7-1 0 2 3 3 5 3M12 8c2-3 6-3 7-1 0 2-3 3-5 3" /><path d="M12 8V6M10.5 4.5 12 6l1.5-1.5" /></svg>),
};

const EXAMPLES = {
  bon: {
    fullName: "Sophie Marchand",
    company: "Innovatech SARL",
    email: "s.marchand@innovatech.fr",
    need: "Nous sommes une PME de 35 personnes dans le conseil B2B. Notre équipe commerciale perd un temps fou à trier et relancer les leads entrants. On cherche à automatiser la qualification et les relances pour remplir notre pipeline.",
  },
  horscible: {
    fullName: "Marc Dubois",
    company: "",
    email: "marcdubois@gmail.com",
    need: "Bonjour, je cherche un stage en alternance dans le développement web. Avez-vous des offres ?",
  },
};

const SCORE_COLOR = { Chaud: "#34d399", "Tiède": "#f0d27a", Froid: "#fb7185" };
const ACTION_STYLE = {
  RDV: { c: "#34d399", label: "Proposer un RDV" },
  Relance: { c: "#f0d27a", label: "Relancer" },
  "Écarter": { c: "#fb7185", label: "Écarter" },
};

function ScoreRing({ score, label, animate }) {
  const size = 132, r = size / 2 - 10, c = 2 * Math.PI * r;
  const col = SCORE_COLOR[label] || "#f0d27a";
  const offset = animate ? c - (score / 100) * c : c;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="8" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.3s cubic-bezier(.22,1,.36,1)", filter: `drop-shadow(0 0 8px ${col})` }} />
      </svg>
      <div className="absolute text-center">
        <div className="text-3xl font-bold text-paper">{animate ? score : 0}</div>
        <div className="text-[10px] font-semibold tracking-widest" style={{ color: col }}>{label?.toUpperCase()}</div>
      </div>
    </div>
  );
}

export default function AgentProspectionPage() {
  const [lead, setLead] = useState(EXAMPLES.bon);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState(null);
  const [copied, setCopied] = useState(false);
  const [reveal, setReveal] = useState(false);

  const set = (k) => (e) => setLead((l) => ({ ...l, [k]: e.target.value }));

  async function run(e) {
    e?.preventDefault();
    setLoading(true);
    setResult(null);
    setReveal(false);
    try {
      const res = await fetch("/api/qualify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      const data = await res.json();
      if (data.ok) {
        setResult(data.result);
        setMode(data.mode);
        // petite latence pour l'effet "analyse" puis révélation animée
        setTimeout(() => setReveal(true), 250);
      }
    } catch (_) {
      /* silencieux */
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  }

  function copyEmail() {
    if (!result?.suggestedEmail) return;
    const txt = `Objet : ${result.suggestedEmail.subject}\n\n${result.suggestedEmail.body}`;
    navigator.clipboard?.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden text-paper"
      style={{ background: "radial-gradient(120% 90% at 50% -10%, #0a1626 0%, #060b14 45%, #03060b 100%)" }}>
      <div className="pointer-events-none absolute inset-0 grid-mask opacity-40" />

      {/* NAV */}
      <header className="relative z-20 mx-auto flex max-w-[1300px] items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Logo size={40} showWordmark={false} />
          <div className="text-lg font-bold tracking-[0.2em] text-gradient">AMAVYA</div>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/command-center" className="rounded-lg border border-white/10 px-3 py-2 text-[12px] text-silver hover:text-paper">Centre de commande</Link>
          <Link href="/login" className="glow-ring rounded-lg bg-gradient-to-r from-gold to-gold-bright px-4 py-2.5 text-[12px] font-semibold text-ink">Se connecter</Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-[1300px] px-6 pb-14">
        {/* Titre */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-gold-bright">
            <I.target width={14} height={14} /> AGENT PROSPECTION · DÉMO EN DIRECT
          </div>
          <h1 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
            Votre <span className="text-gradient">Agent IA</span> qualifie un prospect en direct
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-[13.5px] leading-relaxed text-muted">
            Saisissez un lead (ou utilisez un exemple). L'agent l'analyse, le score, rédige
            l'email de réponse et recommande la prochaine action — en quelques secondes.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
          {/* ---- FORMULAIRE ---- */}
          <form onSubmit={run} className="glass h-fit rounded-2xl p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[12px] font-semibold tracking-[0.16em] text-paper">LEAD ENTRANT</h2>
              <div className="flex gap-1.5">
                <button type="button" onClick={() => setLead(EXAMPLES.bon)} className="rounded-md border border-white/10 px-2 py-1 text-[10px] text-silver hover:text-gold-bright">Bon lead</button>
                <button type="button" onClick={() => setLead(EXAMPLES.horscible)} className="rounded-md border border-white/10 px-2 py-1 text-[10px] text-silver hover:text-gold-bright">Hors cible</button>
              </div>
            </div>

            {[
              ["fullName", "Nom complet", "Sophie Marchand"],
              ["company", "Société", "Innovatech SARL"],
              ["email", "Email", "s.marchand@innovatech.fr"],
            ].map(([k, label, ph]) => (
              <label key={k} className="mb-3 block">
                <span className="mb-1 block text-[11px] text-silver">{label}</span>
                <input value={lead[k]} onChange={set(k)} placeholder={ph}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-[13px] text-paper placeholder:text-muted-soft focus:border-gold/50 focus:outline-none" />
              </label>
            ))}

            <label className="mb-4 block">
              <span className="mb-1 block text-[11px] text-silver">Besoin exprimé</span>
              <textarea value={lead.need} onChange={set("need")} rows={5}
                placeholder="Décrivez la demande du prospect…"
                className="w-full resize-none rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-[13px] leading-relaxed text-paper placeholder:text-muted-soft focus:border-gold/50 focus:outline-none" />
            </label>

            <button type="submit" disabled={loading}
              className="glow-ring flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-gold to-gold-bright py-3 text-[13px] font-semibold text-ink shadow-lg shadow-gold/20 disabled:opacity-70">
              {loading ? (<><span className="loader !h-4 !w-4 !border-2" /> Analyse en cours…</>) : (<><I.spark width={16} height={16} /> Lancer l'agent</>)}
            </button>
          </form>

          {/* ---- RÉSULTAT ---- */}
          <div className="glass relative min-h-[460px] rounded-2xl p-5">
            <div className="mb-4 flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg border border-gold/30 bg-gold/10 text-gold-bright"><I.bee width={18} height={18} /></span>
              <div>
                <div className="text-[13px] font-semibold text-paper">Analyse de l'Agent Prospection</div>
                <div className="text-[10px] text-muted">
                  {mode === "live" ? "Propulsé par Claude · en direct" : mode ? "Mode démonstration" : "En attente d'un lead"}
                </div>
              </div>
            </div>

            {/* État vide */}
            {!loading && !result && (
              <div className="grid h-[360px] place-items-center text-center">
                <div className="text-muted">
                  <I.target width={40} height={40} className="mx-auto opacity-40" />
                  <p className="mt-3 text-[13px]">Lancez l'agent pour voir la qualification apparaître ici.</p>
                </div>
              </div>
            )}

            {/* Chargement */}
            {loading && (
              <div className="grid h-[360px] place-items-center">
                <div className="text-center">
                  <span className="loader mx-auto" />
                  <div className="mt-4 space-y-1 text-[12px] text-muted">
                    <p className="animate-ticker">Lecture du lead…</p>
                    <p className="animate-ticker" style={{ animationDelay: ".3s" }}>Analyse du besoin & correspondance ICP…</p>
                    <p className="animate-ticker" style={{ animationDelay: ".6s" }}>Rédaction de la réponse…</p>
                  </div>
                </div>
              </div>
            )}

            {/* Résultats */}
            <AnimatePresence>
              {!loading && result && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  {/* Ligne haute : score + résumé + ICP */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <ScoreRing score={result.score} label={result.scoreLabel} animate={reveal} />
                    <div className="flex-1 space-y-3">
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                        className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                        <div className="text-[10px] font-semibold tracking-wider text-gold-bright">RÉSUMÉ DU BESOIN</div>
                        <p className="mt-1 text-[13px] text-paper">{result.summary}</p>
                      </motion.div>
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                        className="flex items-start gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                        <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] ${result.icpMatch ? "bg-emerald-400/20 text-emerald-400" : "bg-rose-400/20 text-rose-400"}`}>
                          {result.icpMatch ? "✓" : "✕"}
                        </span>
                        <div>
                          <div className="text-[12px] font-semibold text-paper">{result.icpMatch ? "Correspond à la cible (ICP)" : "Hors cible (ICP)"}</div>
                          <div className="text-[11.5px] text-muted">{result.icpReason}</div>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Contexte société */}
                  {result.companyContext && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}
                      className="grid grid-cols-3 gap-3">
                      {[["Secteur", result.companyContext.sector], ["Taille estimée", result.companyContext.sizeEstimate], ["Note", result.companyContext.notes]].map(([k, v]) => (
                        <div key={k} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                          <div className="text-[9.5px] font-semibold tracking-wider text-muted">{k.toUpperCase()}</div>
                          <div className="mt-1 text-[11.5px] text-paper">{v}</div>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* Email suggéré */}
                  {result.suggestedEmail && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                      className="rounded-xl border border-gold/15 bg-gold/[0.04] p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] font-semibold tracking-wider text-gold-bright"><I.mail width={14} height={14} /> EMAIL DE RÉPONSE SUGGÉRÉ</div>
                        <button onClick={copyEmail} className="flex items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-[10px] text-silver hover:text-gold-bright">
                          {copied ? (<><I.check width={12} height={12} /> Copié</>) : (<><I.copy width={12} height={12} /> Copier</>)}
                        </button>
                      </div>
                      <div className="text-[12px] font-semibold text-paper">Objet : {result.suggestedEmail.subject}</div>
                      <pre className="mt-2 whitespace-pre-wrap font-sans text-[12px] leading-relaxed text-silver-bright">{result.suggestedEmail.body}</pre>
                    </motion.div>
                  )}

                  {/* Prochaine action */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.48 }}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3">
                    <div>
                      <div className="text-[10px] font-semibold tracking-wider text-muted">PROCHAINE ACTION RECOMMANDÉE</div>
                      <div className="text-[11.5px] text-muted">{result.nextActionReason}</div>
                    </div>
                    <span className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-semibold"
                      style={{ background: `${(ACTION_STYLE[result.nextAction]?.c || "#f0d27a")}1f`, color: ACTION_STYLE[result.nextAction]?.c || "#f0d27a" }}>
                      {ACTION_STYLE[result.nextAction]?.label || result.nextAction} <I.arrow width={14} height={14} />
                    </span>
                  </motion.div>

                  {mode !== "live" && (
                    <p className="text-center text-[10px] text-muted-soft">
                      Mode démonstration (clé IA non configurée sur cet environnement). En production, l'analyse est générée en direct par Claude.
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/5 px-6 py-5 text-center text-[11px] text-muted">
        AMAVYA · Agent Prospection — démo en direct ·{" "}
        <Link href="/command-center" className="text-gold-bright hover:underline">Voir le centre de commande →</Link>
      </footer>
    </div>
  );
}
