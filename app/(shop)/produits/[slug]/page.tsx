import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AddToCartForm } from "@/components/shop/add-to-cart-form";
import { ProductGallery } from "@/components/shop/product-gallery";
import { SITE } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { formatGNF } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

async function getProduit(slug: string) {
  return prisma.produit.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { ordre: "asc" } },
      variantes: true,
      categorie: true,
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const produit = await getProduit(slug);
  if (!produit) return {};

  return {
    title: produit.nom,
    description: produit.description,
    openGraph: {
      title: produit.nom,
      description: produit.description,
      images: produit.images[0] ? [produit.images[0].url] : undefined,
    },
  };
}

export default async function ProduitPage({ params }: Props) {
  const { slug } = await params;
  const produit = await getProduit(slug);

  if (!produit || !produit.actif) notFound();

  const enStock = produit.variantes.some((v) => v.stock > 0);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: produit.nom,
    description: produit.description,
    image: produit.images.map((image) => `${SITE.url}${image.url}`),
    offers: {
      "@type": "Offer",
      url: `${SITE.url}/produits/${produit.slug}`,
      priceCurrency: "GNF",
      price: produit.prix,
      availability: enStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-6 md:grid-cols-2">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <ProductGallery images={produit.images} nom={produit.nom} />

      <div className="flex flex-col gap-4">
        <div>
          <Badge variant="secondary">{produit.categorie.nom}</Badge>
          <h1 className="mt-2 text-xl font-semibold tracking-tight">{produit.nom}</h1>
          <p className="mt-1 font-mono text-lg font-semibold">{formatGNF(produit.prix)}</p>
        </div>

        <p className="text-sm text-muted-foreground">{produit.description}</p>

        <Separator />

        <AddToCartForm
          produit={{
            id: produit.id,
            slug: produit.slug,
            nom: produit.nom,
            prixUnitaire: produit.prix,
            image: produit.images[0]?.url ?? null,
          }}
          variantes={produit.variantes.map((v) => ({ id: v.id, taille: v.taille, stock: v.stock }))}
        />
      </div>
    </div>
  );
}
