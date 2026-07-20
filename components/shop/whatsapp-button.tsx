import { MessageCircleIcon } from "lucide-react";

/**
 * Bouton WhatsApp flottant. On accepte l'URL complete pour supporter les liens
 * wa.me/message/XXX (message pre-rempli cote WhatsApp Business).
 */
export function WhatsappButton({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter la boutique sur WhatsApp"
      className="fixed right-4 bottom-20 z-40 flex size-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg ring-2 ring-white/40 transition-all duration-200 hover:scale-110 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366] md:bottom-6 dark:ring-white/10"
    >
      <MessageCircleIcon className="size-6" fill="currentColor" />
      <span className="pointer-events-none absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/50" aria-hidden />
    </a>
  );
}
