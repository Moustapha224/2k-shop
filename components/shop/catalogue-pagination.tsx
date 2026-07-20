import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

function hrefPage(page: number, categorieSlug?: string) {
  const params = new URLSearchParams();
  if (categorieSlug) params.set("categorie", categorieSlug);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/produits?${query}` : "/produits";
}

export function CataloguePagination({
  page,
  totalPages,
  categorieSlug,
}: {
  page: number;
  totalPages: number;
  categorieSlug?: string;
}) {
  return (
    <div className="flex items-center justify-center gap-3">
      <Button variant="outline" size="sm" asChild disabled={page <= 1}>
        <Link
          href={hrefPage(page - 1, categorieSlug)}
          aria-disabled={page <= 1}
          className={page <= 1 ? "pointer-events-none opacity-40" : undefined}
        >
          <ChevronLeftIcon />
          Précédent
        </Link>
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {page} / {totalPages}
      </span>
      <Button variant="outline" size="sm" asChild disabled={page >= totalPages}>
        <Link
          href={hrefPage(page + 1, categorieSlug)}
          aria-disabled={page >= totalPages}
          className={page >= totalPages ? "pointer-events-none opacity-40" : undefined}
        >
          Suivant
          <ChevronRightIcon />
        </Link>
      </Button>
    </div>
  );
}
