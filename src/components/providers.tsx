"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { useSessionTimeout } from "@/features/auth/hooks/use-session-timeout";

function AuthWatcher({ children }: { children: React.ReactNode }) {
  useSessionTimeout();
  return <>{children}</>;
}

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
      <Toaster position="top-right" expand richColors />
      <SessionProvider session={session}>
        <AuthWatcher>{children}</AuthWatcher>
      </SessionProvider>
    </ThemeProvider>
  );
}
