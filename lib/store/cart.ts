"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ArticlePanier = {
  varianteId: string;
  produitId: string;
  slug: string;
  nom: string;
  image: string | null;
  taille: string;
  prixUnitaire: number;
  quantite: number;
  stockDisponible: number;
};

type PanierStore = {
  articles: ArticlePanier[];
  ajouter: (article: Omit<ArticlePanier, "quantite">, quantite?: number) => void;
  retirer: (varianteId: string) => void;
  changerQuantite: (varianteId: string, quantite: number) => void;
  vider: () => void;
};

/**
 * `skipHydration` + `usePanierHydrate()` : la persistance localStorage ne
 * doit se charger qu'apres le montage client, sinon le rendu serveur (panier
 * vide) et le premier rendu client (panier deja rehydrate) divergent et
 * React leve une erreur d'hydratation.
 */
export const usePanierStore = create<PanierStore>()(
  persist(
    (set) => ({
      articles: [],
      ajouter: (article, quantite = 1) =>
        set((state) => {
          const existant = state.articles.find((a) => a.varianteId === article.varianteId);
          if (existant) {
            const nouvelleQuantite = Math.min(
              existant.quantite + quantite,
              existant.stockDisponible
            );
            return {
              articles: state.articles.map((a) =>
                a.varianteId === article.varianteId ? { ...a, quantite: nouvelleQuantite } : a
              ),
            };
          }
          return {
            articles: [
              ...state.articles,
              { ...article, quantite: Math.max(1, Math.min(quantite, article.stockDisponible)) },
            ],
          };
        }),
      retirer: (varianteId) =>
        set((state) => ({ articles: state.articles.filter((a) => a.varianteId !== varianteId) })),
      changerQuantite: (varianteId, quantite) =>
        set((state) => ({
          articles:
            quantite <= 0
              ? state.articles.filter((a) => a.varianteId !== varianteId)
              : state.articles.map((a) =>
                  a.varianteId === varianteId
                    ? { ...a, quantite: Math.min(quantite, a.stockDisponible) }
                    : a
                ),
        })),
      vider: () => set({ articles: [] }),
    }),
    { name: "2k-shop-panier", skipHydration: true }
  )
);

/** A utiliser une seule fois en haut de l'arbre (layout) pour declencher la rehydratation. */
export function usePanierHydrate(): boolean {
  const [hydrate, setHydrate] = useState(false);

  useEffect(() => {
    usePanierStore.persist.rehydrate();
    setHydrate(true);
  }, []);

  return hydrate;
}

export function nombreArticles(articles: ArticlePanier[]): number {
  return articles.reduce((total, a) => total + a.quantite, 0);
}

export function totalPanier(articles: ArticlePanier[]): number {
  return articles.reduce((total, a) => total + a.prixUnitaire * a.quantite, 0);
}
