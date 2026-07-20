"use client";

import Image from "next/image";
import Link from "next/link";
import { ImageOffIcon, MinusIcon, PlusIcon, ShoppingBagIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { formatGNF } from "@/lib/format";
import { nombreArticles, totalPanier, usePanierStore } from "@/lib/store/cart";

export function PanierClient() {
  const articles = usePanierStore((state) => state.articles);
  const changerQuantite = usePanierStore((state) => state.changerQuantite);
  const retirer = usePanierStore((state) => state.retirer);

  if (articles.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ShoppingBagIcon />
          </EmptyMedia>
          <EmptyTitle>Votre panier est vide</EmptyTitle>
          <EmptyDescription>Parcourez le catalogue pour ajouter des articles.</EmptyDescription>
        </EmptyHeader>
        <Button asChild>
          <Link href="/produits">Voir les produits</Link>
        </Button>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ul className="flex flex-col gap-4">
        {articles.map((article) => (
          <li key={article.varianteId} className="flex gap-3">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
              {article.image ? (
                <Image src={article.image} alt={article.nom} fill className="object-cover" sizes="80px" />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <ImageOffIcon className="size-6" />
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col justify-between gap-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Link href={`/produits/${article.slug}`} className="line-clamp-1 text-sm font-medium hover:underline">
                    {article.nom}
                  </Link>
                  <p className="text-xs text-muted-foreground">Taille {article.taille}</p>
                </div>
                <button
                  type="button"
                  onClick={() => retirer(article.varianteId)}
                  aria-label="Retirer du panier"
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2Icon className="size-4" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => changerQuantite(article.varianteId, article.quantite - 1)}
                    aria-label="Diminuer la quantité"
                  >
                    <MinusIcon />
                  </Button>
                  <span className="w-6 text-center text-sm font-medium">{article.quantite}</span>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => changerQuantite(article.varianteId, article.quantite + 1)}
                    disabled={article.quantite >= article.stockDisponible}
                    aria-label="Augmenter la quantité"
                  >
                    <PlusIcon />
                  </Button>
                </div>
                <span className="font-mono text-sm font-semibold">
                  {formatGNF(article.prixUnitaire * article.quantite)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Separator />

      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-muted-foreground">{nombreArticles(articles)} article(s)</span>
          <span className="font-mono text-lg font-semibold">{formatGNF(totalPanier(articles))}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Les frais de livraison sont calculés à l&apos;étape suivante selon votre commune.
        </p>
        <Button size="lg" asChild>
          <Link href="/checkout">Passer la commande</Link>
        </Button>
      </div>
    </div>
  );
}
