"use client";

import { SidebarNav } from "./sidebar-nav";
import { useSidebar } from "./sidebar-context";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

interface SidebarShellProps {
  appName: string;
  userName?: string | null;
  userEmail?: string | null;
  version: string;
}

export function SidebarShell({ userName, userEmail, version }: SidebarShellProps) {
  const { isCollapsed } = useSidebar();

  return (
    <aside
      className={cn(
        "bg-sidebar/95 border-sidebar-border sticky top-0 left-0 z-20 hidden h-full flex-col border-r backdrop-blur-sm transition-all duration-300 ease-in-out md:flex",
        isCollapsed ? "w-[64px]" : "w-[240px]"
      )}
    >
      {/* ── Brand ───────────────────────────────────── */}
      <div
        className={cn(
          "flex h-14 items-center border-b border-sidebar-border/60 transition-all duration-300",
          isCollapsed ? "justify-center px-3" : "px-5"
        )}
      >
        <Logo size={isCollapsed ? 32 : 28} showText={!isCollapsed} />
      </div>

      {/* ── Navigation ──────────────────────────────── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <SidebarNav />
      </div>

      {/* ── User Footer ─────────────────────────────── */}
      <div
        className={cn(
          "border-t border-sidebar-border/60 transition-all duration-300",
          isCollapsed ? "p-2" : "p-3"
        )}
      >
        {isCollapsed ? (
          /* Collapsed: avatar + sign out stacked */
          <div className="flex flex-col items-center gap-2">
            <div className="bg-primary/10 text-primary border-primary/20 flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-semibold">
              {userName?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              className="text-muted-foreground hover:text-destructive flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          /* Expanded: user info + sign out */
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="bg-primary/10 text-primary border-primary/20 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border text-xs font-semibold">
                {userName?.charAt(0)?.toUpperCase() ?? "U"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-heading truncate text-[13px] font-semibold leading-none">
                  {userName ?? "User"}
                </p>
                <p className="text-muted-foreground truncate text-[11px] leading-none opacity-70 mt-0.5">
                  {userEmail}
                </p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
                className="text-muted-foreground hover:text-destructive ml-auto flex-shrink-0 rounded-md p-1.5 transition-colors"
                title="Sign Out"
              >
                <LogOut size={14} />
              </button>
            </div>
            <div className="text-muted-foreground/30 text-center font-mono text-[9px] tracking-widest">
              v{version}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
