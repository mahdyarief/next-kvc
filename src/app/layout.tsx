import type { Metadata } from "next";
import { Inter, Outfit, Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { TopLoader } from "@/components/ui/top-loader";
import { auth } from "@/lib/auth";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
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
        className={`${inter.variable} ${outfit.variable} ${bricolage.variable} ${jetbrainsMono.variable} text-foreground bg-background selection:bg-primary/20 selection:text-primary-foreground flex min-h-screen flex-col font-sans antialiased`}
        suppressHydrationWarning
      >
        {/* LightDay Gold ambient background mesh — static, zero JS */}
        <div className="bg-mesh-gold pointer-events-none fixed inset-0 -z-50" />
        <Providers session={session}>
          <TopLoader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
