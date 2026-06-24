/**
 * ✦ CONTENU ÉDITABLE — AMAVYA · « La Galerie Orbitale » ✦
 * Univers : galaxie + sanctuaires cyberpunk-japonais qui exposent TES créations.
 * Le PATH est le rail de la caméra ; chaque nœud a une position caméra (cam) et
 * un point regardé (focus). Les nœuds « creation » portent une œuvre exposée.
 *
 * Pour adapter : édite uniquement ce fichier (textes, créations, ordre, couleurs).
 */
export type Vec3 = [number, number, number];

export type Node = {
  id: string;
  kind: "hero" | "creation" | "outro";
  cam: Vec3;          // position de la caméra à ce nœud
  focus: Vec3;        // point que la caméra regarde
  kicker?: string;
  title: string;
  body?: string;
  // pour les créations exposées :
  type?: "Outil" | "Site" | "Landing" | "Expérience" | "Présentation";
  tech?: string[];
  url?: string;
  preview?: string;   // image dans /assets/textures (sans extension)
  video?: string;     // vidéo dans /assets/video (sans extension) — prioritaire sur preview
  ratio?: "wide" | "square";
  accent?: string;
};

export const THEME = {
  bg: "#05030a",
  fog: "#0a0612",
  magenta: "#ff2d7e",
  cyan: "#36e0ff",
  red: "#e23636",
  gold: "#e8b84b",
  text: "#f0eaff",
};

export const EXPERIENCE = {
  name: "AMAVYA",
  tagline: "Galerie orbitale · cyberpunk",
};

/** Le parcours : hero → gardien → travaux → (PLONGÉE grand-huit) → soutenance → sortie. */
export const PATH: Node[] = [
  {
    id: "hero",
    kind: "hero",
    cam: [0, 1.3, 12],
    focus: [0, 1.0, 3],
    kicker: "Entrez dans la galerie",
    title: "AMAVYA",
    body: "Une galaxie. Des sanctuaires. Chaque œuvre est un de mes travaux. Avancez et explorez.",
  },
  {
    id: "gardien",
    kind: "creation",
    cam: [0, 1.3, 4],
    focus: [0, 0.7, -5],
    title: "Gardien AMAVYA",
    type: "Expérience",
    tech: ["Cyberpunk", "Vidéo", "AMAVYA"],
    url: "#",
    video: "guardian",
    ratio: "square",
    accent: "#7CFF3D",
  },
  {
    id: "hermes",
    kind: "creation",
    cam: [0, 1.3, -11],
    focus: [-5.6, 0.6, -18],
    title: "Hermès Perpétuelle",
    type: "Présentation",
    tech: ["Storytelling", "WebGL", "GSAP"],
    url: "/works/hermes.html",
    preview: "hermes",
    accent: "#e8b84b",
  },
  {
    id: "dose",
    kind: "creation",
    cam: [0, 1.3, -27],
    focus: [5.6, 0.6, -34],
    title: "DOSE",
    type: "Présentation",
    tech: ["Marque", "Viral", "Pitch"],
    url: "/works/dose.html",
    preview: "dose",
    accent: "#ff2d7e",
  },
  {
    id: "refuge",
    kind: "creation",
    cam: [0, 1.3, -43],
    focus: [-5.6, 0.6, -50],
    title: "Le Refuge des Pins",
    type: "Site",
    tech: ["Immobilier", "Web", "Design"],
    url: "/works/refuge.html",
    preview: "refuge",
    accent: "#36e0ff",
  },
  {
    id: "prospection",
    kind: "creation",
    cam: [0, 1.3, -59],
    focus: [5.6, 0.6, -66],
    title: "Machine de Prospection",
    type: "Outil",
    tech: ["IA", "CRM", "Automation"],
    url: "https://machine-de-prospection-web.vercel.app/crm",
    preview: "prospection",
    accent: "#36e0ff",
  },
  {
    id: "lostchapter",
    kind: "creation",
    cam: [0, 1.3, -75],
    focus: [-5.6, 0.6, -82],
    title: "Lost Chapter 3D",
    type: "Expérience",
    tech: ["Three.js", "R3F", "WebGL"],
    url: "https://lostchapter.vercel.app/",
    preview: "lostchapter",
    accent: "#e8b84b",
  },
  {
    id: "artcol",
    kind: "creation",
    cam: [0, 1.3, -91],
    focus: [5.6, 0.6, -98],
    title: "ARTCOL",
    type: "Site",
    tech: ["Plateforme", "Artistes", "Web"],
    url: "https://artcol.online/",
    preview: "artcol",
    accent: "#ff2d7e",
  },
  {
    // ⬇️ LA PLONGÉE « grand-huit » : la caméra bascule par-dessus le bord et
    // chute d'un coup vers le bas (focus très bas = on regarde le vide).
    id: "soutenance",
    kind: "creation",
    cam: [0, -26, -99],
    focus: [0, -29, -107],
    title: "Soutenance — Lost Chapter",
    type: "Expérience",
    tech: ["3D", "Présentation", "Cinéma"],
    url: "https://lostchapter-git-claude-48b214-bouhleltarek06220-4609s-projects.vercel.app/Soutenance",
    preview: "soutenance",
    ratio: "square",
    accent: "#9b6bff",
  },
  {
    id: "outro",
    kind: "outro",
    cam: [0, -29, -113],
    focus: [0, -29, -125],
    kicker: "La suite",
    title: "Construisons la vôtre.",
    body: "Chaque création peut vivre ici. Parlons de votre univers.",
  },
];

export const CREATIONS = PATH.filter((n) => n.kind === "creation");
