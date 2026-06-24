/**
 * Caméra sur rail : position = camCurve(t), regard = focusCurve(t), avec lissage
 * et légère parallaxe souris. Seul endroit qui bouge la caméra.
 */
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { camCurve, focusCurve } from "@/lib/path";
import { useExperience } from "@/stores/useExperience";

export default function CameraRig() {
  const { camera } = useThree();
  const t = useRef(0);
  const pos = useRef(new THREE.Vector3());
  const foc = useRef(new THREE.Vector3());
  const focSmooth = useRef(new THREE.Vector3(0, 1, -2));

  useFrame((state, dt) => {
    const { target, setT } = useExperience.getState();

    t.current = THREE.MathUtils.damp(t.current, target, 3.2, dt);
    const tt = THREE.MathUtils.clamp(t.current, 0, 1);

    // getPoint (param. uniforme) : le nœud i tombe EXACTEMENT à t = i/(n-1),
    // donc chaque œuvre est parfaitement cadrée quand on s'y arrête.
    camCurve.getPoint(tt, pos.current);
    const px = state.pointer.x;
    const py = state.pointer.y;
    camera.position.set(pos.current.x + px * 1.1, pos.current.y + py * 0.5, pos.current.z);

    focusCurve.getPoint(tt, foc.current);
    foc.current.x += px * 0.8;
    focSmooth.current.lerp(foc.current, 1 - Math.pow(0.0008, dt));
    camera.lookAt(focSmooth.current);

    if (Math.abs(useExperience.getState().t - tt) > 0.0005) setT(tt);
  });

  return null;
}
