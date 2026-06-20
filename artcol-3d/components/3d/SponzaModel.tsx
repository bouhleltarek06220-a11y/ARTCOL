"use client";

import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import type { Mesh } from "three";

const MODEL_URL = "/models/sponza.glb";

type SponzaModelProps = ThreeElements["group"];

/**
 * Intérieur architectural réaliste (Sponza), chargé en GLB optimisé
 * (géométrie meshopt + textures WebP). drei `useGLTF` configure
 * automatiquement le décodeur meshopt — aucun CDN externe requis.
 *
 * On parcourt le graphe une fois pour activer les ombres sur chaque mesh.
 */
export function SponzaModel(props: SponzaModelProps) {
  const { scene } = useGLTF(MODEL_URL);

  useEffect(() => {
    scene.traverse((object) => {
      const mesh = object as Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [scene]);

  return <primitive object={scene} {...props} />;
}

// Précharge le modèle dès l'import du module pour réduire le temps d'apparition.
useGLTF.preload(MODEL_URL);
