import { Card, CardContent } from "@/components/ui/card";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import Link from "next/link";
import {
  Sparkles,
  TrendingUp,
  Zap,
  ArrowUpRight,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Stat {
  title: string;
  value: number | string;
  icon: React.ElementType;
  description: string;
  color?: string;
  bg?: string;
}

interface QuickAction {
  href: string;
  label: string;
  icon: React.ElementType;
  description: string;
  kbd?: string;
}

interface DashboardViewProps {
  stats: Stat[];
  quickActions: QuickAction[];
  userName?: string;
}

export function DashboardView({ stats, quickActions, userName = "User" }: DashboardViewProps) {

  return (
    <div className="space-y-10 max-w-6xl">
      {/* ── Welcome Hero ────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl border border-primary/10 bg-primary/5 p-8 md:p-10 backdrop-blur-sm">
        {/* Decorative elements */}
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
              <Sparkles className="h-3 w-3" />
              Overview Dashboard
            </div>
            <div className="space-y-1">
              <h1 className="font-outfit text-4xl font-bold tracking-tight md:text-5xl">
                Welcome back,{" "}
                <span className="text-primary">{userName}</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl">
                Here&apos;s a quick overview of what&apos;s happening with your platform today.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-primary/20 bg-background/40 p-4 text-center backdrop-blur-md">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">Status</p>
              <div className="flex items-center gap-2 justify-center">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-bold">System Online</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Grid ──────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-outfit text-xl font-bold tracking-tight">System Performance</h2>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1.5 rounded-xl">
            View Reports <ChevronRight className="h-3 w-3" />
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.title}
                className="relative group overflow-hidden border-border/60 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className={cn(
                      "rounded-xl border p-2.5 transition-all duration-300 group-hover:scale-110",
                      stat.bg ? stat.bg : "bg-primary/10",
                      stat.color ? stat.color : "text-primary",
                      !stat.color && !stat.bg && "border-primary/20"
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-500 border border-emerald-500/20">
                      <TrendingUp className="h-3 w-3" />
                      +4%
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">{stat.title}</p>
                    <p className="font-outfit text-3xl font-bold tracking-tight">
                      {stat.value}
                    </p>
                    <p className="text-muted-foreground/60 text-xs mt-1">
                      {stat.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ── Quick Actions ────────────────────────────── */}
      <section className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          <h2 className="font-outfit text-xl font-bold tracking-tight">Quick Operations</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-5 transition-all duration-300 hover:border-primary/40 hover:bg-primary/[0.02] hover:shadow-xl"
              >
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-all pointer-events-none" />

                <div className="relative space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="rounded-xl bg-primary/10 border border-primary/20 p-2.5 text-primary group-hover:bg-primary/20 transition-all">
                      <Icon className="h-5 w-5" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground/30 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{action.label}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-4">
                  <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Shortcut</span>
                  {action.kbd && (
                    <KbdGroup>
                      <Kbd className="bg-muted shadow-none border-border/60 text-[10px]">⌘</Kbd>
                      <Kbd className="bg-muted shadow-none border-border/60 text-[10px]">{action.kbd}</Kbd>
                    </KbdGroup>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Button({
  className,
  variant,
  size,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "ghost" | "default" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center transition-all disabled:opacity-50",
        variant === "ghost" && "hover:bg-accent text-accent-foreground",
        variant === "outline" && "border border-input hover:bg-accent",
        !variant && "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        size === "sm" && "h-8 px-3 py-1 text-xs font-medium",
        size === "icon" && "h-9 w-9",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
