"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import { Object3D, Quaternion, Raycaster, Vector2, Vector3 } from "three";
import type { PointerLockControls as PLC } from "three-stdlib";
import { useVilla, type Aim } from "../store";
import type { ArtworkMeta } from "../world/artworks";

/**
 * Joueur à la première personne : marche ZQSD/WASD + regard souris (pointer
 * lock), bornes de la propriété, détection de zone (HUD), et interaction au
 * centre de l'écran : viser l'hôte (→ conversation) ou une œuvre (→ zoom
 * cinématique + cartel). Le réticule du HUD réagit à ce qui est visé.
 *
 * Monté pour les phases « visiting », « talking » et « inspecting » ; le
 * déplacement n'est actif qu'en « visiting » (gelé pendant chat / inspection).
 */
const EYE = 1.65;
const SPEED = 4.8;
const REACH = 6; // portée d'interaction / de visée (m)

/** Régions navigables (XZ). Le déplacement est bloqué hors de ces boîtes, ce
 *  qui crée de vraies pièces reliées par des portes (ex : hall ↔ cuisine). */
const ROOMS: [number, number, number, number][] = [
  [-10.6, 10.6, -8.3, 13], // hall + terrasse (fond étendu pour le bureau vitré)
  [-11.6, -10.4, -2.3, -0.7], // embrasure porte cuisine
  [-17.4, -11.0, -5.4, 0.4], // cuisine
  [10.4, 11.6, -1.8, -0.2], // embrasure porte bibliothèque
  [11.0, 17.4, -5.4, 0.4], // bibliothèque
  [-3.9, -2.1, -8.7, -8.3], // embrasure porte bureau (mur du fond)
  [-9.5, 3.5, -17, -8.4], // bureau (grande pièce nord)
];
const inAny = (x: number, z: number) =>
  ROOMS.some((b) => x >= b[0] && x <= b[1] && z >= b[2] && z <= b[3]);

/** Premier ancêtre interactif rencontré sur le rayon (centre écran), à portée. */
function pickInteractive(
  ray: Raycaster,
  center: Vector2,
  camera: Object3D,
  children: Object3D[],
): { type: Aim; object: Object3D } | null {
  ray.setFromCamera(center, camera as never);
  const hits = ray.intersectObjects(children, true);
  for (const h of hits) {
    if (h.distance > REACH) break;
    let o: Object3D | null = h.object;
    while (o) {
      const it = o.userData?.interactive as Aim | undefined;
      if (it === "guide" || it === "artwork") return { type: it, object: o };
      o = o.parent;
    }
  }
  return null;
}

