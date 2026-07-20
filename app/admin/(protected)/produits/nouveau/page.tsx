import type { Metadata } from "next";

import { ProduitForm } from "@/components/admin/produit-form";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Nouveau produit" };

export default async function AdminNouveauProduitPage() {
  const categories = await prisma.categorie.findMany({ orderBy: { ordre: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold tracking-tight">Nouveau produit</h1>
      <ProduitForm categories={categories} />
    </div>
  );
}
