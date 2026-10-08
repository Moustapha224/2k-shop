import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TruckIcon,
  MailIcon,
  HeartIcon,
  BadgeCheckIcon,
  HeadphonesIcon,
  SmileIcon,
} from "lucide-react";

import { NewsletterForm } from "@/components/shop/newsletter-form";

import { ProductGrid } from "@/components/shop/product-grid";
import { HeroSlider } from "@/components/shop/hero-slider";
import { prisma } from "@/lib/db";
import { cn } from "@/lib/utils";
import { versCarteProduit } from "@/lib/produits";
import { DELAI_LIVRAISON, SITE } from "@/lib/constants";

export default async function AccueilPage() {
  const [categories, produitsRecents, slidesHero] = await Promise.all([
    prisma.categorie.findMany({ orderBy: { ordre: "asc" } }),
    prisma.produit.findMany({
      where: { actif: true },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { images: true, variantes: true },
    }),
    prisma.slideHero.findMany({
      where: { actif: true },
      orderBy: { ordre: "asc" },
    }),
  ]);

  const arguments_confiance = [
    {
      icon: TruckIcon,
      titre: `Livraison en ${DELAI_LIVRAISON}`,
      texte: "Partout à Conakry, chez vous ou à votre bureau.",
    },
    {
      icon: ShieldCheckIcon,
      titre: "Paiement à la livraison",
      texte: "Aucun paiement en ligne. Vous réglez le livreur en espèces.",
    },
    {
      icon: SparklesIcon,
      titre: "Essayage avant paiement",
      texte: "Vous vérifiez la taille et l'état à la réception.",
    },
  ];

  const stats = [
    {
      icon: BadgeCheckIcon,
      label: "Qualité. Style. Confiance.",
      description: "2K SHOP, c'est plus qu'un style, c'est une promesse.",
      main: true,
    },
    {
      icon: HeartIcon,
      label: "Produits sélectionnés",
      description: "avec soin",
    },
    {
      icon: HeadphonesIcon,
      label: "SAV réactif",
      description: "et à l'écoute",
    },
    {
      icon: SmileIcon,
      label: "Clients satisfaits",
      description: "partout à Conakry",
    },
  ];

  return (
    <div className="flex w-full flex-col">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="relative isolate flex min-h-[26rem] overflow-hidden rounded-2xl border border-border/60 shadow-sm md:min-h-[32rem]">
          {/* Carrousel en fond, pleine surface */}
          <HeroSlider slides={slidesHero} />

          {/*
            Voile directionnel : dense la ou se pose le texte, il s'efface pour
            laisser voir le vetement. Vertical sur mobile (le texte est empile
            au-dessus de l'image), horizontal des md (le texte occupe la gauche).
            C'est lui qui garantit un fond sombre dans les deux themes, d'ou du
            blanc fixe plus bas plutot que des tokens de theme.
          */}
          <div
            aria-hidden
            className="absolute inset-0 z-10 bg-gradient-to-t from-black/85 via-black/55 to-black/20 md:bg-gradient-to-r md:from-black/85 md:via-black/50 md:to-transparent"
          />

          {/* Contenu editorial. `pointer-events-none` laisse les fleches et les
              puces du carrousel cliquables ; seuls les vrais liens reactivent
              les evenements. */}
          <div className="relative z-20 flex w-full flex-col justify-end gap-5 px-6 py-10 pointer-events-none sm:px-8 md:max-w-xl md:justify-center md:px-12 md:py-14">
            <div className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/8">
                <Image
                  src="/logo.jpeg"
                  alt={`Logo ${SITE.nom}`}
                  width={32}
                  height={32}
                  priority
                  className="size-8 rounded-lg object-contain"
                />
              </div>
            </div>

            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-sm sm:text-5xl md:text-6xl">
                {SITE.nom}
              </h1>
              <p className="mt-1.5 text-xs font-semibold tracking-[0.25em] uppercase text-gold">
                {SITE.slogan}
              </p>
            </div>

            <ul className="flex flex-col gap-2.5 text-sm text-white/90">
              <li className="flex items-start gap-2">
                <TruckIcon className="mt-0.5 size-4 shrink-0 text-white/70" />
                Hauts, pantalons et chaussures livrés partout à Conakry en{" "}
                {DELAI_LIVRAISON}.
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheckIcon className="mt-0.5 size-4 shrink-0 text-white/70" />
                Vous ne payez rien maintenant.
              </li>
              <li className="flex items-start gap-2">
                <SparklesIcon className="mt-0.5 size-4 shrink-0 text-white/70" />
                Vous payez le livreur à la réception.
              </li>
            </ul>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/produits"
                className="pointer-events-auto inline-flex items-center gap-2 self-start rounded-xl bg-gold px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:brightness-90 hover:-translate-y-0.5 active:scale-95"
              >
                Voir les produits
                <ArrowRightIcon className="size-4" />
              </Link>
              <span className="text-xs text-white/75">
                +1 250 clients satisfaits
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Arguments confiance ───────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-2">
        <div className="grid gap-3 sm:grid-cols-3">
          {arguments_confiance.map(({ icon: Icon, titre, texte }) => (
            <div
              key={titre}
              className="group flex items-start gap-3 rounded-xl border border-border/60 bg-card p-4 shadow-sm transition-all duration-200 hover:border-gold/40 hover:shadow-md"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted group-hover:bg-gold/10 transition-colors">
                <Icon className="size-5 text-foreground/70 group-hover:text-gold-ink transition-colors" />
              </div>
              <div>
                <p className="text-sm font-semibold">{titre}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{texte}</p>
              </div>
              <ArrowRightIcon className="ml-auto size-4 shrink-0 text-muted-foreground/50 group-hover:text-gold-ink transition-colors self-center" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Catégories ────────────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-4 py-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Catégories</h2>
            <Link
              href="/produits"
              className="inline-flex items-center gap-1 text-sm font-medium text-gold-ink transition-opacity hover:opacity-80"
            >
              Voir toutes
              <ArrowRightIcon className="size-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((categorie) => (
              <Link
                key={categorie.id}
                href={`/produits?categorie=${categorie.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-md"
              >
                {/* Zone image / icône catégorie */}
                <div className="flex h-28 items-center justify-center bg-[#f7f5f0] dark:bg-muted text-5xl select-none">
                  {categorie.nom.toLowerCase().includes("haut") ||
                  categorie.nom.toLowerCase().includes("hoodie") ||
                  categorie.nom.toLowerCase().includes("veste") ||
                  categorie.nom.toLowerCase().includes("chemise")
                    ? "👕"
                    : categorie.nom.toLowerCase().includes("pantalon") ||
                      categorie.nom.toLowerCase().includes("jean")
                    ? "👖"
                    : categorie.nom.toLowerCase().includes("chaussure") ||
                      categorie.nom.toLowerCase().includes("basket") ||
                      categorie.nom.toLowerCase().includes("sandale")
                    ? "👟"
                    : "🛍️"}
                </div>
                <div className="flex items-center justify-between p-3">
                  <div>
                    <p className="text-sm font-semibold">{categorie.nom}</p>
                    <p className="text-xs text-gold-ink font-medium mt-0.5">
                      Découvrir →
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Nouveautés ────────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Nouveautés</h2>
          <Link
            href="/produits"
            className="inline-flex items-center gap-1 text-sm font-medium text-gold-ink transition-opacity hover:opacity-80"
          >
            Tout voir
            <ArrowRightIcon className="size-3.5" />
          </Link>
        </div>
        <ProductGrid produits={produitsRecents.map(versCarteProduit)} />
      </section>

      {/* ── Stats / valeurs ───────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map(({ icon: Icon, label, description, main }) => (
            <div
              key={label}
              className={cn(
                "flex flex-col gap-2 rounded-xl border p-4",
                main
                  ? "col-span-2 flex-row items-center gap-3 border-foreground/20 bg-foreground text-background sm:col-span-1"
                  : "border-border/60 bg-card"
              )}
            >
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-full",
                  main ? "bg-background/10" : "bg-muted"
                )}
              >
                <Icon className={cn("size-5", main ? "text-background" : "text-gold-ink")} />
              </div>
              <div>
                <p
                  className={cn(
                    "text-sm font-semibold",
                    main ? "text-background" : "text-foreground"
                  )}
                >
                  {label}
                </p>
                <p
                  className={cn(
                    "mt-0.5 text-xs",
                    main ? "text-background/70" : "text-muted-foreground"
                  )}
                >
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Newsletter ────────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-10">
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-foreground px-6 py-8 text-background sm:flex-row sm:justify-between sm:gap-6">
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-background/10">
              <MailIcon className="size-6 text-background" />
            </div>
            <div>
              <p className="font-bold text-background">Ne manquez aucune nouveauté</p>
              <p className="text-sm text-background/70">
                Abonnez-vous pour recevoir nos offres et nouveaux arrivages.
              </p>
            </div>
          </div>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
