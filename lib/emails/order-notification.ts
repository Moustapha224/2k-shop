/**
 * Gabarit d'email envoye au proprietaire a chaque nouvelle commande.
 *
 * Rend un email en HTML + un pendant texte brut (les clients qui ne rendent
 * pas le HTML — ou les previews Gmail — voient un contenu propre). Toutes les
 * donnees client sont echappees car elles proviennent de saisies clavier.
 */

import { SITE } from "@/lib/constants";
import { formatDateHeure, formatGNF, formatTelephone, telephoneInternational } from "@/lib/format";

export type OrderNotificationInput = {
  numero: string;
  clientNom: string;
  clientTelephone: string;
  communeNom: string;
  quartier: string;
  adresse: string;
  notes: string | null;
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
  /** URL absolue vers la page detail admin (ex : https://2kshop.gn/admin/commandes/xxx). */
  urlAdmin: string;
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

export function renderOrderNotification(input: OrderNotificationInput): PreparedEmail {
  const telFr = formatTelephone(input.clientTelephone);
  const telIntl = telephoneInternational(input.clientTelephone);
  const dateLisible = formatDateHeure(input.createdAt);

  const subject = `Nouvelle commande ${input.numero} — ${input.clientNom} (${formatGNF(input.total)})`;

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
                <div style="font-size:20px;font-weight:600;margin-top:4px;">Nouvelle commande</div>
                <div style="font-size:14px;color:#d4d4d8;margin-top:2px;">${e(input.numero)} · ${e(dateLisible)}</div>
              </td>
            </tr>

            <!-- Bloc client -->
            <tr>
              <td style="padding:20px 24px 8px;">
                <div style="font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:#71717a;">Client</div>
                <div style="font-size:16px;font-weight:600;margin-top:4px;">${e(input.clientNom)}</div>
                <div style="margin-top:8px;font-size:14px;">
                  <a href="tel:+${telIntl}" style="color:#111;text-decoration:none;border-bottom:1px solid #d4d4d8;">📞 +${e(telIntl)}</a>
                  &nbsp;·&nbsp;
                  <a href="https://wa.me/${e(telIntl)}?text=${encodeURIComponent(
                    `Bonjour ${input.clientNom}, je vous contacte au sujet de votre commande ${input.numero} chez ${SITE.nom}.`
                  )}" style="color:#25D366;text-decoration:none;border-bottom:1px solid #25D366;">💬 WhatsApp</a>
                </div>
              </td>
            </tr>

            <!-- Bloc livraison -->
            <tr>
              <td style="padding:12px 24px;">
                <div style="font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:#71717a;">Livraison</div>
                <div style="font-size:14px;margin-top:4px;line-height:1.5;">
                  ${e(input.quartier)}, ${e(input.adresse)}<br />
                  <strong>${e(input.communeNom)}</strong>
                </div>
                ${input.notes ? `<div style="margin-top:8px;padding:8px 10px;background:#fef3c7;border-radius:6px;font-size:13px;"><strong>Note client :</strong> ${e(input.notes)}</div>` : ""}
              </td>
            </tr>

            <!-- Articles -->
            <tr>
              <td style="padding:12px 24px;">
                <div style="font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:#71717a;margin-bottom:8px;">Articles</div>
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
                    <td style="padding:8px 0 4px;font-size:16px;font-weight:600;border-top:1px solid #e5e5e5;">Total à encaisser</td>
                    <td align="right" style="padding:8px 0 4px;font-size:16px;font-weight:600;font-variant-numeric:tabular-nums;border-top:1px solid #e5e5e5;">${formatGNF(input.total)}</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Bouton admin -->
            <tr>
              <td style="padding:16px 24px 24px;" align="center">
                <a href="${e(input.urlAdmin)}" style="display:inline-block;padding:12px 20px;background:#111;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">Ouvrir dans l'admin</a>
                <div style="margin-top:12px;font-size:12px;color:#71717a;">Paiement à la livraison — ${formatGNF(input.total)} à encaisser en espèces.</div>
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

  // Version texte brut (fallback + previews) : simple, lisible, meme info.
  const text = [
    `Nouvelle commande ${input.numero}`,
    `${dateLisible}`,
    ``,
    `Client : ${input.clientNom}`,
    `Telephone : +${telIntl} (${telFr})`,
    ``,
    `Livraison :`,
    `  ${input.quartier}, ${input.adresse}`,
    `  ${input.communeNom}`,
    input.notes ? `Note client : ${input.notes}` : null,
    ``,
    `Articles :`,
    ...input.lignes.map(
      (ligne) =>
        `  - ${ligne.nomProduit} (taille ${ligne.taille}) x ${ligne.quantite} : ${formatGNF(ligne.sousTotal)}`
    ),
    ``,
    `Sous-total : ${formatGNF(input.sousTotal)}`,
    `Livraison  : ${formatGNF(input.fraisLivraison)}`,
    `Total      : ${formatGNF(input.total)}`,
    ``,
    `Paiement a la livraison en especes.`,
    ``,
    `Ouvrir dans l'admin : ${input.urlAdmin}`,
  ]
    .filter((ligne): ligne is string => ligne !== null)
    .join("\n");

  return { subject, html, text };
}
