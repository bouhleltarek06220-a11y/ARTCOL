"use client";

import { useEffect, useMemo, useState } from "react";
import { useVilla } from "../store";
import { WAYPOINTS, WAYPOINT_GROUPS } from "../world/waypoints";

/**
 * Menu de visite guidée (façon kellydev.io) : destinations groupées par niveau,
 * clic = glissement caméra fluide (TourController). Panneau latéral sur desktop,
 * dock + feuille sur mobile. Bouton « ◂ Retour » vers le point de vue précédent.
 */
const LEVELS = Object.fromEntries(Object.values(WAYPOINTS).map((w) => [w.id, w.level]));

export function NavMenu() {
  const phase = useVilla((s) => s.phase);
  const tourId = useVilla((s) => s.tourId);
  const busy = useVilla((s) => s.tourBusy);
  const canBack = useVilla((s) => s.history.length > 0);
  const flyTo = useVilla((s) => s.flyTo);
  const flyBack = useVilla((s) => s.flyBack);

  const groupOfCurrent = useMemo(() => {
    const i = WAYPOINT_GROUPS.findIndex((g) => g.items.includes(tourId ?? ""));
    return i === -1 ? 0 : i;
  }, [tourId]);
  const [openGroup, setOpenGroup] = useState(groupOfCurrent);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => setOpenGroup(groupOfCurrent), [groupOfCurrent]);

  if (phase !== "visiting") return null;

  const go = (id: string) => {
    if (busy) return;
    flyTo(id, LEVELS[id] ?? 0);
    setMobileOpen(false);
  };
  const back = () => {
    if (!busy) flyBack(LEVELS);
  };

  const Accordion = ({ compact = false }: { compact?: boolean }) => (
    <nav aria-label="Destinations de la villa" className="flex flex-col gap-0.5">
      {WAYPOINT_GROUPS.map((group, gi) => {
        const isOpen = openGroup === gi;
        return (
          <div key={group.title} className="overflow-hidden">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenGroup(isOpen ? -1 : gi)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left font-semibold uppercase tracking-[0.18em] text-[#a98a5c] transition-colors duration-300 hover:bg-[#a98a5c]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a98a5c]/70 ${
                compact ? "text-[11px]" : "text-xs"
              }`}
            >
              <span>{group.title}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
              <ul className="min-h-0 overflow-hidden">
                {group.items.map((id) => {
                  const active = id === tourId;
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => go(id)}
                        disabled={busy}
                        aria-current={active ? "true" : undefined}
                        className={`group/item flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a98a5c]/70 ${
                          active ? "bg-[#a98a5c]/20 text-[#221c15]" : "text-[#221c15]/80 hover:bg-[#a98a5c]/10 hover:text-[#221c15]"
                        } ${busy ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                      >
                        <span aria-hidden className={`h-4 w-[3px] rounded-full transition-all duration-300 ${active ? "bg-[#a98a5c]" : "bg-transparent group-hover/item:bg-[#a98a5c]/50"}`} />
                        <span className="truncate">{WAYPOINTS[id].label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        );
      })}
    </nav>
  );

  const BackBtn = ({ floating = false }: { floating?: boolean }) => (
    <button
      type="button"
      onClick={back}
      disabled={!canBack || busy}
      aria-label="Retour au point de vue précédent"
      className={`flex items-center gap-2 rounded-full border border-[#a98a5c]/40 bg-[#f7f2e9]/80 text-[#221c15] backdrop-blur-md transition-all duration-300 ease-out hover:border-[#a98a5c] hover:bg-[#a98a5c]/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a98a5c]/70 ${
        floating ? "px-4 py-3 text-sm shadow-lg" : "px-3.5 py-2 text-sm"
      } ${!canBack || busy ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
        <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>Retour</span>
    </button>
  );

  return (
    <>
      {/* DESKTOP : panneau latéral droit */}
      <aside className="pointer-events-auto fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 md:block">
        <div className="flex w-60 flex-col gap-3 rounded-2xl border border-[#f7f2e9]/20 bg-[#f7f2e9]/55 p-3 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between px-1">
            <span className="font-serif text-base italic tracking-wide text-[#221c15]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              Visite
            </span>
            <BackBtn />
          </div>
          <div className="h-px w-full bg-[#a98a5c]/25" />
          <Accordion />
        </div>
      </aside>

      {/* MOBILE : retour flottant (pouce) + dock d'ouverture */}
      <div className="pointer-events-auto fixed bottom-4 left-4 z-40 md:hidden">
        <BackBtn floating />
      </div>
      <div className="pointer-events-auto fixed bottom-4 right-4 z-40 md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={mobileOpen}
          className="flex items-center gap-2 rounded-full border border-[#a98a5c]/40 bg-[#221c15]/85 px-5 py-3 text-sm font-medium tracking-wide text-[#f7f2e9] shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-[#221c15] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a98a5c]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Destinations
        </button>
      </div>

      {/* MOBILE : feuille du bas */}
      <div className={`fixed inset-0 z-50 md:hidden ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"}`} role="dialog" aria-modal="true">
        <div onClick={() => setMobileOpen(false)} className={`absolute inset-0 bg-[#221c15]/40 backdrop-blur-sm transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0"}`} />
        <div className={`absolute inset-x-0 bottom-0 max-h-[72vh] overflow-y-auto rounded-t-3xl border-t border-[#a98a5c]/30 bg-[#f7f2e9]/90 p-4 pb-8 shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-out ${mobileOpen ? "translate-y-0" : "translate-y-full"}`}>
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[#a98a5c]/40" aria-hidden />
          <div className="mb-2 flex items-center justify-between px-1">
            <span className="text-lg italic text-[#221c15]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Visite de la villa</span>
            <button type="button" onClick={() => setMobileOpen(false)} aria-label="Fermer" className="rounded-full p-2 text-[#221c15]/70 hover:bg-[#a98a5c]/10">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <Accordion compact />
        </div>
      </div>
    </>
  );
}
