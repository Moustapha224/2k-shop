import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StatutSelect } from "@/components/admin/statut-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { StatutCommande } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { formatDateHeure, formatGNF, formatTelephone } from "@/lib/format";

export const metadata: Metadata = { title: "Détail commande" };

type Props = { params: Promise<{ id: string }> };

export default async function AdminCommandeDetailPage({ params }: Props) {
  const { id } = await params;
  const commande = await prisma.commande.findUnique({
    where: { id },
    include: { commune: true, lignes: true },
  });

  if (!commande) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Commande {commande.numero}</h1>
          <p className="text-sm text-muted-foreground">{formatDateHeure(commande.createdAt)}</p>
        </div>
        <StatutSelect commandeId={commande.id} statutActuel={commande.statut as StatutCommande} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Client</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1 text-sm">
            <p>{commande.clientNom}</p>
            <p className="text-muted-foreground">{formatTelephone(commande.clientTelephone)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Livraison</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1 text-sm">
            <p>
              {commande.commune.nom}, {commande.quartier}
            </p>
            <p className="text-muted-foreground">{commande.adresse}</p>
            {commande.notes && <p className="text-muted-foreground">Notes : {commande.notes}</p>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Articles</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <ul className="flex flex-col gap-2 text-sm">
            {commande.lignes.map((ligne) => (
              <li key={ligne.id} className="flex justify-between">
                <span>
                  {ligne.nomProduit}{" "}
                  <span className="text-muted-foreground">
                    (taille {ligne.taille}) × {ligne.quantite}
                  </span>
                </span>
                <span className="font-mono">{formatGNF(ligne.sousTotal)}</span>
              </li>
            ))}
          </ul>
          <Separator />
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sous-total</span>
              <span>{formatGNF(commande.sousTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Livraison</span>
              <span>{formatGNF(commande.fraisLivraison)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="font-mono">{formatGNF(commande.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
