import { getAllArticles } from "@/lib/blog";
import BlogIndexClient from "@/components/blog/BlogIndexClient";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Cosmos AMAVYA — Le blog de l'IA appliquée",
  description:
    "Articles, cas clients et explorations sur l'intelligence artificielle, l'automatisation et les agents IA. Le blog d'AMAVYA, en 3D.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Cosmos AMAVYA — Le blog de l'IA appliquée",
    description:
      "Articles, cas clients et explorations sur l'intelligence artificielle. Navigation 3D.",
  },
};

export default function BlogPage() {
  const articles = getAllArticles();

  return (
    <>
      <Navbar />
      {/* Pas de footer ici : le Cosmos est plein écran, le footer reste sur les articles */}
      <main id="main" className="relative">
        <BlogIndexClient articles={articles} />
      </main>
    </>
  );
}
