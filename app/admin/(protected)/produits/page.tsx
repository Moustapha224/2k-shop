import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ImageOffIcon, PlusIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/db";
import { formatGNF } from "@/lib/format";

export const metadata: Metadata = { title: "Produits" };

type Props = { searchParams: Promise<{ q?: string }> };

export default async function AdminProduitsPage({ searchParams }: Props) {
  const { q } = await searchParams;

  const produits = await prisma.produit.findMany({
    where: q ? { nom: { contains: q } } : undefined,
    include: { images: { orderBy: { ordre: "asc" }, take: 1 }, categorie: true, variantes: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold tracking-tight">Produits</h1>
        <Button size="sm" asChild>
          <Link href="/admin/produits/nouveau">
            <PlusIcon />
            Nouveau produit
          </Link>
        </Button>
      </div>

      <form method="GET" className="flex gap-2">
        <Input name="q" placeholder="Rechercher un produit..." defaultValue={q ?? ""} className="max-w-xs" />
        <Button type="submit" variant="outline">
          Rechercher
        </Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead />
            <TableHead>Nom</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {produits.map((produit) => {
            const stockTotal = produit.variantes.reduce((total, v) => total + v.stock, 0);
            const image = produit.images[0]?.url;
            return (
              <TableRow key={produit.id}>
                <TableCell>
                  <div className="relative size-10 overflow-hidden rounded-md bg-muted">
                    {image ? (
                      <Image src={image} alt="" fill className="object-cover" sizes="40px" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        <ImageOffIcon className="size-4" />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Link href={`/admin/produits/${produit.id}`} className="font-medium hover:underline">
                    {produit.nom}
                  </Link>
                </TableCell>
                <TableCell>{produit.categorie.nom}</TableCell>
                <TableCell className="font-mono">{formatGNF(produit.prix)}</TableCell>
                <TableCell>{stockTotal}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant={produit.actif ? "secondary" : "outline"}>
                      {produit.actif ? "Visible" : "Masqué"}
                    </Badge>
                    {stockTotal === 0 && <Badge variant="destructive">Rupture</Badge>}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {produits.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">Aucun produit.</p>
      )}
    </div>
  );
}
