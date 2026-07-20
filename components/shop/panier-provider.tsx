"use client";

import { usePanierHydrate } from "@/lib/store/cart";

/** Declenche la rehydratation du panier (localStorage) une fois monte cote client. */
export function PanierProvider({ children }: { children: React.ReactNode }) {
  usePanierHydrate();
  return <>{children}</>;
}
