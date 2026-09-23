-- AlterTable
ALTER TABLE "Commande" ADD COLUMN "clientEmail" TEXT;

-- CreateTable
CREATE TABLE "AbonneNewsletter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "AbonneNewsletter_email_key" ON "AbonneNewsletter"("email");
