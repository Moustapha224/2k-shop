import type { Metadata } from "next";

import { CategoryFilter } from "@/components/shop/category-filter";
import { CataloguePagination } from "@/components/shop/catalogue-pagination";
import { ProductGrid } from "@/components/shop/product-grid";
import { prisma } from "@/lib/db";
import { versCarteProduit } from "@/lib/produits";

export const metadata: Metadata = {
  title: "Produits",
  description: "Hauts, pantalons et chaussures disponibles à la livraison sur Conakry.",
};

const TAILLE_PAGE = 12;

type Props = {
  searchParams: Promise<{ categorie?: string; page?: string }>;
};

export default async function ProduitsPage({ searchParams }: Props) {
  const { categorie: categorieSlug, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const where = {
    actif: true,
    ...(categorieSlug ? { categorie: { slug: categorieSlug } } : {}),
  };

  const [categories, produits, total] = await Promise.all([
    prisma.categorie.findMany({ orderBy: { ordre: "asc" } }),
    prisma.produit.findMany({
      where,
      include: { images: true, variantes: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * TAILLE_PAGE,
      take: TAILLE_PAGE,
    }),
    prisma.produit.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / TAILLE_PAGE));

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-6">
      <h1 className="text-xl font-semibold tracking-tight">Produits</h1>
      <CategoryFilter categories={categories} categorieActuelle={categorieSlug} />
      <ProductGrid produits={produits.map(versCarteProduit)} />
      {totalPages > 1 && (
        <CataloguePagination page={page} totalPages={totalPages} categorieSlug={categorieSlug} />
      )}
    </div>
  );
}
