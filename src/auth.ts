import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {prisma} from "@/lib/prisma";
import { compare } from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or phone", type: "text" },
        password:   { label: "Password", type: "password" },
      },
      authorize: async (creds) => {
        const id = creds?.identifier?.trim();
        const pwd = creds?.password ?? "";
        if (!id || !pwd) return null;

        const user = await prisma.user.findFirst({
          where: { OR: [{ email: id }, { phone: id }] },
        });
        if (!user) return null;

        const ok = await compare(pwd, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: [user.firstName, user.lastName].filter(Boolean).join(" "),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.userId = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.userId;
      }
      return session;
    },
  },
});

export const { GET, POST } = handlers;
