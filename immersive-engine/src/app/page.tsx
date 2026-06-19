"use client";

import dynamic from "next/dynamic";
import Hud from "@/components/ui/Hud";
import { useNavigation } from "@/hooks/useNavigation";

// La scène 3D est chargée uniquement côté client (WebGL).
const Experience = dynamic(() => import("@/components/3d/Experience"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex items-center justify-center bg-bg text-xs uppercase tracking-[0.3em] text-white/50">
      Initialisation de l'univers…
    </div>
  ),
});

export default function Page() {
  useNavigation();
  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <Experience />
      <Hud />
    </main>
  );
}
