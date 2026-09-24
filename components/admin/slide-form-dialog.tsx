"use client";

import { useEffect, useState } from "react";
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
import { creerSlide, modifierSlide, uploadSlideImage } from "@/lib/actions/slides";
import { slideSchema, type SlideInput } from "@/lib/validations/slide";

type Props = {
  slide?: {
    id: string;
    titre: string | null;
    sousTitre: string | null;
    imageUrl: string | null;
    imageUrlExterne: string | null;
    ordre: number;
    actif: boolean;
  };
};

/** Valeurs du formulaire derivees du slide edite (ou vides pour une creation). */
function valeursInitiales(slide?: Props["slide"]): SlideInput {
  return {
    titre: slide?.titre ?? "",
    sousTitre: slide?.sousTitre ?? "",
    imageUrl: slide?.imageUrl ?? "",
    imageUrlExterne: slide?.imageUrlExterne ?? "",
    ordre: slide?.ordre ?? 0,
    actif: slide?.actif ?? true,
  };
}

export function SlideFormDialog({ slide }: Props) {
  const [open, setOpen] = useState(false);
  const [fichier, setFichier] = useState<File | null>(null);

  const form = useForm<SlideInput>({
    resolver: zodResolver(slideSchema),
    defaultValues: valeursInitiales(slide),
  });

  const { reset } = form;
  // Reinitialise les champs a chaque ouverture : sans cela le formulaire garde
  // les valeurs capturees au premier montage apres un enregistrement.
  useEffect(() => {
    if (open) reset(valeursInitiales(slide));
  }, [open, slide, reset]);

  const actif = form.watch("actif");

  async function onSubmit(data: SlideInput) {
    try {
      let imageUrl = data.imageUrl;
      if (fichier) {
        const formData = new FormData();
        formData.append("fichier", fichier);
        imageUrl = await uploadSlideImage(formData);
        data.imageUrl = imageUrl;
      }

      if (slide) {
        await modifierSlide(slide.id, data);
      } else {
        await creerSlide(data);
        form.reset(valeursInitiales());
      }
      setFichier(null);
      toast.success(slide ? "Slide modifié." : "Slide créé.");
      setOpen(false);
    } catch (erreur) {
      toast.error(erreur instanceof Error ? erreur.message : "Une erreur est survenue.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {slide ? (
          <Button variant="ghost" size="icon-sm" aria-label="Modifier">
            <PencilIcon className="size-4" />
          </Button>
        ) : (
          <Button size="sm">
            <PlusIcon />
            Nouveau slide
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{slide ? "Modifier le slide" : "Nouveau slide"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.titre}>
              <FieldLabel htmlFor="titre">Titre (optionnel)</FieldLabel>
              <Input id="titre" {...form.register("titre")} />
              <FieldError errors={[form.formState.errors.titre]} />
            </Field>
            <Field data-invalid={!!form.formState.errors.sousTitre}>
              <FieldLabel htmlFor="sousTitre">Sous-titre (optionnel)</FieldLabel>
              <Input id="sousTitre" {...form.register("sousTitre")} />
              <FieldError errors={[form.formState.errors.sousTitre]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="fichierLocal">Image (fichier local)</FieldLabel>
              <Input
                id="fichierLocal"
                type="file"
                accept="image/jpeg, image/png, image/webp, image/avif"
                onChange={(e) => setFichier(e.target.files?.[0] || null)}
              />
              {fichier && <span className="text-xs text-muted-foreground">{fichier.name} sélectionné</span>}
            </Field>
            <Field data-invalid={!!form.formState.errors.imageUrl}>
              <FieldLabel htmlFor="imageUrl">Ou URL Image locale existante (ex: /slide/1.png)</FieldLabel>
              <Input id="imageUrl" {...form.register("imageUrl")} />
              <FieldError errors={[form.formState.errors.imageUrl]} />
            </Field>
            <Field data-invalid={!!form.formState.errors.imageUrlExterne}>
              <FieldLabel htmlFor="imageUrlExterne">URL Image Externe (ex: https://...)</FieldLabel>
              <Input id="imageUrlExterne" type="url" {...form.register("imageUrlExterne")} />
              <FieldError errors={[form.formState.errors.imageUrlExterne]} />
            </Field>
            <Field data-invalid={!!form.formState.errors.ordre}>
              <FieldLabel htmlFor="ordre">Ordre d&apos;affichage</FieldLabel>
              <Input id="ordre" type="number" {...form.register("ordre", { valueAsNumber: true })} />
              <FieldError errors={[form.formState.errors.ordre]} />
            </Field>
            <Field orientation="horizontal">
              <Checkbox
                id="actif"
                checked={actif}
                onCheckedChange={(v) => form.setValue("actif", v === true)}
              />
              <FieldLabel htmlFor="actif">Slide visible sur la page d&apos;accueil</FieldLabel>
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
