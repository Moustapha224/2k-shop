"use client";

import { useState } from "react";
import { ShoppingBagIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePanierStore } from "@/lib/store/cart";

type Variante = { id: string; taille: string; stock: number };

export function AddToCartForm({
  produit,
  variantes,
}: {
  produit: { id: string; slug: string; nom: string; prixUnitaire: number; image: string | null };
  variantes: Variante[];
}) {
  const [tailleId, setTailleId] = useState<string | null>(null);
  const ajouter = usePanierStore((state) => state.ajouter);

  const selectionnee = variantes.find((v) => v.id === tailleId);
  const toutEpuise = variantes.every((v) => v.stock <= 0);

  function ajouterAuPanier() {
    if (!selectionnee || selectionnee.stock <= 0) return;
    ajouter({
      varianteId: selectionnee.id,
      produitId: produit.id,
      slug: produit.slug,
      nom: produit.nom,
      image: produit.image,
      taille: selectionnee.taille,
      prixUnitaire: produit.prixUnitaire,
      stockDisponible: selectionnee.stock,
    });
    toast.success(`${produit.nom} (${selectionnee.taille}) ajouté au panier`);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-2 text-sm font-medium">Taille</p>
        {toutEpuise ? (
          <p className="text-sm text-muted-foreground">Rupture de stock sur toutes les tailles.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {variantes.map((variante) => (
              <button
                key={variante.id}
                type="button"
                disabled={variante.stock <= 0}
                onClick={() => setTailleId(variante.id)}
                className={cn(
                  "h-9 min-w-9 rounded-lg border px-3 text-sm font-medium transition-colors",
                  tailleId === variante.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-muted",
                  variante.stock <= 0 && "pointer-events-none opacity-40 line-through"
                )}
              >
                {variante.taille}
              </button>
            ))}
          </div>
        )}
      </div>

      <Button size="lg" onClick={ajouterAuPanier} disabled={!selectionnee || selectionnee.stock <= 0}>
        <ShoppingBagIcon />
        Ajouter au panier
      </Button>
    </div>
  );
}
