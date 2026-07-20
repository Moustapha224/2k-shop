"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { retrouverCommande } from "@/lib/actions/commandes";
import { suiviSchema, type SuiviInput } from "@/lib/validations/checkout";

export function SuiviForm() {
  const [recherche, setRecherche] = useState(false);

  const form = useForm<SuiviInput>({
    resolver: zodResolver(suiviSchema),
    defaultValues: { numero: "", telephone: "" },
  });

  async function onSubmit(data: SuiviInput) {
    setRecherche(true);
    const resultat = await retrouverCommande(data);
    setRecherche(false);
    if (resultat && !resultat.ok) {
      toast.error(resultat.error);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FieldGroup>
        <Field data-invalid={!!form.formState.errors.numero}>
          <FieldLabel htmlFor="numero">Numéro de commande</FieldLabel>
          <Input id="numero" placeholder="2K-2026-0001" {...form.register("numero")} />
          <FieldError errors={[form.formState.errors.numero]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.telephone}>
          <FieldLabel htmlFor="telephone">Téléphone utilisé pour la commande</FieldLabel>
          <Input id="telephone" type="tel" placeholder="620 12 34 56" {...form.register("telephone")} />
          <FieldError errors={[form.formState.errors.telephone]} />
        </Field>
      </FieldGroup>

      <Button type="submit" disabled={recherche}>
        {recherche ? "Recherche..." : "Suivre ma commande"}
      </Button>
    </form>
  );
}
