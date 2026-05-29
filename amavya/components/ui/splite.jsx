"use client";

import { Suspense, lazy } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

/**
 * Charge et affiche une scène Spline (3D temps réel) avec un fallback de
 * chargement le temps que le runtime + la scène se téléchargent.
 */
export function SplineScene({ scene, className }) {
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          <span className="loader" />
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  );
}
