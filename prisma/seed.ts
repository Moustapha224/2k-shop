/**
 * Peuple la base avec des donnees de demo : communes, categories, produits +
 * variantes, compte admin. Aucune image n'est seedee (une boutique qui
 * demarre n'a pas encore de vraies photos) : l'UI doit geger cet etat vide.
 *
 * Execute par `prisma migrate dev` / `npm run db:seed` (voir prisma.config.ts).
 * Lance directement par Node (pas par le bundler Next.js) : les imports
 * restent en chemins relatifs, pas d'alias `@/`.
 */
// Charge `.env` — indispensable quand le seed est lance directement par tsx
// (npm run db:seed) et pas via prisma.config.ts.
import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../generated/prisma/client";
import { TAILLES_VETEMENT, TAILLES_CHAUSSURE } from "../lib/constants";
import { slugifier } from "../lib/slug";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const COMMUNES = [
  { nom: "Kaloum", fraisLivraison: 30000 },
  { nom: "Dixinn", fraisLivraison: 25000 },
  { nom: "Matam", fraisLivraison: 25000 },
  { nom: "Ratoma", fraisLivraison: 20000 },
  { nom: "Matoto", fraisLivraison: 20000 },
];

const CATEGORIES = [
  { nom: "Hauts", ordre: 0 },
  { nom: "Pantalons", ordre: 1 },
  { nom: "Chaussures", ordre: 2 },
];

type ProduitSeed = {
  nom: string;
  categorie: string;
  type: "VETEMENT" | "CHAUSSURE";
  prix: number;
  description: string;
  stocks: number[];
};

const PRODUITS: ProduitSeed[] = [
  {
    nom: "T-shirt basique coton",
    categorie: "Hauts",
    type: "VETEMENT",
    prix: 75000,
    description:
      "T-shirt en coton respirant, coupe droite. Ideal au quotidien avec la chaleur de Conakry.",
    stocks: [5, 8, 8, 4, 0],
  },
  {
    nom: "Chemise manches longues",
    categorie: "Hauts",
    type: "VETEMENT",
    prix: 120000,
    description: "Chemise habillee manches longues, tissu leger, coupe ajustee.",
    stocks: [3, 6, 6, 2, 2],
  },
  {
    nom: "Polo classique",
    categorie: "Hauts",
    type: "VETEMENT",
    prix: 95000,
    description: "Polo piqué trois boutons, coloris uni, parfait pour le bureau comme le weekend.",
    stocks: [4, 7, 7, 5, 1],
  },
  {
    nom: "Jean slim",
    categorie: "Pantalons",
    type: "VETEMENT",
    prix: 150000,
    description: "Jean coupe slim, denim resistant, confortable pour toute la journee.",
    stocks: [2, 5, 6, 3, 0],
  },
  {
    nom: "Pantalon cargo",
    categorie: "Pantalons",
    type: "VETEMENT",
    prix: 130000,
    description: "Pantalon cargo multipoches, tissu solide, coupe droite decontractee.",
    stocks: [3, 4, 5, 4, 2],
  },
  {
    nom: "Jogging molleton",
    categorie: "Pantalons",
    type: "VETEMENT",
    prix: 90000,
    description: "Jogging en molleton doux, taille elastique, tres confortable.",
    stocks: [6, 8, 8, 6, 3],
  },
  {
    nom: "Baskets running",
    categorie: "Chaussures",
    type: "CHAUSSURE",
    prix: 250000,
    description: "Baskets legeres pour le sport ou le quotidien, semelle amortissante.",
    stocks: [0, 2, 3, 4, 3, 2, 2, 1, 0],
  },
  {
    nom: "Sneakers classiques",
    categorie: "Chaussures",
    type: "CHAUSSURE",
    prix: 220000,
    description: "Sneakers en toile, style intemporel, faciles a assortir.",
    stocks: [1, 3, 4, 4, 3, 3, 1, 1, 0],
  },
  {
    nom: "Sandales homme",
    categorie: "Chaussures",
    type: "CHAUSSURE",
    prix: 60000,
    description: "Sandales confortables en cuir synthetique, ideales pour la saison chaude.",
    stocks: [2, 3, 4, 3, 2, 2, 1, 0, 0],
  },
];

