import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ShieldCheckIcon, SparklesIcon, TruckIcon } from "lucide-react";

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

  const arguments_confiance = [
    {
      icon: TruckIcon,
      titre: `Livraison en ${DELAI_LIVRAISON}`,
      texte: "Partout à Conakry, chez vous ou à votre bureau.",
    },
    {
      icon: ShieldCheckIcon,
      titre: "Paiement à la livraison",
      texte: "Aucun paiement en ligne. Vous réglez le livreur en espèces.",
    },
    {
      icon: SparklesIcon,
      titre: "Essayage avant paiement",
      texte: "Vous vérifiez la taille et l'état à la réception.",
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 py-8">
      {/* Hero : degrade doux + entree en fondu, coherent en clair et en sombre */}
      <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-muted/60 via-background to-muted/40 px-6 py-10 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 sm:px-10 sm:py-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 size-56 rounded-full bg-foreground/5 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-24 size-56 rounded-full bg-foreground/5 blur-3xl"
        />

        <div className="relative flex flex-col items-center gap-4 text-center">
          <Image
            src="/logo.jpeg"
            alt={`Logo ${SITE.nom}`}
            width={112}
            height={112}
            priority
            className="size-24 rounded-2xl bg-white object-contain shadow-sm ring-1 ring-black/5 dark:ring-white/10"
          />
          <div className="flex flex-col items-center gap-1">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{SITE.nom}</h1>
            <p className="text-xs tracking-[0.25em] text-muted-foreground uppercase sm:text-sm">
              {SITE.slogan}
            </p>
          </div>
          <p className="max-w-md text-sm text-muted-foreground sm:text-base">
            Hauts, pantalons et chaussures livrés partout à Conakry en {DELAI_LIVRAISON}.
            <br className="hidden sm:inline" />
            Vous ne payez rien maintenant. Vous payez le livreur à la réception.
          </p>
          <Button asChild size="lg" className="mt-2 group">
            <Link href="/produits">
              Voir les produits
              <ArrowRightIcon className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Arguments de confiance */}
      <section className="grid gap-3 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-75 sm:grid-cols-3">
        {arguments_confiance.map(({ icon: Icon, titre, texte }) => (
          <div
            key={titre}
            className="rounded-2xl border bg-card p-4 transition-shadow hover:shadow-sm"
          >
            <Icon className="mb-2 size-5 text-foreground" />
            <p className="text-sm font-medium">{titre}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{texte}</p>
          </div>
        ))}
      </section>

      {categories.length > 0 && (
        <section className="flex flex-col gap-3 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-100">
          <h2 className="text-lg font-semibold tracking-tight">Catégories</h2>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((categorie) => (
              <Link
                key={categorie.id}
                href={`/produits?categorie=${categorie.slug}`}
                className="group flex items-center justify-center rounded-xl border bg-card px-3 py-6 text-center text-sm font-medium ring-1 ring-foreground/5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted hover:shadow-sm"
              >
                <span className="transition-transform group-hover:scale-[1.03]">
                  {categorie.nom}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-3 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-150">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Nouveautés</h2>
          <Link
            href="/produits"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Tout voir
            <ArrowRightIcon className="size-3.5" />
          </Link>
        </div>
        <ProductGrid produits={produitsRecents.map(versCarteProduit)} />
      </section>
    </div>
  );
}
