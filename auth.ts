import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { prisma } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const motDePasse = credentials?.password;
        if (typeof email !== "string" || typeof motDePasse !== "string") return null;

        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin) return null;

        const valide = await bcrypt.compare(motDePasse, admin.motDePasseHash);
        if (!valide) return null;

        return { id: admin.id, email: admin.email, name: admin.nom };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id as string;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
});
