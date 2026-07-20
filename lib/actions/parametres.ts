"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { parametreSchema } from "@/lib/validations/parametre";

type ActionResultat = { ok: true } | { ok: false; error: string };

export async function modifierParametres(input: unknown): Promise<ActionResultat> {
  const session = await auth();
  if (!session?.user) throw new Error("Non autorisé");

  const analyse = parametreSchema.safeParse(input);
  if (!analyse.success) {
    return { ok: false, error: analyse.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const donnees = {
    whatsapp: analyse.data.whatsapp,
    whatsappUrl: analyse.data.whatsappUrl?.trim() || null,
    facebookUrl: analyse.data.facebookUrl?.trim() || null,
    messageAnnonce: analyse.data.messageAnnonce || null,
  };

  await prisma.parametre.upsert({
    where: { id: "principal" },
    update: donnees,
    create: { id: "principal", ...donnees },
  });

  revalidatePath("/admin/parametres");
  revalidatePath("/", "layout");

  return { ok: true };
}
