"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Slide = {
  id: string;
  titre: string | null;
  sousTitre: string | null;
  imageUrl: string | null;
  imageUrlExterne: string | null;
};

interface HeroSliderProps {
  slides: Slide[];
}

/**
 * Carrousel de fond du hero. Il ne porte ni voile ni texte : la section qui
 * l'englobe pose son propre degrade et superpose le contenu editorial, sinon
 * les deux se cumuleraient et l'image virerait au gris.
 */
export function HeroSlider({ slides }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // `currentIndex` est dans les dependances : toute navigation manuelle relance
  // le compte a rebours au lieu de laisser le tick precedent avancer aussitot.
  useEffect(() => {
    if (slides.length <= 1) return;

    // Le defilement tourne toujours. Sous `prefers-reduced-motion`, ce n'est
    // pas l'avancement qui est coupe mais le fondu : la classe
    // `motion-reduce:transition-none` plus bas rend le changement instantane,
    // ce qui supprime le mouvement sans priver personne du contenu.
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearTimeout(timer);
  }, [slides.length, currentIndex]);

  // Fond neutre sombre : le texte du hero est blanc, il doit rester lisible
  // meme sans aucune image.
  if (!slides || slides.length === 0) {
    return <div className="absolute inset-0 bg-stone-900" />;
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="group absolute inset-0 overflow-hidden bg-stone-900">
      {slides.map((slide, index) => {
        const url = slide.imageUrlExterne || slide.imageUrl || "";
        return (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 motion-reduce:transition-none",
              index === currentIndex ? "opacity-100" : "opacity-0"
            )}
            aria-hidden={index !== currentIndex}
          >
            {url && (
              <Image
                src={url}
                alt={slide.titre || ""}
                fill
                priority={index === 0}
                className="object-cover object-center"
                // Le carrousel occupe desormais toute la largeur du hero.
                sizes="100vw"
              />
            )}
          </div>
        );
      })}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={goToPrevious}
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/55 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:opacity-0 md:group-hover:opacity-100"
            aria-label="Image précédente"
          >
            <ChevronLeftIcon className="size-5" />
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/55 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:opacity-0 md:group-hover:opacity-100"
            aria-label="Image suivante"
          >
            <ChevronRightIcon className="size-5" />
          </button>

          <div className="absolute bottom-5 right-5 z-20 flex gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "h-1.5 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                  index === currentIndex
                    ? "w-7 bg-white"
                    : "w-3 bg-white/45 hover:bg-white/75"
                )}
                aria-label={`Voir l'image ${index + 1} sur ${slides.length}`}
                aria-current={index === currentIndex}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
