import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { STATUTS_COMMANDE, STATUT_LABEL, type StatutCommande } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { formatDateHeure, formatGNF } from "@/lib/format";

export const metadata: Metadata = { title: "Commandes" };

const TAILLE_PAGE = 20;

type Props = {
  searchParams: Promise<{ statut?: string; page?: string }>;
};

export default async function AdminCommandesPage({ searchParams }: Props) {
  const { statut, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const statutValide = STATUTS_COMMANDE.includes(statut as StatutCommande)
    ? (statut as StatutCommande)
    : undefined;

  const where = statutValide ? { statut: statutValide } : {};

  const [commandes, total] = await Promise.all([
    prisma.commande.findMany({
      where,
      include: { commune: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * TAILLE_PAGE,
      take: TAILLE_PAGE,
    }),
    prisma.commande.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / TAILLE_PAGE));

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold tracking-tight">Commandes</h1>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <Link
          href="/admin/commandes"
          className={cn(
            "shrink-0 rounded-full border px-3 py-1 text-sm font-medium",
            !statutValide ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted"
          )}
        >
          Tous
        </Link>
        {STATUTS_COMMANDE.map((s) => (
          <Link
            key={s}
            href={`/admin/commandes?statut=${s}`}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1 text-sm font-medium",
              statutValide === s ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted"
            )}
          >
            {STATUT_LABEL[s]}
          </Link>
        ))}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Numéro</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Commune</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {commandes.map((commande) => (
            <TableRow key={commande.id}>
              <TableCell>
                <Link href={`/admin/commandes/${commande.id}`} className="font-medium hover:underline">
                  {commande.numero}
                </Link>
              </TableCell>
              <TableCell>{commande.clientNom}</TableCell>
              <TableCell>{commande.commune.nom}</TableCell>
              <TableCell>
                <Badge variant="secondary">{STATUT_LABEL[commande.statut as StatutCommande]}</Badge>
              </TableCell>
              <TableCell className="font-mono">{formatGNF(commande.total)}</TableCell>
              <TableCell className="text-muted-foreground">{formatDateHeure(commande.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {commandes.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">Aucune commande.</p>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" asChild disabled={page <= 1}>
            <Link
              href={`/admin/commandes?${statutValide ? `statut=${statutValide}&` : ""}page=${page - 1}`}
              className={page <= 1 ? "pointer-events-none opacity-40" : undefined}
            >
              Précédent
            </Link>
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} / {totalPages}
          </span>
          <Button variant="outline" size="sm" asChild disabled={page >= totalPages}>
            <Link
              href={`/admin/commandes?${statutValide ? `statut=${statutValide}&` : ""}page=${page + 1}`}
              className={page >= totalPages ? "pointer-events-none opacity-40" : undefined}
            >
              Suivant
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
