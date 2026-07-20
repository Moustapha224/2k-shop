import { z } from "zod";

export const parametreSchema = z.object({
  whatsapp: z
    .string()
    .trim()
    .regex(/^\d{9,15}$/, "Numéro invalide (format international sans le +, ex: 224620123456)"),
  messageAnnonce: z.string().trim().max(200, "200 caractères maximum").optional().or(z.literal("")),
});

export type ParametreInput = z.infer<typeof parametreSchema>;
