import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Le projet vit dans un monorepo : on ancre le tracing au dossier amavya
  // pour éviter que Next remonte aux lockfiles racine.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
