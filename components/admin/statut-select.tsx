"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { changerStatutCommande } from "@/lib/actions/commandes-admin";
import { STATUTS_COMMANDE, STATUT_LABEL, type StatutCommande } from "@/lib/constants";

export function StatutSelect({
  commandeId,
  statutActuel,
}: {
  commandeId: string;
  statutActuel: StatutCommande;
}) {
  const [pending, startTransition] = useTransition();

  function onChange(valeur: string) {
    startTransition(async () => {
      try {
        await changerStatutCommande(commandeId, valeur as StatutCommande);
        toast.success("Statut mis à jour.");
      } catch {
        toast.error("Impossible de mettre à jour le statut.");
      }
    });
  }

  return (
    <Select value={statutActuel} onValueChange={onChange} disabled={pending}>
      <SelectTrigger className="w-full sm:w-56">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUTS_COMMANDE.map((s) => (
          <SelectItem key={s} value={s}>
            {STATUT_LABEL[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
