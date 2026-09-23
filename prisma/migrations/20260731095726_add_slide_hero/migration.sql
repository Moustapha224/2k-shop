-- CreateTable
CREATE TABLE "SlideHero" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titre" TEXT,
    "sousTitre" TEXT,
    "imageUrl" TEXT,
    "imageUrlExterne" TEXT,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
