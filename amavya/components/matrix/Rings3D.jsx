"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { lerpColor } from "./data";

/**
 * Anneaux en vraie 3D qui défilent vers la caméra (tunnel infini), faits de
 * géométrie torique réelle : on peut donc orbiter et les voir sous tous les
 * angles. Couleur vert → or selon le voyage.
 */

const COUNT = 26;
const SPAN = 70; // longueur du tunnel sur Z
const START = -52;

export default function Rings3D({ progressRef }) {
  const refs = useRef([]);
  const matRefs = useRef([]);
  const color = useMemo(() => new THREE.Color(), []);

  const rings = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => ({
        z: START + (i / COUNT) * SPAN,
        r: 2.6 + Math.sin(i * 1.7) * 0.5,
        tilt: (Math.random() - 0.5) * 0.5,
        spin: (Math.random() - 0.5) * 0.4,
        squash: 0.85 + Math.random() * 0.3,
      })),
    [],
  );

  useFrame((state, dt) => {
    const p = Math.max(0, Math.min(1, progressRef.current));
    const c = lerpColor(p);
    color.setRGB(c.r / 255, c.g / 255, c.b / 255);
    const speed = 4 + p * 6;

    rings.forEach((ring, i) => {
      const m = refs.current[i];
      if (!m) return;
      m.position.z += dt * speed;
      if (m.position.z > 12) m.position.z -= SPAN;
      m.rotation.z += dt * ring.spin;

      // Fondu en entrée (loin) et en sortie (près de la caméra)
      const z = m.position.z;
      const near = THREE.MathUtils.clamp((12 - z) / 6, 0, 1);
      const far = THREE.MathUtils.clamp((z - START) / 10, 0, 1);
      const mat = matRefs.current[i];
      if (mat) {
        mat.color.copy(color);
        mat.opacity = Math.min(near, far) * 0.95;
      }
    });
  });

  return (
    <group>
      {rings.map((ring, i) => (
        <mesh
          key={i}
          ref={(el) => (refs.current[i] = el)}
          position={[0, 0, ring.z]}
          rotation={[Math.PI / 2 + ring.tilt, 0, 0]}
          scale={[1, ring.squash, 1]}
        >
          <torusGeometry args={[ring.r, 0.045, 10, 64]} />
          <meshBasicMaterial
            ref={(el) => (matRefs.current[i] = el)}
            transparent
            opacity={0}
            toneMapped={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}
