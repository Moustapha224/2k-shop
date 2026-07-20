"use client";

import { nombreArticles, usePanierStore } from "@/lib/store/cart";
import { Badge } from "@/components/ui/badge";

export function PanierBadge() {
  const count = usePanierStore((state) => nombreArticles(state.articles));

  if (count === 0) return null;

  return (
    <Badge className="absolute -top-1 -right-1 h-4 min-w-4 justify-center rounded-full px-1 text-[10px]">
      {count}
    </Badge>
  );
}
