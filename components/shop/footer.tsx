import Link from "next/link";
import { MessageCircleIcon } from "lucide-react";

import { DELAI_LIVRAISON, SITE } from "@/lib/constants";
import { formatTelephone } from "@/lib/format";

/**
 * Icone Facebook inline — lucide-react ne fournit plus les icones de marque
 * depuis la v1. Chemin issu de la version SVG officielle simplifiee.
 */
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 4.99 3.66 9.13 8.44 9.88v-6.99H7.9v-2.89h2.54V9.86c0-2.51 1.49-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.77l-.44 2.89h-2.33V22c4.78-.76 8.43-4.9 8.43-9.94Z" />
    </svg>
  );
}

export function Footer({
  whatsapp,
  whatsappHref,
  facebookUrl,
}: {
  whatsapp: string;
  whatsappHref: string;
  facebookUrl: string | null;
}) {
  const annee = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t bg-muted/30 pb-20 md:pb-0">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 text-sm sm:flex-row sm:justify-between">
        <div className="max-w-sm">
          <p className="font-semibold">{SITE.nom}</p>
          <p className="mt-1 text-muted-foreground">{SITE.description}</p>
          <p className="mt-3 text-muted-foreground">
            Livraison à Conakry en {DELAI_LIVRAISON}, paiement à la livraison uniquement.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-medium">Liens</p>
          <Link href="/produits" className="text-muted-foreground transition-colors hover:text-foreground">
            Produits
          </Link>
          <Link href="/suivi" className="text-muted-foreground transition-colors hover:text-foreground">
            Suivi de commande
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-medium">Contact & réseaux</p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <MessageCircleIcon className="size-4" />
            WhatsApp : {formatTelephone(whatsapp)}
          </a>
          {facebookUrl && (
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <FacebookIcon className="size-4" />
              Page Facebook
            </a>
          )}
        </div>
      </div>

      <p className="border-t px-4 py-4 text-center text-xs text-muted-foreground">
        © {annee} {SITE.nom} — {SITE.slogan}
      </p>
    </footer>
  );
}
