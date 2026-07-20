import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { LogoutButton } from "@/components/admin/logout-button";
import { SITE } from "@/lib/constants";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="min-h-svh bg-muted/20">
      <header className="flex items-center justify-between border-b bg-background px-4 py-3">
        <div>
          <p className="text-sm font-semibold">{SITE.nom} — Administration</p>
          <p className="text-xs text-muted-foreground">{session.user.email}</p>
        </div>
        <LogoutButton />
      </header>
      <AdminNav />
      <main className="mx-auto w-full max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