export function Player() {
  const { camera, scene, gl } = useThree();
  const controls = useRef<PLC>(null);
  const registerLock = useVilla((s) => s.registerLock);
  const setZone = useVilla((s) => s.setZone);
  const setPhase = useVilla((s) => s.setPhase);
  const setAim = useVilla((s) => s.setAim);
  const inspect = useVilla((s) => s.inspect);

  const keys = useRef({ f: false, b: false, l: false, r: false });
  const dir = useMemo(() => new Vector3(), []);
  const right = useMemo(() => new Vector3(), []);
  const up = useMemo(() => new Vector3(0, 1, 0), []);
  const ray = useMemo(() => new Raycaster(), []);
  const center = useMemo(() => new Vector2(0, 0), []);
  const dummy = useMemo(() => new Object3D(), []);
  // Scratch réutilisés (pas d'allocation dans useFrame / le clic).
  const tmpPos = useMemo(() => new Vector3(), []);
  const tmpQuat = useMemo(() => new Quaternion(), []);
  const tmpNormal = useMemo(() => new Vector3(), []);

  // Tween caméra pour le zoom d'inspection (vers l'œuvre, puis retour).
  const tween = useRef({
    mode: "none" as "none" | "in",
    toPos: new Vector3(),
    toQuat: new Quaternion(),
    savedPos: new Vector3(),
    savedQuat: new Quaternion(),
  });
  const prevPhase = useRef(useVilla.getState().phase);

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

  // Verrouillage du pointeur exposé à l'UI (boutons « Entrer » / fermetures).
  useEffect(() => {
    registerLock(() => controls.current?.lock());
  }, [registerLock]);

  // Interaction au centre de l'écran : viser l'hôte (→ parler) ou une œuvre
  // (→ inspection avec cadrage cinématique).
  useEffect(() => {
    const onClick = () => {
      if (useVilla.getState().phase !== "visiting") return;
      const hit = pickInteractive(ray, center, camera, scene.children);
      if (!hit) return;

      if (hit.type === "guide") {
        setPhase("talking");
        controls.current?.unlock();
        return;
      }

      // Œuvre : on mémorise la vue de marche, puis on cadre l'œuvre de face.
      const o = hit.object;
      const meta = o.userData.meta as ArtworkMeta;
      const halfW = (o.userData.halfWidth as number) ?? 1.2;
      o.getWorldPosition(tmpPos);
      o.getWorldQuaternion(tmpQuat);
      tmpNormal.set(0, 0, 1).applyQuaternion(tmpQuat).normalize();

      const tw = tween.current;
      tw.savedPos.copy(camera.position);
      tw.savedQuat.copy(camera.quaternion);
      tw.toPos.copy(tmpPos).addScaledVector(tmpNormal, 2.2 + halfW * 1.15);
      tw.toPos.y = tmpPos.y; // vue horizontale, centrée sur l'œuvre
      dummy.position.copy(tw.toPos);
      dummy.lookAt(tmpPos);
      tw.toQuat.copy(dummy.quaternion);
      tw.mode = "in";

      inspect(meta);
      controls.current?.unlock();
    };
    const el = gl.domElement;
    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, [camera, scene, gl, ray, center, dummy, tmpPos, tmpQuat, tmpNormal, setPhase, inspect]);

  const zoneRef = useRef("");
  const aimRef = useRef<Aim>(null);
  const tick = useRef(0);

  useFrame((_, delta) => {
    const phase = useVilla.getState().phase;
    const tw = tween.current;

    // Sortie d'inspection : on restaure la vue de marche (cut net — compatible
    // avec le reverrouillage pointeur qui doit suivre le geste de fermeture).
    if (prevPhase.current === "inspecting" && phase !== "inspecting") {
      camera.position.copy(tw.savedPos);
      camera.quaternion.copy(tw.savedQuat);
      tw.mode = "none";
    }
    prevPhase.current = phase;

    // Zoom cinématique vers l'œuvre pendant l'inspection.
    if (tw.mode === "in") {
      const k = Math.min(1, delta * 3.4);
      camera.position.lerp(tw.toPos, k);
      camera.quaternion.slerp(tw.toQuat, k);
      return;
    }

    // Déplacement uniquement en visite (gelé pendant chat / inspection).
    if (phase !== "visiting") return;

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
    else if (nz < -8.5) z = "Bureau";
    else if (nz > 5) z = "Terrasse & piscine";
    else if (nz > -2 && Math.abs(nx) < 3.5) z = "Hall principal";
    else if (nx < -6) z = "Salle à manger";
    else if (nx > 6) z = "Escalier & mezzanine";
    else if (nz < -4) z = "Galerie · collection";
    if (z !== zoneRef.current) {
      zoneRef.current = z;
      setZone(z);
    }

    // Visée du réticule (throttlée pour limiter le coût du raycast).
    tick.current++;
    if (tick.current % 9 === 0) {
      const aim = pickInteractive(ray, center, camera, scene.children)?.type ?? null;
      if (aim !== aimRef.current) {
        aimRef.current = aim;
        setAim(aim);
      }
    }
  });

  return (
    <PointerLockControls
      ref={controls}
      onUnlock={() => {
        // Esc en visite → retour à l'accueil ; en conversation/inspection, on
        // ne touche à rien (la fermeture du panneau gère le retour).
        if (useVilla.getState().phase === "visiting") setPhase("intro");
      }}
    />
  );
}
