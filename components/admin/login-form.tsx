"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

/**
 * Ne retient une destination que si elle est interne et dans l'admin : une
 * valeur attaquant-controlee (`//evil.com`, `https://…`) transformerait sinon
 * la page de connexion en redirection ouverte.
 */
function destinationSure(valeur: string | null): string {
  if (!valeur) return "/admin";
  if (!valeur.startsWith("/admin") || valeur.startsWith("//")) return "/admin";
  return valeur;
}

export function LoginForm() {
  const router = useRouter();
  const parametres = useSearchParams();
  const [pending, setPending] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: LoginInput) {
    setPending(true);
    const resultat = await signIn("credentials", { ...data, redirect: false });
    setPending(false);

    if (!resultat || resultat.error) {
      toast.error("Email ou mot de passe incorrect.");
      return;
    }

    router.push(destinationSure(parametres.get("callbackUrl")));
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FieldGroup>
        <Field data-invalid={!!form.formState.errors.email}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="username"
            placeholder="admin@2kshop.gn"
            {...form.register("email")}
          />
          <FieldError errors={[form.formState.errors.email]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.password}>
          <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
          <Input id="password" type="password" autoComplete="current-password" {...form.register("password")} />
          <FieldError errors={[form.formState.errors.password]} />
        </Field>
      </FieldGroup>

      <Button type="submit" disabled={pending}>
        {pending ? "Connexion..." : "Se connecter"}
      </Button>
    </form>
  );
}
