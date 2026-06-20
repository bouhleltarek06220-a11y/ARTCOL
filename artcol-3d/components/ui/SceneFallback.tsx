/**
 * Alternative SANS 3D (accessibilité / absence de WebGL).
 * Affichée uniquement si le navigateur ne peut pas faire de rendu WebGL.
 * Composant serveur : pas d'interactivité, pas de `"use client"`.
 */
export function SceneFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-zinc-950 p-8">
      <div className="max-w-md text-center">
        <div
          aria-hidden
          className="mx-auto mb-6 h-24 w-24 rounded-2xl bg-gradient-to-br from-zinc-700 to-zinc-900"
        />
        <h2 className="text-xl font-semibold text-white">
          Visite 3D indisponible
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Votre navigateur ne prend pas en charge WebGL, ou il est désactivé.
          Activez-le (ou utilisez un navigateur récent) pour explorer la
          maison en 3D.
        </p>
      </div>
    </div>
  );
}
