"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PencilIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
import { creerCategorie, modifierCategorie } from "@/lib/actions/categories";
import { categorieSchema, type CategorieInput } from "@/lib/validations/categorie";

type Props = { categorie?: { id: string; nom: string; ordre: number } };

export function CategorieFormDialog({ categorie }: Props) {
  const [open, setOpen] = useState(false);

  const form = useForm<CategorieInput>({
    resolver: zodResolver(categorieSchema),
    defaultValues: { nom: categorie?.nom ?? "", ordre: categorie?.ordre ?? 0 },
  });

  async function onSubmit(data: CategorieInput) {
    try {
      if (categorie) {
        await modifierCategorie(categorie.id, data);
      } else {
        await creerCategorie(data);
        form.reset({ nom: "", ordre: 0 });
      }
      toast.success(categorie ? "Catégorie modifiée." : "Catégorie créée.");
      setOpen(false);
    } catch (erreur) {
      toast.error(erreur instanceof Error ? erreur.message : "Une erreur est survenue.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {categorie ? (
          <Button variant="ghost" size="icon-sm" aria-label="Modifier">
            <PencilIcon className="size-4" />
          </Button>
        ) : (
          <Button size="sm">
            <PlusIcon />
            Nouvelle catégorie
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{categorie ? "Modifier la catégorie" : "Nouvelle catégorie"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.nom}>
              <FieldLabel htmlFor="nom">Nom</FieldLabel>
              <Input id="nom" {...form.register("nom")} />
              <FieldError errors={[form.formState.errors.nom]} />
            </Field>
            <Field data-invalid={!!form.formState.errors.ordre}>
              <FieldLabel htmlFor="ordre">Ordre d&apos;affichage</FieldLabel>
              <Input id="ordre" type="number" {...form.register("ordre", { valueAsNumber: true })} />
              <FieldError errors={[form.formState.errors.ordre]} />
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
