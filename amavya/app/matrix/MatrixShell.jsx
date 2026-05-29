"use client";

import dynamic from "next/dynamic";

const MatrixClient = dynamic(() => import("./MatrixClient"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-400/30 border-t-emerald-400" />
        <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-emerald-400/70">
          Loading the construct
        </p>
      </div>
    </div>
  ),
});

export default function MatrixShell() {
  return <MatrixClient />;
}
