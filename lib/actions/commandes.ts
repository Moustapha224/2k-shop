"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { normaliserTelephone } from "@/lib/format";
import { PREFIXE_COMMANDE } from "@/lib/constants";
import { checkoutSchema, suiviSchema } from "@/lib/validations/checkout";

export type CreerCommandeInput = {
  clientNom: string;
  clientTelephone: string;
  communeId: string;
  quartier: string;
  adresse: string;
  notes?: string;
  articles: { varianteId: string; quantite: number }[];
};

type ActionEchouee = { ok: false; error: string };

async function genererNumeroCommande(): Promise<string> {
  const annee = new Date().getFullYear();
  const debutAnnee = new Date(Date.UTC(annee, 0, 1));
  const nombre = await prisma.commande.count({ where: { createdAt: { gte: debutAnnee } } });
  const sequence = String(nombre + 1).padStart(4, "0");
  return `${PREFIXE_COMMANDE}-${annee}-${sequence}`;
}

/** Cree la commande (prix/stock recalcules cote serveur), decremente le stock, puis redirige. */
export async function creerCommande(input: CreerCommandeInput): Promise<ActionEchouee> {
  const analyse = checkoutSchema.safeParse(input);
  if (!analyse.success) {
    return { ok: false, error: analyse.error.issues[0]?.message ?? "Formulaire invalide" };
  }
  if (!input.articles || input.articles.length === 0) {
    return { ok: false, error: "Le panier est vide." };
  }

  const commune = await prisma.commune.findFirst({
    where: { id: analyse.data.communeId, actif: true },
  });
  if (!commune) {
    return { ok: false, error: "Commune de livraison invalide." };
  }

  const variantes = await prisma.variante.findMany({
    where: { id: { in: input.articles.map((a) => a.varianteId) } },
    include: { produit: true },
  });

  let sousTotal = 0;
  const lignes: {
    varianteId: string;
    produitId: string;
    nomProduit: string;
    taille: string;
    prixUnitaire: number;
    quantite: number;
    sousTotal: number;
  }[] = [];

  for (const article of input.articles) {
    const variante = variantes.find((v) => v.id === article.varianteId);
    if (!variante || !variante.produit.actif) {
      return { ok: false, error: "Un article de votre panier n'est plus disponible." };
    }
    if (article.quantite < 1 || variante.stock < article.quantite) {
      return {
        ok: false,
        error: `Stock insuffisant pour ${variante.produit.nom} (taille ${variante.taille}).`,
      };
    }
    const sousTotalLigne = variante.produit.prix * article.quantite;
    sousTotal += sousTotalLigne;
    lignes.push({
      varianteId: variante.id,
      produitId: variante.produitId,
      nomProduit: variante.produit.nom,
      taille: variante.taille,
      prixUnitaire: variante.produit.prix,
      quantite: article.quantite,
      sousTotal: sousTotalLigne,
    });
  }

  const total = sousTotal + commune.fraisLivraison;
  const numero = await genererNumeroCommande();

  await prisma.$transaction(async (tx) => {
    await tx.commande.create({
      data: {
        numero,
        clientNom: analyse.data.clientNom,
        clientTelephone: analyse.data.clientTelephone,
        communeId: commune.id,
        quartier: analyse.data.quartier,
        adresse: analyse.data.adresse,
        notes: analyse.data.notes || null,
        sousTotal,
        fraisLivraison: commune.fraisLivraison,
        total,
        lignes: {
          create: lignes.map(({ varianteId: _varianteId, ...ligne }) => ligne),
        },
      },
    });

    for (const ligne of lignes) {
      await tx.variante.update({
        where: { id: ligne.varianteId },
        data: { stock: { decrement: ligne.quantite } },
      });
    }
  });

  revalidatePath("/admin/commandes");
  redirect(`/commande/confirmation/${numero}?tel=${analyse.data.clientTelephone}`);
}

/** Retrouve une commande par numero + telephone, puis redirige vers la page de suivi. */
export async function retrouverCommande(input: {
  numero: string;
  telephone: string;
}): Promise<ActionEchouee> {
  const analyse = suiviSchema.safeParse(input);
  if (!analyse.success) {
    return { ok: false, error: analyse.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const commande = await prisma.commande.findUnique({
    where: { numero: analyse.data.numero.trim().toUpperCase() },
  });

  if (!commande || normaliserTelephone(commande.clientTelephone) !== analyse.data.telephone) {
    return { ok: false, error: "Aucune commande trouvée avec ce numéro et ce téléphone." };
  }

  redirect(`/suivi/${commande.numero}?tel=${analyse.data.telephone}`);
}
