import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";

import { LoginForm } from "@/components/admin/login-form";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = { title: "Connexion admin" };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/20 px-4">
      <div className="w-full max-w-sm rounded-xl border bg-background p-6 shadow-sm">
        <div className="mb-6 flex flex-col items-center gap-2">
          <Image
            src="/logo.jpeg"
            alt={`Logo ${SITE.nom}`}
            width={48}
            height={48}
            className="size-12 rounded-lg object-contain"
          />
          <h1 className="text-lg font-semibold tracking-tight">Administration</h1>
          <p className="text-sm text-muted-foreground">{SITE.nom}</p>
        </div>
        {/* LoginForm lit `callbackUrl` via useSearchParams : sans frontiere
            Suspense, Next refuse de prerendre cette page statiquement. */}
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
