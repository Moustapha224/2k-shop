import type { NextConfig } from "next";

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
  },
};

export default nextConfig;
