"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Bouton de bascule clair / sombre. On resout le theme du cote client uniquement
 * pour eviter un mismatch d'hydratation : tant que `mounted` est faux, le bouton
 * est rendu avec les deux icones cachees (structure inchangee, contenu vide).
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const estSombre = mounted && resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={estSombre ? "Passer en mode clair" : "Passer en mode sombre"}
      onClick={() => setTheme(estSombre ? "light" : "dark")}
      className={className}
    >
      <SunIcon
        className={`size-5 transition-all duration-300 ${
          mounted && estSombre ? "-rotate-90 scale-0" : "rotate-0 scale-100"
        }`}
      />
      <MoonIcon
        className={`absolute size-5 transition-all duration-300 ${
          mounted && estSombre ? "rotate-0 scale-100" : "rotate-90 scale-0"
        }`}
      />
    </Button>
  );
}
