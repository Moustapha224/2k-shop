import Image from "next/image";
import Link from "next/link";
import { MessageCircleIcon, PhoneIcon, MailIcon, MapPinIcon } from "lucide-react";

import { DELAI_LIVRAISON, SITE } from "@/lib/constants";
import { formatTelephone } from "@/lib/format";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 4.99 3.66 9.13 8.44 9.88v-6.99H7.9v-2.89h2.54V9.86c0-2.51 1.49-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.77l-.44 2.89h-2.33V22c4.78-.76 8.43-4.9 8.43-9.94Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
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
    <footer className="mt-4 border-t border-border/60 bg-background pb-20 md:pb-0">
      <div className="mx-auto w-full max-w-6xl px-4 pt-10 pb-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Colonne marque */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.jpeg"
                alt={`Logo ${SITE.nom}`}
                width={32}
                height={32}
                className="size-8 rounded-lg object-contain shadow-sm"
              />
              <div>
                <p className="text-sm font-bold">{SITE.nom}</p>
                <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-gold">
                  {SITE.slogan}
                </p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Livraison à Conakry en {DELAI_LIVRAISON}. <br />
              Paiement à la livraison.
            </p>
          </div>

          {/* Liens utiles */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold">Liens utiles</p>
            {[
              { href: "/produits", label: "Produits" },
              { href: "/suivi", label: "Suivi de commande" },
              { href: "/panier", label: "Mon panier" },
              { href: "/a-propos", label: "À propos" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-xs text-muted-foreground transition-colors hover:text-gold"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Aide */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold">Aide</p>
            {[
              { href: "/aide#commander", label: "Comment commander" },
              { href: "/aide#livraison", label: "Livraison" },
              { href: "/aide#retours", label: "Retours & échanges" },
              { href: "/aide#faq", label: "FAQ" },
            ].map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                className="text-xs text-muted-foreground transition-colors hover:text-gold"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Contact + Réseaux */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold">Nous contacter</p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-gold"
            >
              <PhoneIcon className="size-3.5" />
              {formatTelephone(whatsapp)}
            </a>
            <a
              href="mailto:contact@2kshop.com"
              className="inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-gold"
            >
              <MailIcon className="size-3.5" />
              contact@2kshop.com
            </a>
            <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <MapPinIcon className="size-3.5" />
              Conakry, Guinée
            </span>

            <div className="mt-1">
              <p className="text-sm font-semibold mb-2">Suivez-nous</p>
              <div className="flex items-center gap-2">
                {facebookUrl && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="flex size-8 items-center justify-center rounded-lg border border-border/60 bg-card text-muted-foreground transition-all hover:border-gold/40 hover:text-gold hover:shadow-sm"
                  >
                    <FacebookIcon className="size-4" />
                  </a>
                )}
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex size-8 items-center justify-center rounded-lg border border-border/60 bg-card text-muted-foreground transition-all hover:border-gold/40 hover:text-gold hover:shadow-sm"
                >
                  <InstagramIcon className="size-4" />
                </a>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="flex size-8 items-center justify-center rounded-lg border border-border/60 bg-card text-muted-foreground transition-all hover:border-gold/40 hover:text-[#25D366] hover:shadow-sm"
                >
                  <MessageCircleIcon className="size-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border/60 px-4 py-4 text-center text-xs text-muted-foreground">
        © {annee} {SITE.nom} — Tous droits réservés.
      </div>
    </footer>
  );
}
