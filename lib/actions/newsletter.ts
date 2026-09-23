"use server";

import { prisma } from "@/lib/db";
import { newsletterSchema } from "@/lib/validations/newsletter";

export type ResultatInscription =
  | { ok: true; deja: boolean }
  | { ok: false; error: string };

/**
 * Inscrit une adresse a la newsletter.
 *
 * Action publique (appelee depuis le footer, sans authentification) : on ne
 * renvoie donc jamais de detail technique au client, et on `upsert` pour que
 * deux envois successifs du meme formulaire ne produisent pas d'erreur.
 * Une adresse desabonnee qui se reinscrit est simplement reactivee.
 */
export async function inscrireNewsletter(
  input: { email: string }
): Promise<ResultatInscription> {
  const analyse = newsletterSchema.safeParse(input);
  if (!analyse.success) {
    return { ok: false, error: analyse.error.issues[0]?.message ?? "Adresse email invalide" };
  }

  const { email } = analyse.data;

  try {
    const existant = await prisma.abonneNewsletter.findUnique({
      where: { email },
      select: { actif: true },
    });

    await prisma.abonneNewsletter.upsert({
      where: { email },
      update: { actif: true },
      create: { email },
    });

    // `deja` vaut true uniquement si l'adresse etait deja abonnee ET active :
    // une reinscription apres desabonnement merite le message de bienvenue.
    return { ok: true, deja: existant?.actif === true };
  } catch (erreur) {
    console.error("[newsletter] Inscription en echec :", erreur);
    return { ok: false, error: "Inscription impossible pour le moment. Réessayez plus tard." };
  }
}
