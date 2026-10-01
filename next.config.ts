import type { NextConfig } from "next";

import { HOTES_IMAGES_DISTANTES } from "./lib/constants";

/** Hote du bucket (ex : ep-xxx.storage.c-5.eu-central-1.aws.neon.tech). */
const hoteStockage = (() => {
  const brut = process.env.AWS_ENDPOINT_URL_S3?.trim();
  if (!brut) return null;
  try {
    return new URL(brut).hostname;
  } catch {
    console.warn("[next.config] AWS_ENDPOINT_URL_S3 illisible, hote ignore.");
    return null;
  }
})();

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
    remotePatterns: [
      ...HOTES_IMAGES_DISTANTES.map((hostname) => ({
        protocol: "https" as const,
        hostname,
      })),
      // Hote du stockage objet, deduit de l'endpoint S3. Sans cette entree,
      // next/image refuserait les images televersees depuis l'admin.
      ...(hoteStockage ? [{ protocol: "https" as const, hostname: hoteStockage }] : []),
    ],
  },
};

export default nextConfig;
