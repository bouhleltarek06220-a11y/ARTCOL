import { Scene } from "@/components/3d/Scene";

export default function Home() {
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-zinc-950 text-white">
      {/* Scène 3D plein écran (décorative, encapsulée dans un composant client) */}
      <div className="absolute inset-0">
        <Scene />
      </div>

      {/* Couche UI 2D (Tailwind) — contenu textuel équivalent et accessible */}
      <div className="pointer-events-none relative z-10 flex h-full flex-col justify-between p-6 sm:p-10">
        <header>
          <p className="text-xs font-medium uppercase tracking-widest text-indigo-300">
            ARTCOL · 3D
          </p>
        </header>

        <div className="max-w-xl">
          <h1 className="text-4xl font-semibold leading-tight sm:text-6xl">
            Expériences web 3D, performantes et accessibles.
          </h1>
          <p className="mt-4 text-base text-zinc-300 sm:text-lg">
            Démonstration React Three Fiber : un nœud torique animé via{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm">
              useFrame
            </code>
            , éclairage de base, contrôles orbitaux et chargement sous{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm">
              Suspense
            </code>
            . Faites glisser pour orbiter, molette pour zoomer.
          </p>
        </div>

        <footer className="text-xs text-zinc-500">
          Next.js · React Three Fiber · drei · Tailwind CSS
        </footer>
      </div>
    </main>
  );
}
