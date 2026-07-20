"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function SupprimerBouton({
  action,
  confirmMessage,
  redirectTo,
}: {
  action: () => Promise<void>;
  confirmMessage: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onClick() {
    if (!window.confirm(confirmMessage)) return;
    startTransition(async () => {
      try {
        await action();
        toast.success("Supprimé.");
        if (redirectTo) router.push(redirectTo);
      } catch (erreur) {
        toast.error(erreur instanceof Error ? erreur.message : "Suppression impossible.");
      }
    });
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={onClick}
      disabled={pending}
      aria-label="Supprimer"
    >
      <Trash2Icon className="size-4" />
    </Button>
  );
}
