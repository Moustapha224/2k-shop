"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { SITE, STATUTS_COMMANDE, type StatutCommande } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { sendOrderStatus } from "@/lib/email";
import { statutMeriteUnEmail } from "@/lib/emails/order-status";
import { normaliserTelephone } from "@/lib/format";

export async function changerStatutCommande(commandeId: string, statut: StatutCommande) {
  const session = await auth();
  if (!session?.user) throw new Error("Non autorisé");
  if (!STATUTS_COMMANDE.includes(statut)) throw new Error("Statut invalide");

  const data: { statut: StatutCommande; confirmeeLe?: Date; enLivraisonLe?: Date; livreeLe?: Date } = {
    statut,
  };
  if (statut === "CONFIRMEE") data.confirmeeLe = new Date();
  if (statut === "EN_LIVRAISON") data.enLivraisonLe = new Date();
  if (statut === "LIVREE") data.livreeLe = new Date();

  const commande = await prisma.commande.update({ where: { id: commandeId }, data });

  // Notification au client, uniquement s'il a laisse une adresse et si le
  // statut atteint lui apprend quelque chose. Fire-and-forget, comme les
  // autres envois : un incident Resend ne doit pas empecher le proprietaire
  // de faire avancer sa commande.
  if (commande.clientEmail && statutMeriteUnEmail(statut)) {
    const tel = normaliserTelephone(commande.clientTelephone);
    sendOrderStatus({
      numero: commande.numero,
      clientNom: commande.clientNom,
      clientEmail: commande.clientEmail,
      statut,
      total: commande.total,
      urlSuivi: `${SITE.url}/suivi/${commande.numero}?tel=${tel}`,
    }).catch((erreur) => {
      console.error(`[commandes-admin] Notification statut ${commande.numero} en echec :`, erreur);
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/commandes");
  revalidatePath(`/admin/commandes/${commandeId}`);
  // La page de suivi est publique et mise en cache : sans cela, le client
  // verrait encore l'ancien statut apres le clic du proprietaire.
  revalidatePath(`/suivi/${commande.numero}`);
}
