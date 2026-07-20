"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PencilIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { creerCommune, modifierCommune } from "@/lib/actions/communes";
import { communeSchema, type CommuneInput } from "@/lib/validations/commune";

type Props = {
  commune?: { id: string; nom: string; fraisLivraison: number; actif: boolean };
};

export function CommuneFormDialog({ commune }: Props) {
  const [open, setOpen] = useState(false);

  const form = useForm<CommuneInput>({
    resolver: zodResolver(communeSchema),
    defaultValues: {
      nom: commune?.nom ?? "",
      fraisLivraison: commune?.fraisLivraison ?? 0,
      actif: commune?.actif ?? true,
    },
  });

  const actif = form.watch("actif");

  async function onSubmit(data: CommuneInput) {
    try {
      if (commune) {
        await modifierCommune(commune.id, data);
      } else {
        await creerCommune(data);
        form.reset({ nom: "", fraisLivraison: 0, actif: true });
      }
      toast.success(commune ? "Commune modifiée." : "Commune créée.");
      setOpen(false);
    } catch (erreur) {
      toast.error(erreur instanceof Error ? erreur.message : "Une erreur est survenue.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {commune ? (
          <Button variant="ghost" size="icon-sm" aria-label="Modifier">
            <PencilIcon className="size-4" />
          </Button>
        ) : (
          <Button size="sm">
            <PlusIcon />
            Nouvelle commune
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{commune ? "Modifier la commune" : "Nouvelle commune"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.nom}>
              <FieldLabel htmlFor="nom">Nom</FieldLabel>
              <Input id="nom" {...form.register("nom")} />
              <FieldError errors={[form.formState.errors.nom]} />
            </Field>
            <Field data-invalid={!!form.formState.errors.fraisLivraison}>
              <FieldLabel htmlFor="fraisLivraison">Frais de livraison (GNF)</FieldLabel>
              <Input
                id="fraisLivraison"
                type="number"
                {...form.register("fraisLivraison", { valueAsNumber: true })}
              />
              <FieldError errors={[form.formState.errors.fraisLivraison]} />
            </Field>
            <Field orientation="horizontal">
              <Checkbox
                id="actif"
                checked={actif}
                onCheckedChange={(valeur) => form.setValue("actif", valeur === true)}
              />
              <FieldLabel htmlFor="actif">Commune active (visible au checkout)</FieldLabel>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
