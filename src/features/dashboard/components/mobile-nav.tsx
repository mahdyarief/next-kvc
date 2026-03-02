"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Bell,
  FileText,
  Code,
  Menu,
} from "lucide-react";

import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import pkg from "../../../../package.json";
import { cn } from "@/lib/utils";

interface NavGroup {
  label: string;
  items: {
    href: string;
    label: string;
    icon: React.ElementType;
    external?: boolean;
    superadminOnly?: boolean;
  }[];
}

const navGroups: NavGroup[] = [
  {
    label: "Main",
    items: [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Developer",
    items: [
      { href: "/docs", label: "API Docs", icon: FileText },
      { href: "/swagger", label: "Swagger UI", icon: Code, external: true },
    ],
  },
  {
    label: "Administration",
    items: [
      { href: "/dashboard/users", label: "Users", icon: Users },
      { href: "/dashboard/settings", label: "Settings", icon: Settings },
      {
        href: "/dashboard/notifications",
        label: "Notifications",
        icon: Bell,
        superadminOnly: true,
      },
    ],
  },
];

export function MobileNav({ appName = "NextKVC" }: { appName?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userRole = session?.user?.role;

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="md:hidden">
        <Menu className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-[85vw] flex-col p-0 sm:w-[320px] glass-panel border-r-border/30">
        <SheetHeader className="border-b border-border/40 px-5 py-6 text-left">
          <SheetTitle className="font-heading text-xl font-bold tracking-tight">{appName}</SheetTitle>
          <p className="text-muted-foreground/60 -mt-1 text-[11px] font-medium uppercase tracking-wider">Application Starter</p>
        </SheetHeader>


        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
          {navGroups.map((group) => {
            const visibleItems = group.items.filter(
              (item) => !item.superadminOnly || userRole === "SUPERADMIN"
            );
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.label} className="mb-6">
                {group.label !== "Main" && (
                  <p className="text-muted-foreground/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest">
                    {group.label}
                  </p>
                )}
                <div className="space-y-1">
                  {visibleItems.map(({ href, label, icon: Icon, external }) => (
                    <Link
                      key={href}
                      href={href}
                      target={external ? "_blank" : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        isActive(href)
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon
                        size={18}
                        className={cn("flex-shrink-0", isActive(href) ? "text-primary-foreground" : "text-muted-foreground/50")}
                      />
                      <span>{label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-border/40 bg-muted/30 p-4 backdrop-blur-md">
          <div className="mb-4 flex items-center gap-3">
            <div className="bg-primary/10 text-primary border-primary/20 font-heading flex h-9 w-9 items-center justify-center rounded-xl border text-sm font-bold">
              {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-heading text-[13px] font-semibold text-foreground leading-none">
                {session?.user?.name || "User"}
              </p>
              <p className="text-muted-foreground/60 mt-1 truncate text-[11px] font-medium leading-none">{session?.user?.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex h-9 w-full items-center justify-center gap-2 rounded-xl border-border/40 bg-background/50 text-xs font-semibold shadow-sm transition-all hover:bg-accent"
            onClick={async () => {
              setOpen(false);
              await signOut({ callbackUrl: "/auth/login" });
            }}
          >
            <LogOut size={14} /> Sign Out
          </Button>
          <div className="text-muted-foreground/20 mt-4 text-center font-mono text-[9px] font-medium tracking-[0.2em] uppercase">v{pkg.version}</div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
