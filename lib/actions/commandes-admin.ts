"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { STATUTS_COMMANDE, type StatutCommande } from "@/lib/constants";
import { prisma } from "@/lib/db";

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

  await prisma.commande.update({ where: { id: commandeId }, data });

  revalidatePath("/admin");
  revalidatePath("/admin/commandes");
  revalidatePath(`/admin/commandes/${commandeId}`);
}
