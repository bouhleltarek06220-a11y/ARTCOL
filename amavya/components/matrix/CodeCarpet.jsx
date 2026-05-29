"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * "Tapis de code" : des lignes de code HTML en COULEUR (coloration
 * syntaxique multicolore) défilent au sol en perspective et ouvrent le
 * chemin vers le logo AMAVYA. Plus de rails ni de bords : la piste s'étend
 * et se fond dans le noir / le fog.
 */

const CW = 1024;
const CH = 2048;
const LINE_H = 46;
const ROWS = Math.floor(CH / LINE_H);

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
  '        <neural layers="9999" connect="true" />',
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
  "    <amavya:welcome>entrez dans le futur</amavya:welcome>",
  "  </body>",
  "</html>",
];

// Palette coloration syntaxique (style éditeur, néon)
const COL = {
  punct: "#7fdbff",
  tag: "#56b6ff",
  attr: "#ffcb6b",
  str: "#c3e88d",
  kw: "#c792ea",
  num: "#f78c6c",
  text: "#d6e9ff",
  eq: "#7fdbff",
};
const KW = new Set([
  "const", "await", "export", "default", "while", "return", "new",
  "function", "class", "import", "from", "async", "true", "false",
]);

function tokenize(line) {
  const tokens = [];
  const re = /(\s+)|("(?:[^"\\]|\\.)*")|(<\/?|\/?>|=)|([A-Za-z_][\w\-:.]*)|(\d+)|(.)/g;
  let m, inTag = false, expectTag = false;
  while ((m = re.exec(line))) {
    const t = m[0];
    if (m[1]) tokens.push({ t, c: COL.text });
    else if (m[2]) tokens.push({ t, c: COL.str });
    else if (m[3]) {
      if (t === "<" || t === "</") { inTag = true; expectTag = true; tokens.push({ t, c: COL.punct }); }
      else if (t === ">" || t === "/>") { inTag = false; tokens.push({ t, c: COL.punct }); }
      else tokens.push({ t, c: COL.eq });
    } else if (m[4]) {
      if (inTag && expectTag) { expectTag = false; tokens.push({ t, c: COL.tag }); }
      else if (inTag) tokens.push({ t, c: COL.attr });
      else if (KW.has(t)) tokens.push({ t, c: COL.kw });
      else tokens.push({ t, c: COL.text });
    } else if (m[5]) tokens.push({ t, c: COL.num });
    else tokens.push({ t, c: COL.text });
  }
  return tokens;
}

export default function CodeCarpet() {
  const { canvas, ctx, texture } = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = CW;
    c.height = CH;
    const x = c.getContext("2d");
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(1, 3);
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.colorSpace = THREE.SRGBColorSpace;
    return { canvas: c, ctx: x, texture: t };
  }, []);

  // Dessin unique (coloration syntaxique + glow néon)
  useEffect(() => {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, CW, CH);
    ctx.font = `600 ${Math.round(LINE_H * 0.6)}px "JetBrains Mono", "Courier New", monospace`;
    ctx.textBaseline = "middle";
    for (let r = 0; r < ROWS; r++) {
      const line = CODE[r % CODE.length];
      const y = r * LINE_H + LINE_H / 2;
      let x = 70;
      for (const tok of tokenize(line)) {
        ctx.fillStyle = tok.c;
        ctx.shadowColor = tok.c;
        ctx.shadowBlur = 8;
        ctx.fillText(tok.t, x, y);
        x += ctx.measureText(tok.t).width;
      }
    }
    ctx.shadowBlur = 0;
    texture.needsUpdate = true;
  }, [ctx, texture]);

  useFrame((_, dt) => {
    texture.offset.y -= dt * 0.07;
  });

  return (
    <mesh position={[0, -1.9, -10]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={-3}>
      <planeGeometry args={[22, 150]} />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}
