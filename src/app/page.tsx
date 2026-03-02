import Link from "next/link";
import {
  ArrowRight,
  Github,
  Zap,
  Shield,
  Globe,
  MessageSquare,
  Clock,
  Code,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import fs from "fs";
import path from "path";
import { Logo } from "@/components/brand/logo";

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
  } catch (error) {
    console.error("Failed to read package.json", error);
  }

  return (
    <div className="selection:bg-primary/30 selection:text-primary-foreground flex min-h-screen flex-col overflow-hidden">
      {/* Navbar - Floating Glass */}
      <header className="fixed inset-x-6 top-6 z-50 transition-all duration-300">
        <div className="glass shadow-primary/5 mx-auto flex h-20 max-w-7xl items-center justify-between rounded-[2rem] border-white/40 px-6 shadow-2xl md:px-10 dark:border-white/5 dark:shadow-black/40">
          <Link href="/" className="transition-opacity hover:opacity-90">
            <Logo size={42} showText={true} />
          </Link>

          <nav className="hidden items-center gap-10 lg:flex">
            <Link
              href="#features"
              className="text-muted-foreground hover:text-primary text-sm font-bold transition-all"
            >
              Features
            </Link>
            <Link
              href="/docs"
              className="text-muted-foreground hover:text-primary text-sm font-bold transition-all"
            >
              API & Docs
            </Link>
            <Link
              href="https://github.com/kelasvibecoding/next-kvc"
              className="text-muted-foreground hover:text-primary flex items-center gap-2 text-sm font-bold transition-all"
            >
              <Github className="h-4 w-4" /> GitHub
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="hidden sm:block">
              <Button variant="ghost" className="hover:bg-primary/5 text-sm font-bold">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="from-primary shadow-primary/20 hover:shadow-primary/40 h-12 rounded-2xl bg-gradient-to-r to-blue-600 px-8 text-sm font-black shadow-xl transition-all hover:-translate-y-0.5">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative flex min-h-[95vh] items-center overflow-hidden pt-44 pb-32 lg:pt-60 lg:pb-48">
          {/* Animated Premium Background Components */}
          <div className="pointer-events-none absolute top-0 left-1/2 h-[1000px] w-full -translate-x-1/2 overflow-hidden">
            <div className="from-primary/10 animate-pulse-glow absolute top-[-200px] left-1/2 h-[1200px] w-[1200px] -translate-x-1/2 rounded-full bg-gradient-to-b via-blue-500/5 to-transparent blur-[160px]" />
            <div
              className="animate-float absolute top-[20%] left-[10%] h-[600px] w-[600px] rounded-full bg-blue-400/10 blur-[120px]"
              style={{ animationDuration: "15s" }}
            />
            <div
              className="bg-primary/10 animate-float absolute top-[40%] right-[5%] h-[500px] w-[500px] rounded-full blur-[100px]"
              style={{ animationDuration: "12s", animationDelay: "2s" }}
            />
          </div>

          <div className="relative z-10 container mx-auto px-6 text-center">
            <div className="glass-panel text-primary animate-in fade-in slide-in-from-bottom-5 border-primary/10 mb-12 inline-flex items-center rounded-2xl px-5 py-2 text-sm font-bold duration-1000">
              <span className="relative mr-3 flex h-2 w-2">
                <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
                <span className="bg-primary relative inline-flex h-2 w-2 rounded-full"></span>
              </span>
              Modern Stack {version} is live
              <ChevronRight className="ml-1.5 h-4 w-4 opacity-60" />
            </div>

            <h1 className="animate-in fade-in slide-in-from-bottom-10 mx-auto mb-10 max-w-6xl text-6xl leading-[0.95] font-black tracking-tight duration-1000 sm:text-7xl md:text-8xl lg:text-9xl">
              Build your <span className="text-primary italic">Dreams</span> <br />
              <span className="text-gradient">Faster than Ever.</span>
            </h1>

            <p className="text-muted-foreground animate-in fade-in slide-in-from-bottom-10 mx-auto mb-16 max-w-[46rem] text-xl leading-relaxed font-medium delay-200 duration-1000 sm:text-2xl">
              A premium, production-ready starter template featuring Next.js 15,
              Prisma, Auth.js, and a beautifully crafted Dashboard shell.
            </p>

            <div className="animate-in fade-in slide-in-from-bottom-10 flex flex-col items-center justify-center gap-6 delay-300 duration-1000 sm:flex-row">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="shadow-primary/30 hover:shadow-primary/50 from-primary group h-16 w-full rounded-[1.5rem] bg-gradient-to-r to-blue-600 px-10 text-xl font-black shadow-2xl transition-all hover:-translate-y-1"
                >
                  Enter Dashboard
                  <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1.5" />
                </Button>
              </Link>
            </div>

          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative py-40">
          <div className="relative z-10 container mx-auto px-6">
            <div className="mb-32 text-center">
              <h2 className="text-foreground mb-8 text-4xl leading-tight font-black tracking-tight sm:text-6xl">
                Mastering Connectivity
              </h2>
              <p className="text-muted-foreground mx-auto max-w-3xl text-xl font-medium">
                Precision-engineered tools to bridge your business logic with the world&apos;s most
                popular messaging platform.
              </p>
            </div>

            <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<Shield className="h-7 w-7 text-blue-600" />}
                title="Secure Auth"
                description="Robust authentication system powered by Auth.js with support for multiple providers."
              />
              <FeatureCard
                icon={<Zap className="text-primary h-7 w-7" />}
                title="Dashboard Shell"
                description="A beautifully crafted, responsive dashboard shell with sidebar navigation and profile management."
              />
              <FeatureCard
                icon={<MessageSquare className="h-7 w-7 text-blue-500" />}
                title="Notifications"
                description="Real-time notification system to keep your users updated on important system events."
              />
              <FeatureCard
                icon={<Clock className="h-7 w-7 text-indigo-500" />}
                title="Prisma Ready"
                description="Pre-configured Prisma ORM with SQLite (fallback) for effortless database management and migrations."
              />
              <FeatureCard
                icon={<Globe className="h-7 w-7 text-sky-500" />}
                title="Modern Stack"
                description="Built with the latest technologies: Next.js 15 (App Router), Tailwind 4, and Shadcn UI."
              />
              <FeatureCard
                icon={<Code className="h-7 w-7 text-blue-400" />}
                title="Type-Safe Core"
                description="Fully written in TypeScript, providing a superior developer experience and fewer bugs."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-sidebar-border bg-background relative z-10 border-t pt-24 pb-12">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-20 flex flex-col items-start justify-between gap-12 md:flex-row">
            <div className="space-y-6">
              <Logo size={48} showText={true} />
              <p className="text-muted-foreground max-w-[280px] text-lg leading-relaxed font-medium">
                The modern, flexible foundation for your next web application.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-16 sm:grid-cols-3 md:gap-24">
              <div className="space-y-6">
                <h4 className="text-foreground text-sm font-black tracking-[0.2em] uppercase">
                  Product
                </h4>
                <ul className="text-muted-foreground space-y-4 text-base font-bold">
                  <li>
                    <Link href="#features" className="hover:text-primary transition-colors">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard" className="hover:text-primary transition-colors">
                      Dashboard
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="text-foreground text-sm font-black tracking-[0.2em] uppercase">
                  Legal
                </h4>
                <ul className="text-muted-foreground space-y-4 text-base font-bold">
                  <li>
                    <Link href="/privacy" className="hover:text-primary transition-colors">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:text-primary transition-colors">
                      Terms
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-sidebar-border flex flex-col items-center justify-between gap-6 border-t pt-10 sm:flex-row">
            <p className="text-muted-foreground text-base font-bold">
              © {new Date().getFullYear()} Next.js Starter. Built with ❤️.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group glass-panel hover-lift shadow-primary/5 relative overflow-hidden rounded-[2.5rem] border-white/20 p-10 shadow-2xl dark:border-white/5">
      <div className="from-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="bg-primary/5 text-primary border-primary/10 group-hover:bg-primary mb-8 inline-flex rounded-[1.5rem] border p-5 shadow-sm transition-all duration-500 ease-out group-hover:scale-110 group-hover:text-white">
          {icon}
        </div>
        <h3 className="text-foreground mb-4 text-2xl font-black tracking-tight italic">{title}</h3>
        <p className="text-muted-foreground text-lg leading-relaxed font-medium">{description}</p>
      </div>
    </div>
  );
}
