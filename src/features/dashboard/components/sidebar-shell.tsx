"use client";

import { SidebarNav } from "./sidebar-nav";
import { useSidebar } from "./sidebar-context";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Logo } from "@/components/brand/logo";

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
      className={`bg-sidebar/80 border-sidebar-border sticky top-0 left-0 z-20 hidden h-full flex-col border-r shadow-[2px_0_12px_-4px_rgba(0,0,0,0.1)] backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] md:flex ${isCollapsed ? "w-[78px]" : "w-[260px]"} `}
    >
      {/* Logo / Brand */}
      <div
        className={`transition-all duration-500 ease-in-out ${isCollapsed ? "px-4 py-8" : "px-6 py-8"}`}
      >
        <div className="group relative cursor-pointer">
          <Logo size={isCollapsed ? 44 : 38} showText={!isCollapsed} />
          {!isCollapsed && (
            <div className="from-primary absolute -bottom-1 left-12 h-0.5 w-12 rounded-full bg-gradient-to-r to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="custom-scrollbar flex-1 overflow-y-auto">
        <SidebarNav />
      </div>

      {/* User Footer */}
      <div
        className={`border-sidebar-border/50 bg-sidebar/20 mt-auto border-t backdrop-blur-md transition-all duration-500 ${isCollapsed ? "p-3" : "p-5"}`}
      >
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-4">
            <div className="group relative">
              <div className="from-primary/10 text-primary border-primary/20 group-hover:shadow-primary/20 flex h-10 w-10 items-center justify-center rounded-2xl border bg-gradient-to-br to-blue-500/10 text-sm font-black shadow-sm transition-all group-hover:scale-110">
                {userName?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="bg-primary/20 absolute inset-0 -z-10 rounded-2xl opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-100" />
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              className="text-muted-foreground hover:bg-destructive hover:shadow-destructive/20 rounded-xl p-2.5 transition-all hover:text-white hover:shadow-lg"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="group relative">
                <div className="from-primary/10 text-primary border-primary/20 flex h-11 w-11 items-center justify-center rounded-2xl border bg-gradient-to-br to-blue-500/10 text-lg font-black shadow-sm transition-transform group-hover:scale-105">
                  {userName?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="border-sidebar absolute -right-0.5 -bottom-0.5 h-3.5 w-3.5 rounded-full border-2 bg-emerald-500 ring-2 ring-emerald-500/20" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-sm font-black tracking-tight">
                  {userName || "User Dashboard"}
                </p>
                <p className="text-muted-foreground truncate text-[11px] font-medium opacity-70">
                  {userEmail}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-border/40 hover:bg-destructive hover:border-destructive hover:shadow-destructive/20 flex h-10 w-full items-center justify-center gap-2 rounded-xl text-[11px] font-black shadow-sm transition-all hover:text-white"
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
            >
              <LogOut size={15} /> Sign Out
            </Button>
            <div className="flex items-center justify-center gap-2 opacity-30">
              <div className="bg-muted-foreground h-px w-4" />
              <span className="font-mono text-[9px] font-black tracking-[0.2em] uppercase">
                v{version}
              </span>
              <div className="bg-muted-foreground h-px w-4" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
