"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Monde de code à 360° : la pluie de code est dessinée dans un canvas 2D
 * (offscreen) puis plaquée tout autour de la caméra via :
 *  - 3 cylindres concentriques ouverts (ambiance 360°, vus de l'intérieur)
 *  - des lamelles verticales ("rideaux") disposées en anneau, que l'on
 *    traverse en orbitant / zoomant.
 * La couleur des glyphes interpole vert (Matrix) → or (AMAVYA) selon le
 * scroll/voyage (progressRef).
 */

const TEX = 256;
const CELL = 14;
const COLS = Math.floor(TEX / CELL);

const GLYPHS = Array.from({ length: 90 }, (_, i) => String.fromCharCode(0x30a1 + i)).concat(
  "0123456789{}[]()<>=+*#$%&@".split(""),
);

// Construit une texture de pluie partagée + N clones (pour varier le mapping)
function useRainTextures(cloneCount) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = TEX;
    canvas.height = TEX;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, TEX, TEX);

    const base = new THREE.CanvasTexture(canvas);
    base.wrapS = base.wrapT = THREE.RepeatWrapping;
    base.minFilter = THREE.LinearFilter;
    base.magFilter = THREE.LinearFilter;

    const clones = Array.from({ length: cloneCount }, () => {
      const t = base.clone();
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.needsUpdate = true;
      return t;
    });

    const drops = Array.from({ length: COLS }, () => Math.floor(Math.random() * 30));

    return { canvas, ctx, base, clones, drops };
  }, [cloneCount]);
}

export default function CodeWorld({ progressRef }) {
  const cylRefs = useRef([]);
  const ribbonGroup = useRef();
  const ribbonRefs = useRef([]);

  // 6 textures clones : 0-2 pour les cylindres, 3-5 pour les lamelles
  // (séparées car le repeat d'une texture est partagé entre ses meshes)
  const { ctx, base, clones, drops } = useRainTextures(6);

  // Définition des cylindres ambiants
  const cylinders = useMemo(
    () => [
      { r: 7, h: 34, rep: [Math.round((2 * Math.PI * 7) / 4), 5], speed: 0.04, dir: 1, tex: 0, op: 0.55 },
      { r: 11, h: 40, rep: [Math.round((2 * Math.PI * 11) / 5), 6], speed: 0.03, dir: -1, tex: 1, op: 0.4 },
      { r: 16, h: 46, rep: [Math.round((2 * Math.PI * 16) / 6), 7], speed: 0.02, dir: 1, tex: 2, op: 0.28 },
    ],
    [],
  );

  // Lamelles verticales ("rideaux") disposées en anneau
  const ribbons = useMemo(() => {
    const COUNT = 22;
    return Array.from({ length: COUNT }, (_, i) => {
      const a = (i / COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.12;
      const r = 3.4 + Math.random() * 2.6;
      return {
        angle: a,
        r,
        y: (Math.random() - 0.5) * 4,
        w: 1.1 + Math.random() * 1.0,
        h: 16 + Math.random() * 10,
        bob: Math.random() * Math.PI * 2,
        tex: 3 + (i % 3),
      };
    });
  }, []);

  // Initialise les textures sur les matériaux une fois montés
  useEffect(() => {
    cylinders.forEach((c, i) => {
      const m = cylRefs.current[i];
      if (m) {
        const t = clones[c.tex];
        t.repeat.set(c.rep[0], c.rep[1]);
        m.material.map = t;
        m.material.needsUpdate = true;
      }
    });
    // Les lamelles partagent 3 textures (3-5) avec un repeat vertical fixe ;
    // la variété vient de leur taille / position / angle.
    [3, 4, 5].forEach((idx) => clones[idx].repeat.set(1, 5));
    ribbons.forEach((rb, i) => {
      const m = ribbonRefs.current[i];
      if (m) {
        m.material.map = clones[rb.tex];
        m.material.needsUpdate = true;
      }
    });
  }, [cylinders, ribbons, clones]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;

    // --- Dessin de la pluie sur le canvas partagé (arc-en-ciel) ---
    ctx.fillStyle = "rgba(0,0,0,0.09)";
    ctx.fillRect(0, 0, TEX, TEX);
    ctx.font = `bold ${CELL}px "Courier New", monospace`;
    ctx.textBaseline = "top";
    for (let i = 0; i < COLS; i++) {
      const x = i * CELL;
      const y = drops[i] * CELL;
      // Teinte qui défile dans le temps + selon la colonne → toutes les couleurs
      const hue = (t * 55 + i * 9) % 360;
      ctx.fillStyle = `hsl(${hue}, 100%, 72%)`;
      ctx.fillText(GLYPHS[(Math.random() * GLYPHS.length) | 0], x, y);
      ctx.fillStyle = `hsl(${hue}, 100%, 56%)`;
      ctx.fillText(GLYPHS[(Math.random() * GLYPHS.length) | 0], x, y - CELL);
      if (y > TEX && Math.random() > 0.97) drops[i] = 0;
      drops[i] += 1;
    }
    base.needsUpdate = true;

    // Anime le défilement vertical + signale la maj des clones
    clones.forEach((c, idx) => {
      c.offset.y -= dt * (0.18 + idx * 0.06);
      c.needsUpdate = true;
    });

    // Cylindres : rotation lente
    cylinders.forEach((c, i) => {
      const m = cylRefs.current[i];
      if (!m) return;
      m.rotation.y += dt * c.speed * c.dir;
      m.material.opacity = c.op;
    });

    // Lamelles : l'anneau tourne doucement, chaque lamelle ondule
    if (ribbonGroup.current) ribbonGroup.current.rotation.y += dt * 0.05;
    ribbons.forEach((rb, i) => {
      const m = ribbonRefs.current[i];
      if (!m) return;
      m.position.y = rb.y + Math.sin(t * 0.4 + rb.bob) * 0.6;
      m.material.opacity = 0.8 - i * 0.005;
    });
  });

  return (
    <group>
      {/* Cylindres ambiants 360° (vus de l'intérieur) */}
      {cylinders.map((c, i) => (
        <mesh key={`cyl${i}`} ref={(el) => (cylRefs.current[i] = el)} renderOrder={-5}>
          <cylinderGeometry args={[c.r, c.r, c.h, 48, 1, true]} />
          <meshBasicMaterial
            side={THREE.BackSide}
            transparent
            depthWrite={false}
            opacity={c.op}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Rideaux de lamelles que l'on traverse */}
      <group ref={ribbonGroup}>
        {ribbons.map((rb, i) => (
          <mesh
            key={`rb${i}`}
            ref={(el) => (ribbonRefs.current[i] = el)}
            position={[Math.cos(rb.angle) * rb.r, rb.y, Math.sin(rb.angle) * rb.r]}
            rotation={[0, -rb.angle + Math.PI / 2, 0]}
            renderOrder={-4}
          >
            <planeGeometry args={[rb.w, rb.h]} />
            <meshBasicMaterial
              side={THREE.DoubleSide}
              transparent
              depthWrite={false}
              opacity={0.8}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
