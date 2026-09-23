"use server";

import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { slideSchema } from "@/lib/validations/slide";

async function verifierAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Non autorisé");
}

const TYPES_AUTORISES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const TAILLE_MAX_OCTETS = 5 * 1024 * 1024;

export async function uploadSlideImage(formData: FormData) {
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

  return `/uploads/${nomFichier}`;
}

export async function creerSlide(input: unknown) {
  await verifierAuth();
  const donnees = slideSchema.parse(input);

  await prisma.slideHero.create({
    data: { 
      titre: donnees.titre || null,
      sousTitre: donnees.sousTitre || null,
      imageUrl: donnees.imageUrl || null,
      imageUrlExterne: donnees.imageUrlExterne || null,
      ordre: donnees.ordre,
      actif: donnees.actif,
    },
  });

  revalidatePath("/admin/slides");
  revalidatePath("/");
}

export async function modifierSlide(id: string, input: unknown) {
  await verifierAuth();
  const donnees = slideSchema.parse(input);

  await prisma.slideHero.update({
    where: { id },
    data: { 
      titre: donnees.titre || null,
      sousTitre: donnees.sousTitre || null,
      imageUrl: donnees.imageUrl || null,
      imageUrlExterne: donnees.imageUrlExterne || null,
      ordre: donnees.ordre,
      actif: donnees.actif,
    },
  });

  revalidatePath("/admin/slides");
  revalidatePath("/");
}

export async function supprimerSlide(id: string) {
  await verifierAuth();

  const slide = await prisma.slideHero.delete({ where: { id } });
  if (slide.imageUrl) await supprimerFichierUpload(slide.imageUrl);

  revalidatePath("/admin/slides");
  revalidatePath("/");
}

/** Supprime le fichier physique d'une image uploadee (ignore les URL externes). */
async function supprimerFichierUpload(url: string) {
  if (!url.startsWith("/uploads/")) return;
  try {
    await unlink(path.join(process.cwd(), "public", url));
  } catch {
    // Fichier deja absent : rien a faire.
  }
}
