import Image from "next/image";
import Link from "next/link";
import { PackageSearchIcon, ShoppingBagIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PanierBadge } from "@/components/shop/panier-badge";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { SITE } from "@/lib/constants";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/90 shadow-sm">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
        {/* Logo + nom */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <Image
            src="/logo.jpeg"
            alt={`Logo ${SITE.nom}`}
            width={36}
            height={36}
            className="size-9 rounded-lg object-contain dark:bg-white dark:p-0.5 shadow-sm"
            priority
          />
          <div className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight">{SITE.nom}</span>
            <span className="text-[10px] font-medium tracking-[0.18em] uppercase text-gold-ink">
              {SITE.slogan}
            </span>
          </div>
        </Link>

        {/* Navigation centrale */}
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link
            href="/produits"
            className="relative text-foreground/80 transition-colors hover:text-foreground after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-gold after:transition-all hover:after:w-full"
          >
            Produits
          </Link>
          <Link
            href="/suivi"
            className="relative text-foreground/80 transition-colors hover:text-foreground after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-gold after:transition-all hover:after:w-full"
          >
            Suivi de commande
          </Link>
        </nav>

        {/* Actions droite */}
        <div className="flex items-center gap-1">
          <ThemeToggle className="relative" />
          <Button variant="ghost" size="icon" asChild className="hidden md:inline-flex">
            <Link href="/suivi" aria-label="Suivi de commande">
              <PackageSearchIcon className="size-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/panier" aria-label="Panier">
              <ShoppingBagIcon className="size-5" />
              <PanierBadge />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
