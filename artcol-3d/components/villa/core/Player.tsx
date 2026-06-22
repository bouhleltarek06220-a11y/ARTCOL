"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import { Euler, Object3D, Quaternion, Raycaster, Vector2, Vector3 } from "three";
import type { PointerLockControls as PLC } from "three-stdlib";
import { useVilla, type Aim } from "../store";
import type { ArtworkMeta } from "../world/artworks";
import { touchInput } from "./touchInput";
import { CORE, CORE_LEVELS, inCore, onCoreWalk, coreHeights } from "../dimensions";

/**
 * Joueur à la première personne.
 *
 * Bureau : marche ZQSD/WASD + regard souris (pointer lock).
 * Mobile / tablette : joystick (déplacement) + glisser sur la scène (regard),
 *   sans pointer lock — la caméra est alors pilotée par des angles maison.
 *
 * Interaction au centre de l'écran : viser l'hôte (→ conversation) ou une œuvre
 * (→ zoom cinématique + cartel). Le réticule du HUD réagit à ce qui est visé.
 */
const EYE = 1.65;
const SPEED = 4.8;
const REACH = 12; // portée d'interaction / de visée (m)
const LOOK_SENS = 0.0032; // sensibilité du regard tactile

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

/* ===== Niveaux & NOYAU de circulation (source unique = dimensions.ts) =====
 * Tous les escaliers sont UN seul noyau empilé (CORE), partagé pixel pour pixel
 * avec la géométrie (CoreStairs). Hors-noyau, chaque niveau est une empreinte
 * praticable simple. Dans le noyau, `coreHeights` donne les hauteurs candidates
 * de toutes les volées empilées ; on choisit la plus proche de la hauteur
 * courante (la continuité du déplacement lève l'ambiguïté — aucun état). */
const FLOOR1 = CORE.Y.r1; // 3.95
const FLOOR2 = CORE.Y.r2; // 7.75
const BASE_FLOOR = CORE.Y.s1; // -3.85
/** Empreintes praticables HORS noyau, par niveau. */
const onFloor1 = (x: number, z: number) => x >= -10.4 && x <= 10.4 && z >= -8.4 && z <= -3.5;
const onFloor2 = (x: number, z: number) => x >= -10.4 && x <= 10.4 && z >= -8.4 && z <= -3.5;
const inBasement = (x: number, z: number) => x >= -10.4 && x <= 10.4 && z >= -8.2 && z <= 2.2;

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

