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
        position={[-26, 9, 24]}
        intensity={2.3}
        color="#ffca8a"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-camera-near={1}
        shadow-camera-far={130}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
      />
      {/* Remplissage froid pour la séparation premium. */}
      <directionalLight position={[24, 16, -22]} intensity={0.35} color="#9fb8ff" />
      <hemisphereLight args={["#ffe8d2", "#4a4438", 0.34]} />
      <ambientLight intensity={0.12} color="#ffe2bc" />
    </>
  );
}
