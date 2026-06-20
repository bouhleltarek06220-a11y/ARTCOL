/**
 * Visée façon jeu (mode marche) : un rayon part du centre de l'écran (viseur).
 * S'il touche une œuvre → on la marque "ciblée" (glow + nom dans le HUD).
 * Clic = ouvre sa fiche (et libère la souris pour interagir avec le panneau).
 */
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useExperience } from "@/stores/useExperience";

function findExhibitId(o: THREE.Object3D | null): string | null {
  let cur: THREE.Object3D | null = o;
  while (cur) {
    const id = cur.userData?.exhibitId;
    if (id) return id as string;
    cur = cur.parent;
  }
  return null;
}

export default function Targeting() {
  const { camera, scene } = useThree();
  const ray = useMemo(() => new THREE.Raycaster(), []);
  const center = useMemo(() => new THREE.Vector2(0, 0), []);

  useFrame(() => {
    ray.setFromCamera(center, camera);
    ray.far = 30;
    const hits = ray.intersectObjects(scene.children, true);
    let id: string | null = null;
    for (const h of hits) {
      id = findExhibitId(h.object);
      if (id) break;
    }
    if (useExperience.getState().targeted !== id) useExperience.getState().setTargeted(id);
  });

  useEffect(() => {
    const onClick = () => {
      const { targeted, openDetail } = useExperience.getState();
      if (targeted) {
        openDetail(targeted);
        document.exitPointerLock?.(); // on libère la souris pour le panneau
      }
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      useExperience.getState().setTargeted(null);
    };
  }, []);

  return null;
}
