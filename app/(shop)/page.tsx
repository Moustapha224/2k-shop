import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/shop/product-grid";
import { prisma } from "@/lib/db";
import { versCarteProduit } from "@/lib/produits";
import { DELAI_LIVRAISON, SITE } from "@/lib/constants";

export default async function AccueilPage() {
  const [categories, produitsRecents] = await Promise.all([
    prisma.categorie.findMany({ orderBy: { ordre: "asc" } }),
    prisma.produit.findMany({
      where: { actif: true },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { images: true, variantes: true },
    }),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-8">
      <section className="flex flex-col items-center gap-3 py-6 text-center">
        <Image
          src="/logo.jpeg"
          alt={`Logo ${SITE.nom}`}
          width={96}
          height={96}
          priority
          className="size-20 rounded-2xl object-contain"
        />
        <h1 className="text-2xl font-semibold tracking-tight">{SITE.nom}</h1>
        <p className="text-sm tracking-[0.2em] text-muted-foreground uppercase">{SITE.slogan}</p>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          Livraison partout à Conakry en {DELAI_LIVRAISON}. Paiement à la livraison uniquement.
        </p>
        <Button asChild className="mt-3">
          <Link href="/produits">
            Voir les produits
            <ArrowRightIcon />
          </Link>
        </Button>
      </section>

      {categories.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold tracking-tight">Catégories</h2>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((categorie) => (
              <Link
                key={categorie.id}
                href={`/produits?categorie=${categorie.slug}`}
                className="flex items-center justify-center rounded-xl border bg-card px-3 py-6 text-center text-sm font-medium ring-1 ring-foreground/10 transition-colors hover:bg-muted"
              >
                {categorie.nom}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Nouveautés</h2>
          <Link href="/produits" className="text-sm text-muted-foreground hover:text-foreground">
            Tout voir
          </Link>
        </div>
        <ProductGrid produits={produitsRecents.map(versCarteProduit)} />
      </section>
    </div>
  );
}
