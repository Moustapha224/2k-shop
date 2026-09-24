"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

// Patch pour empecher le crash du site (overlay rouge) en developpement avec
// React 19, lie a l'injection du <script> par next-themes.
// Le drapeau evite d'empiler un wrapper supplementaire a chaque re-evaluation
// du module par le Fast Refresh (sinon console.error devient une chaine de
// closures qui grandit a chaque sauvegarde).
const MARQUEUR_PATCH = "__patchScriptTagNextThemes";
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const cible = console.error as typeof console.error & { [MARQUEUR_PATCH]?: true };
  if (!cible[MARQUEUR_PATCH]) {
    const origError = console.error;
    const patch = ((...args: unknown[]) => {
      if (typeof args[0] === "string" && args[0].includes("Encountered a script tag")) {
        return;
      }
      origError.apply(console, args);
    }) as typeof console.error & { [MARQUEUR_PATCH]?: true };
    patch[MARQUEUR_PATCH] = true;
    console.error = patch;
  }
}

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
