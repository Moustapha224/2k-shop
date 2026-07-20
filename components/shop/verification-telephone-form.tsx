import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function VerificationTelephoneForm({ numero }: { numero: string }) {
  return (
    <form method="GET" className="mx-auto flex w-full max-w-sm flex-col gap-4 px-4 py-10">
      <div>
        <p className="text-sm text-muted-foreground">Commande {numero}</p>
        <h1 className="text-lg font-semibold tracking-tight">Vérification</h1>
      </div>
      <Field>
        <FieldLabel htmlFor="tel">Téléphone utilisé pour la commande</FieldLabel>
        <Input id="tel" name="tel" type="tel" placeholder="620 12 34 56" required />
      </Field>
      <Button type="submit">Voir ma commande</Button>
    </form>
  );
}
