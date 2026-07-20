import type { MetadataRoute } from "next";

import { SITE } from "@/lib/constants";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const produits = await prisma.produit.findMany({
    where: { actif: true },
    select: { slug: true, updatedAt: true },
  });

  return [
    { url: SITE.url, changeFrequency: "daily", priority: 1 },
    { url: `${SITE.url}/produits`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE.url}/suivi`, changeFrequency: "monthly", priority: 0.3 },
    ...produits.map((produit) => ({
      url: `${SITE.url}/produits/${produit.slug}`,
      lastModified: produit.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
