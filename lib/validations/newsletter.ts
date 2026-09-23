import { z } from "zod";

export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Entrez votre adresse email")
    .max(120, "Adresse email trop longue")
    // Stocke en minuscules : l'unicite @unique de SQLite compare octet par
    // octet, donc "A@b.com" et "a@b.com" creeraient deux lignes distinctes.
    .toLowerCase()
    .pipe(z.email("Adresse email invalide")),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
