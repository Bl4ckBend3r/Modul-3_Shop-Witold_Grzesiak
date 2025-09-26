import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 }, 

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        const identifier = String(creds?.identifier ?? "").trim();
        const password = String(creds?.password ?? "");

        if (!identifier || !password) return null;

        const byPhone = identifier.replace(/[^\d]/g, "").length >= 10;
        const where = byPhone
          ? { phone: identifier.replace(/[^\d]/g, "") }
          : { email: identifier.toLowerCase() };

        const user = await prisma.user.findFirst({ where });
        if (!user) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return { id: user.id, email: user.email };
      },
    }),
  ],

  pages: {
    signIn: "/auth/login", // Twój custom UI logowania
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.userId = (user as any).id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).id = token.userId as string | undefined;
      return session;
    },
    // UWAGA: tu NIE dajemy 'authorized' w v4
  },
};