export function Player({ touch = false }: { touch?: boolean }) {
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
  const tmpEuler = useMemo(() => new Euler(0, 0, 0, "YXZ"), []);
  // Angles de regard tactile (yaw/pitch), entretenus à la main.
  const look = useRef({ yaw: 0, pitch: 0 });

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
    camera.lookAt(-6.5, EYE, 0); // regard vers -Z → yaw/pitch = 0

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
  // Sur tactile, pas de pointer lock : la fonction est inerte.
  useEffect(() => {
    registerLock(() => controls.current?.lock());
  }, [registerLock]);

  // Regard tactile : glisser sur la scène fait tourner la caméra. On suit un
  // doigt précis (par identifiant) pour cohabiter avec le joystick.
  useEffect(() => {
    if (!touch) return;
    const el = gl.domElement;
    let id: number | null = null;
    let lastX = 0;
    let lastY = 0;
    let moved = 0;

    const onStart = (e: TouchEvent) => {
      if (id !== null) return;
      for (const t of Array.from(e.changedTouches)) {
        if (t.target === el) {
          id = t.identifier;
          lastX = t.clientX;
          lastY = t.clientY;
          moved = 0;
          touchInput.suppressTap = false;
          break;
        }
      }
    };
    const onMove = (e: TouchEvent) => {
      if (id === null) return;
      for (const t of Array.from(e.touches)) {
        if (t.identifier !== id) continue;
        const dx = t.clientX - lastX;
        const dy = t.clientY - lastY;
        lastX = t.clientX;
        lastY = t.clientY;
        moved += Math.abs(dx) + Math.abs(dy);
        touchInput.look.dx += dx;
        touchInput.look.dy += dy;
        if (moved > 12) touchInput.suppressTap = true;
        break;
      }
    };
    const onEnd = (e: TouchEvent) => {
      for (const t of Array.from(e.changedTouches)) {
        if (t.identifier === id) {
          id = null;
          break;
        }
      }
    };
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: true });
    el.addEventListener("touchend", onEnd, { passive: true });
    el.addEventListener("touchcancel", onEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onEnd);
    };
  }, [touch, gl]);

  // Interaction au centre de l'écran : viser l'hôte (→ parler) ou une œuvre
  // (→ inspection avec cadrage cinématique). Déclenché au clic (souris) ou au
  // tap (mobile) — un glissé de regard annule le tap (suppressTap).
  useEffect(() => {
    const onClick = () => {
      if (useVilla.getState().phase !== "visiting") return;
      if (touchInput.suppressTap) {
        touchInput.suppressTap = false;
        return;
      }
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
  const level = useRef(0); // 0 = sol, 1 = mezzanine (étage)

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

    // Regard tactile : applique les deltas accumulés et reconstruit la caméra.
    if (touch) {
      const lk = look.current;
      lk.yaw -= touchInput.look.dx * LOOK_SENS;
      lk.pitch -= touchInput.look.dy * LOOK_SENS;
      lk.pitch = Math.max(-1.3, Math.min(1.3, lk.pitch));
      touchInput.look.dx = 0;
      touchInput.look.dy = 0;
      tmpEuler.set(lk.pitch, lk.yaw, 0);
      camera.quaternion.setFromEuler(tmpEuler);
    }

    const step = SPEED * delta;
    camera.getWorldDirection(dir);
    dir.y = 0;
    dir.normalize();
    right.crossVectors(dir, up).normalize();

    const px = camera.position.x;
    const pz = camera.position.z;

    const k = keys.current;
    const mf = (k.f ? 1 : 0) - (k.b ? 1 : 0) + (touch ? touchInput.move.y : 0);
    const mr = (k.r ? 1 : 0) - (k.l ? 1 : 0) + (touch ? touchInput.move.x : 0);
    if (mf) camera.position.addScaledVector(dir, mf * step);
    if (mr) camera.position.addScaledVector(right, mr * step);

    // Collisions : on reste dans les pièces (ou sur l'escalier selon la hauteur
    // courante), glissement le long des murs.
    // NOYAU : on n'est « sur » une volée que si l'une de ses hauteurs candidates
    // est proche de la hauteur actuelle (continuité) — sinon on passe DESSOUS
    // (trémie/vide) sans être téléporté. Source unique : CORE/coreHeights.
    const curY = camera.position.y - EYE;
    const coreStep = (x: number, zz: number): number | null => {
      if (!onCoreWalk(x, zz)) return null;
      let best: number | null = null;
      let bd = Infinity;
      for (const h of coreHeights(x, zz)) {
        const d = Math.abs(h - curY);
        if (d < bd) {
          bd = d;
          best = h;
        }
      }
      return best !== null && bd <= 1.3 ? best : null;
    };
    const valid = (x: number, zz: number) => {
      if (coreStep(x, zz) !== null) return true;
      if (inCore(x, zz)) return false; // trémie (vide)
      if (level.current === 2) return onFloor2(x, zz);
      if (level.current === 1) return onFloor1(x, zz);
      if (level.current === -1) return inBasement(x, zz);
      return inAny(x, zz);
    };
    let nx = camera.position.x;
    let nz = camera.position.z;
    if (!valid(nx, nz)) {
      if (valid(nx, pz)) nz = pz;
      else if (valid(px, nz)) nx = px;
      else {
        nx = px;
        nz = pz;
      }
    }
    camera.position.x = nx;
    camera.position.z = nz;

    // Hauteur de l'œil : sur le noyau, hauteur de volée la plus proche (+ bascule
    // de niveau = sol empilé le plus proche) ; sinon, sol du niveau courant.
    const cs = coreStep(nx, nz);
    if (cs !== null) {
      camera.position.y = cs + EYE;
      let li = 0;
      let bd = Infinity;
      for (let i = 0; i < CORE_LEVELS.length; i++) {
        const d = Math.abs(CORE_LEVELS[i] - cs);
        if (d < bd) {
          bd = d;
          li = i;
        }
      }
      level.current = li - 1; // s1→-1, r0→0, r1→1, r2→2
    } else if (level.current === 2) {
      camera.position.y = FLOOR2 + EYE;
    } else if (level.current === 1) {
      camera.position.y = FLOOR1 + EYE;
    } else if (level.current === -1) {
      camera.position.y = BASE_FLOOR + EYE;
    } else {
      camera.position.y = EYE;
    }

    let z = "Galerie principale";
    if (level.current === -1) z = "Sous-sol · spa";
    else if (level.current === 2) z = "Étage · chambres";
    else if (level.current === 1) z = "Mezzanine · étage";
    else if (onCoreWalk(nx, nz)) z = "Escalier";
    else if (nx < -11) z = "Cuisine";
    else if (nx > 11) z = "Bibliothèque";
    else if (nz < -8.5) z = "Bureau";
    else if (nz > 5) z = "Terrasse & piscine";
    else if (nz > -2 && Math.abs(nx) < 3.5) z = "Hall principal";
    else if (nx < -6) z = "Salle à manger";
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

  // Sur tactile, pas de PointerLockControls (incompatible) : la caméra est
  // pilotée par les angles de regard maison.
  if (touch) return null;

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
