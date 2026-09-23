import { z } from "zod";

import { HOTES_IMAGES_DISTANTES } from "@/lib/constants";

const HOTES_AUTORISES: readonly string[] = HOTES_IMAGES_DISTANTES;

export const slideSchema = z.object({
  titre: z.string().trim().max(100, "Titre trop long").optional().or(z.literal("")),
  sousTitre: z.string().trim().max(200, "Sous-titre trop long").optional().or(z.literal("")),
  // Chemin servi depuis /public : doit rester relatif, sinon next/image refuse la source.
  imageUrl: z
    .string()
    .trim()
    .refine((valeur) => valeur === "" || valeur.startsWith("/"), {
      message: "Chemin local invalide (doit commencer par «/», ex: /slide/1.png)",
    })
    .optional()
    .or(z.literal("")),
  // Une URL distante n'est affichable que si son hote figure dans
  // `images.remotePatterns` (next.config.ts) — sinon next/image jette a l'execution
  // et la page d'accueil tombe.
  imageUrlExterne: z
    .string()
    .trim()
    .url("URL invalide")
    .refine(
      (valeur) => {
        try {
          return HOTES_AUTORISES.includes(new URL(valeur).hostname);
        } catch {
          return false;
        }
      },
      { message: `Hôte non autorisé (autorisés : ${HOTES_AUTORISES.join(", ")})` }
    )
    .optional()
    .or(z.literal("")),
  ordre: z.number().int("Nombre entier requis").min(0).max(999),
  // Pas de `.default()` : il rendrait le champ optionnel en entree et le type
  // d'entree du schema ne collerait plus a `SlideInput` cote react-hook-form.
  actif: z.boolean(),
});

export type SlideInput = z.infer<typeof slideSchema>;
