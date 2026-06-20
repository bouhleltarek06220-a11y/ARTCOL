"use client";

import { useEffect, useMemo, useRef } from "react";
import { Html, useAnimations, useGLTF } from "@react-three/drei";
import { Group, type Mesh } from "three";

/**
 * Hôte / gardien de la villa-galerie : vrai modèle 3D rigué (RobotExpressive,
 * three.js — CC) avec animation d'attente « Idle ». Cliquable (raycast
 * centre-écran géré par le <Player/>) pour lancer la conversation : le groupe
 * porte `userData.interactive = "guide"`.
 */
const MODEL = "/models/RobotExpressive.glb";

export function CharacterGuide({
  position = [-3.4, 0, 1.2],
  rotation = 0.2,
  scale = 0.42,
}: {
  position?: [number, number, number];
  rotation?: number;
  scale?: number;
}) {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(MODEL);
  const { actions } = useAnimations(animations, group);

  // Ombres portées sur le modèle.
  useMemo(() => {
    scene.traverse((o) => {
      const m = o as Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
      }
    });
  }, [scene]);

  // Animation d'attente en boucle (respiration / vie).
  useEffect(() => {
    const idle = actions["Idle"];
    idle?.reset().fadeIn(0.4).play();
    return () => {
      idle?.fadeOut(0.2);
    };
  }, [actions]);

  return (
    <group
      ref={group}
      position={position}
      rotation={[0, rotation, 0]}
      userData={{ interactive: "guide" }}
    >
      <group scale={scale}>
        <primitive object={scene} />
      </group>

      {/* Halo lumineux chaud pour attirer l'attention. */}
      <pointLight position={[0, 1.7, 1.2]} intensity={4} distance={5} decay={2} color="#ffdca6" />

      {/* Invitation au-dessus de la tête. */}
      <Html position={[0, 2.15, 0]} center distanceFactor={9} occlude={false}>
        <div
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 15,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#f7f2e9",
            background: "rgba(20,16,11,.5)",
            border: "1px solid rgba(169,138,92,.6)",
            padding: "5px 12px",
            borderRadius: 2,
            whiteSpace: "nowrap",
            textShadow: "0 1px 10px rgba(0,0,0,.6)",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          Parler à l’hôte
        </div>
      </Html>
    </group>
  );
}

useGLTF.preload(MODEL);
