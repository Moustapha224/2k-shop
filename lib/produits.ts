import type { Produit, ProduitImage, Variante } from "@/generated/prisma/client";
import type { ProduitCarte } from "@/components/shop/product-card";

export type ProduitAvecRelations = Produit & {
  images: ProduitImage[];
  variantes: Variante[];
};

/** Convertit un produit Prisma (avec images/variantes) vers la forme attendue par <ProductCard>. */
export function versCarteProduit(produit: ProduitAvecRelations): ProduitCarte {
  const image = [...produit.images].sort((a, b) => a.ordre - b.ordre)[0]?.url ?? null;
  const enRupture = produit.variantes.every((v) => v.stock <= 0);

  return {
    slug: produit.slug,
    nom: produit.nom,
    prix: produit.prix,
    image,
    enRupture,
  };
}
