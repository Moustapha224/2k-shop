-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Categorie" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Categorie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produit" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prix" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "categorieId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Produit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProduitImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "produitId" TEXT NOT NULL,

    CONSTRAINT "ProduitImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Variante" (
    "id" TEXT NOT NULL,
    "taille" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "produitId" TEXT NOT NULL,

    CONSTRAINT "Variante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commune" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "fraisLivraison" INTEGER NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Commune_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commande" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "clientNom" TEXT NOT NULL,
    "clientTelephone" TEXT NOT NULL,
    "clientEmail" TEXT,
    "communeId" TEXT NOT NULL,
    "quartier" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "notes" TEXT,
    "sousTotal" INTEGER NOT NULL,
    "fraisLivraison" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "confirmeeLe" TIMESTAMP(3),
    "enLivraisonLe" TIMESTAMP(3),
    "livreeLe" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Commande_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LigneCommande" (
    "id" TEXT NOT NULL,
    "commandeId" TEXT NOT NULL,
    "produitId" TEXT,
    "nomProduit" TEXT NOT NULL,
    "taille" TEXT NOT NULL,
    "prixUnitaire" INTEGER NOT NULL,
    "quantite" INTEGER NOT NULL,
    "sousTotal" INTEGER NOT NULL,

    CONSTRAINT "LigneCommande_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasseHash" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlideHero" (
    "id" TEXT NOT NULL,
    "titre" TEXT,
    "sousTitre" TEXT,
    "imageUrl" TEXT,
    "imageUrlExterne" TEXT,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SlideHero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parametre" (
    "id" TEXT NOT NULL DEFAULT 'principal',
    "whatsapp" TEXT,
    "whatsappUrl" TEXT,
    "facebookUrl" TEXT,
    "messageAnnonce" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Parametre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AbonneNewsletter" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AbonneNewsletter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categorie_slug_key" ON "Categorie"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Produit_slug_key" ON "Produit"("slug");

-- CreateIndex
CREATE INDEX "Produit_categorieId_idx" ON "Produit"("categorieId");

-- CreateIndex
CREATE INDEX "ProduitImage_produitId_idx" ON "ProduitImage"("produitId");

-- CreateIndex
CREATE UNIQUE INDEX "Variante_produitId_taille_key" ON "Variante"("produitId", "taille");

-- CreateIndex
CREATE UNIQUE INDEX "Commune_nom_key" ON "Commune"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "Commande_numero_key" ON "Commande"("numero");

-- CreateIndex
CREATE INDEX "Commande_statut_idx" ON "Commande"("statut");

-- CreateIndex
CREATE INDEX "Commande_clientTelephone_idx" ON "Commande"("clientTelephone");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AbonneNewsletter_email_key" ON "AbonneNewsletter"("email");

-- AddForeignKey
ALTER TABLE "Produit" ADD CONSTRAINT "Produit_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "Categorie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProduitImage" ADD CONSTRAINT "ProduitImage_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "Produit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variante" ADD CONSTRAINT "Variante_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "Produit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commande" ADD CONSTRAINT "Commande_communeId_fkey" FOREIGN KEY ("communeId") REFERENCES "Commune"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LigneCommande" ADD CONSTRAINT "LigneCommande_commandeId_fkey" FOREIGN KEY ("commandeId") REFERENCES "Commande"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LigneCommande" ADD CONSTRAINT "LigneCommande_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "Produit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
