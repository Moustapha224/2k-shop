import { z } from "zod";

export const communeSchema = z.object({
  nom: z.string().trim().min(2, "Nom trop court").max(60, "Nom trop long"),
  fraisLivraison: z.number().int("Nombre entier requis").min(0, "Doit être positif"),
  actif: z.boolean(),
});

export type CommuneInput = z.infer<typeof communeSchema>;
