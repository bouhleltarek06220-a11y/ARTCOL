"use client";

import { useGLTF } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";

/**
 * EXEMPLE de chargement de modèle GLTF/GLB avec drei.
 *
 * Workflow recommandé :
 * 1. Déposer le modèle dans `public/models/` (compressé Draco/meshopt + KTX2).
 * 2. Le convertir en composant typé :  `npx gltfjsx public/models/mon-modele.glb`
 * 3. Remplacer ce fichier par le composant généré, ou s'en inspirer.
 *
 * Tant qu'aucun fichier `mon-modele.glb` n'existe dans `public/models/`,
 * ce composant ne doit PAS être monté (il déclencherait un fetch 404).
 * Il sert de référence ; voir CLAUDE.md.
 */

const MODEL_URL = "/models/mon-modele.glb";

type ModelProps = ThreeElements["group"];

export function Model(props: ModelProps) {
  // `useGLTF` suspend le rendu pendant le chargement : monter sous <Suspense>.
  const { scene } = useGLTF(MODEL_URL);
  return <primitive object={scene} {...props} />;
}

// Précharge le modèle dès que ce module est importé, pour réduire le
// temps d'apparition lorsque le composant est effectivement monté.
useGLTF.preload(MODEL_URL);
