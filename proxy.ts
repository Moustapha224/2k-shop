import { NextResponse, type NextRequest } from "next/server";

import { auth } from "@/auth";

/**
 * Next.js 16 a renomme `middleware.ts` en `proxy.ts` (fonction identique).
 * Proxy tourne desormais sur le runtime Node.js par defaut, ce qui permet
 * d'importer directement `auth` (Prisma + bcryptjs) sans le decouper en
 * config Edge-safe separee.
 */

/**
 * Origine a laquelle le visiteur a reellement parle.
 *
 * `req.nextUrl.origin` ne convient pas ici : le wrapper `auth()` fait passer
 * la requete par `reqWithEnvURL`, qui remplace son origine par celle de
 * `AUTH_URL`/`NEXTAUTH_URL` avant de nous la transmettre
 * (node_modules/next-auth/lib/env.js). Une valeur locale heritee du `.env`
 * suffisait donc a renvoyer vers `localhost:3000` tous les liens profonds de
 * l'admin — ceux des emails de commande en particulier.
 *
 * Les en-tetes `x-forwarded-*` sont poses par Vercel et decrivent, eux, la
 * requete telle qu'elle est arrivee. Ils survivent aussi a un changement de
 * domaine, ce qui evite de recabler quoi que ce soit le jour du domaine
 * personnalise.
 */
function origineDemandee(req: NextRequest): string {
  const hote = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!hote) return req.nextUrl.origin;

  const protocole =
    req.headers.get("x-forwarded-proto") ?? req.nextUrl.protocol.replace(":", "");

  return `${protocole}://${hote}`;
}

export default auth((req) => {
  const estConnecte = !!req.auth;
  const { pathname } = req.nextUrl;
  const estPageLogin = pathname === "/admin/login";
  const origine = origineDemandee(req);

  if (!estConnecte && !estPageLogin) {
    const versLogin = new URL("/admin/login", origine);
    // On conserve la destination : sans cela, un lien profond — typiquement
    // celui d'un email de commande — ramenait toujours au tableau de bord.
    versLogin.searchParams.set("callbackUrl", pathname + req.nextUrl.search);
    return NextResponse.redirect(versLogin);
  }

  if (estConnecte && estPageLogin) {
    return NextResponse.redirect(new URL("/admin", origine));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
