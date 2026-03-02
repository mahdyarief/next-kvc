import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { TopLoader } from "@/components/ui/top-loader";
import { auth } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next.js Starter | Premium Template",
  description: "Advanced Next.js Dashboard Starter Template with Auth and Notifications",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} text-foreground bg-background selection:bg-primary/30 selection:text-primary-foreground flex min-h-screen flex-col font-sans antialiased`}
        suppressHydrationWarning
      >
        {/* Global ambient background glow for premium feel */}
        <div className="from-primary/5 via-background to-background dark:from-primary/10 dark:via-background dark:to-background pointer-events-none fixed inset-0 -z-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]" />
        <Providers session={session}>
          <TopLoader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
