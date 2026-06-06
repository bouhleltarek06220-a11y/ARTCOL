/**
 * Helpers pour le blog AMAVYA.
 * Les articles sont des fichiers .mdx stockés dans content/blog/.
 * Frontmatter attendu :
 *   ---
 *   title: "..."
 *   description: "..."
 *   date: "2026-06-06"
 *   author: "Tarek Bouhlel"
 *   category: "automation" | "ai-agents" | "case-study" | "vision" | "crm"
 *   readingTime: 5
 *   lang: "fr" | "en" | "es"
 *   video: "https://..."  (optionnel — vidéo Higgsfield/Kling à intégrer en hero)
 *   planet:
 *     color: "#f0d27a"  (couleur dominante de la planète dans le Cosmos)
 *     size: 1.2         (rayon — varie un peu pour la diversité visuelle)
 *   ---
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

const CATEGORY_COLORS = {
  automation: "#f0d27a", // doré AMAVYA
  "ai-agents": "#d4af37", // or plus profond
  "case-study": "#7dd3fc", // cyan
  vision: "#e9e9f2", // blanc holographique
  crm: "#a78bfa", // violet doux
  formation: "#86efac", // vert tendre
};

function ensureDir() {
  if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true });
}

export function getAllSlugs() {
  ensureDir();
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getArticleBySlug(slug) {
  const file = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const planet = data.planet || {};
  return {
    slug,
    content,
    title: data.title || slug,
    description: data.description || "",
    date: data.date || "",
    author: data.author || "Tarek Bouhlel",
    category: data.category || "vision",
    readingTime: data.readingTime || 5,
    lang: data.lang || "fr",
    video: data.video || null,
    image: data.image || null,
    planet: {
      color: planet.color || CATEGORY_COLORS[data.category] || "#f0d27a",
      size: planet.size || 1,
    },
  };
}

export function getAllArticles(lang) {
  return getAllSlugs()
    .map((slug) => getArticleBySlug(slug))
    .filter(Boolean)
    .filter((a) => (lang ? a.lang === lang : true))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/* Distribue les planètes en spirale 3D dans l'espace pour le Cosmos. */
export function placeInCosmos(articles) {
  return articles.map((a, i) => {
    const golden = Math.PI * (3 - Math.sqrt(5)); // angle d'or pour distribution uniforme
    const radius = 5 + i * 1.6;
    const angle = i * golden;
    return {
      ...a,
      position: [
        Math.cos(angle) * radius,
        ((i % 5) - 2) * 1.4,
        Math.sin(angle) * radius - i * 0.8,
      ],
    };
  });
}
