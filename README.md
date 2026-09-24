# 2K SHOP — *Qualité et Fiabilité*

Boutique en ligne de vêtements (hauts, pantalons, chaussures) pour la région de
**Conakry, Guinée**. Paiement **à la livraison uniquement** (cash on delivery) :
le client ne paie rien en ligne, il règle le livreur à la réception.

Interface **en français**, prix en **GNF**, pensée **mobile-first** pour des
smartphones Android sur connexion lente.

## Stack

| Domaine        | Choix                                        |
| -------------- | -------------------------------------------- |
| Framework      | Next.js 16 (App Router) + TypeScript          |
| Style          | Tailwind CSS v4 + shadcn/ui (base Radix)      |
| Base de données| Prisma + SQLite (dev), prêt pour PostgreSQL   |
| Auth admin     | NextAuth (credentials)                        |
| Panier         | Zustand (persisté en localStorage)            |
| Formulaires    | React Hook Form + Zod                         |
| Toasts         | sonner                                        |

> **Tailwind v4** : il n'y a pas de `tailwind.config.ts`. Le thème (couleurs,
> rayons, polices) est défini en CSS dans [`app/globals.css`](app/globals.css)
> via la directive `@theme`.

## Prérequis

- Node.js 20 ou plus (testé avec Node 24)
- npm

## Installation

```bash
npm install
cp .env.example .env   # puis adapter les valeurs
npm run dev
```

L'application démarre sur http://localhost:3000.

## Scripts

| Script          | Rôle                                   |
| --------------- | -------------------------------------- |
| `npm run dev`   | Serveur de développement               |
| `npm run build` | Build de production                    |
| `npm run start` | Sert le build de production            |
| `npm run lint`  | ESLint                                 |

## Structure

```
app/
  (shop)/        Front-office client (accueil, catalogue, panier, commande)
  admin/         Back-office protégé
  layout.tsx     Layout racine (polices, métadonnées, toasts)
  globals.css    Thème Tailwind v4 + tokens shadcn
components/
  ui/            Composants shadcn/ui
  shop/          Composants du front-office
  admin/         Composants du back-office
  shared/        Composants transverses
lib/
  constants.ts   Identité boutique, tailles, statuts de commande
  format.ts      Formatage GNF, téléphone guinéen, dates
  utils.ts       Helper `cn()`
  validations/   Schémas Zod partagés client/serveur
  actions/       Server Actions (mutations)
  store/         Panier Zustand
prisma/          Schéma, migrations, seed
public/
  uploads/       Images produits envoyées depuis l'admin
```

## Avancement

- [x] **1** — Setup projet, Tailwind, shadcn/ui, structure des dossiers
- [x] **2** — Schéma Prisma, migrations, seed
- [x] **3** — Layout global (header, footer, nav mobile, WhatsApp flottant)
- [x] **4** — Catalogue et fiche produit
- [x] **5** — Panier
- [x] **6** — Checkout, confirmation, suivi de commande
- [x] **7** — Admin : auth, dashboard, commandes
- [x] **8** — Admin : produits, catégories, communes, paramètres
- [x] **9** — SEO, finitions, documentation

## Admin

Interface `/admin` protégée par NextAuth (credentials). Le compte est créé par
le seed à partir de `ADMIN_EMAIL` / `ADMIN_PASSWORD` (voir `.env`). Le seed
crée aussi 5 communes de Conakry, 3 catégories et 9 produits de démonstration
(sans photos — à ajouter depuis `/admin/produits`).

## Notifications email (Resend)

À chaque nouvelle commande, un email HTML récapitulatif est envoyé au
propriétaire (`NOTIFICATION_EMAIL`, repli sur `ADMIN_EMAIL`). L'envoi est
« fire-and-forget » — un incident côté Resend ne fait jamais échouer un
checkout.

**Activation :**

1. Créer un compte gratuit sur https://resend.com (100 emails/jour offerts).
2. Générer une clé API dans le dashboard Resend.
3. La coller dans `.env` : `RESEND_API_KEY="re_..."`.
4. Redémarrer le serveur (`npm run dev`).

Sans clé, les notifications sont **silencieusement désactivées** et le site
continue à fonctionner (utile en dev).

**Adresse d'expédition** : par défaut `onboarding@resend.dev` (sandbox — ne
peut envoyer qu'au propriétaire du compte Resend). Pour une utilisation réelle,
vérifier un domaine sur Resend puis régler `EMAIL_FROM="2K SHOP <commandes@votre-domaine.gn>"`.

## Base de données

PostgreSQL via [Neon](https://neon.com), avec l'adapter `@prisma/adapter-pg`.

Mise en place depuis zéro :

```bash
# 1. Créer un projet sur neon.com, copier la chaîne de connexion *avec pooling*
#    (l'hôte contient "-pooler") dans DATABASE_URL, côté .env
# 2. Créer les tables
npx prisma migrate deploy
# 3. Données de départ (catégories, communes, produits, compte admin)
npm run db:seed
```

Le seed lit `ADMIN_EMAIL` et `ADMIN_PASSWORD` et met le mot de passe à jour à
chaque exécution.

## Déploiement

Cible : Vercel + Neon. Un point reste à traiter :

- **Images produits et slides** : l'upload admin écrit dans `public/uploads/`
  via le système de fichiers (`lib/actions/produits.ts`, `lib/actions/slides.ts`).
  Cela fonctionne en local ou sur un serveur Node.js classique, mais **pas** sur
  une plateforme serverless comme Vercel, dont le système de fichiers est en
  lecture seule : l'upload échouera. Il faut passer par un stockage externe
  (Vercel Blob, Cloudinary, S3…) avant d'ouvrir l'admin en production. Les
  images déjà présentes dans `public/` sont servies normalement — c'est
  l'écriture, pas la lecture, qui pose problème.
