"use client";

import { useEffect, useState } from "react";
import { useVilla } from "../store";

/**
 * Panneau d'inspection d'une œuvre (cartel premium). S'ouvre quand la phase
 * passe à « inspecting » : pendant ce temps, le <Player/> a cadré l'œuvre en
 * zoom cinématique. À la fermeture, on revient à la visite et on reverrouille
 * la souris (le Player restaure la vue de marche).
 */
export function ArtworkPanel() {
  const phase = useVilla((s) => s.phase);
  const artwork = useVilla((s) => s.artwork);
  const stopInspect = useVilla((s) => s.stopInspect);
  const lock = useVilla((s) => s.lock);
  const open = phase === "inspecting" && !!artwork;

  const [showMore, setShowMore] = useState(false);

  // Replie « en savoir plus » à chaque nouvelle œuvre.
  useEffect(() => {
    setShowMore(false);
  }, [artwork?.id]);

  const close = () => {
    stopInspect();
    // Le verrouillage doit suivre le geste utilisateur (clic).
    requestAnimationFrame(() => lock?.());
  };

  return (
    <div
      className={`pointer-events-none absolute bottom-0 left-0 z-30 m-5 w-[min(400px,92vw)] transition-all duration-700 ${
        open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
      style={{
        background: "linear-gradient(180deg, rgba(247,242,233,.97), rgba(239,232,219,.98))",
        backdropFilter: "blur(26px) saturate(1.1)",
        border: "1px solid rgba(34,28,21,.14)",
        borderRadius: 18,
        boxShadow: "0 40px 90px -45px rgba(40,22,8,.55)",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
      }}
      aria-hidden={!open}
    >
      {open && artwork && (
        <div className="relative px-8 pb-7 pt-8">
          <button
            type="button"
            onClick={close}
            className="pointer-events-auto absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-lg text-[#4a4036] transition hover:bg-[#221c15] hover:text-[#f7f2e9]"
            style={{ border: "1px solid rgba(34,28,21,.14)" }}
            aria-label="Fermer le cartel"
          >
            ×
          </button>

          <div
            className="text-[10px] uppercase text-[#a98a5c]"
            style={{ fontFamily: "'Jost', system-ui, sans-serif", letterSpacing: "0.34em" }}
          >
            Œuvre · Collection AMAVYA
          </div>
          <h2 className="mt-2 text-[34px] font-normal italic leading-none text-[#221c15]">
            {artwork.title}
          </h2>
          <div
            className="mt-2 text-[11px] uppercase text-[#8c8073]"
            style={{ fontFamily: "'Jost', system-ui, sans-serif", letterSpacing: "0.22em" }}
          >
            {artwork.style} · {artwork.year}
          </div>

          <div className="my-4 h-px w-full bg-[rgba(34,28,21,.14)]" />

          <p className="text-[18px] leading-relaxed text-[#2c2820]">{artwork.description}</p>

          {showMore && (
            <p className="mt-3 text-[16px] italic leading-relaxed text-[#4a4036]">
              {artwork.more}
            </p>
          )}

          <div className="mt-6 flex items-center gap-3">
            {!showMore && (
              <button
                type="button"
                onClick={() => setShowMore(true)}
                className="pointer-events-auto rounded-full bg-[#221c15] px-5 py-2.5 text-[11px] uppercase text-[#f7f2e9] transition hover:opacity-90"
                style={{ fontFamily: "'Jost', system-ui, sans-serif", letterSpacing: "0.2em" }}
              >
                En savoir plus
              </button>
            )}
            <button
              type="button"
              onClick={close}
              className="pointer-events-auto rounded-full px-5 py-2.5 text-[11px] uppercase text-[#4a4036] transition hover:bg-[rgba(34,28,21,.06)]"
              style={{
                fontFamily: "'Jost', system-ui, sans-serif",
                letterSpacing: "0.2em",
                border: "1px solid rgba(34,28,21,.18)",
              }}
            >
              Reprendre la visite
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
