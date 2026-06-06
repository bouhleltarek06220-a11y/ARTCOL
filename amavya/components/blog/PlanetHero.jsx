"use client";

import { Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import RealisticPlanet from "./celestial/RealisticPlanet";
import { CATEGORY_TO_TYPE } from "./celestial/proceduralPlanet";

export default function PlanetHero({ color, size = 1.4, type, category, seed = 1 }) {
  const planetType = type || (category && CATEGORY_TO_TYPE[category]) || "earth";
  const atmoMap = {
    earth: "#7dd3fc",
    mars: "#ff7e5a",
    jupiter: "#e6c690",
    saturn: "#f0d27a",
    ice: "#bde0fe",
    exotic: "#c8aaff",
  };
  const atmosphere = color || atmoMap[planetType] || "#f0d27a";

  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[6, 4, 6]} intensity={2} color="#fff3c4" />
      <pointLight position={[-5, -3, 2]} intensity={0.45} color="#5b3d99" />
      <Stars radius={90} depth={50} count={5000} factor={4} fade speed={0.25} />
      <RealisticPlanet
        type={planetType}
        size={size}
        seed={seed}
        atmosphere={atmosphere}
        rotationSpeed={0.18}
        tilt={0.18}
      />
      <EffectComposer>
        <Bloom intensity={1} luminanceThreshold={0.35} mipmapBlur />
      </EffectComposer>
    </>
  );
}
