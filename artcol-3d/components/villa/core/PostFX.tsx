"use client";

import {
  Bloom,
  DepthOfField,
  EffectComposer,
  SMAA,
  Vignette,
} from "@react-three/postprocessing";

/**
 * Pile de post-traitement « premium » : profondeur de champ subtile, bloom
 * doux sur les sources lumineuses, vignette chaude, anti-aliasing SMAA.
 */
export function PostFX() {
  return (
    <EffectComposer multisampling={0}>
      <DepthOfField focusDistance={0.025} focalLength={0.04} bokehScale={1.4} />
      <Bloom mipmapBlur intensity={0.6} luminanceThreshold={0.95} luminanceSmoothing={0.2} />
      <Vignette eskil={false} offset={0.2} darkness={0.82} />
      <SMAA />
    </EffectComposer>
  );
}
