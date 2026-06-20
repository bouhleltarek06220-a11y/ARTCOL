import { HouseScene } from "@/components/3d/HouseScene";

export const metadata = {
  title: "ARTCOL · Maison 3D réaliste",
  description:
    "Intérieur architectural réaliste (Sponza) éclairé par HDRI, ombres dynamiques et post-processing.",
};

export default function Home() {
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-black text-white">
      {/* Scène 3D plein écran (décorative, encapsulée dans un composant client) */}
      <div className="absolute inset-0">
        <HouseScene />
      </div>

      {/* Couche UI 2D (Tailwind) — contenu textuel équivalent et accessible */}
      <div className="pointer-events-none relative z-10 flex h-full flex-col justify-between p-6 sm:p-10">
        <header>
          <p className="text-xs font-medium uppercase tracking-widest text-amber-200/90">
            ARTCOL · Démo architecture
          </p>
        </header>

        <div className="max-w-xl">
          <h1
            className="text-4xl font-semibold leading-tight drop-shadow-lg sm:text-6xl"
            style={{ textShadow: "0 2px 24px rgba(0,0,0,0.7)" }}
          >
            Une maison, pour de vrai.
          </h1>
          <p
            className="mt-4 max-w-md text-base text-zinc-200 sm:text-lg"
            style={{ textShadow: "0 1px 12px rgba(0,0,0,0.8)" }}
          >
            Intérieur architectural réaliste (Sponza), éclairé par une vraie
            HDRI (image-based lighting), avec ombres dynamiques et
            post-processing (bloom, vignette). Faites glisser pour visiter,
            molette pour avancer.
          </p>
        </div>

        <footer
          className="text-xs text-zinc-400"
          style={{ textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}
        >
          GLB optimisé (meshopt + WebP) · HDRI Poly Haven (CC0) · React Three Fiber
        </footer>
      </div>
    </main>
  );
}
