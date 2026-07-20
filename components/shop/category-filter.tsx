import Link from "next/link";

import { cn } from "@/lib/utils";

type Categorie = { slug: string; nom: string };

const CHIP =
  "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors";
const CHIP_ACTIF = "border-primary bg-primary text-primary-foreground";
const CHIP_INACTIF = "border-border bg-background text-foreground hover:bg-muted";

export function CategoryFilter({
  categories,
  categorieActuelle,
}: {
  categories: Categorie[];
  categorieActuelle?: string;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      <Link href="/produits" className={cn(CHIP, !categorieActuelle ? CHIP_ACTIF : CHIP_INACTIF)}>
        Tous
      </Link>
      {categories.map((categorie) => (
        <Link
          key={categorie.slug}
          href={`/produits?categorie=${categorie.slug}`}
          className={cn(CHIP, categorieActuelle === categorie.slug ? CHIP_ACTIF : CHIP_INACTIF)}
        >
          {categorie.nom}
        </Link>
      ))}
    </div>
  );
}
