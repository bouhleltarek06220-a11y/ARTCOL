"use client";

import { useMemo } from "react";

/**
 * Fond animé pleine page : plusieurs colonnes de code coloré qui défilent
 * doucement vers le haut. Pas de découpe visible — tout le décor est code.
 * Pur DOM/CSS, léger, désactivé en mobile.
 */

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
  '    <amavya:welcome>entrez dans le futur</amavya:welcome>',
  "  </body>",
  "</html>",
];

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
  "const", "await", "export", "default", "while",
  "return", "new", "function", "class", "import",
  "from", "async", "true", "false",
]);

function tokenize(line) {
  const tokens = [];
  const re =
    /(\s+)|("(?:[^"\\]|\\.)*")|(<\/?|\/?>|=)|([A-Za-z_][\w\-:.]*)|(\d+)|(.)/g;
  let m;
  let inTag = false;
  let expectTag = false;
  while ((m = re.exec(line))) {
    const t = m[0];
    if (m[1]) tokens.push({ t, c: COL.text });
    else if (m[2]) tokens.push({ t, c: COL.str });
    else if (m[3]) {
      if (t === "<" || t === "</") {
        inTag = true;
        expectTag = true;
        tokens.push({ t, c: COL.punct });
      } else if (t === ">" || t === "/>") {
        inTag = false;
        tokens.push({ t, c: COL.punct });
      } else tokens.push({ t, c: COL.eq });
    } else if (m[4]) {
      if (inTag && expectTag) {
        expectTag = false;
        tokens.push({ t, c: COL.tag });
      } else if (inTag) tokens.push({ t, c: COL.attr });
      else if (KW.has(t)) tokens.push({ t, c: COL.kw });
      else tokens.push({ t, c: COL.text });
    } else if (m[5]) tokens.push({ t, c: COL.num });
    else tokens.push({ t, c: COL.text });
  }
  return tokens;
}

function CodeLine({ line }) {
  const tokens = useMemo(() => tokenize(line), [line]);
  return (
    <div className="whitespace-pre">
      {tokens.map((tok, i) => (
        <span
          key={i}
          style={{
            color: tok.c,
            textShadow: `0 0 8px ${tok.c}44`,
          }}
        >
          {tok.t}
        </span>
      ))}
    </div>
  );
}

/* Une colonne verticale infinie, vitesse + délai paramétrables. */
function CodeColumn({ durationS, delayS = 0 }) {
  const loop = useMemo(() => [...CODE, ...CODE], []);
  return (
    <div className="relative overflow-hidden">
      <div
        className="px-3 font-mono text-[12px] leading-[1.65] tracking-tight opacity-90"
        style={{
          animation: `amavya-code-scroll ${durationS}s linear infinite`,
          animationDelay: `-${delayS}s`,
        }}
      >
        {loop.map((line, i) => (
          <CodeLine key={i} line={line || " "} />
        ))}
      </div>
    </div>
  );
}

export default function LabsCodeBackground() {
  /* 6 colonnes parallèles, chacune avec sa vitesse, son décalage de
     démarrage, et son opacity globale, pour un effet rideau riche
     sans look "uniforme". */
  const columns = useMemo(
    () => [
      { durationS: 42, delayS: 0, opacity: 0.7 },
      { durationS: 56, delayS: 14, opacity: 0.55 },
      { durationS: 36, delayS: 6, opacity: 0.85 },
      { durationS: 64, delayS: 22, opacity: 0.45 },
      { durationS: 48, delayS: 10, opacity: 0.75 },
      { durationS: 52, delayS: 28, opacity: 0.5 },
    ],
    [],
  );

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full overflow-hidden lg:block"
      aria-hidden="true"
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <style>{`
        @keyframes amavya-code-scroll {
          from { transform: translateY(0); }
          to   { transform: translateY(-50%); }
        }
      `}</style>
      <div className="grid h-full w-full grid-cols-6">
        {columns.map((col, i) => (
          <div
            key={i}
            className="h-full overflow-hidden"
            style={{ opacity: col.opacity }}
          >
            <CodeColumn durationS={col.durationS} delayS={col.delayS} />
          </div>
        ))}
      </div>
    </div>
  );
}
