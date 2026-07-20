import Image from "next/image";
import Link from "next/link";
import { PackageSearchIcon, ShoppingBagIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PanierBadge } from "@/components/shop/panier-badge";
import { SITE } from "@/lib/constants";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-3 px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.jpeg"
            alt={`Logo ${SITE.nom}`}
            width={32}
            height={32}
            className="size-8 rounded-md object-contain"
            priority
          />
          <span className="font-semibold tracking-tight">{SITE.nom}</span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-medium md:flex">
          <Link href="/produits" className="text-muted-foreground hover:text-foreground">
            Produits
          </Link>
          <Link href="/suivi" className="text-muted-foreground hover:text-foreground">
            Suivi de commande
          </Link>
        </nav>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" asChild className="hidden md:inline-flex">
            <Link href="/suivi" aria-label="Suivi de commande">
              <PackageSearchIcon />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/panier" aria-label="Panier">
              <ShoppingBagIcon />
              <PanierBadge />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
