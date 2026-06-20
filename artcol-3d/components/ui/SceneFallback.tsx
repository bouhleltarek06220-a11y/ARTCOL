/**
 * Alternative SANS 3D (accessibilité / absence de WebGL).
 * Fournit un contenu équivalent à la scène pour les utilisateurs qui ne
 * peuvent pas (ou ne veulent pas) afficher le rendu WebGL.
 * Composant serveur : pas d'interactivité, pas de `"use client"`.
 */
export function SceneFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-zinc-950 p-8">
      <div className="max-w-md text-center">
        <div
          aria-hidden
          className="mx-auto mb-6 h-24 w-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500"
        />
        <h2 className="text-xl font-semibold text-white">
          Expérience 3D indisponible
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Votre navigateur ne prend pas en charge WebGL, ou il est désactivé.
          Le contenu reste accessible : il s&apos;agit d&apos;un nœud torique
          animé, présenté comme démonstration de scène interactive.
        </p>
      </div>
    </div>
  );
}
