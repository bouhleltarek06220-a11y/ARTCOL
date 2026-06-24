/* ===========================================================================
   scroll-store.js — état de scroll partagé (hors React pour la perf)
   Lenis écrit ici à chaque frame ; le Canvas R3F lit ici dans useFrame.
   Évite de re-render React 60x/s.
   =========================================================================== */
export const scroll = {
  progress: 0,   // 0..1 sur toute la page
  velocity: 0,   // vitesse de scroll (pour les effets de distorsion)
};
