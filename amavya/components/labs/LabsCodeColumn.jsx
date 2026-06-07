"use client";

import { useMemo } from "react";

/**
 * Rideau de code HTML coloré qui défile lentement vers le haut.
 * Reprend la palette néon du CodeCarpet /matrix mais en pur DOM/CSS
 * pour rester léger et lisible en 2D.
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

/* Tokeniseur léger : reprend la logique de CodeCarpet (HTML-ish), retourne
   un tableau d'objets { t, c } convertibles en <span>. */
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
            textShadow: `0 0 8px ${tok.c}55`,
          }}
        >
          {tok.t}
        </span>
      ))}
    </div>
  );
}

export default function LabsCodeColumn() {
  // On duplique le bloc pour permettre une boucle de défilement infinie
  const loop = useMemo(() => [...CODE, ...CODE], []);
  return (
    <div
      className="pointer-events-none absolute inset-y-0 left-0 z-[1] hidden h-full w-[24vw] overflow-hidden lg:block"
      aria-hidden="true"
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent), linear-gradient(to right, black 60%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent), linear-gradient(to right, black 60%, transparent)",
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    >
      <style>{`
        @keyframes amavya-code-scroll {
          from { transform: translateY(0); }
          to   { transform: translateY(-50%); }
        }
      `}</style>
      <div
        className="px-6 font-mono text-[13px] leading-[1.6] tracking-tight"
        style={{
          animation: "amavya-code-scroll 38s linear infinite",
        }}
      >
        {loop.map((line, i) => (
          <CodeLine key={i} line={line || " "} />
        ))}
      </div>
    </div>
  );
}
