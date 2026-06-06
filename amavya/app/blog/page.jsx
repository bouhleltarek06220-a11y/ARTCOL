import { getAllArticles } from "@/lib/blog";
import BlogIndexClient from "@/components/blog/BlogIndexClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
  // On expose tous les articles (toutes langues) ici : la sélection par langue
  // se fera plus tard via i18n routing (étape 3.2). Pour l'instant on filtre
  // côté client via le LangProvider si besoin.
  const articles = getAllArticles();

  return (
    <>
      <Navbar />
      <main id="main">
        <BlogIndexClient articles={articles} />
      </main>
      <Footer />
    </>
  );
}
