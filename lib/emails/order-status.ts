/**
 * Gabarit d'email envoye au client quand le proprietaire change le statut de
 * sa commande depuis l'admin.
 *
 * Meme structure que `order-confirmation.ts` : HTML + pendant texte brut,
 * donnees client echappees. Le contenu s'adapte au statut atteint — c'est la
 * seule information que le client attend reellement.
 */

import { STATUT_DESCRIPTION, STATUT_LABEL, SITE, type StatutCommande } from "@/lib/constants";
import { formatGNF } from "@/lib/format";

export type OrderStatusInput = {
  numero: string;
  clientNom: string;
  clientEmail: string;
  statut: StatutCommande;
  total: number;
  /** URL absolue vers le suivi (avec le telephone en parametre). */
  urlSuivi: string;
};

export type PreparedEmail = {
  subject: string;
  html: string;
  text: string;
};

function e(valeur: string | null | undefined): string {
  if (!valeur) return "";
  return valeur
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/** Teinte du bandeau : vert pour une bonne nouvelle, rouge pour un arret. */
function couleurStatut(statut: StatutCommande): string {
  if (statut === "LIVREE") return "#16a34a";
  if (statut === "ANNULEE" || statut === "RETOURNEE") return "#dc2626";
  return "#111";
}

/**
 * Tous les statuts ne meritent pas un email. Un passage en « En attente » est
 * l'etat initial, deja couvert par la confirmation de commande.
 */
export function statutMeriteUnEmail(statut: StatutCommande): boolean {
  return statut !== "EN_ATTENTE";
}

export function renderOrderStatus(input: OrderStatusInput): PreparedEmail {
  const label = STATUT_LABEL[input.statut];
  const description = STATUT_DESCRIPTION[input.statut];
  const couleur = couleurStatut(input.statut);
  const subject = `Commande ${input.numero} — ${label}`;

  const aPayer =
    input.statut === "CONFIRMEE" || input.statut === "EN_LIVRAISON"
      ? `<tr><td style="padding:8px 24px 0;font-size:14px;color:#71717a;">Montant à régler à la livraison : <strong style="color:#111;">${formatGNF(input.total)}</strong></td></tr>`
      : "";

  const html = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${e(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#111;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e5e5;">
            <tr>
              <td style="padding:20px 24px;background:${couleur};color:#fff;">
                <div style="font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.7);">${e(SITE.nom)}</div>
                <div style="font-size:20px;font-weight:600;margin-top:4px;">${e(label)}</div>
                <div style="font-size:14px;color:rgba(255,255,255,.85);margin-top:2px;">Commande ${e(input.numero)}</div>
              </td>
            </tr>

            <tr>
              <td style="padding:20px 24px 8px;font-size:15px;line-height:1.6;">
                Bonjour <strong>${e(input.clientNom)}</strong>,<br />
                ${e(description)}
              </td>
            </tr>

            ${aPayer}

            <tr>
              <td style="padding:20px 24px 24px;" align="center">
                <a href="${e(input.urlSuivi)}" style="display:inline-block;padding:12px 20px;background:#111;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">Suivre ma commande</a>
              </td>
            </tr>
          </table>

          <div style="margin-top:16px;font-size:11px;color:#a1a1aa;text-align:center;max-width:560px;">
            Email envoyé automatiquement par ${e(SITE.nom)} — ne pas répondre à cette adresse.
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    `${label} — commande ${input.numero}`,
    ``,
    `Bonjour ${input.clientNom},`,
    description,
    ...(input.statut === "CONFIRMEE" || input.statut === "EN_LIVRAISON"
      ? [``, `Montant a regler a la livraison : ${formatGNF(input.total)}`]
      : []),
    ``,
    `Suivre ma commande : ${input.urlSuivi}`,
  ].join("\n");

  return { subject, html, text };
}
