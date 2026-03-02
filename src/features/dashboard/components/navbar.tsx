"use client";

import { useState, useEffect, useCallback } from "react";
import { MobileNav } from "@/features/dashboard/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { RealtimeClock } from "@/features/dashboard/components/realtime-clock";
import { ThemeToggle } from "@/features/dashboard/components/theme-toggle";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Kbd } from "@/components/ui/kbd";
import { Bell, Inbox, Trash2, ChevronRight, Search } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { io } from "socket.io-client";
import { cn } from "@/lib/utils";
import { SearchCommand } from "./search-command";

interface NavbarProps {
  appName?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  href?: string;
  createdAt: string;
}

export function Navbar({ appName }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Breadcrumbs generation
  const segments = pathname.split("/").filter(Boolean);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const response = await res.json();
        // Extract data from the standardized api.success() response
        const data = response.data || [];
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.read).length);
      } else {
        const error = await res.json();
        console.error("Failed to fetch notifications:", error.message || res.statusText);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();

    if (session?.user?.id) {
      const socketInstance = io({
        path: "/api/socket/io",
      });

      socketInstance.on("connect", () => {
        socketInstance.emit("join-user-room", session.user.id);
      });

      socketInstance.on("notification:new", (notification: Notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        toast.info(notification.title, {
          description: notification.message,
          action: notification.href
            ? {
              label: "View",
              onClick: () => router.push(notification.href!),
            }
            : undefined,
        });
      });

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [session?.user?.id, fetchNotifications, router]);

  const markAsRead = async (id?: string) => {
    try {
      const ids = id ? [id] : [];
      const res = await fetch("/api/notifications/read", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (res.ok) {
        if (id) {
          setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
          setUnreadCount((prev) => Math.max(0, prev - 1));
        } else {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
          setUnreadCount(0);
        }
      }
    } catch {
      console.error("Failed to mark read");
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/delete?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        setUnreadCount((prev) => {
          const notification = notifications.find((n) => n.id === id);
          return notification && !notification.read ? Math.max(0, prev - 1) : prev;
        });
        toast.success("Notification deleted");
      }
    } catch {
      toast.error("Failed to delete notification");
    }
  };

  const handleNotificationClick = (n: Notification) => {
    if (!n.read) markAsRead(n.id);
    if (n.href) router.push(n.href);
    setIsOpen(false);
  };

  if (!mounted) return null;

  return (
    <header className="bg-background/80 sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border/60 px-4 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <MobileNav appName={appName} />

        {/* Simplified Breadcrumbs */}
        <nav className="hidden items-center gap-1.5 text-sm font-medium sm:flex">
          {segments.map((segment, i) => (
            <div key={`${segment}-${i}`} className="flex items-center gap-1.5 capitalize">
              {i > 0 && <ChevronRight className="text-muted-foreground/40 h-3.5 w-3.5" />}
              <span className={cn(
                i === segments.length - 1 ? "text-foreground" : "text-muted-foreground/60"
              )}>
                {segment.replace(/-/g, " ")}
              </span>
            </div>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-4 md:flex">
          <RealtimeClock />
          <div className="bg-border/60 h-4 w-px" />
        </div>

        <Button
          variant="outline"
          size="sm"
          className="relative h-9 w-full justify-start rounded-xl border-border/20 bg-background/50 px-3 text-sm font-normal text-muted-foreground transition-all hover:border-primary/30 hover:bg-accent/50 sm:pr-12 md:w-40 lg:w-64"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="mr-2 h-4 w-4 shrink-0" />
          <span className="hidden lg:inline-flex">Search dashboard...</span>
          <span className="inline-flex lg:hidden">Search...</span>
          <Kbd className="bg-muted-foreground/10 pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs font-sans">⌘</span>K
          </Kbd>
        </Button>

        <ThemeToggle />
        <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 rounded-lg transition-colors hover:bg-accent"
            >
              <Bell
                className={cn(
                  "h-4 w-4 transition-colors",
                  unreadCount > 0 ? "text-primary" : "text-muted-foreground"
                )}
              />
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-80 overflow-hidden rounded-xl border border-border/60 bg-card p-0 shadow-2xl"
            align="end"
            sideOffset={8}
          >
            <div className="border-b border-border/60 bg-muted/30 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-heading text-sm font-semibold">Notifications</h4>
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary h-5 px-1.5 text-[10px] uppercase">
                      {unreadCount} New
                    </Badge>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAsRead()}
                    className="text-primary hover:text-primary/80 text-[11px] font-semibold"
                  >
                    Mark all read
                  </button>
                )}
              </div>
            </div>
            <div className="styled-scrollbar max-h-[350px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                  <div className="bg-muted mb-3 flex h-10 w-10 items-center justify-center rounded-full">
                    <Inbox className="text-muted-foreground/60 h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold">Clean Inbox</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    You&apos;re all caught up with your notifications.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/40">
                  {notifications.map((n, i) => (
                    <div
                      key={n.id || `notif-${i}`}
                      className={cn(
                        "group relative flex items-start gap-3 p-4 transition-colors hover:bg-accent/50",
                        !n.read && "bg-primary/[0.03]"
                      )}
                      onClick={() => handleNotificationClick(n)}
                    >
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className={cn(
                          "truncate text-sm font-semibold leading-none",
                          !n.read ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {n.title}
                        </p>
                        <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                          {n.message}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground/40 text-[10px] font-medium">
                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {!n.read && <div className="bg-primary h-1.5 w-1.5 rounded-full" />}
                        <button
                          className="text-muted-foreground/20 hover:text-destructive opacity-0 transition-all group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(n.id);
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {notifications.length > 0 && (
              <div className="border-t border-border/60 bg-muted/10 p-2 text-center">
                <p className="text-muted-foreground/40 flex items-center justify-center gap-1.5 text-[10px] font-medium uppercase tracking-widest">
                  Quick View <Kbd className="opacity-60 font-medium">Esc</Kbd>
                </p>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}

function Badge({ children, variant, className }: { children: React.ReactNode, variant?: string, className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
      variant === "secondary" ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground",
      className
    )}>
      {children}
    </span>
  )
}
