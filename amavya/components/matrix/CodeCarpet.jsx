"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { lerpColor } from "./data";

/**
 * "Tapis de code" : des lignes de code HTML défilent au sol en perspective
 * et ouvrent le chemin vers le cœur AMAVYA (l'univers IA). Réalisé avec un
 * canvas 2D (lignes HTML lisibles) plaqué sur une longue piste, + deux rails
 * lumineux sur les côtés. Couleur vert → or selon le voyage.
 */

const CW = 1024; // largeur canvas (= largeur du tapis)
const CH = 2048; // hauteur canvas (= longueur du tapis / profondeur)
const LINE_H = 46;
const ROWS = Math.floor(CH / LINE_H);

// Lignes de code HTML / univers IA (bilingue-neutre)
const CODE = [
  "<!DOCTYPE amavya>",
  '<html lang="future">',
  "  <head>",
  '    <meta charset="AI" />',
  '    <link rel="future" href="/amavya" />',
  "  </head>",
  '  <body class="augmented-human">',
  '    <section id="universe">',
  '      <ai-core model="amavya" mode="augment">',
  '        <neural layers="∞" connect="true" />',
  '        <intelligence type="augmented" />',
  "      </ai-core>",
  '      <path class="road" d="M0 0 L0 -100" open />',
  '      <human potential="unlocked" />',
  '      <door to="amavya.cloud">bienvenue</door>',
  "    </section>",
  "    <script>",
  "      const future = await amavya.awaken();",
  "      export default () => <Amavya />;",
  "      while (true) amavya.augment(human);",
  "    </script>",
  '    <amavya:welcome>entrez dans le futur</amavya:welcome>',
  "  </body>",
  "</html>",
];

export default function CodeCarpet({ progressRef }) {
  const railRefs = useRef([]);
  const carpetMat = useRef();
  const colorObj = useMemo(() => new THREE.Color(), []);
  const lastStep = useRef(-1);

  const { canvas, ctx, texture } = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = CW;
    c.height = CH;
    const x = c.getContext("2d");
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(1, 4);
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    return { canvas: c, ctx: x, texture: t };
  }, []);

  // (Re)dessine les lignes de code dans la couleur courante
  const draw = (p) => {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, CW, CH);
    const base = lerpColor(p);
    const hi = lerpColor(Math.min(1, p + 0.18));
    ctx.font = `600 ${Math.round(LINE_H * 0.62)}px "JetBrains Mono", "Courier New", monospace`;
    ctx.textBaseline = "middle";
    for (let r = 0; r < ROWS; r++) {
      const line = CODE[r % CODE.length];
      const y = r * LINE_H + LINE_H / 2;
      // Quelques lignes "actives" plus lumineuses
      const active = (r * 7 + 3) % 11 === 0;
      ctx.fillStyle = active
        ? `rgb(${hi.r},${hi.g},${hi.b})`
        : `rgba(${base.r},${base.g},${base.b},0.82)`;
      ctx.fillText(line, 60, y);
    }
    texture.needsUpdate = true;
  };

  useFrame((state, dt) => {
    const p = Math.max(0, Math.min(1, progressRef.current));

    // Redessine seulement quand la couleur change sensiblement (perf)
    const step = Math.round(p * 36);
    if (step !== lastStep.current) {
      lastStep.current = step;
      draw(p);
    }

    // Défilement du tapis vers la caméra
    texture.offset.y -= dt * (0.06 + p * 0.05);

    // Rails latéraux : couleur + pulsation lumineuse
    const c = lerpColor(p);
    colorObj.setRGB(c.r / 255, c.g / 255, c.b / 255);
    const pulse = 0.7 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    railRefs.current.forEach((m) => {
      if (m) m.color.copy(colorObj).multiplyScalar(pulse);
    });
    if (carpetMat.current) carpetMat.current.color.copy(colorObj);
  });

  return (
    <group position={[0, -1.9, 0]}>
      {/* Le tapis de code (piste au sol, en perspective) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} renderOrder={-3}>
        <planeGeometry args={[8, 110]} />
        <meshBasicMaterial
          ref={carpetMat}
          map={texture}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      {/* Rails lumineux qui bordent le chemin */}
      {[-4.1, 4.1].map((x, i) => (
        <mesh key={i} position={[x, 0.02, 0]}>
          <boxGeometry args={[0.05, 0.05, 110]} />
          <meshBasicMaterial
            ref={(el) => (railRefs.current[i] = el)}
            toneMapped={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* Reflet diffus sous le tapis (halo) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, -10]}>
        <planeGeometry args={[14, 120]} />
        <meshBasicMaterial
          color="#0a0f0a"
          transparent
          opacity={0.25}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
