import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { env } from "@/lib/env";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  secret: env.AUTH_SECRET,
  // No AUTH_URL is configured — trust the incoming Host header to build
  // callback URLs instead, since the deployed domain isn't known ahead of
  // time (Vercel preview URLs, self-hosted with a reverse proxy, etc.).
  trustHost: true,
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
