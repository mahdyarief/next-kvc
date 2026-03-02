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

export function MobileNav({ appName = "NextStarter" }: { appName?: string }) {
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
      <SheetContent side="left" className="flex w-[85vw] flex-col p-0 sm:w-[320px]">
        <SheetHeader className="border-b border-slate-100 px-5 py-4 text-left">
          <SheetTitle className="text-xl font-bold text-slate-800">{appName}</SheetTitle>
          <p className="-mt-1 text-[11px] text-slate-400">Application Starter</p>
        </SheetHeader>


        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
          {navGroups.map((group) => {
            const visibleItems = group.items.filter(
              (item) => !item.superadminOnly || userRole === "SUPERADMIN"
            );
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.label} className="mb-1">
                {group.label !== "Main" && (
                  <p className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                    {group.label}
                  </p>
                )}
                <div className="space-y-0.5">
                  {visibleItems.map(({ href, label, icon: Icon, external }) => (
                    <Link
                      key={href}
                      href={href}
                      target={external ? "_blank" : undefined}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${isActive(href)
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        } `}
                    >
                      <Icon
                        size={18}
                        className={`flex-shrink-0 ${isActive(href) ? "text-white" : "text-slate-400"}`}
                      />
                      <span>{label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 bg-slate-50/50 p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
              {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-700">
                {session?.user?.name || "User"}
              </p>
              <p className="truncate text-[11px] text-slate-400">{session?.user?.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex h-8 w-full items-center justify-center gap-2 text-xs"
            onClick={async () => {
              setOpen(false);
              await signOut({ callbackUrl: "/auth/login" });
            }}
          >
            <LogOut size={14} /> Sign Out
          </Button>
          <p className="mt-2 text-center font-mono text-[10px] text-slate-300">v{pkg.version}</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
