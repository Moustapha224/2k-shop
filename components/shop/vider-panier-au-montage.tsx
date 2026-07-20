"use client";

import { useEffect } from "react";

import { usePanierStore } from "@/lib/store/cart";

/** Vide le panier une fois que la page de confirmation de commande est affichee. */
export function ViderPanierAuMontage() {
  const vider = usePanierStore((state) => state.vider);

  useEffect(() => {
    vider();
  }, [vider]);

  return null;
}
