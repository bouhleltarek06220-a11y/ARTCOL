// Pont SANS état React entre le scroll (DOM : Lenis + ScrollTrigger) et la caméra 3D (useFrame).
// `progress` ∈ [0, 1]. Muté directement → zéro re-render React, zéro setState dans la boucle.
export const scroll = { progress: 0 }
export default scroll
