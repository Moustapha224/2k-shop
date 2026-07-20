"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

/**
 * Encapsule `next-themes` avec les reglages du site :
 *   - attribut `class` sur <html> (compatible Tailwind v4 `.dark`)
 *   - detection du theme systeme par defaut
 *   - pas de transition CSS au changement (evite un flash / une transition
 *     bizarre sur les 200+ elements qui changent en meme temps)
 */
export function ThemeProvider(props: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    />
  );
}
