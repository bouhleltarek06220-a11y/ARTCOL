"use client";

import { useVilla } from "../store";

/**
 * Interface de visite minimale : marque AMAVYA + libellé de la zone courante,
 * et un réticule discret au centre. Visible uniquement pendant la visite.
 */
export function Hud() {
  const phase = useVilla((s) => s.phase);
  const zone = useVilla((s) => s.zone);
  const aim = useVilla((s) => s.aim);
  const visible = phase === "visiting";
  const active = aim !== null;
  const hint = aim === "guide" ? "Cliquez pour parler" : aim === "artwork" ? "Cliquez pour observer" : null;

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-10 transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Barre supérieure */}
      <div className="flex items-center justify-between px-7 py-5">
        <div
          className="text-[13px] font-normal text-[#f7f2e9]"
          style={{ letterSpacing: "0.42em", textShadow: "0 1px 16px rgba(20,10,0,.55)" }}
        >
          AMAVYA
        </div>
        <div
          className="text-[10.5px] uppercase text-[#fff7eb]"
          style={{ letterSpacing: "0.28em", textShadow: "0 1px 16px rgba(20,10,0,.6)" }}
        >
          <span
            className="mr-3 inline-block h-px w-4 align-middle"
            style={{ background: "#a98a5c" }}
          />
          {zone}
        </div>
      </div>

      {/* Réticule central — s'agrandit en anneau doré quand on vise un élément
          interactif (hôte ou œuvre). */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200"
        style={
          active
            ? {
                height: 16,
                width: 16,
                background: "transparent",
                border: "1.5px solid rgba(212,175,108,.95)",
                boxShadow: "0 0 12px rgba(212,175,108,.5)",
              }
            : {
                height: 8,
                width: 8,
                background: "rgba(255,247,235,.9)",
                boxShadow: "0 0 0 1px rgba(255,247,235,.4)",
              }
        }
      />

      {/* Indice d'interaction sous le réticule */}
      {hint && (
        <div
          className="absolute left-1/2 top-1/2 mt-7 -translate-x-1/2 whitespace-nowrap text-[10px] uppercase text-[#fff7eb]"
          style={{ letterSpacing: "0.26em", textShadow: "0 1px 14px rgba(20,10,0,.7)" }}
        >
          {hint}
        </div>
      )}
    </div>
  );
}
