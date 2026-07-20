import { normaliserTelephone } from "@/lib/format";

/** Verifie que le telephone fourni (brut, non normalise) correspond a celui de la commande. */
export function telephoneCorrespond(
  commande: { clientTelephone: string },
  telephoneBrut: string | undefined
): boolean {
  if (!telephoneBrut) return false;
  return normaliserTelephone(commande.clientTelephone) === normaliserTelephone(telephoneBrut);
}
