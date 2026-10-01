/**
 * Stockage des images envoyees depuis l'admin.
 *
 * Deux modes, choisis automatiquement :
 *
 * - **Stockage objet** (Neon Object Storage, compatible S3) des que les
 *   variables AWS_* et STORAGE_BUCKET sont presentes. C'est le mode attendu
 *   en production : le systeme de fichiers de Vercel est en lecture seule,
 *   un `writeFile` y echoue.
 * - **Disque local** (`public/uploads/`) sinon, pour que `npm run dev`
 *   fonctionne sans configurer quoi que ce soit.
 *
 * Le bucket doit etre en acces `public_read` : les URLs retournees sont
 * permanentes et lues directement par `next/image`. Un bucket `private`
 * imposerait des URLs signees a duree limitee, qui expireraient en base.
 */

import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

export const TYPES_IMAGE_AUTORISES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export const TAILLE_MAX_OCTETS = 5 * 1024 * 1024;

/** Prefixe des chemins servis depuis `public/` en mode local. */
const PREFIXE_LOCAL = "/uploads/";

type ConfigStockage = {
  endpoint: string;
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
};

/** Renvoie la config du stockage objet, ou `null` si elle est incomplete. */
function configStockage(): ConfigStockage | null {
  const endpoint = process.env.AWS_ENDPOINT_URL_S3?.trim();
  const bucket = process.env.STORAGE_BUCKET?.trim();
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY?.trim();
  const region = process.env.AWS_REGION?.trim() || "auto";

  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) return null;
  return { endpoint, region, bucket, accessKeyId, secretAccessKey };
}

/** Vrai si les images partent vers le stockage objet plutot que le disque. */
export function stockageObjetActif(): boolean {
  return configStockage() !== null;
}

function extensionDepuisType(type: string): string {
  const sousType = type.split("/")[1] ?? "bin";
  return sousType === "jpeg" ? "jpg" : sousType;
}

/** Valide le fichier recu du formulaire. Leve une erreur lisible sinon. */
function valider(fichier: unknown): asserts fichier is File {
  if (!(fichier instanceof File) || fichier.size === 0) {
    throw new Error("Aucun fichier fourni.");
  }
  if (!TYPES_IMAGE_AUTORISES.has(fichier.type)) {
    throw new Error("Format d'image non supporté (jpeg, png, webp, avif).");
  }
  if (fichier.size > TAILLE_MAX_OCTETS) {
    throw new Error("Image trop volumineuse (5 Mo maximum).");
  }
}

/**
 * Televerse une image et renvoie l'URL a stocker en base.
 *
 * En mode objet : URL absolue et permanente vers le bucket.
 * En mode local : chemin relatif `/uploads/<uuid>.<ext>`.
 */
export async function televerserImage(fichier: unknown): Promise<string> {
  valider(fichier);

  const nomFichier = `${randomUUID()}.${extensionDepuisType(fichier.type)}`;
  const octets = Buffer.from(await fichier.arrayBuffer());
  const config = configStockage();

  if (!config) {
    const dossier = path.join(process.cwd(), "public", "uploads");
    await mkdir(dossier, { recursive: true });
    await writeFile(path.join(dossier, nomFichier), octets);
    return `${PREFIXE_LOCAL}${nomFichier}`;
  }

  // Import dynamique : le SDK ne doit peser sur le bundle que s'il sert.
  const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");

  const client = new S3Client({
    endpoint: config.endpoint,
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    // Indispensable hors AWS : sans cela le SDK construit des URLs de la forme
    // `https://<bucket>.<endpoint>`, que Neon ne sert pas.
    forcePathStyle: true,
  });

  await client.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: nomFichier,
      Body: octets,
      ContentType: fichier.type,
      // Les images de catalogue ne changent jamais de contenu : leur nom est
      // un UUID, donc une nouvelle image = une nouvelle URL.
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return `${config.endpoint.replace(/\/+$/, "")}/${config.bucket}/${nomFichier}`;
}

/**
 * Supprime une image precedemment televersee.
 *
 * Ne leve jamais : une image orpheline est un desagrement, pas une raison de
 * faire echouer la suppression du produit ou de la slide qui la portait.
 * Les URLs externes (Unsplash...) sont ignorees.
 */
export async function supprimerImage(url: string | null | undefined): Promise<void> {
  if (!url) return;

  try {
    if (url.startsWith(PREFIXE_LOCAL)) {
      await unlink(path.join(process.cwd(), "public", url));
      return;
    }

    const config = configStockage();
    if (!config) return;

    const prefixe = `${config.endpoint.replace(/\/+$/, "")}/${config.bucket}/`;
    if (!url.startsWith(prefixe)) return; // URL externe : rien a supprimer.

    const { S3Client, DeleteObjectCommand } = await import("@aws-sdk/client-s3");
    const client = new S3Client({
      endpoint: config.endpoint,
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      forcePathStyle: true,
    });

    await client.send(
      new DeleteObjectCommand({ Bucket: config.bucket, Key: url.slice(prefixe.length) })
    );
  } catch (erreur) {
    console.error(
      "[storage] Suppression impossible :",
      erreur instanceof Error ? erreur.message : erreur
    );
  }
}
