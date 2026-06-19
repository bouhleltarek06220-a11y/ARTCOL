"use client";

import dynamic from "next/dynamic";
import { KeyboardControls } from "@react-three/drei";
import Hud from "@/components/ui/Hud";
import DetailPanel from "@/components/ui/DetailPanel";
import { useNavigation } from "@/hooks/useNavigation";

// La scène 3D est chargée uniquement côté client (WebGL).
const Experience = dynamic(() => import("@/components/3d/Experience"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex items-center justify-center bg-[#05030a] text-xs uppercase tracking-[0.3em] text-white/50">
      Entrée dans la galerie…
    </div>
  ),
});

// Mapping clavier (mode marche) : ZQSD + WASD + flèches.
const KEYS = [
  { name: "forward", keys: ["ArrowUp", "w", "W", "z", "Z"] },
  { name: "backward", keys: ["ArrowDown", "s", "S"] },
  { name: "left", keys: ["ArrowLeft", "a", "A", "q", "Q"] },
  { name: "right", keys: ["ArrowRight", "d", "D"] },
  { name: "jump", keys: ["Space"] },
];

export default function Page() {
  useNavigation();
  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <KeyboardControls map={KEYS}>
        <Experience />
      </KeyboardControls>
      <Hud />
      <DetailPanel />
    </main>
  );
}
