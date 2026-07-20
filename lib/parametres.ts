import { SITE } from "@/lib/constants";
import { prisma } from "@/lib/db";

export type Parametres = {
  whatsapp: string;
  messageAnnonce: string | null;
};

/** Reglages boutique (numero WhatsApp, banniere d'annonce), repli sur les constantes si absent. */
export async function getParametres(): Promise<Parametres> {
  const parametre = await prisma.parametre.findUnique({ where: { id: "principal" } });

  return {
    whatsapp: parametre?.whatsapp ?? SITE.whatsapp,
    messageAnnonce: parametre?.messageAnnonce ?? null,
  };
}
