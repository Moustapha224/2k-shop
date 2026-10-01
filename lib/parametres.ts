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

/** Valeurs de repli, tirees des constantes et de l'environnement. */
function parametresParDefaut(): Parametres {
  return {
    whatsapp: SITE.whatsapp,
    whatsappUrl: process.env.NEXT_PUBLIC_WHATSAPP_URL ?? null,
    facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? null,
    messageAnnonce: null,
  };
}

/**
 * Reglages boutique (numero WhatsApp, banniere d'annonce, liens sociaux).
 *
 * Appelee par le layout de la boutique, donc executee pour CHAQUE page, y
 * compris celles generees statiquement au build (/aide, /a-propos...). Une
 * exception ici ferait echouer le build entier alors qu'il ne s'agit que de
 * reglages d'affichage, tous pourvus d'un repli. On intercepte donc l'erreur
 * au lieu de la laisser remonter : le site se construit et fonctionne, et
 * l'incident reste visible dans les logs serveur.
 */
export async function getParametres(): Promise<Parametres> {
  const defauts = parametresParDefaut();

  try {
    const parametre = await prisma.parametre.findUnique({ where: { id: "principal" } });

    return {
      whatsapp: parametre?.whatsapp ?? defauts.whatsapp,
      whatsappUrl: parametre?.whatsappUrl ?? defauts.whatsappUrl,
      facebookUrl: parametre?.facebookUrl ?? defauts.facebookUrl,
      messageAnnonce: parametre?.messageAnnonce ?? defauts.messageAnnonce,
    };
  } catch (erreur) {
    console.error(
      "[parametres] Lecture impossible, repli sur les valeurs par defaut :",
      erreur instanceof Error ? erreur.message : erreur
    );
    return defauts;
  }
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