async function main() {
  console.log("Seed : communes...");
  for (const commune of COMMUNES) {
    await prisma.commune.upsert({
      where: { nom: commune.nom },
      update: { fraisLivraison: commune.fraisLivraison },
      create: commune,
    });
  }

  console.log("Seed : categories...");
  const categoriesParNom = new Map<string, string>();
  for (const categorie of CATEGORIES) {
    const slug = slugifier(categorie.nom);
    const enregistree = await prisma.categorie.upsert({
      where: { slug },
      update: { nom: categorie.nom, ordre: categorie.ordre },
      create: { nom: categorie.nom, slug, ordre: categorie.ordre },
    });
    categoriesParNom.set(categorie.nom, enregistree.id);
  }

  console.log("Seed : produits et variantes...");
  for (const produit of PRODUITS) {
    const categorieId = categoriesParNom.get(produit.categorie);
    if (!categorieId) throw new Error(`Categorie inconnue : ${produit.categorie}`);

    const slug = slugifier(produit.nom);
    const tailles = produit.type === "VETEMENT" ? TAILLES_VETEMENT : TAILLES_CHAUSSURE;

    const enregistre = await prisma.produit.upsert({
      where: { slug },
      update: {
        nom: produit.nom,
        description: produit.description,
        prix: produit.prix,
        categorieId,
        type: produit.type,
      },
      create: {
        nom: produit.nom,
        slug,
        description: produit.description,
        prix: produit.prix,
        categorieId,
        type: produit.type,
      },
    });

    for (let i = 0; i < tailles.length; i++) {
      await prisma.variante.upsert({
        where: { produitId_taille: { produitId: enregistre.id, taille: tailles[i] } },
        update: { stock: produit.stocks[i] ?? 0 },
        create: { produitId: enregistre.id, taille: tailles[i], stock: produit.stocks[i] ?? 0 },
      });
    }
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@2kshop.gn";
  const adminMotDePasse = process.env.ADMIN_PASSWORD ?? "changeme";
  console.log(`Seed : compte admin (${adminEmail})...`);
  const motDePasseHash = await bcrypt.hash(adminMotDePasse, 10);
  await prisma.admin.upsert({
    where: { email: adminEmail },
    // On met a jour le hash a chaque run pour que changer ADMIN_PASSWORD
    // dans .env prenne effet en relancant simplement le seed.
    update: { motDePasseHash },
    create: {
      email: adminEmail,
      motDePasseHash,
      nom: "Administrateur",
    },
  });
  // Nettoyage des anciens comptes de demonstration (evite qu'un mot de passe
  // par defaut reste actif apres avoir renseigne le vrai compte proprietaire).
  await prisma.admin.deleteMany({
    where: { email: { in: ["admin@2kshop.gn", "admin@exemple.gn"], not: adminEmail },
    },
  });

  console.log("Seed : parametres...");
  const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_URL || null;
  const facebookUrl = process.env.NEXT_PUBLIC_FACEBOOK_URL || null;
  await prisma.parametre.upsert({
    where: { id: "principal" },
    // Seed idempotent : on rafraichit les liens depuis .env sans ecraser
    // la banniere d'annonce eventuellement definie depuis l'admin.
    update: {
      whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "224600000000",
      whatsappUrl,
      facebookUrl,
    },
    create: {
      id: "principal",
      whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "224600000000",
      whatsappUrl,
      facebookUrl,
    },
  });

  console.log("Seed : slides hero...");
  const slidesDefaut = [
    {
      titre: "Nouvelle Collection",
      sousTitre: "Hauts, pantalons et chaussures livrés en 24h",
      imageUrlExterne:
        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=900&q=80&auto=format&fit=crop",
      ordre: 0,
    },
    {
      titre: "Style Urbain",
      sousTitre: "Des sneakers et baskets pour tous les jours",
      imageUrlExterne:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80&auto=format&fit=crop",
      ordre: 1,
    },
    {
      titre: "Mode Décontractée",
      sousTitre: "Jeans, cargos et joggings confortables",
      imageUrlExterne:
        "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=900&q=80&auto=format&fit=crop",
      ordre: 2,
    },
    {
      titre: "Élégance Quotidienne",
      sousTitre: "Chemises et polos pour toutes les occasions",
      imageUrlExterne:
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900&q=80&auto=format&fit=crop",
      ordre: 3,
    },
  ];
  // On n'insère les slides que s'il n'en existe pas encore
  // (pour ne pas écraser les slides ajoutées par l'admin)
  const nbSlides = await prisma.slideHero.count();
  if (nbSlides === 0) {
    for (const slide of slidesDefaut) {
      await prisma.slideHero.create({ data: slide });
    }
  }

  console.log("Seed termine.");
}

main()
  .catch((erreur) => {
    console.error(erreur);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
