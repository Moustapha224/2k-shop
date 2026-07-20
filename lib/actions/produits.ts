"use server";

import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
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
    await supprimerFichierUpload(image.url);
  }

  revalidatePath("/admin/produits");
  revalidatePath("/produits");
  revalidatePath("/");
}

const TYPES_AUTORISES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const TAILLE_MAX_OCTETS = 5 * 1024 * 1024;

export async function ajouterImage(produitId: string, formData: FormData) {
  await verifierAuth();

  const fichier = formData.get("fichier");
  if (!(fichier instanceof File) || fichier.size === 0) {
    throw new Error("Aucun fichier fourni.");
  }
  if (!TYPES_AUTORISES.has(fichier.type)) {
    throw new Error("Format d'image non supporté (jpeg, png, webp, avif).");
  }
  if (fichier.size > TAILLE_MAX_OCTETS) {
    throw new Error("Image trop volumineuse (5 Mo maximum).");
  }

  const dossier = path.join(process.cwd(), "public", "uploads");
  await mkdir(dossier, { recursive: true });

  const extension = fichier.type.split("/")[1] === "jpeg" ? "jpg" : fichier.type.split("/")[1];
  const nomFichier = `${randomUUID()}.${extension}`;
  const octets = Buffer.from(await fichier.arrayBuffer());
  await writeFile(path.join(dossier, nomFichier), octets);

  const ordreMax = await prisma.produitImage.aggregate({
    where: { produitId },
    _max: { ordre: true },
  });

  await prisma.produitImage.create({
    data: {
      produitId,
      url: `/uploads/${nomFichier}`,
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
  await supprimerFichierUpload(image.url);

  revalidatePath(`/admin/produits/${image.produitId}`);
  revalidatePath("/produits");
  revalidatePath("/");
}

async function supprimerFichierUpload(url: string) {
  if (!url.startsWith("/uploads/")) return;
  try {
    await unlink(path.join(process.cwd(), "public", url));
  } catch {
    // Fichier deja absent : rien a faire.
  }
}
