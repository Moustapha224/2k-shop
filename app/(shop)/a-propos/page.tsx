import type { Metadata } from "next";
import Link from "next/link";
import { HeartIcon, ShieldCheckIcon, TruckIcon } from "lucide-react";

import { DELAI_LIVRAISON, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "À propos",
  description: `${SITE.nom} — ${SITE.slogan}. ${SITE.description}`,
};

const ENGAGEMENTS = [
  {
    icone: ShieldCheckIcon,
    titre: "Essayage avant paiement",
    texte:
      "Vous essayez l'article devant le livreur. Si la taille ne va pas ou si le produit ne correspond pas, vous ne payez pas.",
  },
  {
    icone: TruckIcon,
    titre: `Livraison en ${DELAI_LIVRAISON}`,
    texte:
      "Nous livrons dans toutes les communes de Conakry. Les frais dépendent de votre commune et s'affichent avant la validation.",
  },
  {
    icone: HeartIcon,
    titre: "Paiement à la livraison",
    texte:
      "Aucun paiement en ligne, aucune carte bancaire. Vous réglez en espèces au moment de recevoir votre commande.",
  },
];

export default function AProposPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-10 px-4 py-10">
      <header className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">À propos de {SITE.nom}</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {SITE.nom} est une boutique de prêt-à-porter basée à Conakry. Nous proposons des
          hauts, des pantalons et des chaussures sélectionnés pour leur qualité, livrés
          directement chez vous.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold tracking-tight">Nos engagements</h2>
        <ul className="flex flex-col gap-4">
          {ENGAGEMENTS.map(({ icone: Icone, titre, texte }) => (
            <li
              key={titre}
              className="flex gap-3 rounded-xl border border-border bg-card p-4"
            >
              <Icone className="mt-0.5 size-5 shrink-0 text-gold-ink" aria-hidden="true" />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold">{titre}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{texte}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-tight">Notre façon de travailler</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Chaque commande est confirmée par téléphone avant d&apos;être préparée. Cela nous
          permet de vérifier la disponibilité de votre taille et de convenir avec vous du
          moment de la livraison. Vous pouvez suivre l&apos;avancement de votre commande à
          tout moment depuis la page{" "}
          <Link href="/suivi" className="font-medium text-gold-ink underline underline-offset-4">
            suivi de commande
          </Link>
          .
        </p>
      </section>

      <section className="flex flex-col gap-3 rounded-xl border border-border bg-muted/40 p-5">
        <h2 className="text-base font-semibold tracking-tight">Une question ?</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Consultez notre{" "}
          <Link href="/aide" className="font-medium text-gold-ink underline underline-offset-4">
            page d&apos;aide
          </Link>{" "}
          ou{" "}
          <Link href="/contact" className="font-medium text-gold-ink underline underline-offset-4">
            contactez-nous directement
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
