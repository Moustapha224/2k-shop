import { CheckIcon } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import {
  PARCOURS_COMMANDE,
  STATUT_DESCRIPTION,
  STATUT_LABEL,
  type StatutCommande,
} from "@/lib/constants";
import { formatDateHeure, formatGNF } from "@/lib/format";
import { cn } from "@/lib/utils";

type LigneAffichee = {
  id: string;
  nomProduit: string;
  taille: string;
  quantite: number;
  sousTotal: number;
};

type CommandeAffichee = {
  numero: string;
  statut: string;
  createdAt: Date;
  sousTotal: number;
  fraisLivraison: number;
  total: number;
  quartier: string;
  adresse: string;
  commune: { nom: string };
  lignes: LigneAffichee[];
};

export function CommandeDetail({
  commande,
  whatsapp,
  confirmation = false,
}: {
  commande: CommandeAffichee;
  whatsapp: string;
  confirmation?: boolean;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        {confirmation && (
          <p className="mb-1 text-sm font-medium text-primary">Commande enregistrée !</p>
        )}
        <h1 className="text-xl font-semibold tracking-tight">Commande {commande.numero}</h1>
        <p className="text-sm text-muted-foreground">{formatDateHeure(commande.createdAt)}</p>
      </div>

      <CommandeTimeline statut={commande.statut} />

      <Separator />

      <div>
        <p className="mb-2 text-sm font-medium">Articles</p>
        <ul className="flex flex-col gap-2">
          {commande.lignes.map((ligne) => (
            <li key={ligne.id} className="flex justify-between text-sm">
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
      </div>

      <Separator />

      <div className="flex flex-col gap-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Sous-total</span>
          <span>{formatGNF(commande.sousTotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Livraison ({commande.commune.nom})</span>
          <span>{formatGNF(commande.fraisLivraison)}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span className="font-mono">{formatGNF(commande.total)}</span>
        </div>
      </div>

      <Separator />

      <div className="text-sm">
        <p className="font-medium">Livraison</p>
        <p className="text-muted-foreground">
          {commande.quartier}, {commande.adresse} — {commande.commune.nom}
        </p>
      </div>

      <a
        href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(
          `Bonjour, je vous contacte au sujet de ma commande ${commande.numero}`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-center text-sm font-medium text-primary hover:underline"
      >
        Nous contacter sur WhatsApp au sujet de cette commande
      </a>
    </div>
  );
}

function CommandeTimeline({ statut }: { statut: string }) {
  if (statut === "ANNULEE" || statut === "RETOURNEE") {
    const s = statut as StatutCommande;
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
        <p className="font-medium">{STATUT_LABEL[s]}</p>
        <p>{STATUT_DESCRIPTION[s]}</p>
      </div>
    );
  }

  const indexActuel = PARCOURS_COMMANDE.indexOf(statut as (typeof PARCOURS_COMMANDE)[number]);

  return (
    <ol className="flex flex-col gap-3">
      {PARCOURS_COMMANDE.map((etape, i) => {
        const atteinte = i <= indexActuel;
        return (
          <li key={etape} className="flex gap-3">
            <span
              className={cn(
                "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-medium",
                atteinte ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}
            >
              {atteinte ? <CheckIcon className="size-3" /> : i + 1}
            </span>
            <div>
              <p className={cn("text-sm font-medium", !atteinte && "text-muted-foreground")}>
                {STATUT_LABEL[etape]}
              </p>
              {i === indexActuel && (
                <p className="text-xs text-muted-foreground">{STATUT_DESCRIPTION[etape]}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
