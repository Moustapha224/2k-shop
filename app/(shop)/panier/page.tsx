import type { Metadata } from "next";

import { PanierClient } from "@/components/shop/panier-client";

export const metadata: Metadata = { title: "Panier" };

export default function PanierPage() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-5 px-4 py-6">
      <h1 className="text-xl font-semibold tracking-tight">Panier</h1>
      <PanierClient />
    </div>
  );
}
