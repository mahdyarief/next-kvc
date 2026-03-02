"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: import("next-auth").Session | null;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <SessionProvider session={session}>{children}</SessionProvider>
    </ThemeProvider>
  );
}
