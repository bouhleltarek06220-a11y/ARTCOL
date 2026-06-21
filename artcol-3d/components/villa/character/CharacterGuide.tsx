"use client";

import { useEffect, useMemo, useRef } from "react";
import { Html, useAnimations, useGLTF } from "@react-three/drei";
import { Group, type Mesh } from "three";

/**
 * Hôte de la villa-galerie : modèle 3D humain rigué neutre (CesiumMan, Khronos —
 * CC-BY 4.0, attribution dans public/models/README.md). Placeholder « humain
 * normal » en attendant l'avatar perso (ReadyPlayerMe) de l'hôte. Cliquable
 * (raycast centre-écran géré par le <Player/>) : `userData.interactive = "guide"`.
 */
const MODEL = "/models/CesiumMan.glb";

export function CharacterGuide({
  position = [-3.4, 0, 1.2],
  rotation = 0.2,
  scale = 1,
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

  // Animation d'attente : si une clip « Idle » existe, on la joue en boucle ;
  // sinon (cas CesiumMan, seule une marche) on GÈLE la pose à ~35 % du cycle
  // pour obtenir une posture debout naturelle (pas de marche sur place).
  useEffect(() => {
    const names = Object.keys(actions);
    const idleName = names.find((n) => /idle/i.test(n));
    const clip = idleName ? actions[idleName] : names.length ? actions[names[0]] : undefined;
    if (!clip) return;
    clip.reset().fadeIn(0.4).play();
    if (!idleName) {
      clip.paused = true;
      clip.time = 0.35 * clip.getClip().duration;
    }
    return () => {
      clip.fadeOut(0.2);
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
