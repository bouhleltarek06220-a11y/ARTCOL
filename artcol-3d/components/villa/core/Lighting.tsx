"use client";

/**
 * Éclairage de la scène : soleil rasant doré (golden hour) + remplissage
 * chaud/froid équilibré. Le ciel HDRI (réflexions + ambiance) est monté
 * séparément dans <VillaExperience/> sous Suspense.
 */
export function Lighting() {
  return (
    <>
      {/* Soleil rasant doré, ombres longues. */}
      <directionalLight
        position={[-34, 13, 22]}
        intensity={1.7}
        color="#ffd6a0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-camera-near={1}
        shadow-camera-far={130}
        shadow-camera-left={-46}
        shadow-camera-right={46}
        shadow-camera-top={46}
        shadow-camera-bottom={-46}
      />
      {/* Remplissage froid pour la séparation premium. */}
      <directionalLight position={[24, 16, -22]} intensity={0.35} color="#9fb8ff" />
      <hemisphereLight args={["#ffe8d2", "#3a4a5a", 0.3]} />
      <ambientLight intensity={0.08} color="#ffe6c4" />
    </>
  );
}
