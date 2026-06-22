"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Quaternion, Vector3 } from "three";
import { useVilla } from "../store";
import { WAYPOINTS } from "../world/waypoints";

/**
 * Visite guidée : au clic d'une destination (store.tourGo), glisse la caméra du
 * point de vue courant vers le waypoint cible — position lerpée + orientation
 * slerpée, easing easeInOutCubic ~1.1 s (modèle kellydev.io, sans GSAP). Pendant
 * le vol, `tourBusy` gèle la marche libre et verrouille les boutons.
 */
const DURATION = 1.15; // secondes
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function TourController() {
  const { camera } = useThree();
  const tourArrived = useVilla((s) => s.tourArrived);

  const fromPos = useMemo(() => new Vector3(), []);
  const toPos = useMemo(() => new Vector3(), []);
  const fromQuat = useMemo(() => new Quaternion(), []);
  const toQuat = useMemo(() => new Quaternion(), []);
  // Vraie caméra-repère : Object3D.lookAt inverse œil/cible pour un non-caméra,
  // donc on utilise une PerspectiveCamera pour obtenir la bonne orientation.
  const dummy = useMemo(() => new PerspectiveCamera(), []);

  const anim = useRef<{ active: boolean; t: number }>({ active: false, t: 0 });
  const lastN = useRef(0);

  // Démarre un vol quand une nouvelle destination est demandée (jeton .n).
  useEffect(() => {
    const unsub = useVilla.subscribe((s) => {
      const go = s.tourGo;
      if (!go || go.n === lastN.current) return;
      lastN.current = go.n;
      const wp = WAYPOINTS[go.id];
      if (!wp) {
        tourArrived();
        return;
      }
      fromPos.copy(camera.position);
      fromQuat.copy(camera.quaternion);
      toPos.set(wp.pos[0], wp.pos[1], wp.pos[2]);
      dummy.position.copy(toPos);
      dummy.lookAt(wp.target[0], wp.target[1], wp.target[2]);
      toQuat.copy(dummy.quaternion);
      anim.current.active = true;
      anim.current.t = 0;
    });
    return unsub;
  }, [camera, fromPos, toPos, fromQuat, toQuat, dummy, tourArrived]);

  useFrame((_, delta) => {
    const a = anim.current;
    if (!a.active) return;
    a.t = Math.min(1, a.t + delta / DURATION);
    const k = easeInOutCubic(a.t);
    camera.position.lerpVectors(fromPos, toPos, k);
    camera.quaternion.slerpQuaternions(fromQuat, toQuat, k);
    if (a.t >= 1) {
      a.active = false;
      tourArrived();
    }
  });

  return null;
}
