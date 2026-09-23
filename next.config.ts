import type { NextConfig } from "next";

import { HOTES_IMAGES_DISTANTES } from "./lib/constants";

const nextConfig: NextConfig = {
  // Un package-lock.json traîne dans le dossier utilisateur, au-dessus du projet.
  // Sans cette ligne, Turbopack remonte jusqu'à lui et prend C:\Users\... comme
  // racine du workspace au lieu du dossier du projet.
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    // La cible est un smartphone Android sur connexion lente : l'AVIF pèse
    // sensiblement moins que le WebP, au prix d'un encodage plus lent (mis en
    // cache après la première génération).
    formats: ["image/avif", "image/webp"],
    // Source unique de verite partagee avec la validation des slides
    // (lib/validations/slide.ts), pour qu'une URL acceptee par l'admin soit
    // toujours une URL que next/image sait charger.
    remotePatterns: HOTES_IMAGES_DISTANTES.map((hostname) => ({
      protocol: "https" as const,
      hostname,
    })),
  },
};

export default nextConfig;
