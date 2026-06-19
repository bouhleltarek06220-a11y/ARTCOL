import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Le repo contient un lockfile parent : on fixe la racine Turbopack
  // sur ce projet pour éviter le warning "inferred workspace root".
  turbopack: {
    root: path.resolve("."),
  },
};

export default nextConfig;
