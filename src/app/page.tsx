import Link from "next/link";
import {
  ArrowRight,
  Github,
  Zap,
  Shield,
  Globe,
  Bell,
  Code,
  Sparkles,
  Database,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Badge } from "@/components/ui/badge";
import fs from "fs";
import path from "path";
import { Logo } from "@/components/brand/logo";
import { SiteFooter } from "@/components/brand/site-footer";

export const metadata = {
  title: "Next.js Starter | Premium Application Template",
  description:
    "A powerful, modern application template built with Next.js 15, Prisma, and Tailwind 4. Ready for your next big project.",
  openGraph: {
    title: "Next.js Starter | Premium Application Template",
    description:
      "Full-stack Next.js Starter with Auth, Notifications, and Dashboard Shell.",
    type: "website",
  },
};

export default function Home() {
  const packagePath = path.join(process.cwd(), "package.json");
  let version = "v1.5.0";
  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    version = `v${packageJson.version}`;
  } catch {
    // fallback to default
  }

  return (
    <div className="selection:bg-primary/20 selection:text-primary-foreground flex min-h-screen flex-col overflow-hidden">

      {/* ── Floating Navbar ───────────────────────────── */}
      <header className="fixed inset-x-4 top-5 z-50 sm:inset-x-8 sm:top-6">
        <div className="glass mx-auto flex h-14 max-w-6xl items-center justify-between rounded-xl px-4 sm:px-6">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <Logo size={36} showText={true} />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            <Link
              href="#features"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Features
            </Link>
            <Link
              href="/docs"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Docs
            </Link>
            <Link
              href="https://github.com/kelasvibecoding/next-kvc"
              className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm font-medium transition-colors"
            >
              <Github className="h-4 w-4" />
              GitHub
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="text-sm font-medium">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 rounded-lg px-4 text-sm font-semibold shadow-sm transition-all"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero Section ─────────────────────────────── */}
        <section className="relative flex min-h-[92vh] items-center pt-32 pb-24 lg:pt-44 lg:pb-36">

          {/* Decorative gold line — top */}
          <div className="from-primary/0 via-primary/30 to-primary/0 pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r" />

          <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
            {/* Grid layout — content left, decorative right */}
            <div className="grid items-center gap-16 lg:grid-cols-[1fr_auto]">

              {/* Left — Editorial text block */}
              <div className="max-w-2xl">
                {/* Version badge */}
                <div className="mb-8 inline-flex items-center gap-2.5 animate-fade-up" style={{ animationDelay: "0ms" }}>
                  <Badge
                    variant="outline"
                    className="border-primary/30 text-primary bg-primary/5 gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold"
                  >
                    <span className="bg-primary h-1.5 w-1.5 rounded-full" />
                    {version} — Now live
                  </Badge>
                </div>

                {/* Headline */}
                <h1
                  className="font-heading mb-6 text-[clamp(2.8rem,7vw,5.5rem)] font-bold leading-[1.05] tracking-tight animate-fade-up"
                  style={{ animationDelay: "60ms" }}
                >
                  Build your next{" "}
                  <span className="text-gradient">big thing</span>
                  <br />
                  <span className="text-muted-foreground font-light">faster than ever.</span>
                </h1>

                {/* Sub text */}
                <p
                  className="text-muted-foreground mb-10 max-w-xl text-lg leading-relaxed animate-fade-up"
                  style={{ animationDelay: "120ms" }}
                >
                  A premium, production-ready starter featuring{" "}
                  <span className="text-foreground font-medium">Next.js 15</span>,{" "}
                  <span className="text-foreground font-medium">Prisma ORM</span>,{" "}
                  <span className="text-foreground font-medium">Auth.js v5</span>, and a
                  fully-crafted dashboard shell. Skip the boilerplate.
                </p>

                {/* CTA buttons */}
                <div
                  className="flex flex-wrap items-center gap-3 animate-fade-up"
                  style={{ animationDelay: "180ms" }}
                >
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground group h-11 rounded-lg px-6 font-semibold shadow-sm transition-all"
                    >
                      Enter Dashboard
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </Link>
                  <Link href="https://github.com/kelasvibecoding/next-kvc">
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-11 rounded-lg px-6 font-semibold transition-all"
                    >
                      <Github className="mr-2 h-4 w-4" />
                      View Source
                    </Button>
                  </Link>
                </div>

                {/* Keyboard shortcut hint — uses Kbd component */}
                <div
                  className="mt-8 flex items-center gap-2 animate-fade-up"
                  style={{ animationDelay: "240ms" }}
                >
                  <span className="text-muted-foreground text-xs">Quick start →</span>
                  <KbdGroup>
                    <Kbd>npx</Kbd>
                    <Kbd>create-next-app</Kbd>
                  </KbdGroup>
                </div>
              </div>

              {/* Right — Decorative tech stack card */}
              <div className="hidden lg:block animate-fade-up" style={{ animationDelay: "300ms" }}>
                <TechCard version={version} />
              </div>
            </div>
          </div>
        </section>

        {/* ── Features Section ── Bento Grid ───────────── */}
        <section id="features" className="relative py-32">
          {/* Section separator */}
          <div className="from-border/0 via-border to-border/0 pointer-events-none absolute top-0 left-8 right-8 h-px bg-gradient-to-r" />

          <div className="mx-auto max-w-6xl px-6">
            {/* Section header — left aligned */}
            <div className="mb-16 max-w-xl">
              <p className="text-primary mb-3 text-xs font-semibold tracking-widest uppercase">
                What&apos;s included
              </p>
              <h2 className="font-heading mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
                Everything you need.{" "}
                <span className="text-muted-foreground font-light">Nothing you don&apos;t.</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Production-grade infrastructure baked in from day one.
              </p>
            </div>

            {/* Bento grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {/* Large hero feature — Auth */}
              <FeatureCard
                className="md:col-span-2 md:row-span-2"
                icon={<Shield className="h-6 w-6" />}
                tag="Security"
                title="Secure Auth"
                description="Full authentication system powered by Auth.js v5 with credential-based login, session management, and role-based access control. Sign in, sign out, and protect routes with ease."
                large
              />
              {/* Medium feature */}
              <FeatureCard
                className="md:col-span-1"
                icon={<LayoutDashboard className="h-5 w-5" />}
                tag="UI"
                title="Dashboard Shell"
                description="Responsive sidebar navigation with collapsible mode, mobile drawer, and profile management."
              />
              <FeatureCard
                className="md:col-span-1"
                icon={<Bell className="h-5 w-5" />}
                tag="Realtime"
                title="Notifications"
                description="Real-time push notifications via Socket.IO with toast alerts and an unread badge system."
              />
              <FeatureCard
                className="md:col-span-1"
                icon={<Database className="h-5 w-5" />}
                tag="Database"
                title="Prisma Ready"
                description="Modular Prisma schema (prisma/schema/*.prisma) with SQLite fallback and migration support."
              />
              <FeatureCard
                className="md:col-span-1"
                icon={<Globe className="h-5 w-5" />}
                tag="Stack"
                title="Modern Stack"
                description="Next.js 15 App Router, Tailwind v4, Shadcn UI, and full TypeScript throughout."
              />
              <FeatureCard
                className="md:col-span-1"
                icon={<Zap className="h-5 w-5" />}
                tag="DX"
                title="API Layer"
                description="Standardized API routes with withErrorHandler, api.success(), and typed error handling."
              />
              <FeatureCard
                className="md:col-span-1"
                icon={<Code className="h-5 w-5" />}
                tag="Core"
                title="Type-Safe"
                description="Fully TypeScript. Zod schemas co-located with forms. No any. No guesswork."
              />
            </div>

            {/* Keyboard shortcuts callout */}
            <div className="surface mt-8 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="text-primary h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="font-heading text-sm font-semibold">Developer shortcuts</p>
                  <p className="text-muted-foreground text-xs">Quick access everywhere in the dashboard</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Toggle sidebar</span>
                  <KbdGroup>
                    <Kbd>⌘</Kbd>
                    <Kbd>B</Kbd>
                  </KbdGroup>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Notifications</span>
                  <KbdGroup>
                    <Kbd>⌘</Kbd>
                    <Kbd>N</Kbd>
                  </KbdGroup>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Settings</span>
                  <KbdGroup>
                    <Kbd>⌘</Kbd>
                    <Kbd>,</Kbd>
                  </KbdGroup>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

/* ── Internal components ─────────────────────────────── */

function TechCard({ version }: { version: string }) {
  const stack = [
    { label: "Next.js", version: "15", color: "text-foreground" },
    { label: "Prisma", version: "6", color: "text-primary" },
    { label: "Tailwind", version: "4", color: "text-blue-600 dark:text-blue-400" },
    { label: "Auth.js", version: "v5", color: "text-foreground" },
    { label: "TypeScript", version: "5", color: "text-primary" },
    { label: "Shadcn UI", version: "—", color: "text-foreground" },
  ];

  return (
    <div className="surface-raised w-64 overflow-hidden rounded-2xl">
      {/* Header bar */}
      <div className="border-b border-border/60 bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
          </div>
          <span className="font-mono text-[10px] text-muted-foreground ml-2">
            package.json
          </span>
        </div>
      </div>
      {/* Stack list */}
      <div className="divide-y divide-border/40 px-4">
        {stack.map((item) => (
          <div key={item.label} className="flex items-center justify-between py-2.5">
            <span className={`font-mono text-xs font-medium ${item.color}`}>
              {item.label}
            </span>
            <Kbd>{item.version}</Kbd>
          </div>
        ))}
      </div>
      {/* Footer */}
      <div className="border-t border-border/60 bg-muted/20 px-4 py-2.5 flex items-center justify-between">
        <span className="font-mono text-[10px] text-muted-foreground">starter</span>
        <Badge variant="outline" className="text-primary border-primary/30 text-[9px] px-1.5 py-0.5 h-auto">
          {version}
        </Badge>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  tag,
  title,
  description,
  large,
  className,
}: {
  icon: React.ReactNode;
  tag: string;
  title: string;
  description: string;
  large?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`surface group relative overflow-hidden p-6 transition-all duration-200 hover:shadow-md ${large ? "flex flex-col justify-between" : ""} ${className ?? ""}`}
    >
      {/* Subtle gold hover accent */}
      <div className="from-primary/0 to-primary/[0.04] pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10">
        {/* Icon + tag row */}
        <div className="mb-4 flex items-center justify-between">
          <div className="bg-primary/8 text-primary border-primary/15 inline-flex rounded-lg border p-2.5">
            {icon}
          </div>
          <span className="text-muted-foreground/60 font-mono text-[10px] font-semibold tracking-widest uppercase">
            {tag}
          </span>
        </div>

        <h3 className={`font-heading text-foreground font-semibold tracking-tight ${large ? "mb-3 text-2xl" : "mb-2 text-base"}`}>
          {title}
        </h3>
        <p className={`text-muted-foreground leading-relaxed ${large ? "text-base" : "text-sm"}`}>
          {description}
        </p>
      </div>
    </div>
  );
}
