"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { PanelLeftClose, PanelLeft } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Settings,
  Bell,
  FileText,
  Code,
  User,
} from "lucide-react";

import { useSidebar } from "./sidebar-context";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";

interface NavGroup {
  label: string;
  items: NavItem[];
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  external?: boolean;
  superadminOnly?: boolean;
}

const navGroups: NavGroup[] = [
  {
    label: "Main",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dashboard/profile", label: "My Profile", icon: User },
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
  {
    label: "Developer",
    items: [
      { href: "/docs", label: "API Docs", icon: FileText },
      { href: "/swagger", label: "Swagger UI", icon: Code, external: true },
    ],
  },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapse } = useSidebar();
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  if (!mounted) return null;

  return (
    <TooltipProvider delayDuration={0}>
      <nav className="space-y-4 overflow-x-hidden px-2 py-3">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter(
            (item) => !item.superadminOnly || userRole === "SUPERADMIN"
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.label} className="space-y-0.5">
              {/* Group label — hidden when collapsed */}
              {!isCollapsed && (
                <p className="text-muted-foreground/40 mb-1 px-3 text-[10px] font-semibold tracking-widest uppercase">
                  {group.label}
                </p>
              )}
              {isCollapsed && (
                <div className="border-sidebar-border/30 mx-2 mb-2 border-t" />
              )}

              {visibleItems.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  active={isActive(item.href)}
                  isCollapsed={isCollapsed}
                />
              ))}
            </div>
          );
        })}
      </nav>

      {/* ── Collapse toggle ────────────────────────── */}
      <div className={cn("border-sidebar-border/30 border-t px-2 py-2")}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggleCollapse}
              className={cn(
                "text-muted-foreground hover:text-foreground hover:bg-accent flex h-9 w-full items-center gap-2.5 rounded-lg px-3 text-[11px] font-medium transition-colors",
                isCollapsed && "justify-center px-0"
              )}
            >
              {isCollapsed ? (
                <PanelLeft size={16} />
              ) : (
                <>
                  <PanelLeftClose size={16} />
                  <span className="flex-1 text-left">Collapse</span>
                  <Kbd className="opacity-50">B</Kbd>
                </>
              )}
            </button>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent side="right" sideOffset={10} className="flex items-center gap-2">
              <span>Expand sidebar</span>
              <Kbd>B</Kbd>
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

function NavLink({
  item,
  active,
  isCollapsed,
}: {
  item: NavItem;
  active: boolean;
  isCollapsed: boolean;
}) {
  const Icon = item.icon;

  const linkContent = (
    <Link
      href={item.href}
      target={item.external ? "_blank" : undefined}
      className={cn(
        "group flex items-center rounded-lg text-sm transition-all duration-150",
        isCollapsed ? "h-9 w-full justify-center" : "gap-2.5 px-3 py-2",
        active
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground/70 hover:bg-accent hover:text-foreground font-medium"
      )}
    >
      <Icon
        size={16}
        className={cn(
          "flex-shrink-0 transition-colors",
          active ? "text-primary" : "text-muted-foreground/60 group-hover:text-foreground"
        )}
      />
      {!isCollapsed && (
        <span className="flex-1 truncate">{item.label}</span>
      )}
      {/* Active dot indicator */}
      {active && !isCollapsed && (
        <div className="bg-primary h-1.5 w-1.5 flex-shrink-0 rounded-full" />
      )}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent
          side="right"
          sideOffset={10}
          className="text-[11px] font-medium"
        >
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkContent;
}
