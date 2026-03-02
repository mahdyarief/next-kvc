import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  Activity,
} from "lucide-react";


interface Stat {
  title: string;
  value: number;
  icon: React.ElementType;
  description: string;
  color: string;
  bg: string;
}

interface QuickAction {
  href: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

interface DashboardViewProps {
  stats: Stat[];
  quickActions: QuickAction[];
}

export function DashboardView({ stats, quickActions }: DashboardViewProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-foreground text-3xl font-black tracking-tight italic sm:text-4xl">
            Dashboard <span className="text-primary opacity-50">/</span> Overview
          </h2>
          <p className="text-muted-foreground text-lg font-medium">
            System health and automation insights
          </p>
        </div>
      </div>


      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="glass-panel shadow-primary/5 hover:shadow-primary/10 group overflow-hidden rounded-[2rem] border-white/40 shadow-2xl transition-all duration-500 hover:-translate-y-1 dark:border-white/5"
            >
              <CardContent className="p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div
                    className={`bg-primary/5 text-primary border-primary/10 group-hover:bg-primary rounded-2xl border p-4 shadow-sm transition-all duration-500 ease-out group-hover:text-white`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground mb-1 text-xs font-black tracking-[0.2em] uppercase">
                      {stat.title}
                    </p>
                    <p className="text-foreground text-4xl font-black tracking-tight italic">
                      {stat.value}
                    </p>
                  </div>
                </div>
                <div className="border-border/50 flex items-center justify-between border-t pt-4">
                  <p className="text-muted-foreground/70 text-sm font-bold">{stat.description}</p>
                  <Activity className="text-primary/30 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions Section */}
      <div className="mt-12">
        <h3 className="text-foreground mb-6 flex items-center gap-3 text-sm font-black tracking-[0.3em] uppercase">
          <div className="bg-primary h-1 w-8 rounded-full" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <Card className="glass-panel shadow-primary/5 hover:shadow-primary/10 group cursor-pointer overflow-hidden rounded-2xl border-white/40 shadow-xl transition-all duration-300 hover:translate-x-2 dark:border-white/5">
                  <CardContent className="flex items-center gap-5 p-5">
                    <div className="bg-primary/5 group-hover:bg-primary border-primary/10 rounded-xl border p-3 shadow-sm transition-all duration-500">
                      <Icon className="text-primary h-6 w-6 transition-colors group-hover:text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-foreground group-hover:text-primary text-base font-black tracking-tight italic transition-colors">
                        {action.label}
                      </p>
                      <p className="text-muted-foreground truncate text-sm font-medium">
                        {action.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>


    </div>
  );
}

