/**
 * Contrôleur de marche 1re personne (mode « explore »).
 * Corps physique capsule (rapier) + regard souris (PointerLockControls) +
 * déplacement clavier (drei KeyboardControls). Gravité & collisions = rapier.
 */
import { useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, CapsuleCollider, type RapierRigidBody } from "@react-three/rapier";
import { useKeyboardControls, PointerLockControls } from "@react-three/drei";

const SPEED = 5;
const JUMP = 5;
const dir = new THREE.Vector3();
const front = new THREE.Vector3();
const side = new THREE.Vector3();

export default function Player() {
  const body = useRef<RapierRigidBody>(null);
  const { camera } = useThree();
  const [, get] = useKeyboardControls();

  useFrame(() => {
    if (!body.current) return;
    const { forward, backward, left, right, jump } = get();

    // la caméra suit le corps, à hauteur des yeux
    const t = body.current.translation();
    camera.position.set(t.x, t.y + 0.8, t.z);

    // direction de déplacement à partir du regard (projeté au sol)
    front.set(0, 0, -1).applyQuaternion(camera.quaternion); front.y = 0; front.normalize();
    side.set(1, 0, 0).applyQuaternion(camera.quaternion); side.y = 0; side.normalize();
    dir.set(0, 0, 0);
    if (forward) dir.add(front);
    if (backward) dir.sub(front);
    if (right) dir.add(side);
    if (left) dir.sub(side);
    dir.normalize().multiplyScalar(SPEED);

    const v = body.current.linvel();
    body.current.setLinvel({ x: dir.x, y: v.y, z: dir.z }, true);
    if (jump && Math.abs(v.y) < 0.06) body.current.setLinvel({ x: dir.x, y: JUMP, z: dir.z }, true);
  });

  return (
    <>
      <RigidBody
        ref={body}
        colliders={false}
        type="dynamic"
        mass={1}
        position={[0, 2, 9]}
        enabledRotations={[false, false, false]}
        canSleep={false}
      >
        <CapsuleCollider args={[0.6, 0.4]} />
      </RigidBody>
      <PointerLockControls />
    </>
  );
}
