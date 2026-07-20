"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { slugifier } from "@/lib/slug";
import { categorieSchema } from "@/lib/validations/categorie";

async function verifierAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Non autorisé");
}

export async function creerCategorie(input: unknown) {
  await verifierAuth();
  const donnees = categorieSchema.parse(input);

  await prisma.categorie.create({
    data: { nom: donnees.nom, slug: slugifier(donnees.nom), ordre: donnees.ordre },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/produits");
  revalidatePath("/");
}

export async function modifierCategorie(id: string, input: unknown) {
  await verifierAuth();
  const donnees = categorieSchema.parse(input);

  await prisma.categorie.update({
    where: { id },
    data: { nom: donnees.nom, slug: slugifier(donnees.nom), ordre: donnees.ordre },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/produits");
  revalidatePath("/");
}

export async function supprimerCategorie(id: string) {
  await verifierAuth();

  const produitsLies = await prisma.produit.count({ where: { categorieId: id } });
  if (produitsLies > 0) {
    throw new Error("Catégorie utilisée par des produits, impossible à supprimer.");
  }

  await prisma.categorie.delete({ where: { id } });
  revalidatePath("/admin/categories");
}
