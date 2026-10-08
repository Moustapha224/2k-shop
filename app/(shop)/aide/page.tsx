import type { Metadata } from "next";
import Link from "next/link";

import { DELAI_LIVRAISON, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Aide",
  description: `Comment commander, livraison, retours et questions fréquentes chez ${SITE.nom}.`,
};

/**
 * Page d'aide unique, decoupee en sections ancrees. Les liens du footer
 * pointent vers ces ancres (/aide#livraison, /aide#retours...) plutot que
 * vers quatre pages distinctes quasi vides.
 */
const SECTIONS = [
  {
    id: "commander",
    titre: "Comment commander",
    paragraphes: [
      "Choisissez votre article, sélectionnez votre taille puis ajoutez-le au panier. Vous pouvez continuer vos achats ou valider directement.",
      "Au moment de valider, renseignez votre nom, votre téléphone, votre commune et votre quartier. Aucun compte n'est nécessaire.",
      "Nous vous appelons ensuite pour confirmer la commande et convenir du moment de la livraison.",
    ],
  },
  {
    id: "livraison",
    titre: "Livraison",
    paragraphes: [
      `Nous livrons dans toutes les communes de Conakry, en ${DELAI_LIVRAISON} après confirmation de votre commande.`,
      "Les frais de livraison dépendent de votre commune. Ils s'affichent automatiquement au moment de la validation, avant que vous confirmiez quoi que ce soit.",
      "Le livreur vous appelle à son arrivée. Prévoyez l'appoint si possible.",
    ],
  },
  {
    id: "retours",
    titre: "Retours & échanges",
    paragraphes: [
      "Vous essayez l'article devant le livreur avant de payer. Si la taille ne convient pas ou si le produit ne correspond pas à ce que vous attendiez, vous le rendez immédiatement et vous ne payez rien.",
      "Une fois la commande payée et le livreur reparti, contactez-nous dans les 24 heures si un problème apparaît. Nous étudions chaque cas.",
      "Les articles doivent être rendus non portés, avec leur étiquette.",
    ],
  },
  {
    id: "faq",
    titre: "Questions fréquentes",
    paragraphes: [
      "Faut-il payer en ligne ? Non. Le paiement se fait en espèces, à la livraison uniquement.",
      "Puis-je modifier ma commande ? Oui, tant que nous ne l'avons pas confirmée par téléphone. Contactez-nous au plus vite.",
      "Comment suivre ma commande ? Avec votre numéro de commande et votre téléphone, sur la page suivi de commande.",
      "Livrez-vous en dehors de Conakry ? Pas pour le moment.",
    ],
  },
];

export default function AidePage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Aide</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Tout ce qu&apos;il faut savoir pour commander chez {SITE.nom}.
        </p>
      </header>

      <nav aria-label="Sommaire" className="flex flex-wrap gap-2">
        {SECTIONS.map(({ id, titre }) => (
          <a
            key={id}
            href={`#${id}`}
            className="rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-gold/50 hover:text-gold-ink"
          >
            {titre}
          </a>
        ))}
      </nav>

      <div className="flex flex-col gap-8">
        {SECTIONS.map(({ id, titre, paragraphes }) => (
          <section key={id} id={id} className="flex scroll-mt-24 flex-col gap-3">
            <h2 className="text-lg font-semibold tracking-tight">{titre}</h2>
            {paragraphes.map((texte) => (
              <p key={texte} className="text-sm leading-relaxed text-muted-foreground">
                {texte}
              </p>
            ))}
          </section>
        ))}
      </div>

      <section className="flex flex-col gap-3 rounded-xl border border-border bg-muted/40 p-5">
        <h2 className="text-base font-semibold tracking-tight">
          Vous n&apos;avez pas trouvé votre réponse ?
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Écrivez-nous sur WhatsApp depuis la page{" "}
          <Link href="/contact" className="font-medium text-gold-ink underline underline-offset-4">
            contact
          </Link>
          , nous répondons dans la journée.
        </p>
      </section>
    </div>
  );
}
