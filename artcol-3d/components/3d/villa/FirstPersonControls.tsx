"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import { Vector3 } from "three";

/**
 * Navigation à la première personne : clic pour verrouiller la souris (regard),
 * ZQSD / WASD / flèches pour marcher. Hauteur d'œil fixe, déplacement borné à
 * la propriété pour pouvoir entrer dans la villa et la parcourir.
 */
const EYE = 1.65;
const SPEED = 4.6;

export function FirstPersonControls() {
  const { camera } = useThree();
  const keys = useRef({ f: false, b: false, l: false, r: false });

  // Vecteurs temporaires réutilisés (pas d'allocation par frame).
  const dir = useMemo(() => new Vector3(), []);
  const right = useMemo(() => new Vector3(), []);
  const up = useMemo(() => new Vector3(0, 1, 0), []);

  useEffect(() => {
    // Position de départ : devant l'entrée, regard vers la villa.
    camera.position.set(-6.5, EYE, 11);
    camera.lookAt(-6.5, EYE, 0);

    const onDown = (e: KeyboardEvent) => set(e.code, true);
    const onUp = (e: KeyboardEvent) => set(e.code, false);
    const set = (code: string, v: boolean) => {
      switch (code) {
        case "KeyW":
        case "KeyZ":
        case "ArrowUp":
          keys.current.f = v;
          break;
        case "KeyS":
        case "ArrowDown":
          keys.current.b = v;
          break;
        case "KeyA":
        case "KeyQ":
        case "ArrowLeft":
          keys.current.l = v;
          break;
        case "KeyD":
        case "ArrowRight":
          keys.current.r = v;
          break;
      }
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((_, delta) => {
    const step = SPEED * delta;
    camera.getWorldDirection(dir);
    dir.y = 0;
    dir.normalize();
    right.crossVectors(dir, up).normalize();

    const k = keys.current;
    if (k.f) camera.position.addScaledVector(dir, step);
    if (k.b) camera.position.addScaledVector(dir, -step);
    if (k.r) camera.position.addScaledVector(right, step);
    if (k.l) camera.position.addScaledVector(right, -step);

    // Bornes de la propriété (on reste au sol, à hauteur d'œil).
    camera.position.x = Math.max(-10.3, Math.min(10.3, camera.position.x));
    camera.position.z = Math.max(-8, Math.min(13, camera.position.z));
    camera.position.y = EYE;
  });

  return <PointerLockControls makeDefault />;
}
