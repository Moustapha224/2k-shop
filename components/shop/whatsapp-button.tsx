import { MessageCircleIcon } from "lucide-react";

export function WhatsappButton({ whatsapp }: { whatsapp: string }) {
  return (
    <a
      href={`https://wa.me/${whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter la boutique sur WhatsApp"
      className="fixed right-4 bottom-20 z-40 flex size-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 md:bottom-6"
    >
      <MessageCircleIcon className="size-6" fill="currentColor" />
    </a>
  );
}
