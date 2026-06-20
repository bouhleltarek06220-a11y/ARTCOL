"use client";

import { useVilla } from "../store";
import { useIsTouch } from "@/hooks/useIsTouch";

/**
 * Écran d'accueil cinématographique (marque AMAVYA). La caméra d'ambiance
 * tourne derrière le voile flouté. Au clic « Entrer », on bascule en visite
 * et on verrouille le pointeur.
 */
export function IntroScreen() {
  const phase = useVilla((s) => s.phase);
  const setPhase = useVilla((s) => s.setPhase);
  const lock = useVilla((s) => s.lock);
  const touch = useIsTouch();

  const enter = () => {
    setPhase("visiting");
    // Le verrouillage doit suivre le geste utilisateur (clic).
    requestAnimationFrame(() => lock?.());
  };

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center transition-opacity duration-700 ${
        phase === "intro" ? "opacity-100" : "opacity-0"
      }`}
      style={{
        background:
          "radial-gradient(1400px 900px at 50% 42%, rgba(247,242,233,.28), rgba(247,242,233,.74) 80%)",
        backdropFilter: "blur(5px) saturate(1.05)",
      }}
      aria-hidden={phase !== "intro"}
    >
      <div
        className="mb-7 text-[11px] font-normal uppercase"
        style={{ letterSpacing: "0.5em", color: "#a98a5c" }}
      >
        Collection privée · Côte d’Azur
      </div>
      <h1
        className="mb-5 font-light leading-none"
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "clamp(52px,11vw,128px)",
          color: "#221c15",
        }}
      >
        Villa <em className="font-normal italic">Galerie</em>
      </h1>
      <p
        className="mb-10 max-w-lg text-lg italic"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "#4a4036" }}
      >
        Une propriété d’architecte transformée en galerie d’art contemporain,
        baignée par la lumière du couchant.
      </p>
      <button
        type="button"
        onClick={enter}
        className="pointer-events-auto cursor-pointer border bg-[#221c15] px-12 py-4 text-xs uppercase text-[#f7f2e9] transition hover:bg-transparent hover:text-[#221c15]"
        style={{ letterSpacing: "0.28em", borderColor: "#221c15" }}
      >
        Entrer dans la villa
      </button>
      <div
        className="mt-8 text-[10.5px] uppercase"
        style={{ letterSpacing: "0.18em", color: "#8c8073" }}
      >
        {touch ? (
          <>
            Déplacement <b className="text-[#4a4036]">joystick</b> · regard{" "}
            <b className="text-[#4a4036]">glisser</b> · <b className="text-[#4a4036]">taper</b> une
            œuvre
          </>
        ) : (
          <>
            Déplacement <b className="text-[#4a4036]">Z Q S D</b> · regard{" "}
            <b className="text-[#4a4036]">souris</b> · <b className="text-[#4a4036]">Échap</b> pour
            sortir
          </>
        )}
      </div>
    </div>
  );
}
