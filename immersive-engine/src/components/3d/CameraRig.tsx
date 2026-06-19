/**
 * Déplace la caméra le long du rail en fonction de `target` (input utilisateur),
 * avec un lissage cinématique. Ajoute une légère parallaxe à la souris.
 * C'est le SEUL endroit qui bouge la caméra.
 */
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { curve } from "@/lib/path";
import { useExperience } from "@/stores/useExperience";

export default function CameraRig() {
  const { camera } = useThree();
  const t = useRef(0);
  const pos = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());
  const lookSmooth = useRef(new THREE.Vector3(0, 0, -1));

  useFrame((state, dt) => {
    const { target, setT } = useExperience.getState();

    // lissage exponentiel (damp) : mouvement fluide quel que soit le FPS
    t.current = THREE.MathUtils.damp(t.current, target, 3.5, dt);
    const tt = THREE.MathUtils.clamp(t.current, 0, 1);

    // point courant sur le rail + hauteur "yeux"
    curve.getPointAt(tt, pos.current);
    const px = state.pointer.x; // -1..1
    const py = state.pointer.y;
    camera.position.set(
      pos.current.x + px * 1.4,
      pos.current.y + 1.3 + py * 0.7,
      pos.current.z,
    );

    // point visé : un peu plus loin sur le rail (on regarde vers l'avant)
    curve.getPointAt(Math.min(tt + 0.02, 1), look.current);
    look.current.x += px * 1.4;
    look.current.y += 1.3 + py * 0.7;
    lookSmooth.current.lerp(look.current, 1 - Math.pow(0.0001, dt));
    camera.lookAt(lookSmooth.current);

    if (Math.abs(useExperience.getState().t - tt) > 0.0005) setT(tt);
  });

  return null;
}
