import type { Metadata } from "next";
import Image from "next/image";

import { SlideFormDialog } from "@/components/admin/slide-form-dialog";
import { SupprimerBouton } from "@/components/admin/supprimer-bouton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supprimerSlide } from "@/lib/actions/slides";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Slides Hero" };

export default async function AdminSlidesPage() {
  const slides = await prisma.slideHero.findMany({
    orderBy: { ordre: "asc" },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Slides (Carrousel Accueil)</h1>
        <SlideFormDialog />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24">Image</TableHead>
            <TableHead>Titre</TableHead>
            <TableHead>Sous-titre</TableHead>
            <TableHead>Ordre</TableHead>
            <TableHead className="w-20" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {slides.map((slide) => {
            const imageUrl = slide.imageUrlExterne || slide.imageUrl;
            return (
              <TableRow key={slide.id}>
                <TableCell>
                  {imageUrl ? (
                    <div className="relative h-12 w-20 overflow-hidden rounded-md bg-muted">
                      <Image 
                        src={imageUrl} 
                        alt={slide.titre || "Slide"} 
                        fill 
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  ) : (
                    <div className="flex h-12 w-20 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
                      Aucune
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{slide.titre || "-"}</TableCell>
                <TableCell className="text-muted-foreground">{slide.sousTitre || "-"}</TableCell>
                <TableCell>{slide.ordre}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <SlideFormDialog slide={slide} />
                    <SupprimerBouton
                      action={supprimerSlide.bind(null, slide.id)}
                      confirmMessage="Supprimer ce slide ?"
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {slides.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">Aucun slide.</p>
      )}
    </div>
  );
}
