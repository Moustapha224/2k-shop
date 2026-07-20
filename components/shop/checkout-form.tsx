"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ShoppingBagIcon } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { creerCommande } from "@/lib/actions/commandes";
import { formatGNF } from "@/lib/format";
import { totalPanier, usePanierStore } from "@/lib/store/cart";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations/checkout";

type Commune = { id: string; nom: string; fraisLivraison: number };

export function CheckoutForm({ communes }: { communes: Commune[] }) {
  const articles = usePanierStore((state) => state.articles);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  const form = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      clientNom: "",
      clientTelephone: "",
      communeId: "",
      quartier: "",
      adresse: "",
      notes: "",
    },
  });

  const communeId = form.watch("communeId");
  const commune = communes.find((c) => c.id === communeId);
  const sousTotal = totalPanier(articles);
  const total = sousTotal + (commune?.fraisLivraison ?? 0);

  if (articles.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ShoppingBagIcon />
          </EmptyMedia>
          <EmptyTitle>Votre panier est vide</EmptyTitle>
          <EmptyDescription>Ajoutez des articles avant de passer commande.</EmptyDescription>
        </EmptyHeader>
        <Button asChild>
          <Link href="/produits">Voir les produits</Link>
        </Button>
      </Empty>
    );
  }

  async function onSubmit(data: CheckoutInput) {
    setEnvoiEnCours(true);
    const resultat = await creerCommande({
      ...data,
      articles: articles.map((a) => ({ varianteId: a.varianteId, quantite: a.quantite })),
    });
    setEnvoiEnCours(false);
    if (resultat && !resultat.ok) {
      toast.error(resultat.error);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <FieldGroup>
        <Field data-invalid={!!form.formState.errors.clientNom}>
          <FieldLabel htmlFor="clientNom">Nom complet</FieldLabel>
          <Input id="clientNom" placeholder="Mamadou Diallo" {...form.register("clientNom")} />
          <FieldError errors={[form.formState.errors.clientNom]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.clientTelephone}>
          <FieldLabel htmlFor="clientTelephone">Téléphone</FieldLabel>
          <Input
            id="clientTelephone"
            type="tel"
            placeholder="620 12 34 56"
            {...form.register("clientTelephone")}
          />
          <FieldError errors={[form.formState.errors.clientTelephone]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.communeId}>
          <FieldLabel htmlFor="communeId">Commune</FieldLabel>
          <Select
            value={communeId}
            onValueChange={(valeur) => form.setValue("communeId", valeur, { shouldValidate: true })}
          >
            <SelectTrigger id="communeId" className="w-full">
              <SelectValue placeholder="Choisir une commune" />
            </SelectTrigger>
            <SelectContent>
              {communes.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.nom} — {formatGNF(c.fraisLivraison)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError errors={[form.formState.errors.communeId]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.quartier}>
          <FieldLabel htmlFor="quartier">Quartier</FieldLabel>
          <Input id="quartier" placeholder="Ex : Hamdallaye" {...form.register("quartier")} />
          <FieldError errors={[form.formState.errors.quartier]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.adresse}>
          <FieldLabel htmlFor="adresse">Adresse / point de repère</FieldLabel>
          <Input id="adresse" placeholder="Ex : près de la pharmacie..." {...form.register("adresse")} />
          <FieldError errors={[form.formState.errors.adresse]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="notes">Notes (optionnel)</FieldLabel>
          <Textarea id="notes" placeholder="Précisions pour la livraison" {...form.register("notes")} />
        </Field>
      </FieldGroup>

      <div className="flex flex-col gap-2 rounded-xl border bg-muted/30 p-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Sous-total</span>
          <span>{formatGNF(sousTotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Livraison</span>
          <span>{commune ? formatGNF(commune.fraisLivraison) : "—"}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span className="font-mono">{formatGNF(total)}</span>
        </div>
      </div>

      <Button type="submit" size="lg" disabled={envoiEnCours}>
        {envoiEnCours ? "Envoi..." : "Confirmer la commande"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">Paiement à la livraison uniquement.</p>
    </form>
  );
}
