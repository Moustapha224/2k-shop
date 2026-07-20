import Link from "next/link";

import { DELAI_LIVRAISON, SITE } from "@/lib/constants";
import { formatTelephone } from "@/lib/format";

export function Footer({ whatsapp }: { whatsapp: string }) {
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
          <Link href="/produits" className="text-muted-foreground hover:text-foreground">
            Produits
          </Link>
          <Link href="/suivi" className="text-muted-foreground hover:text-foreground">
            Suivi de commande
          </Link>
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-medium">Contact</p>
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            WhatsApp : {formatTelephone(whatsapp)}
          </a>
        </div>
      </div>

      <p className="border-t px-4 py-4 text-center text-xs text-muted-foreground">
        © {annee} {SITE.nom} — {SITE.slogan}
      </p>
    </footer>
  );
}
