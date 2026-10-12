import "server-only";

import { SITE } from "@/lib/constants";

/**
 * Base absolue a utiliser dans tout ce qui quitte le serveur : liens d'emails
 * surtout, ou une URL relative n'a aucun sens.
 *
 * Pourquoi ne pas se contenter de `SITE.url` :
 * `NEXT_PUBLIC_SITE_URL` s'est revelee absente a l'execution en production
 * alors qu'elle etait bien presente au build — le sitemap, prerendu, portait
 * la bonne adresse pendant que les emails partaient avec `localhost:3000`.
 * Sur Vercel, `VERCEL_PROJECT_PRODUCTION_URL` est fournie au runtime et
 * designe le domaine de production stable (et non celui, ephemere, du
 * deploiement courant comme `VERCEL_URL`). Elle sert donc de filet.
 *
 * L'ordre reste : la valeur explicite d'abord, pour qu'un domaine
 * personnalise l'emporte sur celui de Vercel le jour ou tu en auras un.
 */
export function urlSite(): string {
  const explicite = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicite && !explicite.includes("localhost")) {
    return explicite.replace(/\/+$/, "");
  }

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "").replace(/\/+$/, "")}`;

  // En local, `localhost` est la bonne reponse.
  return SITE.url.replace(/\/+$/, "");
}
