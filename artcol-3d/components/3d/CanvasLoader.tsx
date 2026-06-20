"use client";

import { Html, useProgress } from "@react-three/drei";

/**
 * Fallback affiché *à l'intérieur* du Canvas pendant le chargement
 * asynchrone du modèle (via <Suspense>). Purement visuel, sans texte :
 * une fine barre de progression qui se remplit selon l'avancement réel.
 */
export function CanvasLoader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div
        role="progressbar"
        aria-label="Chargement de la scène 3D"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-[3px] w-40 overflow-hidden rounded-full bg-white/15"
      >
        <div
          className="h-full rounded-full bg-white/80 transition-[width] duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </Html>
  );
}
