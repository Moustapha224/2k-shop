import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircleIcon, PackageSearchIcon, PhoneIcon } from "lucide-react";

import { DELAI_LIVRAISON, SITE } from "@/lib/constants";
import { formatTelephone } from "@/lib/format";
import { getParametres, urlWhatsApp } from "@/lib/parametres";

export const metadata: Metadata = {
  title: "Nous contacter",
  description: `Contactez ${SITE.nom} par WhatsApp ou téléphone pour toute question sur votre commande.`,
};

/** lucide-react ne fournit pas de logo Facebook : meme SVG que le footer. */
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 4.99 3.66 9.13 8.44 9.88v-6.99H7.9v-2.89h2.54V9.86c0-2.51 1.49-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.77l-.44 2.89h-2.33V22c4.78-.76 8.43-4.9 8.43-9.94Z" />
    </svg>
  );
}

export default async function ContactPage() {
  const parametres = await getParametres();
  const whatsappHref = urlWhatsApp(parametres);
  const telephone = parametres.whatsapp ?? SITE.whatsapp;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Nous contacter</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Une question sur un produit, une taille ou une commande en cours ? Le plus rapide
          reste WhatsApp — nous répondons dans la journée.
        </p>
      </header>

      <div className="flex flex-col gap-3">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-gold/50"
        >
          <MessageCircleIcon className="size-5 shrink-0 text-gold-ink" aria-hidden="true" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">WhatsApp</span>
            <span className="text-sm text-muted-foreground">{formatTelephone(telephone)}</span>
          </div>
        </a>

        <a
          href={`tel:+${telephone.replace(/\D/g, "")}`}
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-gold/50"
        >
          <PhoneIcon className="size-5 shrink-0 text-gold-ink" aria-hidden="true" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Téléphone</span>
            <span className="text-sm text-muted-foreground">{formatTelephone(telephone)}</span>
          </div>
        </a>

        {parametres.facebookUrl && (
          <a
            href={parametres.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-gold/50"
          >
            <FacebookIcon className="size-5 shrink-0 text-gold-ink" aria-hidden="true" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Facebook</span>
              <span className="text-sm text-muted-foreground">Voir notre page</span>
            </div>
          </a>
        )}
      </div>

      <section className="flex flex-col gap-3 rounded-xl border border-border bg-muted/40 p-5">
        <div className="flex items-center gap-2">
          <PackageSearchIcon className="size-4 shrink-0 text-gold-ink" aria-hidden="true" />
          <h2 className="text-base font-semibold tracking-tight">
            Vous cherchez où en est votre commande ?
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Pas besoin de nous écrire : la page{" "}
          <Link href="/suivi" className="font-medium text-gold-ink underline underline-offset-4">
            suivi de commande
          </Link>{" "}
          vous donne le statut en temps réel avec votre numéro de commande et votre
          téléphone. La livraison prend {DELAI_LIVRAISON} après confirmation.
        </p>
      </section>

      <p className="text-sm text-muted-foreground">
        Les réponses aux questions les plus fréquentes se trouvent sur notre{" "}
        <Link href="/aide" className="font-medium text-gold-ink underline underline-offset-4">
          page d&apos;aide
        </Link>
        .
      </p>
    </div>
  );
}
