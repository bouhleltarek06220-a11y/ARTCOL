/**
 * Gardien robot 3D (glTF animé) — PNJ réactif : quand le joueur s'approche,
 * il se tourne vers lui, change d'animation (salut) et affiche un message.
 */
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useGLTF, useAnimations, Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

type Props = {
  position?: [number, number, number];
  scale?: number;
  accent?: string;
  nearClip?: string;
  idleClip?: string;
};

export default function Robot({
  position = [0, 0, 0],
  scale = 1.5,
  accent = "#7CFF3D",
  nearClip = "Wave",
  idleClip = "Idle",
}: Props) {
  const inner = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const { scene, animations } = useGLTF("/assets/models/robot.glb");
  const { actions, names } = useAnimations(animations, inner);
  const [near, setNear] = useState(false);
  const cur = useRef<string>("");

  // joue l'animation correspondant à l'état (avec fondu)
  useEffect(() => {
    const want = (near ? actions[nearClip] : actions[idleClip]) ? (near ? nearClip : idleClip) : names[0];
    if (want === cur.current) return;
    actions[cur.current]?.fadeOut(0.3);
    actions[want]?.reset().fadeIn(0.3).play();
    cur.current = want;
  }, [near, actions, names, nearClip, idleClip]);

  const pos = new THREE.Vector3(...position);
  useFrame((_, dt) => {
    if (!inner.current) return;
    const d = camera.position.distanceTo(pos);
    const isNear = d < 7.5;
    if (isNear !== near) setNear(isNear);

    if (isNear) {
      // se tourne vers le joueur
      const target = Math.atan2(camera.position.x - position[0], camera.position.z - position[2]);
      let cy = inner.current.rotation.y;
      let diff = target - cy;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      inner.current.rotation.y = cy + diff * Math.min(1, dt * 4);
    } else {
      inner.current.rotation.y += dt * 0.3; // tourne doucement
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.4, 1.75, 48]} />
        <meshBasicMaterial color={accent} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      <pointLight position={[0, 3, 2.5]} intensity={near ? 50 : 28} color={accent} distance={16} />
      <spotLight position={[2.5, 7, 4]} angle={0.6} penumbra={0.7} intensity={140} color="#ffffff" distance={34} />
      <group ref={inner} scale={scale}>
        <primitive object={scene} />
      </group>
      {near && (
        <Html position={[0, 3.6, 0]} center distanceFactor={12} prepend>
          <div className="robot-greet" style={{ borderColor: accent, color: accent }}>
            ようこそ · Bienvenue dans AMAVYA
          </div>
        </Html>
      )}
    </group>
  );
}

useGLTF.preload("/assets/models/robot.glb");
