"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { creerProduit, modifierProduit } from "@/lib/actions/produits";
import { TAILLES_CHAUSSURE, TAILLES_VETEMENT } from "@/lib/constants";
import { produitSchema, type ProduitInput } from "@/lib/validations/produit";

type TypeProduit = "VETEMENT" | "CHAUSSURE";

function taillesPourType(type: TypeProduit): readonly string[] {
  return type === "VETEMENT" ? TAILLES_VETEMENT : TAILLES_CHAUSSURE;
}

type Categorie = { id: string; nom: string };
type ProduitExistant = {
  id: string;
  nom: string;
  description: string;
  prix: number;
  categorieId: string;
  type: TypeProduit;
  actif: boolean;
  variantes: { taille: string; stock: number }[];
};

export function ProduitForm({
  categories,
  produit,
}: {
  categories: Categorie[];
  produit?: ProduitExistant;
}) {
  const router = useRouter();
  const typeInitial = produit?.type ?? "VETEMENT";

  const form = useForm<ProduitInput>({
    resolver: zodResolver(produitSchema),
    defaultValues: {
      nom: produit?.nom ?? "",
      description: produit?.description ?? "",
      prix: produit?.prix ?? 0,
      categorieId: produit?.categorieId ?? "",
      type: typeInitial,
      actif: produit?.actif ?? true,
      variantes: taillesPourType(typeInitial).map((taille) => ({
        taille,
        stock: produit?.variantes.find((v) => v.taille === taille)?.stock ?? 0,
      })),
    },
  });

  const typeActuel = form.watch("type");
  const categorieId = form.watch("categorieId");
  const actif = form.watch("actif");
  const variantes = form.watch("variantes");

  function changerType(nouveauType: TypeProduit) {
    form.setValue("type", nouveauType);
    form.setValue(
      "variantes",
      taillesPourType(nouveauType).map((taille) => ({ taille, stock: 0 }))
    );
  }

  async function onSubmit(data: ProduitInput) {
    const resultat = produit ? await modifierProduit(produit.id, data) : await creerProduit(data);
    if (resultat && !resultat.ok) {
      toast.error(resultat.error);
      return;
    }
    if (produit) {
      toast.success("Produit enregistré.");
      router.refresh();
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <FieldGroup>
        <Field data-invalid={!!form.formState.errors.nom}>
          <FieldLabel htmlFor="nom">Nom</FieldLabel>
          <Input id="nom" {...form.register("nom")} />
          <FieldError errors={[form.formState.errors.nom]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.description}>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea id="description" rows={4} {...form.register("description")} />
          <FieldError errors={[form.formState.errors.description]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.prix}>
          <FieldLabel htmlFor="prix">Prix (GNF)</FieldLabel>
          <Input id="prix" type="number" {...form.register("prix", { valueAsNumber: true })} />
          <FieldError errors={[form.formState.errors.prix]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.categorieId}>
          <FieldLabel htmlFor="categorieId">Catégorie</FieldLabel>
          <Select
            value={categorieId}
            onValueChange={(v) => form.setValue("categorieId", v, { shouldValidate: true })}
          >
            <SelectTrigger id="categorieId" className="w-full">
              <SelectValue placeholder="Choisir une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError errors={[form.formState.errors.categorieId]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="type">Type (détermine les tailles)</FieldLabel>
          <Select
            value={typeActuel}
            onValueChange={(v) => changerType(v as TypeProduit)}
            disabled={!!produit}
          >
            <SelectTrigger id="type" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VETEMENT">Vêtement (S — XXL)</SelectItem>
              <SelectItem value="CHAUSSURE">Chaussure (38 — 46)</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field orientation="horizontal">
          <Checkbox id="actif" checked={actif} onCheckedChange={(v) => form.setValue("actif", v === true)} />
          <FieldLabel htmlFor="actif">Produit visible sur la boutique</FieldLabel>
        </Field>
      </FieldGroup>

      <div>
        <p className="mb-2 text-sm font-medium">Stock par taille</p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {variantes.map((variante, index) => (
            <Field key={variante.taille}>
              <FieldLabel htmlFor={`stock-${variante.taille}`}>{variante.taille}</FieldLabel>
              <Input
                id={`stock-${variante.taille}`}
                type="number"
                min={0}
                value={variante.stock}
                onChange={(e) =>
                  form.setValue(`variantes.${index}.stock`, Number(e.target.value) || 0)
                }
              />
            </Field>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {produit ? "Enregistrer les modifications" : "Créer le produit"}
      </Button>
    </form>
  );
}
