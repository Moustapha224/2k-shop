"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboardIcon,
  MapIcon,
  PackageIcon,
  SettingsIcon,
  ShoppingCartIcon,
  TagIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

const LIENS = [
  { href: "/admin", label: "Dashboard", icone: LayoutDashboardIcon },
  { href: "/admin/commandes", label: "Commandes", icone: ShoppingCartIcon },
  { href: "/admin/produits", label: "Produits", icone: PackageIcon },
  { href: "/admin/categories", label: "Catégories", icone: TagIcon },
  { href: "/admin/communes", label: "Communes", icone: MapIcon },
  { href: "/admin/parametres", label: "Paramètres", icone: SettingsIcon },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto border-b bg-background px-4 py-2">
      {LIENS.map(({ href, label, icone: Icone }) => {
        const actif = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              actif ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
            )}
          >
            <Icone className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
