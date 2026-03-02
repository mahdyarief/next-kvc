import { Card, CardContent } from "@/components/ui/card";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import Link from "next/link";
import { TrendingUp, ArrowRight } from "lucide-react";
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
}

export function DashboardView({ stats, quickActions }: DashboardViewProps) {
  return (
    <div className="space-y-8 max-w-5xl">
      {/* ── Page Header ─────────────────────────────── */}
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Overview
        </h1>
        <p className="text-muted-foreground text-sm">
          System health and key metrics at a glance.
        </p>
      </div>

      {/* ── Stats Grid ──────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="surface-raised group overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              <CardContent className="p-5">
                {/* Value row */}
                <div className="mb-3 flex items-start justify-between">
                  <p className="font-heading text-3xl font-bold tracking-tight">
                    {stat.value}
                  </p>
                  <div className={cn(
                    "rounded-lg border p-2",
                    stat.bg ? stat.bg : "bg-primary/8",
                    stat.color ? stat.color : "text-primary",
                    !stat.color && !stat.bg && "border-primary/15"
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                {/* Label + trend */}
                <div className="space-y-0.5">
                  <p className="text-foreground text-sm font-medium">{stat.title}</p>
                  <p className="text-muted-foreground flex items-center gap-1 text-xs">
                    <TrendingUp className="h-3 w-3 opacity-50" />
                    {stat.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── Quick Actions ────────────────────────────── */}
      <div className="animate-fade-up" style={{ animationDelay: "100ms" }}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-sm font-semibold tracking-tight">
            Quick Actions
          </h2>
          <p className="text-muted-foreground text-xs font-medium">
            Shortcuts enabled
          </p>
        </div>

        <div className="surface overflow-hidden rounded-xl divide-y divide-border/60">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-accent/50"
              >
                <div className="bg-primary/8 text-primary border-primary/15 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-sm font-semibold group-hover:text-primary transition-colors">{action.label}</p>
                  <p className="text-muted-foreground truncate text-xs">{action.description}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {action.kbd && (
                    <KbdGroup>
                      <Kbd className="bg-muted shadow-none border-border/40">⌘</Kbd>
                      <Kbd className="bg-muted shadow-none border-border/40">{action.kbd}</Kbd>
                    </KbdGroup>
                  )}
                  <ArrowRight className="text-primary h-4 w-4 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
