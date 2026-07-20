import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CommandeDetail } from "@/components/shop/commande-detail";
import { VerificationTelephoneForm } from "@/components/shop/verification-telephone-form";
import { ViderPanierAuMontage } from "@/components/shop/vider-panier-au-montage";
import { telephoneCorrespond } from "@/lib/commandes";
import { prisma } from "@/lib/db";
import { getParametres } from "@/lib/parametres";

export const metadata: Metadata = { title: "Commande confirmée" };

type Props = {
  params: Promise<{ numero: string }>;
  searchParams: Promise<{ tel?: string }>;
};

export default async function ConfirmationPage({ params, searchParams }: Props) {
  const { numero } = await params;
  const { tel } = await searchParams;

  const [commande, { whatsapp }] = await Promise.all([
    prisma.commande.findUnique({ where: { numero }, include: { commune: true, lignes: true } }),
    getParametres(),
  ]);

  if (!commande) notFound();

  if (!telephoneCorrespond(commande, tel)) {
    return <VerificationTelephoneForm numero={numero} />;
  }

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-8">
      <ViderPanierAuMontage />
      <CommandeDetail commande={commande} whatsapp={whatsapp} confirmation />
    </div>
  );
}
