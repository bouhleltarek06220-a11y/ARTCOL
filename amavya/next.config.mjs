import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Le projet vit dans un monorepo : on ancre le tracing au dossier amavya
  // pour éviter que Next remonte aux lockfiles racine.
  outputFileTracingRoot: __dirname,
  // En-têtes de sécurité HTTP appliqués à toutes les routes.
  // Pas de Content-Security-Policy ici : Three.js/Spline/framer-motion/Vercel
  // Analytics nécessitent des sources dynamiques qu'une CSP stricte casserait.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
