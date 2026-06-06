import { getAllArticles } from "@/lib/blog";

export default function sitemap() {
  const base = "https://amavya.cloud";
  const now = new Date();
  const staticEntries = [
    { url: base, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/matrix`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/experience`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/mentions-legales`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/confidentialite`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/cgu-cgv`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const articleEntries = getAllArticles().map((a) => ({
    url: `${base}/blog/${a.slug}`,
    lastModified: a.date ? new Date(a.date) : now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...articleEntries];
}
