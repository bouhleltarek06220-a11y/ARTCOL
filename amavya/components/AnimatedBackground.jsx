/**
 * Fond global : noir profond + lueurs dorées/argentées dérivantes + réseau de
 * villes connectées animé + grille masquée.
 * Purement décoratif et non interactif (pointer-events: none).
 */
import CityNetwork from "./CityNetwork";

export default function AnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Base */}
      <div className="absolute inset-0 bg-ink" />

      {/* Halo central doré */}
      <div className="absolute left-1/2 top-[-10%] h-[60rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.14),transparent_60%)] blur-2xl" />

      {/* Lueurs dérivantes */}
      <div className="animate-drift absolute -left-32 top-1/4 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(168,127,46,0.16),transparent_65%)] blur-3xl" />
      <div
        className="animate-drift absolute -right-24 top-1/3 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(194,199,208,0.08),transparent_65%)] blur-3xl"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="animate-drift absolute bottom-0 left-1/3 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.12),transparent_65%)] blur-3xl"
        style={{ animationDelay: "-11s" }}
      />

      {/* Réseau de villes connectées animé (flux de données) */}
      <CityNetwork />

      {/* Grille technique masquée */}
      <div className="grid-mask absolute inset-0 opacity-60" />

      {/* Vignette basse pour la lisibilité */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
    </div>
  );
}
