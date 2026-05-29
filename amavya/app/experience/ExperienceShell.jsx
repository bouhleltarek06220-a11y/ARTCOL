"use client";

import dynamic from "next/dynamic";

const ExperienceClient = dynamic(() => import("./ExperienceClient"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center bg-[#03050a]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold/30 border-t-gold-bright" />
        <p className="text-[10px] uppercase tracking-[0.32em] text-paper/55">Initializing neural core</p>
      </div>
    </div>
  ),
});

export default function ExperienceShell() {
  return <ExperienceClient />;
}
