"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { inscrireNewsletter } from "@/lib/actions/newsletter";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [envoiEnCours, demarrerEnvoi] = useTransition();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const saisie = email;

        demarrerEnvoi(async () => {
          const resultat = await inscrireNewsletter({ email: saisie });

          if (!resultat.ok) {
            toast.error(resultat.error);
            return;
          }

          if (resultat.deja) {
            toast.info("Vous êtes déjà inscrit — à très vite !");
          } else {
            toast.success("Merci ! Vous recevrez nos prochaines nouveautés.");
          }
          setEmail("");
        });
      }}
      className="flex w-full max-w-xs gap-2"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Votre adresse email
      </label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        required
        disabled={envoiEnCours}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Votre email"
        className="flex-1 rounded-lg border border-background/20 bg-background/10 px-3 py-2 text-sm text-background outline-none placeholder:text-background/50 focus:ring-2 focus:ring-gold/60 disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={envoiEnCours}
        className="rounded-lg bg-gold px-4 py-2 text-sm font-bold whitespace-nowrap text-white transition hover:brightness-90 active:scale-95 disabled:pointer-events-none disabled:opacity-60"
      >
        {envoiEnCours ? "Envoi…" : "S'abonner"}
      </button>
    </form>
  );
}
