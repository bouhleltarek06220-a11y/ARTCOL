"use client";

import { Html, useProgress } from "@react-three/drei";

/**
 * Fallback affiché *à l'intérieur* du Canvas pendant le chargement
 * asynchrone (modèles, textures, environnements) via <Suspense>.
 * Utilise `useProgress` de drei pour afficher l'avancement réel.
 */
export function CanvasLoader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center gap-2 text-sm text-white/80"
      >
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        <span>Chargement de la scène… {Math.round(progress)}%</span>
      </div>
    </Html>
  );
}
