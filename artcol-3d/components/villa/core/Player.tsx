"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import { Object3D, Raycaster, Vector2, Vector3 } from "three";
import type { PointerLockControls as PLC } from "three-stdlib";
import { useVilla } from "../store";

/**
 * Joueur à la première personne : marche ZQSD/WASD + regard souris (pointer
 * lock), bornes de la propriété, détection de zone (HUD), et interaction au
 * centre de l'écran : viser l'hôte puis cliquer lance la conversation.
 *
 * Monté pour les phases « visiting » et « talking » ; le déplacement n'est
 * actif qu'en « visiting » (gelé pendant la conversation et l'inspection).
 */
const EYE = 1.65;
const SPEED = 4.8;

/** Régions navigables (XZ). Le déplacement est bloqué hors de ces boîtes, ce
 *  qui crée de vraies pièces reliées par des portes (ex : hall ↔ cuisine). */
const ROOMS: [number, number, number, number][] = [
  [-10.6, 10.6, -8.3, 13], // hall + terrasse (fond étendu pour le bureau vitré)
  [-11.6, -10.4, -2.3, -0.7], // embrasure porte cuisine
  [-17.4, -11.0, -5.4, 0.4], // cuisine
  [10.4, 11.6, -1.8, -0.2], // embrasure porte bibliothèque
  [11.0, 17.4, -5.4, 0.4], // bibliothèque
];
const inAny = (x: number, z: number) =>
  ROOMS.some((b) => x >= b[0] && x <= b[1] && z >= b[2] && z <= b[3]);

export function Player() {
  const { camera, scene, gl } = useThree();
  const controls = useRef<PLC>(null);
  const registerLock = useVilla((s) => s.registerLock);
  const setZone = useVilla((s) => s.setZone);
  const setPhase = useVilla((s) => s.setPhase);

  const keys = useRef({ f: false, b: false, l: false, r: false });
  const dir = useMemo(() => new Vector3(), []);
  const right = useMemo(() => new Vector3(), []);
  const up = useMemo(() => new Vector3(0, 1, 0), []);
  const ray = useMemo(() => new Raycaster(), []);
  const center = useMemo(() => new Vector2(0, 0), []);

  useEffect(() => {
    camera.position.set(-6.5, EYE, 11);
    camera.lookAt(-6.5, EYE, 0);

    const set = (code: string, v: boolean) => {
      switch (code) {
        case "KeyW": case "KeyZ": case "ArrowUp": keys.current.f = v; break;
        case "KeyS": case "ArrowDown": keys.current.b = v; break;
        case "KeyA": case "KeyQ": case "ArrowLeft": keys.current.l = v; break;
        case "KeyD": case "ArrowRight": keys.current.r = v; break;
      }
    };
    const onDown = (e: KeyboardEvent) => set(e.code, true);
    const onUp = (e: KeyboardEvent) => set(e.code, false);
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [camera]);

  // Verrouillage du pointeur exposé à l'UI (boutons « Entrer » / fermeture chat).
  useEffect(() => {
    registerLock(() => controls.current?.lock());
  }, [registerLock]);

  // Interaction au centre de l'écran : viser l'hôte et cliquer → conversation.
  useEffect(() => {
    const onClick = () => {
      if (useVilla.getState().phase !== "visiting") return;
      ray.setFromCamera(center, camera);
      const hits = ray.intersectObjects(scene.children, true);
      for (const h of hits) {
        if (h.distance > 6) break;
        let o: Object3D | null = h.object;
        while (o) {
          if (o.userData?.interactive === "guide") {
            setPhase("talking");
            controls.current?.unlock();
            return;
          }
          o = o.parent;
        }
      }
    };
    const el = gl.domElement;
    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, [camera, scene, gl, ray, center, setPhase]);

  const zoneRef = useRef("");
  useFrame((_, delta) => {
    // Déplacement uniquement en visite (gelé pendant chat / inspection).
    if (useVilla.getState().phase !== "visiting") return;

    const step = SPEED * delta;
    camera.getWorldDirection(dir);
    dir.y = 0;
    dir.normalize();
    right.crossVectors(dir, up).normalize();

    const px = camera.position.x;
    const pz = camera.position.z;

    const k = keys.current;
    if (k.f) camera.position.addScaledVector(dir, step);
    if (k.b) camera.position.addScaledVector(dir, -step);
    if (k.r) camera.position.addScaledVector(right, step);
    if (k.l) camera.position.addScaledVector(right, -step);

    // Collisions : on reste dans les pièces, glissement le long des murs.
    let nx = camera.position.x;
    let nz = camera.position.z;
    if (!inAny(nx, nz)) {
      if (inAny(nx, pz)) nz = pz;
      else if (inAny(px, nz)) nx = px;
      else {
        nx = px;
        nz = pz;
      }
    }
    camera.position.x = nx;
    camera.position.z = nz;
    camera.position.y = EYE;

    let z = "Galerie principale";
    if (nx < -11) z = "Cuisine";
    else if (nx > 11) z = "Bibliothèque";
    else if (nz > 5) z = "Terrasse & piscine";
    else if (nz > -2 && Math.abs(nx) < 3.5) z = "Hall principal";
    else if (nx < -6) z = "Salle à manger";
    else if (nx > 6) z = "Escalier & mezzanine";
    else if (nz < -4) z = "Galerie · collection";
    if (z !== zoneRef.current) {
      zoneRef.current = z;
      setZone(z);
    }
  });

  return (
    <PointerLockControls
      ref={controls}
      onUnlock={() => {
        // Esc en visite → retour à l'accueil ; en conversation, on ne touche à rien.
        if (useVilla.getState().phase === "visiting") setPhase("intro");
      }}
    />
  );
}
