"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOffIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  nom,
}: {
  images: { url: string }[];
  nom: string;
}) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <ImageOffIcon className="size-10" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
        <Image
          src={images[index].url}
          alt={nom}
          fill
          priority
          className="object-cover"
          sizes="(min-width: 768px) 480px, 100vw"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((image, i) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Photo ${i + 1}`}
              className={cn(
                "relative size-14 shrink-0 overflow-hidden rounded-lg border-2",
                i === index ? "border-primary" : "border-transparent"
              )}
            >
              <Image src={image.url} alt="" fill className="object-cover" sizes="56px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
