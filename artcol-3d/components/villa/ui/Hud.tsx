"use client";

import { useVilla } from "../store";

/**
 * Interface de visite minimale : marque AMAVYA + libellé de la zone courante,
 * et un réticule discret au centre. Visible uniquement pendant la visite.
 */
export function Hud() {
  const phase = useVilla((s) => s.phase);
  const zone = useVilla((s) => s.zone);
  const visible = phase === "visiting";

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

      {/* Réticule central */}
      <div
        className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "rgba(255,247,235,.9)", boxShadow: "0 0 0 1px rgba(255,247,235,.4)" }}
      />
    </div>
  );
}
