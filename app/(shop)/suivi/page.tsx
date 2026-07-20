import type { Metadata } from "next";

import { SuiviForm } from "@/components/shop/suivi-form";

export const metadata: Metadata = { title: "Suivi de commande" };

export default function SuiviPage() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-5 px-4 py-10">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Suivi de commande</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Entrez votre numéro de commande et votre téléphone pour voir son statut.
        </p>
      </div>
      <SuiviForm />
    </div>
  );
}
