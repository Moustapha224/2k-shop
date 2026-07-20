import { PackageSearchIcon } from "lucide-react";

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { ProductCard, type ProduitCarte } from "@/components/shop/product-card";

export function ProductGrid({ produits }: { produits: ProduitCarte[] }) {
  if (produits.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <PackageSearchIcon />
          </EmptyMedia>
          <EmptyTitle>Aucun produit</EmptyTitle>
          <EmptyDescription>Aucun produit ne correspond a cette selection pour le moment.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {produits.map((produit) => (
        <ProductCard key={produit.slug} produit={produit} />
      ))}
    </div>
  );
}
