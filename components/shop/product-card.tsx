import Image from "next/image";
import Link from "next/link";
import { ImageOffIcon } from "lucide-react";

import { formatGNF } from "@/lib/format";

export type ProduitCarte = {
  slug: string;
  nom: string;
  prix: number;
  image: string | null;
  enRupture: boolean;
  isNew?: boolean;
};

/**
 * Carte produit de la grille.
 *
 * Le prix est l'ancre typographique, pas une mention secondaire : sur une
 * boutique ou l'on essaie avant de payer, il rassure au lieu de freiner. Il
 * est compose en chiffres tabulaires pour que les montants s'alignent d'une
 * carte a l'autre — les prix en GNF sont longs, et une colonne ferraillee se
 * lit mal.
 */
export function ProductCard({ produit }: { produit: ProduitCarte }) {
  return (
    <Link
      href={`/produits/${produit.slug}`}
      className="group block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
    >
      <article className="overflow-hidden rounded-xl border border-border bg-card transition-colors duration-200 group-hover:border-gold/45">
        <div className="relative aspect-square w-full overflow-hidden bg-surface-image">
          {produit.image ? (
            <Image
              src={produit.image}
              alt={produit.nom}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              sizes="(min-width: 768px) 220px, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <ImageOffIcon className="size-8" aria-hidden />
            </div>
          )}

          {produit.enRupture ? (
            // La rupture prime sur la nouveaute : inutile d'attirer l'oeil sur
            // un article qu'on ne peut pas commander.
            <span className="absolute top-2.5 left-2.5 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground backdrop-blur-sm">
              Épuisé
            </span>
          ) : (
            produit.isNew && (
              <span className="absolute top-2.5 left-2.5 rounded-full bg-gold px-2.5 py-1 text-[11px] font-semibold text-gold-foreground">
                Nouveau
              </span>
            )
          )}
        </div>

        <div className="flex flex-col gap-1 px-3.5 py-3">
          <h3 className="line-clamp-1 text-[13px] leading-snug text-muted-foreground">
            {produit.nom}
          </h3>
          <p className="text-[15px] font-semibold tracking-tight text-gold-ink tabular-nums">
            {formatGNF(produit.prix)}
          </p>
        </div>
      </article>
    </Link>
  );
}
