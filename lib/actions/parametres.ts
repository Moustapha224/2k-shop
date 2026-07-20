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

  await prisma.parametre.upsert({
    where: { id: "principal" },
    update: { whatsapp: analyse.data.whatsapp, messageAnnonce: analyse.data.messageAnnonce || null },
    create: {
      id: "principal",
      whatsapp: analyse.data.whatsapp,
      messageAnnonce: analyse.data.messageAnnonce || null,
    },
  });

  revalidatePath("/admin/parametres");
  revalidatePath("/", "layout");

  return { ok: true };
}
