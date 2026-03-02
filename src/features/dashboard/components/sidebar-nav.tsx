"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChevronDown, PanelLeftClose, PanelLeft } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Settings,
  Bell,
  FileText,
  Code,
} from "lucide-react";

import { useSidebar } from "./sidebar-context";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    items: [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }],
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
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleGroup = (label: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  if (!mounted) return null;

  return (
    <TooltipProvider delayDuration={0}>
      <nav className="custom-scrollbar flex-1 space-y-6 overflow-x-hidden overflow-y-auto px-3 py-4">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter(
            (item) => !item.superadminOnly || userRole === "SUPERADMIN"
          );
          if (visibleItems.length === 0) return null;

          const isGroupCollapsed = collapsedGroups[group.label] ?? false;

          return (
            <div key={group.label} className="space-y-1">
              {!isCollapsed && (
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="text-muted-foreground/40 hover:text-primary group/header flex w-full items-center justify-between px-3 py-2 text-[10px] font-black tracking-[0.2em] uppercase transition-colors"
                >
                  {group.label}
                  <ChevronDown
                    size={12}
                    className={`transition-all duration-300 group-hover/header:translate-y-0.5 ${isGroupCollapsed ? "-rotate-90" : ""}`}
                  />
                </button>
              )}

              {isCollapsed && (
                <div className="border-sidebar-border/30 mx-2 mb-4 border-t opacity-50" />
              )}

              {(!isGroupCollapsed || isCollapsed) && (
                <div className="space-y-1">
                  {visibleItems.map((item) => (
                    <NavLink
                      key={item.href}
                      item={item}
                      active={isActive(item.href)}
                      isCollapsed={isCollapsed}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div
        className={`border-sidebar-border/30 bg-sidebar/10 border-t p-3 transition-all duration-500 ${isCollapsed ? "px-2" : "px-4"}`}
      >
        <button
          onClick={toggleCollapse}
          className="text-muted-foreground hover:text-primary hover:bg-primary/5 group/collapse hover:border-primary/10 flex h-11 w-full items-center justify-center gap-3 overflow-hidden rounded-xl border border-transparent text-[11px] font-black tracking-widest uppercase transition-all duration-300"
        >
          <div className="relative">
            {isCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
            <div className="bg-primary/20 absolute inset-0 opacity-0 blur-md transition-opacity group-hover/collapse:opacity-100" />
          </div>
          {!isCollapsed && <span>Minimize View</span>}
        </button>
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
      className={`group relative flex items-center rounded-2xl text-sm font-bold transition-all duration-300 ${isCollapsed ? "mx-auto h-12 w-12 justify-center" : "gap-3.5 px-4 py-3"} ${active
        ? "text-primary bg-primary/5 border-primary/10 border shadow-[0_0_20px_rgba(var(--primary-rgb),0.05)]"
        : "text-muted-foreground/70 hover:bg-primary/[0.03] hover:text-foreground border border-transparent"
        } `}
    >
      <div className="relative">
        <Icon
          size={isCollapsed ? 22 : 19}
          className={`flex-shrink-0 transition-all duration-300 ${active ? "text-primary scale-110 drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.4)]" : "text-muted-foreground/60 group-hover:text-primary group-hover:scale-110"}`}
        />
      </div>

      {!isCollapsed && <span className="flex-1 truncate tracking-tight">{item.label}</span>}

      {active && !isCollapsed && (
        <div className="bg-primary h-1.5 w-1.5 animate-pulse rounded-full shadow-[0_0_8px_var(--primary)]" />
      )}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent
          side="right"
          sideOffset={12}
          className="bg-foreground text-background rounded-lg border-none px-3 py-1.5 text-[10px] font-black tracking-widest uppercase shadow-xl"
        >
          <p>{item.label}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkContent;
}
