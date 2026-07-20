import { AnnonceBanner } from "@/components/shop/annonce-banner";
import { Footer } from "@/components/shop/footer";
import { Header } from "@/components/shop/header";
import { MobileNav } from "@/components/shop/mobile-nav";
import { PanierProvider } from "@/components/shop/panier-provider";
import { WhatsappButton } from "@/components/shop/whatsapp-button";
import { getParametres } from "@/lib/parametres";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const { whatsapp, messageAnnonce } = await getParametres();

  return (
    <PanierProvider>
      {messageAnnonce && <AnnonceBanner message={messageAnnonce} />}
      <Header />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer whatsapp={whatsapp} />
      <MobileNav />
      <WhatsappButton whatsapp={whatsapp} />
    </PanierProvider>
  );
}
