/**
 * Un VRAI modèle 3D animé (glTF) — gardien robot de la galerie.
 * Chargé via useGLTF, animé via useAnimations (le robot bouge en continu).
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

type Props = {
  position?: [number, number, number];
  scale?: number;
  clip?: string;
  spin?: number;
  accent?: string;
};

export default function Robot({
  position = [0, 0, 0],
  scale = 2.4,
  clip = "Dance",
  spin = 0.35,
  accent = "#36e0ff",
}: Props) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/assets/models/robot.glb");
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    const a = actions[clip] ?? actions[names[0]];
    a?.reset().fadeIn(0.4).play();
    return () => {
      a?.fadeOut(0.3);
    };
  }, [actions, names, clip]);

  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * spin;
  });

  return (
    <group position={position}>
      {/* socle néon */}
      <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.4, 1.75, 48]} />
        <meshBasicMaterial color={accent} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      {/* éclairage dédié */}
      <pointLight position={[0, 3, 2.5]} intensity={28} color={accent} distance={16} />
      <spotLight position={[2.5, 7, 4]} angle={0.6} penumbra={0.7} intensity={140} color="#ffffff" distance={34} />
      <group ref={group} scale={scale}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

useGLTF.preload("/assets/models/robot.glb");
