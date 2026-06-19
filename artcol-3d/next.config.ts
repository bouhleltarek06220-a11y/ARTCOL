import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Ce projet vit dans un monorepo (plusieurs lockfiles) : on fixe
  // explicitement la racine pour que Next.js infère le bon répertoire.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
