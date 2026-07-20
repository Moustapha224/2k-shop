import { AnnonceBanner } from "@/components/shop/annonce-banner";
import { Footer } from "@/components/shop/footer";
import { Header } from "@/components/shop/header";
import { MobileNav } from "@/components/shop/mobile-nav";
import { PanierProvider } from "@/components/shop/panier-provider";
import { WhatsappButton } from "@/components/shop/whatsapp-button";
import { getParametres, urlWhatsApp } from "@/lib/parametres";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const parametres = await getParametres();
  const whatsappHref = urlWhatsApp(parametres);

  return (
    <PanierProvider>
      {parametres.messageAnnonce && <AnnonceBanner message={parametres.messageAnnonce} />}
      <Header />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer
        whatsapp={parametres.whatsapp}
        whatsappHref={whatsappHref}
        facebookUrl={parametres.facebookUrl}
      />
      <MobileNav />
      <WhatsappButton href={whatsappHref} />
    </PanierProvider>
  );
}
