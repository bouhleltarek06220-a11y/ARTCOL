"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS } from "./data";

/**
 * Pluie de code Matrix rendue dans un canvas 2D offscreen et plaquée sur
 * un mesh WebGL via CanvasTexture. Le plan suit la caméra (toujours
 * devant), et la couleur interpole vert (Matrix) → or (AMAVYA) selon la
 * progression du scroll.
 */

const CELL = 18;            // taille d'un caractère en px
const W = 1024;
const H = 1024;
const COLUMNS = Math.floor(W / CELL);

// Glyphes "matrix" — mix de katakana, chiffres, symboles
const GLYPHS = Array.from({ length: 96 }, (_, i) =>
  String.fromCharCode(0x30a1 + i),
).concat("0123456789@#$%&*+=<>?".split(""));

// Petites lignes "code" lisibles qui apparaissent occasionnellement
const SNIPPETS = [
  "amavya.connect()",
  "if (you.see) { reveal() }",
  "AI.augment(human)",
  "future.now = true",
  "wake.up()",
  "neural.sync(amavya)",
  "01101000 01110101 01101101 01100001 01101110",
];

export default function CodeRain({ progressRef }) {
  const { camera } = useThree();
  const meshRef = useRef();
  const matRef = useRef();
  const ctxRef = useRef(null);
  const textureRef = useRef(null);
  const dropsRef = useRef(null);
  const snippetRef = useRef({ text: "", x: 0, y: -1, alive: 0 });

  // Initialise le canvas et la texture une seule fois
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);
    ctxRef.current = ctx;

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    textureRef.current = texture;
    if (matRef.current) matRef.current.map = texture;

    // Position de chute aléatoire pour chaque colonne
    dropsRef.current = Array.from({ length: COLUMNS }, () =>
      Math.floor(Math.random() * 80),
    );

    return () => {
      texture.dispose();
    };
  }, []);

  useFrame(() => {
    const ctx = ctxRef.current;
    const tex = textureRef.current;
    const drops = dropsRef.current;
    if (!ctx || !tex || !drops) return;

    const p = Math.max(0, Math.min(1, progressRef.current));

    // Couleur interpolée vert → or
    const r = Math.round(COLORS.matrix.r + (COLORS.gold.r - COLORS.matrix.r) * p);
    const g = Math.round(COLORS.matrix.g + (COLORS.gold.g - COLORS.matrix.g) * p);
    const b = Math.round(COLORS.matrix.b + (COLORS.gold.b - COLORS.matrix.b) * p);
    const color = `rgb(${r}, ${g}, ${b})`;
    // tête de chute plus brillante
    const bright = `rgb(${Math.min(255, r + 60)}, ${Math.min(255, g + 60)}, ${Math.min(255, b + 60)})`;

    // Voile noir partiel = effet trace/fading des caractères précédents
    ctx.fillStyle = "rgba(0, 0, 0, 0.07)";
    ctx.fillRect(0, 0, W, H);

    ctx.font = `${CELL}px "JetBrains Mono", "Courier New", monospace`;

    // Pluie de glyphes
    for (let i = 0; i < COLUMNS; i++) {
      const x = i * CELL;
      const y = drops[i] * CELL;
      const ch = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

      // Tête de la chute en brillant
      ctx.fillStyle = bright;
      ctx.fillText(ch, x, y);
      // Caractère juste au-dessus en couleur normale
      ctx.fillStyle = color;
      ctx.fillText(
        GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        x,
        y - CELL,
      );

      // Recyclage avec proba aléatoire (donne l'effet décalé)
      if (y > H && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i] += 1;
    }

    // Snippet lisible occasionnel
    const sn = snippetRef.current;
    if (sn.alive > 0) {
      ctx.fillStyle = bright;
      ctx.fillText(sn.text, sn.x, sn.y);
      sn.y += CELL;
      sn.alive -= 1;
    } else if (Math.random() < 0.02) {
      sn.text = SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)];
      sn.x = Math.floor(Math.random() * (COLUMNS - sn.text.length)) * CELL;
      sn.y = CELL;
      sn.alive = Math.floor(H / CELL);
    }

    tex.needsUpdate = true;

    // Le plan suit la caméra (toujours 4 unités devant)
    if (meshRef.current) {
      meshRef.current.position.copy(camera.position);
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      meshRef.current.position.addScaledVector(forward, 5);
      meshRef.current.quaternion.copy(camera.quaternion);

      // Opacité : 1 jusqu'à D1, fade vers 0.25 en D2/D3 (laisse voir le tunnel/cœur)
      if (matRef.current) {
        const o = p < 0.5 ? 1 : 1 - ((p - 0.5) / 0.45) * 0.85;
        matRef.current.opacity = Math.max(0.15, o);
      }
    }
  });

  return (
    <mesh ref={meshRef} renderOrder={-10}>
      <planeGeometry args={[16, 12]} />
      <meshBasicMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        opacity={1}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}
