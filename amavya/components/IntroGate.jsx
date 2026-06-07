"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

/* La vidéo showreel AMAVYA — l'intro principale.
   Le composant MatrixClient (rideau de code + humanoïde) reste accessible
   sur /matrix en tant qu'expérience de réserve. */
const AmavyaShowreelVideo = dynamic(
  () => import("@/components/AmavyaShowreelVideo"),
  { ssr: false },
);

const STORAGE_KEY = "amavya-intro-seen";

/**
 * Intro "une fois" : au premier passage sur "/", la vidéo showreel AMAVYA
 * s'affiche en plein écran par-dessus le site. Quand la vidéo se termine
 * OU que le visiteur clique sur Passer / X, l'intro s'estompe et ne se
 * remontre plus (mémorisé dans localStorage). Le vrai site est rendu
 * en dessous pour préserver le SEO.
 * Astuce dev : ?intro=1 force la relecture.
 */
export default function IntroGate() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return;
    let seen = false;
    try {
      seen = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      /* localStorage indisponible */
    }
    const force = window.location.search.includes("intro=1");
    if (!seen || force) {
      setShow(true);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [pathname]);

  const enter = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setLeaving(true);
    document.body.style.overflow = "";
    window.setTimeout(() => setShow(false), 900);
  };

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] bg-black transition-opacity duration-700 ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <AmavyaShowreelVideo onClose={enter} />
    </div>
  );
}
