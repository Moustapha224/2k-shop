/**
 * Envoi d'emails (Resend).
 *
 * IMPORTANT RESEND SANDBOX :
 * Avec l'adresse `onboarding@resend.dev` (sandbox), Resend n'autorise
 * l'envoi QU'À l'adresse email du compte Resend (pas à n'importe quelle
 * adresse Gmail). Pour envoyer à `laminekeita923@gmail.com` depuis la sandbox,
 * il faut que ce soit l'email du compte Resend lui-même.
 *
 * Solution recommandée en production : vérifier un domaine sur Resend et
 * mettre EMAIL_FROM="2K SHOP <commandes@votre-domaine.gn>".
 */

import "server-only";

import { SITE } from "@/lib/constants";
import { renderOrderConfirmation, type OrderConfirmationInput } from "@/lib/emails/order-confirmation";
import { renderOrderNotification, type OrderNotificationInput } from "@/lib/emails/order-notification";

export type EmailResult =
  | { ok: true; id: string }
  | { ok: false; reason: "not_configured" | "send_failed"; error?: string };

/**
 * Adresse d'expédition.
 * Par défaut : sandbox Resend (uniquement vers l'email du compte Resend).
 * En production : mettre EMAIL_FROM="2K SHOP <commandes@votre-domaine.gn>"
 */
function adresseExpediteur(): string {
  const from = process.env.EMAIL_FROM?.trim();
  if (from) return from;
  return `${SITE.nom} <onboarding@resend.dev>`;
}

/** Adresse du propriétaire, destinataire des notifications de commande. */
function adresseDestinataire(): string | null {
  return (
    process.env.NOTIFICATION_EMAIL?.trim() ||
    process.env.ADMIN_EMAIL?.trim() ||
    null
  );
}

/**
 * Envoie la notification "nouvelle commande" au propriétaire.
 * Ne lance jamais d'exception : les erreurs sont retournées sous forme d'objet.
 */
export async function sendOrderNotification(
  input: OrderNotificationInput
): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const destinataire = adresseDestinataire();
  const expediteur = adresseExpediteur();

  if (!apiKey) {
    console.warn(
      `[email] RESEND_API_KEY absente — notification commande ${input.numero} non envoyée.`
    );
    return { ok: false, reason: "not_configured" };
  }

  if (!destinataire) {
    console.warn(
      `[email] Aucun destinataire configuré (NOTIFICATION_EMAIL / ADMIN_EMAIL) — notification ${input.numero} non envoyée.`
    );
    return { ok: false, reason: "not_configured" };
  }

  console.info(
    `[email] Envoi notification commande ${input.numero} → ${destinataire} (from: ${expediteur})`
  );

  // Import dynamique pour alléger le bundle quand Resend n'est pas utilisé.
  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const { subject, html, text } = renderOrderNotification(input);

  const { data, error } = await resend.emails.send({
    from: expediteur,
    to: [destinataire],
    subject,
    html,
    text,
    // Tags pour retrouver ces emails dans le dashboard Resend.
    tags: [
      { name: "type", value: "order_notification" },
      { name: "commande", value: input.numero },
    ],
  });

  if (error) {
    // Resend renvoie souvent un message utile : "You can only send testing
    // emails to your own email address" en mode sandbox.
    const msg = typeof error === "object" && "message" in error
      ? String((error as { message: unknown }).message)
      : String(error);
    console.error(
      `[email] Échec envoi notification ${input.numero} :`,
      msg,
      "\n⚠️  Si vous voyez 'testing emails', l'adresse destinataire doit être l'email du compte Resend, ou vérifiez un domaine sur resend.com/domains."
    );
    return { ok: false, reason: "send_failed", error: msg };
  }

  console.info(
    `[email] ✅ Notification commande ${input.numero} envoyée. ID Resend: ${data?.id}`
  );
  return { ok: true, id: data?.id ?? "" };
}


/**
 * Envoie au CLIENT la confirmation de sa commande.
 *
 * Contrairement a la notification proprietaire, le destinataire vient d'une
 * saisie client : en sandbox Resend (`onboarding@resend.dev`), l'envoi echouera
 * pour toute adresse autre que celle du compte Resend. C'est attendu, et sans
 * consequence — la commande est deja enregistree, l'erreur est seulement loggee.
 * Ne lance jamais d'exception.
 */
export async function sendOrderConfirmation(
  input: OrderConfirmationInput
): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const expediteur = adresseExpediteur();

  if (!apiKey) {
    console.warn(
      `[email] RESEND_API_KEY absente — confirmation client ${input.numero} non envoyee.`
    );
    return { ok: false, reason: "not_configured" };
  }

  console.info(
    `[email] Envoi confirmation client ${input.numero} -> ${input.clientEmail} (from: ${expediteur})`
  );

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const { subject, html, text } = renderOrderConfirmation(input);

  const { data, error } = await resend.emails.send({
    from: expediteur,
    to: [input.clientEmail],
    subject,
    html,
    text,
    tags: [
      { name: "type", value: "order_confirmation" },
      { name: "commande", value: input.numero },
    ],
  });

  if (error) {
    const msg = typeof error === "object" && "message" in error
      ? String((error as { message: unknown }).message)
      : String(error);
    console.error(
      `[email] Echec envoi confirmation client ${input.numero} :`,
      msg,
      "\n⚠️  En sandbox Resend, seul l'email du compte peut recevoir. Verifiez un domaine sur resend.com/domains pour ecrire a vos clients."
    );
    return { ok: false, reason: "send_failed", error: msg };
  }

  console.info(
    `[email] ✅ Confirmation client ${input.numero} envoyee. ID Resend: ${data?.id}`
  );
  return { ok: true, id: data?.id ?? "" };
}
