import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ImagesManager } from "@/components/admin/images-manager";
import { ProduitForm } from "@/components/admin/produit-form";
import { SupprimerBouton } from "@/components/admin/supprimer-bouton";
import { Separator } from "@/components/ui/separator";
import { supprimerProduit } from "@/lib/actions/produits";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Modifier le produit" };

type Props = { params: Promise<{ id: string }> };

export default async function AdminProduitEditPage({ params }: Props) {
  const { id } = await params;

  const [produit, categories] = await Promise.all([
    prisma.produit.findUnique({
      where: { id },
      include: { images: { orderBy: { ordre: "asc" } }, variantes: true },
    }),
    prisma.categorie.findMany({ orderBy: { ordre: "asc" } }),
  ]);

  if (!produit) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">{produit.nom}</h1>
        <SupprimerBouton
          action={supprimerProduit.bind(null, produit.id)}
          confirmMessage={`Supprimer "${produit.nom}" ? Cette action est irréversible.`}
          redirectTo="/admin/produits"
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Images</p>
        <ImagesManager produitId={produit.id} images={produit.images} />
      </div>

      <Separator />

      <ProduitForm
        categories={categories}
        produit={{
          id: produit.id,
          nom: produit.nom,
          description: produit.description,
          prix: produit.prix,
          categorieId: produit.categorieId,
          type: produit.type as "VETEMENT" | "CHAUSSURE",
          actif: produit.actif,
          variantes: produit.variantes.map((v) => ({ taille: v.taille, stock: v.stock })),
        }}
      />
    </div>
  );
}
