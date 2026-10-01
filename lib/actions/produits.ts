"use server";


import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { supprimerImage as supprimerFichierStocke, televerserImage } from "@/lib/storage";
import { prisma } from "@/lib/db";
import { slugifier } from "@/lib/slug";
import { produitSchema } from "@/lib/validations/produit";

type ActionEchouee = { ok: false; error: string };
type ActionResultat = { ok: true } | ActionEchouee;

async function verifierAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Non autorisé");
}

function estErreurUnique(erreur: unknown): boolean {
  return typeof erreur === "object" && erreur !== null && "code" in erreur && erreur.code === "P2002";
}

/** Cree le produit + ses variantes, puis redirige vers sa page d'edition. */
export async function creerProduit(input: unknown): Promise<ActionEchouee> {
  await verifierAuth();

  const analyse = produitSchema.safeParse(input);
  if (!analyse.success) {
    return { ok: false, error: analyse.error.issues[0]?.message ?? "Formulaire invalide" };
  }
  const donnees = analyse.data;

  let produitId: string;
  try {
    const produit = await prisma.produit.create({
      data: {
        nom: donnees.nom,
        slug: slugifier(donnees.nom),
        description: donnees.description,
        prix: donnees.prix,
        categorieId: donnees.categorieId,
        type: donnees.type,
        actif: donnees.actif,
        variantes: { create: donnees.variantes },
      },
    });
    produitId = produit.id;
  } catch (erreur) {
    if (estErreurUnique(erreur)) {
      return { ok: false, error: "Un produit avec ce nom existe déjà." };
    }
    throw erreur;
  }

  revalidatePath("/admin/produits");
  revalidatePath("/produits");
  revalidatePath("/");
  redirect(`/admin/produits/${produitId}`);
}

export async function modifierProduit(id: string, input: unknown): Promise<ActionResultat> {
  await verifierAuth();

  const analyse = produitSchema.safeParse(input);
  if (!analyse.success) {
    return { ok: false, error: analyse.error.issues[0]?.message ?? "Formulaire invalide" };
  }
  const donnees = analyse.data;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.produit.update({
        where: { id },
        data: {
          nom: donnees.nom,
          slug: slugifier(donnees.nom),
          description: donnees.description,
          prix: donnees.prix,
          categorieId: donnees.categorieId,
          actif: donnees.actif,
        },
      });

      for (const variante of donnees.variantes) {
        await tx.variante.upsert({
          where: { produitId_taille: { produitId: id, taille: variante.taille } },
          update: { stock: variante.stock },
          create: { produitId: id, taille: variante.taille, stock: variante.stock },
        });
      }
    });
  } catch (erreur) {
    if (estErreurUnique(erreur)) {
      return { ok: false, error: "Un produit avec ce nom existe déjà." };
    }
    throw erreur;
  }

  revalidatePath("/admin/produits");
  revalidatePath(`/admin/produits/${id}`);
  revalidatePath("/produits");
  revalidatePath("/");
  return { ok: true };
}

export async function supprimerProduit(id: string) {
  await verifierAuth();

  const images = await prisma.produitImage.findMany({ where: { produitId: id } });
  await prisma.produit.delete({ where: { id } });

  for (const image of images) {
    await supprimerFichierStocke(image.url);
  }

  revalidatePath("/admin/produits");
  revalidatePath("/produits");
  revalidatePath("/");
}

export async function ajouterImage(produitId: string, formData: FormData) {
  await verifierAuth();

  const url = await televerserImage(formData.get("fichier"));

  const ordreMax = await prisma.produitImage.aggregate({
    where: { produitId },
    _max: { ordre: true },
  });

  await prisma.produitImage.create({
    data: {
      produitId,
      url,
      ordre: (ordreMax._max.ordre ?? -1) + 1,
    },
  });

  revalidatePath(`/admin/produits/${produitId}`);
  revalidatePath("/produits");
  revalidatePath("/");
}

export async function supprimerImage(imageId: string) {
  await verifierAuth();

  const image = await prisma.produitImage.delete({ where: { id: imageId } });
  await supprimerFichierStocke(image.url);

  revalidatePath(`/admin/produits/${image.produitId}`);
  revalidatePath("/produits");
  revalidatePath("/");
}
