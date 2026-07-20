/**
 * Formatage : montants GNF, téléphones guinéens, dates.
 *
 * Ces fonctions sont volontairement déterministes (pas de `toLocaleString`)
 * afin que le rendu serveur et le rendu client soient identiques et
 * n'entraînent pas d'erreur d'hydratation.
 */

/** Sépare les milliers par une espace : 150000 -> "150 000" */
export function formatNombre(valeur: number): string {
  return Math.round(valeur)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/** Montant en francs guinéens : 150000 -> "150 000 GNF" */
export function formatGNF(montant: number): string {
  return `${formatNombre(montant)} GNF`;
}

/**
 * Ne garde que les chiffres du numéro et retire l'indicatif guinéen.
 * "+224 620 12 34 56" -> "620123456"
 */
export function normaliserTelephone(telephone: string): string {
  return telephone.replace(/\D/g, "").replace(/^224/, "");
}

/** Affichage : "620123456" -> "620 12 34 56" */
export function formatTelephone(telephone: string): string {
  const chiffres = normaliserTelephone(telephone);
  if (chiffres.length !== 9) return telephone;
  return `${chiffres.slice(0, 3)} ${chiffres.slice(3, 5)} ${chiffres.slice(5, 7)} ${chiffres.slice(7, 9)}`;
}

/** Format international, pour les liens wa.me : "620123456" -> "224620123456" */
export function telephoneInternational(telephone: string): string {
  return `224${normaliserTelephone(telephone)}`;
}

/** Date lisible en français, ancrée sur le fuseau de Conakry (UTC+0). */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Conakry",
  }).format(new Date(date));
}

/** Date + heure, ancrée sur le fuseau de Conakry (UTC+0). */
export function formatDateHeure(date: Date | string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Conakry",
  }).format(new Date(date));
}
