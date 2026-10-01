"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { supprimerImage, televerserImage } from "@/lib/storage";
import { slideSchema } from "@/lib/validations/slide";

async function verifierAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Non autorisé");
}


export async function uploadSlideImage(formData: FormData) {
  await verifierAuth();
  return televerserImage(formData.get("fichier"));
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
  if (slide.imageUrl) await supprimerImage(slide.imageUrl);

  revalidatePath("/admin/slides");
  revalidatePath("/");
}
