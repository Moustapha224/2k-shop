/**
 * Gabarit d'email envoye au CLIENT apres validation de sa commande.
 *
 * Pendant client de `order-notification.ts` (qui, lui, va au proprietaire) :
 * meme structure HTML + texte brut, mais le ton et les informations sont
 * orientes acheteur — numero de commande, suivi, et ce qui va se passer
 * ensuite. Toutes les donnees saisies au clavier sont echappees.
 */

import { DELAI_LIVRAISON, SITE } from "@/lib/constants";
import { formatDateHeure, formatGNF } from "@/lib/format";

export type OrderConfirmationInput = {
  numero: string;
  clientNom: string;
  clientEmail: string;
  communeNom: string;
  quartier: string;
  adresse: string;
  sousTotal: number;
  fraisLivraison: number;
  total: number;
  createdAt: Date;
  lignes: {
    nomProduit: string;
    taille: string;
    quantite: number;
    sousTotal: number;
  }[];
  /** URL absolue vers le suivi de commande (avec le telephone en parametre). */
  urlSuivi: string;
};

export type PreparedEmail = {
  subject: string;
  html: string;
  text: string;
};

/** Echappe les caracteres HTML dangereux dans une chaine saisie par un client. */
function e(valeur: string | null | undefined): string {
  if (!valeur) return "";
  return valeur
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function renderOrderConfirmation(input: OrderConfirmationInput): PreparedEmail {
  const dateLisible = formatDateHeure(input.createdAt);
  const subject = `Votre commande ${input.numero} chez ${SITE.nom} est bien reçue`;

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
            <!-- En-tete -->
            <tr>
              <td style="padding:20px 24px;background:#111;color:#fff;">
                <div style="font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#a1a1aa;">${e(SITE.nom)}</div>
                <div style="font-size:20px;font-weight:600;margin-top:4px;">Merci pour votre commande !</div>
                <div style="font-size:14px;color:#d4d4d8;margin-top:2px;">${e(input.numero)} · ${e(dateLisible)}</div>
              </td>
            </tr>

            <!-- Message d'accueil -->
            <tr>
              <td style="padding:20px 24px 8px;font-size:15px;line-height:1.6;">
                Bonjour <strong>${e(input.clientNom)}</strong>,<br />
                Nous avons bien reçu votre commande. Nous allons vous appeler pour la
                confirmer, puis vous serez livré sous <strong>${e(DELAI_LIVRAISON)}</strong>.
              </td>
            </tr>

            <!-- Rappel paiement -->
            <tr>
              <td style="padding:8px 24px;">
                <div style="padding:12px 14px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;font-size:14px;line-height:1.5;">
                  <strong>Vous ne payez rien maintenant.</strong><br />
                  Vous essayez vos articles devant le livreur et réglez
                  <strong>${formatGNF(input.total)}</strong> en espèces uniquement si tout
                  vous convient.
                </div>
              </td>
            </tr>

            <!-- Livraison -->
            <tr>
              <td style="padding:12px 24px;">
                <div style="font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:#71717a;">Adresse de livraison</div>
                <div style="font-size:14px;margin-top:4px;line-height:1.5;">
                  ${e(input.quartier)}, ${e(input.adresse)}<br />
                  <strong>${e(input.communeNom)}</strong>
                </div>
              </td>
            </tr>

            <!-- Articles -->
            <tr>
              <td style="padding:12px 24px;">
                <div style="font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:#71717a;margin-bottom:8px;">Votre commande</div>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                  ${input.lignes
                    .map(
                      (ligne) => `<tr>
                        <td style="padding:6px 0;border-bottom:1px solid #f4f4f5;">
                          ${e(ligne.nomProduit)}
                          <span style="color:#71717a;">(taille ${e(ligne.taille)}) × ${ligne.quantite}</span>
                        </td>
                        <td align="right" style="padding:6px 0;border-bottom:1px solid #f4f4f5;font-variant-numeric:tabular-nums;">${formatGNF(ligne.sousTotal)}</td>
                      </tr>`
                    )
                    .join("")}
                </table>
              </td>
            </tr>

            <!-- Totaux -->
            <tr>
              <td style="padding:12px 24px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                  <tr>
                    <td style="padding:4px 0;color:#71717a;">Sous-total</td>
                    <td align="right" style="padding:4px 0;font-variant-numeric:tabular-nums;">${formatGNF(input.sousTotal)}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#71717a;">Livraison ${e(input.communeNom)}</td>
                    <td align="right" style="padding:4px 0;font-variant-numeric:tabular-nums;">${formatGNF(input.fraisLivraison)}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0 4px;font-size:16px;font-weight:600;border-top:1px solid #e5e5e5;">Total à payer à la livraison</td>
                    <td align="right" style="padding:8px 0 4px;font-size:16px;font-weight:600;font-variant-numeric:tabular-nums;border-top:1px solid #e5e5e5;">${formatGNF(input.total)}</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Bouton suivi -->
            <tr>
              <td style="padding:16px 24px 24px;" align="center">
                <a href="${e(input.urlSuivi)}" style="display:inline-block;padding:12px 20px;background:#111;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">Suivre ma commande</a>
                <div style="margin-top:12px;font-size:12px;color:#71717a;">Conservez votre numéro de commande : <strong>${e(input.numero)}</strong></div>
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
    `Merci pour votre commande !`,
    ``,
    `Bonjour ${input.clientNom},`,
    `Nous avons bien recu votre commande ${input.numero} (${dateLisible}).`,
    `Nous allons vous appeler pour la confirmer, puis vous serez livre sous ${DELAI_LIVRAISON}.`,
    ``,
    `VOUS NE PAYEZ RIEN MAINTENANT.`,
    `Vous essayez vos articles devant le livreur et reglez ${formatGNF(input.total)}`,
    `en especes uniquement si tout vous convient.`,
    ``,
    `Adresse de livraison :`,
    `  ${input.quartier}, ${input.adresse}`,
    `  ${input.communeNom}`,
    ``,
    `Votre commande :`,
    ...input.lignes.map(
      (ligne) =>
        `  - ${ligne.nomProduit} (taille ${ligne.taille}) x ${ligne.quantite} : ${formatGNF(ligne.sousTotal)}`
    ),
    ``,
    `Sous-total : ${formatGNF(input.sousTotal)}`,
    `Livraison  : ${formatGNF(input.fraisLivraison)}`,
    `Total      : ${formatGNF(input.total)}`,
    ``,
    `Suivre ma commande : ${input.urlSuivi}`,
    `Conservez votre numero de commande : ${input.numero}`,
  ].join("\n");

  return { subject, html, text };
}
