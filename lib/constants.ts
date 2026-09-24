/** Constantes partagées : identité de la boutique, tailles, statuts. */

export const SITE = {
  nom: "2K SHOP",
  slogan: "Qualité et Fiabilité",
  description:
    "Hauts, pantalons et chaussures livrés partout à Conakry. Paiement à la livraison, essayage avant paiement.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** Numéro WhatsApp de la boutique, format international sans "+". */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "224600000000",
} as const;

/**
 * Hôtes autorisés pour les images distantes (slides du carrousel).
 * Doit rester aligné sur `images.remotePatterns` dans next.config.ts : une URL
 * d'un autre hôte ferait planter le rendu de `next/image`.
 */
export const HOTES_IMAGES_DISTANTES = ["images.unsplash.com"] as const;

/** Préfixe des numéros de commande : 2K-2026-0001 */
export const PREFIXE_COMMANDE = "2K";

/** Délai de livraison annoncé au client. */
export const DELAI_LIVRAISON = "24 à 48 heures";

export const TAILLES_VETEMENT = ["S", "M", "L", "XL", "XXL"] as const;
export type TailleVetement = (typeof TAILLES_VETEMENT)[number];

export const TAILLES_CHAUSSURE = [
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
] as const;
export type TailleChaussure = (typeof TAILLES_CHAUSSURE)[number];

/**
 * Statuts d'une commande, dans l'ordre du cycle de vie.
 * Ces valeurs doivent rester alignées sur l'enum Prisma `StatutCommande`.
 */
export const STATUTS_COMMANDE = [
  "EN_ATTENTE",
  "CONFIRMEE",
  "EN_LIVRAISON",
  "LIVREE",
  "ANNULEE",
  "RETOURNEE",
] as const;
export type StatutCommande = (typeof STATUTS_COMMANDE)[number];

/** Étapes affichées dans la timeline de suivi (hors statuts terminaux négatifs). */
export const PARCOURS_COMMANDE = [
  "EN_ATTENTE",
  "CONFIRMEE",
  "EN_LIVRAISON",
  "LIVREE",
] as const satisfies readonly StatutCommande[];

export const STATUT_LABEL: Record<StatutCommande, string> = {
  EN_ATTENTE: "En attente",
  CONFIRMEE: "Confirmée",
  EN_LIVRAISON: "En livraison",
  LIVREE: "Livrée",
  ANNULEE: "Annulée",
  RETOURNEE: "Retournée",
};

/** Description affichée au client dans le suivi de commande. */
export const STATUT_DESCRIPTION: Record<StatutCommande, string> = {
  EN_ATTENTE: "Nous avons bien reçu votre commande, nous allons vous appeler pour la confirmer.",
  CONFIRMEE: "Votre commande est confirmée et en cours de préparation.",
  EN_LIVRAISON: "Votre commande est en route. Le livreur vous appellera à l'arrivée.",
  LIVREE: "Votre commande a été livrée. Merci de votre confiance !",
  ANNULEE: "Cette commande a été annulée.",
  RETOURNEE: "Cette commande a été retournée.",
};
