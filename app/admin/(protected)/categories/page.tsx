import type { Metadata } from "next";

import { CategorieFormDialog } from "@/components/admin/categorie-form-dialog";
import { SupprimerBouton } from "@/components/admin/supprimer-bouton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supprimerCategorie } from "@/lib/actions/categories";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Catégories" };

export default async function AdminCategoriesPage() {
  const categories = await prisma.categorie.findMany({
    orderBy: { ordre: "asc" },
    include: { _count: { select: { produits: true } } },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Catégories</h1>
        <CategorieFormDialog />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Ordre</TableHead>
            <TableHead>Produits</TableHead>
            <TableHead className="w-20" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((categorie) => (
            <TableRow key={categorie.id}>
              <TableCell className="font-medium">{categorie.nom}</TableCell>
              <TableCell>{categorie.ordre}</TableCell>
              <TableCell>{categorie._count.produits}</TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <CategorieFormDialog categorie={categorie} />
                  <SupprimerBouton
                    action={supprimerCategorie.bind(null, categorie.id)}
                    confirmMessage={`Supprimer la catégorie "${categorie.nom}" ?`}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {categories.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">Aucune catégorie.</p>
      )}
    </div>
  );
}
