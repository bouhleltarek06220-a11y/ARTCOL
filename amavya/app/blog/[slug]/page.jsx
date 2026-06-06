import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getAllArticles, getAllSlugs, getArticleBySlug } from "@/lib/blog";
import BlogArticleHero from "@/components/blog/BlogArticleHero";
import ArticleVideo from "@/components/blog/ArticleVideo";
import MDXComponents from "@/components/blog/MDXComponents";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const article = getArticleBySlug(params.slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
    },
  };
}

export default function ArticlePage({ params }) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  const related = getAllArticles()
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.date,
    author: { "@type": "Person", name: article.author },
    publisher: {
      "@type": "Organization",
      name: "AMAVYA",
      logo: { "@type": "ImageObject", url: "https://amavya.cloud/logo.png" },
    },
    mainEntityOfPage: `https://amavya.cloud/blog/${article.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Navbar />
      <main id="main">
        <BlogArticleHero article={article} />

        <article className="mx-auto max-w-3xl px-5 py-16">
          <ArticleVideo src={article.video} caption={article.title} />

          <div className="prose-amavya">
            <MDXRemote
              source={article.content}
              components={MDXComponents}
              options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
            />
          </div>

          {/* Auteur */}
          <div className="mt-16 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full text-ink"
              style={{
                background:
                  "linear-gradient(135deg, #a87f2e 0%, #f0d27a 55%, #d4af37 100%)",
              }}
            >
              <span className="text-sm font-bold">TB</span>
            </div>
            <div className="text-sm">
              <p className="font-semibold text-paper">{article.author}</p>
              <p className="text-muted">Fondateur d&apos;AMAVYA</p>
            </div>
          </div>
        </article>

        {/* Autres planètes */}
        {related.length > 0 && (
          <section className="mx-auto max-w-6xl px-5 pb-24">
            <h2 className="mb-8 text-center text-2xl font-semibold sm:text-3xl">
              Continuer le voyage
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <Link
                  key={a.slug}
                  href={`/blog/${a.slug}`}
                  className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-5 transition-all hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_18px_50px_-25px_rgba(212,175,55,0.45)]"
                >
                  <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.30),transparent_70%)] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="text-[10px] uppercase tracking-[0.22em] text-gold-bright">
                    {a.category.replace("-", " ")}
                  </div>
                  <h3 className="text-base font-semibold leading-snug">
                    {a.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-muted line-clamp-2">
                    {a.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
