import type { Metadata } from "next";

import { CheckoutForm } from "@/components/shop/checkout-form";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Finaliser la commande" };

export default async function CheckoutPage() {
  const communes = await prisma.commune.findMany({
    where: { actif: true },
    orderBy: { nom: "asc" },
  });

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-5 px-4 py-6">
      <h1 className="text-xl font-semibold tracking-tight">Finaliser la commande</h1>
      <CheckoutForm communes={communes} />
    </div>
  );
}
