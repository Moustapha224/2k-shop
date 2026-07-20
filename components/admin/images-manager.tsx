"use client";

import { useRef, useTransition } from "react";
import Image from "next/image";
import { UploadIcon } from "lucide-react";
import { toast } from "sonner";

import { SupprimerBouton } from "@/components/admin/supprimer-bouton";
import { ajouterImage, supprimerImage } from "@/lib/actions/produits";

type ImageProduit = { id: string; url: string };

export function ImagesManager({
  produitId,
  images,
}: {
  produitId: string;
  images: ImageProduit[];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();

  function onFileChange(evenement: React.ChangeEvent<HTMLInputElement>) {
    const fichier = evenement.target.files?.[0];
    if (!fichier) return;

    const formData = new FormData();
    formData.set("fichier", fichier);

    startTransition(async () => {
      try {
        await ajouterImage(produitId, formData);
        toast.success("Image ajoutée.");
      } catch (erreur) {
        toast.error(erreur instanceof Error ? erreur.message : "Envoi impossible.");
      } finally {
        if (inputRef.current) inputRef.current.value = "";
      }
    });
  }

  return (
    <div className="flex flex-wrap gap-3">
      {images.map((image) => (
        <div key={image.id} className="relative size-24 overflow-hidden rounded-lg border bg-muted">
          <Image src={image.url} alt="" fill className="object-cover" sizes="96px" />
          <div className="absolute top-1 right-1 rounded-md bg-background/90">
            <SupprimerBouton
              action={supprimerImage.bind(null, image.id)}
              confirmMessage="Supprimer cette image ?"
            />
          </div>
        </div>
      ))}
      <label className="flex size-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-muted-foreground hover:bg-muted">
        <UploadIcon className="size-5" />
        <span className="text-xs">{pending ? "Envoi..." : "Ajouter"}</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={onFileChange}
          disabled={pending}
        />
      </label>
    </div>
  );
}
