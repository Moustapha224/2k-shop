/**
 * Envoi d'emails (Resend).
 *
 * Charge le SDK et l'API key de maniere paresseuse : si aucune cle n'est
 * configuree, la fonction log un avertissement et rend `{ ok: false }` sans
 * lancer d'erreur. Cela permet au site de tourner en local sans clef Resend :
 * la commande est toujours creee, seule la notification est omise.
 */

import "server-only";

import { SITE } from "@/lib/constants";
import { renderOrderNotification, type OrderNotificationInput } from "@/lib/emails/order-notification";

export type EmailResult =
  | { ok: true; id: string }
  | { ok: false; reason: "not_configured" | "send_failed"; error?: string };

/**
 * Adresse d'expedition. Defaut : sandbox Resend (utilisable sans domaine
 * verifie, limite a l'adresse du proprietaire du compte). En production,
 * verifier un domaine puis regler EMAIL_FROM sur `commandes@votre-domaine.gn`.
 */
function adresseExpediteur(): string {
  const from = process.env.EMAIL_FROM?.trim();
  if (from) return from;
  return `${SITE.nom} <onboarding@resend.dev>`;
}

/** Adresse du proprietaire, destinataire des notifications de commande. */
function adresseDestinataire(): string | null {
  return (
    process.env.NOTIFICATION_EMAIL?.trim() ||
    process.env.ADMIN_EMAIL?.trim() ||
    null
  );
}

/**
 * Envoie la notification "nouvelle commande" au proprietaire.
 * Ne lance jamais d'exception : les erreurs sont retournees sous forme d'objet
 * pour que l'appelant puisse decider (log, retry...).
 */
export async function sendOrderNotification(
  input: OrderNotificationInput
): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const destinataire = adresseDestinataire();

  if (!apiKey) {
    console.warn(
      `[email] RESEND_API_KEY absente — notification de commande ${input.numero} non envoyee.`
    );
    return { ok: false, reason: "not_configured" };
  }

  if (!destinataire) {
    console.warn(
      `[email] Aucun destinataire (NOTIFICATION_EMAIL ni ADMIN_EMAIL) — notification ${input.numero} non envoyee.`
    );
    return { ok: false, reason: "not_configured" };
  }

  // Import dynamique : evite de charger le SDK inutilement quand la cle
  // n'est pas configuree (build plus leger, moins de code cote worker).
  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const { subject, html, text } = renderOrderNotification(input);

  const { data, error } = await resend.emails.send({
    from: adresseExpediteur(),
    to: [destinataire],
    subject,
    html,
    text,
    replyTo: input.clientTelephone
      ? undefined // pas d'email client — on ne peut pas repondre au client par mail
      : undefined,
    // Tag pour retrouver ces emails cote Resend / analytics.
    tags: [
      { name: "type", value: "order_notification" },
      { name: "commande", value: input.numero },
    ],
  });

  if (error) {
    console.error(`[email] Echec envoi notification ${input.numero} :`, error);
    return { ok: false, reason: "send_failed", error: String(error.message ?? error) };
  }

  return { ok: true, id: data?.id ?? "" };
}
