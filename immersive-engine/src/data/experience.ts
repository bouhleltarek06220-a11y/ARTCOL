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
  type?: "Outil" | "Site" | "Landing" | "Expérience";
  tech?: string[];
  url?: string;
  preview?: string;   // nom du fichier dans /assets/textures (sans extension)
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

/** Le parcours : hero → créations (gauche/droite) → sortie. */
export const PATH: Node[] = [
  {
    id: "hero",
    kind: "hero",
    cam: [0, 1.3, 10],
    focus: [0, 1.0, 0],
    kicker: "Entrez dans la galerie",
    title: "AMAVYA",
    body: "Une galaxie. Des sanctuaires. Chaque œuvre est une de mes créations. Avancez et explorez.",
  },
  {
    id: "crm",
    kind: "creation",
    cam: [0, 1.3, -2],
    focus: [-5.6, 0.6, -9],
    title: "Amavya CRM",
    type: "Outil",
    tech: ["Next.js", "Supabase", "TypeScript"],
    url: "https://amavya.cloud",
    preview: "crm",
    accent: "#36e0ff",
  },
  {
    id: "prospection",
    kind: "creation",
    cam: [0, 1.3, -18],
    focus: [5.6, 0.6, -25],
    title: "Machine de Prospection",
    type: "Outil",
    tech: ["IA", "Node.js", "Automation"],
    url: "#",
    preview: "prospect",
    accent: "#ff2d7e",
  },
  {
    id: "lostchapter",
    kind: "creation",
    cam: [0, 1.3, -34],
    focus: [-5.6, 0.6, -41],
    title: "Lost Chapter 3D",
    type: "Expérience",
    tech: ["Three.js", "R3F", "WebGL"],
    url: "#",
    preview: "site3d",
    accent: "#e8b84b",
  },
  {
    id: "artcol",
    kind: "creation",
    cam: [0, 1.3, -50],
    focus: [5.6, 0.6, -57],
    title: "ARTCOL — Sanctuaire",
    type: "Expérience",
    tech: ["R3F", "GLSL", "Cyberpunk"],
    url: "#",
    preview: "hall",
    accent: "#e23636",
  },
  {
    id: "outro",
    kind: "outro",
    cam: [0, 1.3, -70],
    focus: [0, 1.0, -82],
    kicker: "La suite",
    title: "Construisons la vôtre.",
    body: "Chaque création peut vivre ici. Parlons de votre univers.",
  },
];

export const CREATIONS = PATH.filter((n) => n.kind === "creation");
