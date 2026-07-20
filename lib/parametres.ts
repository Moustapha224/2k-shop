import { SITE } from "@/lib/constants";
import { prisma } from "@/lib/db";

export type Parametres = {
  whatsapp: string;
  /** URL WhatsApp complete (ex : wa.me/message/XXX). Prioritaire sur `whatsapp`. */
  whatsappUrl: string | null;
  /** Lien vers la page Facebook de la boutique. */
  facebookUrl: string | null;
  messageAnnonce: string | null;
};

/**
 * Reglages boutique (numero WhatsApp, banniere d'annonce, liens sociaux).
 * Repli sur les constantes et variables d'environnement si l'enregistrement
 * n'existe pas encore.
 */
export async function getParametres(): Promise<Parametres> {
  const parametre = await prisma.parametre.findUnique({ where: { id: "principal" } });

  return {
    whatsapp: parametre?.whatsapp ?? SITE.whatsapp,
    whatsappUrl:
      parametre?.whatsappUrl ?? process.env.NEXT_PUBLIC_WHATSAPP_URL ?? null,
    facebookUrl:
      parametre?.facebookUrl ?? process.env.NEXT_PUBLIC_FACEBOOK_URL ?? null,
    messageAnnonce: parametre?.messageAnnonce ?? null,
  };
}

/**
 * Construit l'URL WhatsApp a utiliser dans l'UI. L'URL custom (wa.me/message/…)
 * l'emporte sur le simple lien construit depuis le numero.
 */
export function urlWhatsApp(parametres: {
  whatsapp: string;
  whatsappUrl: string | null;
}): string {
  return parametres.whatsappUrl?.trim() || `https://wa.me/${parametres.whatsapp}`;
}
