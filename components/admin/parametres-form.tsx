"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { modifierParametres } from "@/lib/actions/parametres";
import { parametreSchema, type ParametreInput } from "@/lib/validations/parametre";
import type { Parametres } from "@/lib/parametres";

export function ParametresForm({ parametres }: { parametres: Parametres }) {
  const form = useForm<ParametreInput>({
    resolver: zodResolver(parametreSchema),
    defaultValues: {
      whatsapp: parametres.whatsapp,
      whatsappUrl: parametres.whatsappUrl ?? "",
      facebookUrl: parametres.facebookUrl ?? "",
      messageAnnonce: parametres.messageAnnonce ?? "",
    },
  });

  async function onSubmit(data: ParametreInput) {
    const resultat = await modifierParametres(data);
    if (!resultat.ok) {
      toast.error(resultat.error);
      return;
    }
    toast.success("Paramètres enregistrés.");
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex max-w-md flex-col gap-6">
      <FieldGroup>
        <Field data-invalid={!!form.formState.errors.whatsapp}>
          <FieldLabel htmlFor="whatsapp">Numéro WhatsApp</FieldLabel>
          <Input id="whatsapp" placeholder="224620123456" {...form.register("whatsapp")} />
          <FieldDescription>Format international sans le &quot;+&quot;.</FieldDescription>
          <FieldError errors={[form.formState.errors.whatsapp]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.whatsappUrl}>
          <FieldLabel htmlFor="whatsappUrl">Lien WhatsApp (optionnel)</FieldLabel>
          <Input
            id="whatsappUrl"
            placeholder="https://wa.me/message/XXXXXXXXXXX"
            {...form.register("whatsappUrl")}
          />
          <FieldDescription>
            Si renseigné, prioritaire sur le numéro pour le bouton flottant (ex :
            lien à message pré-rempli WhatsApp Business).
          </FieldDescription>
          <FieldError errors={[form.formState.errors.whatsappUrl]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.facebookUrl}>
          <FieldLabel htmlFor="facebookUrl">Page Facebook (optionnel)</FieldLabel>
          <Input
            id="facebookUrl"
            placeholder="https://www.facebook.com/..."
            {...form.register("facebookUrl")}
          />
          <FieldDescription>Affichée dans le footer si renseignée.</FieldDescription>
          <FieldError errors={[form.formState.errors.facebookUrl]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.messageAnnonce}>
          <FieldLabel htmlFor="messageAnnonce">Bannière d&apos;annonce (optionnel)</FieldLabel>
          <Textarea
            id="messageAnnonce"
            rows={2}
            placeholder="Ex : Livraison gratuite ce weekend !"
            {...form.register("messageAnnonce")}
          />
          <FieldDescription>Affichée en haut du site si renseignée.</FieldDescription>
          <FieldError errors={[form.formState.errors.messageAnnonce]} />
        </Field>
      </FieldGroup>

      <Button type="submit" disabled={form.formState.isSubmitting} className="self-start">
        Enregistrer
      </Button>
    </form>
  );
}
