import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Postgres (Neon). L'adaptateur gere son propre pool : indispensable en
// serverless, ou chaque invocation ouvrirait sinon une connexion de plus.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

/** Instance unique de PrismaClient, reutilisee entre les rechargements HMR en dev. */
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
