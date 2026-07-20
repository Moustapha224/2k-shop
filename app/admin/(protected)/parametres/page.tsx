import type { Metadata } from "next";

import { ParametresForm } from "@/components/admin/parametres-form";
import { getParametres } from "@/lib/parametres";

export const metadata: Metadata = { title: "Paramètres" };

export default async function AdminParametresPage() {
  const parametres = await getParametres();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold tracking-tight">Paramètres</h1>
      <ParametresForm parametres={parametres} />
    </div>
  );
}
