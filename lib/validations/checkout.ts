import { z } from "zod";

import { normaliserTelephone } from "@/lib/format";

export const checkoutSchema = z.object({
  clientNom: z.string().trim().min(2, "Nom trop court").max(80, "Nom trop long"),
  clientTelephone: z
    .string()
    .trim()
    .transform(normaliserTelephone)
    .pipe(z.string().regex(/^\d{9}$/, "Numéro guinéen invalide (9 chiffres, ex: 620 12 34 56)")),
  // Optionnel : sert uniquement a envoyer la confirmation de commande.
  // Une chaine vide est acceptee et normalisee en `undefined` par l'action.
  clientEmail: z
    .string()
    .trim()
    .toLowerCase()
    .max(120, "Adresse email trop longue")
    .refine(
      (v) => v === "" || z.email().safeParse(v).success,
      "Adresse email invalide"
    )
    .optional(),
  communeId: z.string().min(1, "Choisissez une commune"),
  quartier: z.string().trim().min(2, "Quartier requis").max(80, "Quartier trop long"),
  adresse: z.string().trim().min(3, "Adresse requise").max(200, "Adresse trop longue"),
  notes: z
    .string()
    .trim()
    .max(300, "300 caractères maximum")
    .optional()
    .or(z.literal("")),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const suiviSchema = z.object({
  numero: z.string().trim().min(1, "Numéro de commande requis"),
  telephone: z
    .string()
    .trim()
    .transform(normaliserTelephone)
    .pipe(z.string().regex(/^\d{9}$/, "Numéro guinéen invalide (9 chiffres)")),
});

export type SuiviInput = z.infer<typeof suiviSchema>;
