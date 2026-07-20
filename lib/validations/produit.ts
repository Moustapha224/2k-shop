import { z } from "zod";

export const varianteSchema = z.object({
  taille: z.string().min(1),
  stock: z.number().int("Nombre entier requis").min(0, "Doit être positif"),
});

export const produitSchema = z.object({
  nom: z.string().trim().min(2, "Nom trop court").max(120, "Nom trop long"),
  description: z.string().trim().min(5, "Description trop courte").max(2000, "Description trop longue"),
  prix: z.number().int("Nombre entier requis").min(0, "Doit être positif"),
  categorieId: z.string().min(1, "Choisissez une catégorie"),
  type: z.enum(["VETEMENT", "CHAUSSURE"]),
  actif: z.boolean(),
  variantes: z.array(varianteSchema).min(1, "Au moins une taille requise"),
});

export type ProduitInput = z.infer<typeof produitSchema>;
export type VarianteInput = z.infer<typeof varianteSchema>;
