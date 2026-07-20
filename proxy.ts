import { NextResponse } from "next/server";

import { auth } from "@/auth";

/**
 * Next.js 16 a renomme `middleware.ts` en `proxy.ts` (fonction identique).
 * Proxy tourne desormais sur le runtime Node.js par defaut, ce qui permet
 * d'importer directement `auth` (Prisma + bcryptjs) sans le decouper en
 * config Edge-safe separee.
 */
export default auth((req) => {
  const estConnecte = !!req.auth;
  const { pathname } = req.nextUrl;
  const estPageLogin = pathname === "/admin/login";

  if (!estConnecte && !estPageLogin) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl.origin));
  }

  if (estConnecte && estPageLogin) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
