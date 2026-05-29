"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Center, Float, Text3D } from "@react-three/drei";
import * as THREE from "three";
import { KEYWORDS, lerpColor } from "./data";

const FONT = "/fonts/helvetiker_bold.typeface.json";

/**
 * Un mot-clé en lettres 3D extrudées, qui apparaît (scale/opacité) autour de
 * sa position dans le voyage et tourne doucement sur lui-même.
 */
function Word({ word, at, final, progressRef }) {
  const group = useRef();
  const matRef = useRef();
  const color = useMemo(() => new THREE.Color(), []);

  // Fenêtre d'apparition : visible autour de `at`. Le mot final reste affiché.
  useFrame((state, dt) => {
    const p = Math.max(0, Math.min(1, progressRef.current));
    let vis;
    if (final) {
      vis = THREE.MathUtils.clamp((p - at + 0.04) / 0.06, 0, 1);
    } else {
      const inT = THREE.MathUtils.clamp((p - (at - 0.06)) / 0.05, 0, 1);
      const outT = 1 - THREE.MathUtils.clamp((p - (at + 0.12)) / 0.05, 0, 1);
      vis = Math.min(inT, outT);
    }

    if (!group.current) return;
    const g = group.current;
    const target = vis;
    // lissage
    g.userData.v = THREE.MathUtils.damp(g.userData.v ?? 0, target, 6, dt);
    const v = g.userData.v;
    const s = (final ? 1.0 : 0.62) * (0.6 + v * 0.4);
    g.scale.setScalar(s);
    g.visible = v > 0.01;

    // Rotation : oscillation pour les mots, rotation continue + lente pour le final
    const t = state.clock.elapsedTime;
    g.rotation.y = final ? t * 0.35 : Math.sin(t * 0.5) * 0.55;

    if (matRef.current) {
      const c = lerpColor(final ? 1 : Math.min(1, p + 0.1));
      color.setRGB(c.r / 255, c.g / 255, c.b / 255);
      matRef.current.color.copy(color);
      matRef.current.emissive.copy(color).multiplyScalar(0.35);
      matRef.current.opacity = v;
    }
  });

  return (
    <Float speed={final ? 1.2 : 2} rotationIntensity={final ? 0.2 : 0.5} floatIntensity={final ? 0.4 : 0.8}>
      <group ref={group} position={[0, 0, 1.5]} scale={0.001}>
        <Center>
          <Text3D
            font={FONT}
            size={1}
            height={0.42}
            curveSegments={8}
            bevelEnabled
            bevelThickness={0.05}
            bevelSize={0.035}
            bevelSegments={4}
          >
            {word}
            <meshStandardMaterial
              ref={matRef}
              metalness={0.95}
              roughness={0.18}
              transparent
              opacity={0}
              toneMapped={false}
            />
          </Text3D>
        </Center>
      </group>
    </Float>
  );
}

export default function Message3D({ progressRef, lang }) {
  const words = KEYWORDS[lang] || KEYWORDS.fr;
  return (
    <group>
      {words.map((w) => (
        <Word key={w.word} {...w} progressRef={progressRef} />
      ))}
    </group>
  );
}
