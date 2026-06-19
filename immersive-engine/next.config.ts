import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Un lockfile existe à la racine du repo : on ancre Turbopack sur CE projet
  // pour éviter une mauvaise inférence de la racine du workspace.
  turbopack: {
    root: path.resolve("."),
  },
};

export default nextConfig;
