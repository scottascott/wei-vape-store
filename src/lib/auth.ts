import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { env } from "@/lib/env";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  secret: env.AUTH_SECRET,
  providers: [
    Google({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    signIn({ user }) {
      const email = user.email?.trim().toLowerCase();
      if (!email) return false;
      return env.ALLOWED_ADMIN_EMAILS.includes(email);
    },
    jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email;
      }
      return token;
    },
    session({ session, token }) {
      if (token.email) {
        session.user.email = token.email;
      }
      return session;
    },
  },
});
