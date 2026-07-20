import type { Metadata } from "next";

import { CommuneFormDialog } from "@/components/admin/commune-form-dialog";
import { SupprimerBouton } from "@/components/admin/supprimer-bouton";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supprimerCommune } from "@/lib/actions/communes";
import { prisma } from "@/lib/db";
import { formatGNF } from "@/lib/format";

export const metadata: Metadata = { title: "Communes" };

export default async function AdminCommunesPage() {
  const communes = await prisma.commune.findMany({ orderBy: { nom: "asc" } });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Communes</h1>
        <CommuneFormDialog />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Frais de livraison</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="w-20" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {communes.map((commune) => (
            <TableRow key={commune.id}>
              <TableCell className="font-medium">{commune.nom}</TableCell>
              <TableCell className="font-mono">{formatGNF(commune.fraisLivraison)}</TableCell>
              <TableCell>
                <Badge variant={commune.actif ? "secondary" : "outline"}>
                  {commune.actif ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <CommuneFormDialog commune={commune} />
                  <SupprimerBouton
                    action={supprimerCommune.bind(null, commune.id)}
                    confirmMessage={`Supprimer la commune "${commune.nom}" ?`}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {communes.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">Aucune commune.</p>
      )}
    </div>
  );
}
