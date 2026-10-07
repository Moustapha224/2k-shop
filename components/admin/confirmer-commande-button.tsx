"use client";

import { useTransition } from "react";
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { changerStatutCommande } from "@/lib/actions/commandes-admin";

/**
 * Raccourci vers l'action la plus frequente : passer une commande en attente
 * a « Confirmee », d'un seul geste plutot qu'en deroulant le selecteur.
 *
 * Volontairement un bouton sur la page, et non un lien dans l'email : un lien
 * qui modifie des donnees est declenche par les previsualisations des clients
 * mail et les scanners de securite, ce qui confirmerait les commandes toutes
 * seules a la reception.
 */
export function ConfirmerCommandeButton({ commandeId }: { commandeId: string }) {
  const [enCours, demarrer] = useTransition();

  return (
    <Button
      type="button"
      disabled={enCours}
      onClick={() =>
        demarrer(async () => {
          try {
            await changerStatutCommande(commandeId, "CONFIRMEE");
            toast.success("Commande confirmée. Le client peut la suivre.");
          } catch {
            toast.error("Impossible de confirmer la commande.");
          }
        })
      }
    >
      <CheckIcon className="size-4" />
      {enCours ? "Confirmation…" : "Confirmer la commande"}
    </Button>
  );
}
