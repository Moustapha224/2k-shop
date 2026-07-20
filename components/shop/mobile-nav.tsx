"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, PackageSearchIcon, ShoppingBagIcon, StoreIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { PanierBadge } from "@/components/shop/panier-badge";

const LIENS = [
  { href: "/", label: "Accueil", icone: HomeIcon },
  { href: "/produits", label: "Produits", icone: StoreIcon },
  { href: "/panier", label: "Panier", icone: ShoppingBagIcon },
  { href: "/suivi", label: "Suivi", icone: PackageSearchIcon },
] as const;

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-stretch border-t bg-background md:hidden">
      {LIENS.map(({ href, label, icone: Icone }) => {
        const actif = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "relative flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium",
              actif ? "text-primary" : "text-muted-foreground"
            )}
          >
            <span className="relative">
              <Icone className="size-5" />
              {href === "/panier" && <PanierBadge />}
            </span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
