"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { communeSchema } from "@/lib/validations/commune";

async function verifierAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Non autorisé");
}

export async function creerCommune(input: unknown) {
  await verifierAuth();
  const donnees = communeSchema.parse(input);

  await prisma.commune.create({ data: donnees });

  revalidatePath("/admin/communes");
  revalidatePath("/checkout");
}

export async function modifierCommune(id: string, input: unknown) {
  await verifierAuth();
  const donnees = communeSchema.parse(input);

  await prisma.commune.update({ where: { id }, data: donnees });

  revalidatePath("/admin/communes");
  revalidatePath("/checkout");
}

export async function supprimerCommune(id: string) {
  await verifierAuth();

  const commandesLiees = await prisma.commande.count({ where: { communeId: id } });
  if (commandesLiees > 0) {
    throw new Error("Commune utilisée par des commandes, impossible à supprimer. Désactivez-la plutôt.");
  }

  await prisma.commune.delete({ where: { id } });
  revalidatePath("/admin/communes");
}
