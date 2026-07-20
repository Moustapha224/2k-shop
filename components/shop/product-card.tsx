import Image from "next/image";
import Link from "next/link";
import { ImageOffIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatGNF } from "@/lib/format";

export type ProduitCarte = {
  slug: string;
  nom: string;
  prix: number;
  image: string | null;
  enRupture: boolean;
};

export function ProductCard({ produit }: { produit: ProduitCarte }) {
  return (
    <Link href={`/produits/${produit.slug}`} className="group block">
      <Card className="gap-0 overflow-hidden p-0 transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md">
        <div className="relative aspect-square w-full overflow-hidden bg-muted">
          {produit.image ? (
            <Image
              src={produit.image}
              alt={produit.nom}
              fill
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.06]"
              sizes="(min-width: 768px) 220px, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <ImageOffIcon className="size-8" />
            </div>
          )}
          {produit.enRupture && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              Rupture
            </Badge>
          )}
        </div>
        <CardContent className="p-3">
          <p className="line-clamp-1 text-sm font-medium">{produit.nom}</p>
          <p className="mt-1 font-mono text-sm font-semibold">{formatGNF(produit.prix)}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
