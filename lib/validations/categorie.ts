import { z } from "zod";

export const categorieSchema = z.object({
  nom: z.string().trim().min(2, "Nom trop court").max(60, "Nom trop long"),
  ordre: z.number().int("Nombre entier requis").min(0).max(999),
});

export type CategorieInput = z.infer<typeof categorieSchema>;
