/**
 * Vol libre (mode « explore ») : aucune physique, aucun mur, aucun sol.
 * On se déplace dans la direction du regard (haut/bas inclus). Souris = regard.
 *  ZQSD/WASD = avancer/strafe · Espace = monter · Shift/C = descendre.
 */
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls, PointerLockControls } from "@react-three/drei";

const SPEED = 9;

export default function FlyController() {
  const { camera } = useThree();
  const [, get] = useKeyboardControls();
  const v = useMemo(() => ({ fwd: new THREE.Vector3(), strafe: new THREE.Vector3(), up: new THREE.Vector3(0, 1, 0), move: new THREE.Vector3() }), []);

  // point de départ propre à l'entrée du mode
  useEffect(() => {
    camera.position.set(0, 1.6, 13);
    camera.lookAt(0, 1, 0);
  }, [camera]);

  useFrame((_, dt) => {
    const { forward, backward, left, right, jump, descend } = get();
    camera.getWorldDirection(v.fwd).normalize();
    v.strafe.crossVectors(v.fwd, v.up).normalize();
    v.move.set(0, 0, 0);
    if (forward) v.move.add(v.fwd);
    if (backward) v.move.sub(v.fwd);
    if (right) v.move.add(v.strafe);
    if (left) v.move.sub(v.strafe);
    if (jump) v.move.add(v.up);
    if (descend) v.move.sub(v.up);
    if (v.move.lengthSq() > 0) {
      v.move.normalize().multiplyScalar(SPEED * dt);
      camera.position.add(v.move);
    }
  });

  return <PointerLockControls />;
}
