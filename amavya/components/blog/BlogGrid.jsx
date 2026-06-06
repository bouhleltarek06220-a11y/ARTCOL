"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function BlogGrid({ articles }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((a, i) => (
        <motion.div
          key={a.slug}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href={`/blog/${a.slug}`}
            className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_20px_60px_-25px_rgba(212,175,55,0.45)]"
          >
            {/* Planète miniature en haut */}
            <div className="relative h-24">
              <div
                className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-700 group-hover:scale-110"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${a.planet.color}, #1a1408 80%)`,
                  boxShadow: `0 0 40px -4px ${a.planet.color}`,
                }}
              />
              <div
                className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-2xl"
                style={{ background: a.planet.color }}
              />
            </div>

            <div className="text-[10px] uppercase tracking-[0.22em] text-gold-bright">
              {a.category.replace("-", " ")}
            </div>
            <h3 className="text-lg font-semibold leading-snug text-paper">
              {a.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted line-clamp-3">
              {a.description}
            </p>
            <div className="mt-auto flex items-center justify-between text-[11px] text-muted-soft">
              <span>{new Date(a.date).toLocaleDateString()}</span>
              <span>{a.readingTime} min</span>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
