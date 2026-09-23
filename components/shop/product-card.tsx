"use client";

import Image from "next/image";
import Link from "next/link";
import { ImageOffIcon, HeartIcon } from "lucide-react";

import { formatGNF } from "@/lib/format";

export type ProduitCarte = {
  slug: string;
  nom: string;
  prix: number;
  image: string | null;
  enRupture: boolean;
  isNew?: boolean;
};

export function ProductCard({ produit }: { produit: ProduitCarte }) {
  return (
    <Link href={`/produits/${produit.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-md">
        {/* Image */}
        <div className="relative aspect-square w-full overflow-hidden bg-[#f7f5f0] dark:bg-muted">
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

          {/* Badge NOUVEAU */}
          {produit.isNew && !produit.enRupture && (
            <span className="absolute top-2 left-2 rounded-md bg-gold px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
              Nouveau
            </span>
          )}

          {/* Badge rupture */}
          {produit.enRupture && (
            <span className="absolute top-2 left-2 rounded-md bg-destructive px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
              Rupture
            </span>
          )}

          {/* Bouton cœur favori */}
          <button
            type="button"
            aria-label="Ajouter aux favoris"
            onClick={(e) => e.preventDefault()}
            className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm opacity-0 transition-all group-hover:opacity-100 hover:bg-white active:scale-90"
          >
            <HeartIcon className="size-4 text-foreground/70" />
          </button>
        </div>

        {/* Infos */}
        <div className="p-3">
          <p className="line-clamp-1 text-sm font-medium text-foreground">{produit.nom}</p>
          <p className="mt-1 text-sm font-bold text-gold">{formatGNF(produit.prix)}</p>
        </div>
      </div>
    </Link>
  );
}
