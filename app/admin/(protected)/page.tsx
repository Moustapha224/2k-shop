import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangleIcon, ClockIcon, PackageIcon, TrendingUpIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { STATUT_LABEL } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { formatDateHeure, formatGNF } from "@/lib/format";

export const metadata: Metadata = { title: "Dashboard" };

async function getStats() {
  const debutJour = new Date();
  debutJour.setUTCHours(0, 0, 0, 0);

  const [commandesEnAttente, statsAujourdhui, produitsActifs, commandesRecentes] = await Promise.all([
    prisma.commande.count({ where: { statut: "EN_ATTENTE" } }),
    prisma.commande.aggregate({
      where: { createdAt: { gte: debutJour } },
      _count: true,
      _sum: { total: true },
    }),
    prisma.produit.findMany({ where: { actif: true }, include: { variantes: true } }),
    prisma.commande.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { commune: true },
    }),
  ]);

  const produitsEnRupture = produitsActifs.filter((p) => p.variantes.every((v) => v.stock <= 0)).length;

  return {
    commandesEnAttente,
    commandesAujourdhui: statsAujourdhui._count,
    chiffreAffairesAujourdhui: statsAujourdhui._sum.total ?? 0,
    produitsEnRupture,
    commandesRecentes,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">En attente</CardTitle>
            <ClockIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats.commandesEnAttente}</CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Commandes aujourd&apos;hui</CardTitle>
            <PackageIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats.commandesAujourdhui}</CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ventes aujourd&apos;hui</CardTitle>
            <TrendingUpIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="font-mono text-2xl font-semibold">
            {formatGNF(stats.chiffreAffairesAujourdhui)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Produits en rupture</CardTitle>
            <AlertTriangleIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats.produitsEnRupture}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dernières commandes</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
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
              {stats.commandesRecentes.map((commande) => (
                <TableRow key={commande.id}>
                  <TableCell>
                    <Link href={`/admin/commandes/${commande.id}`} className="font-medium hover:underline">
                      {commande.numero}
                    </Link>
                  </TableCell>
                  <TableCell>{commande.clientNom}</TableCell>
                  <TableCell>{commande.commune.nom}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{STATUT_LABEL[commande.statut as keyof typeof STATUT_LABEL]}</Badge>
                  </TableCell>
                  <TableCell className="font-mono">{formatGNF(commande.total)}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDateHeure(commande.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
