import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

      if (isOnDashboard) {
        if (isLoggedIn) {
          // Prevent CUSTOMER from accessing dashboard
          if ((auth.user as { role?: string }).role === "CUSTOMER") {
            return Response.redirect(new URL("/", nextUrl));
          }
          return true;
        }
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn && nextUrl.pathname === "/auth/login") {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: unknown }).role = token.role;
      }
      return session;
    },
  },
  providers: [], // Configured in auth.ts
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
} satisfies NextAuthConfig;
