"use client";

import { useState, useEffect, useCallback } from "react";
import { MobileNav } from "@/features/dashboard/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { RealtimeClock } from "@/features/dashboard/components/realtime-clock";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bell, Inbox, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { io } from "socket.io-client";

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
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);


  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.read).length);
      }
    } catch {
      console.error("Failed to fetch notifications");
    }
  }, []);

  useEffect(() => {
    fetchNotifications();

    // Setup Socket.IO connection
    if (session?.user?.id) {
      const socketInstance = io({
        path: "/api/socket/io",
      });

      socketInstance.on("connect", () => {
        console.log("Socket connected for notifications");
        // Join user-specific room
        socketInstance.emit("join-user-room", session.user.id);
      });

      socketInstance.on("notification:new", (notification: Notification) => {
        console.log("New notification received:", notification);

        // Add to notifications list
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);

        // Show toast popup
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
      const ids = id ? [id] : []; // Empty array means mark all
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
      console.error("Failed to delete notification");
      toast.error("Failed to delete notification");
    }
  };

  const handleNotificationClick = (n: Notification) => {
    if (!n.read) markAsRead(n.id);
    if (n.href) router.push(n.href);
    setIsOpen(false);
  };

  if (!mounted) {
    return (
      <header className="bg-background/40 border-border/50 sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b px-4 shadow-sm backdrop-blur-2xl sm:px-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Bell className="h-5 w-5 opacity-50" />
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <RealtimeClock />
          <div className="bg-muted/20 h-9 w-[180px] animate-pulse rounded-md" />
        </div>
      </header>
    );
  }

  return (
    <header className="bg-background/40 border-border/50 sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b px-4 shadow-sm backdrop-blur-2xl sm:px-6">
      <div className="flex items-center gap-3">
        <MobileNav appName={appName} />
      </div>

      <div className="flex items-center gap-4">
        <RealtimeClock />
        <div className="bg-border/50 mx-2 h-6 w-px" />


        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-muted/50 relative h-10 w-10 rounded-full"
            >
              <Bell
                className={`h-5 w-5 transition-colors ${unreadCount > 0 ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              />
              {unreadCount > 0 && (
                <span className="border-background absolute top-1.5 right-2.5 h-2.5 w-2.5 animate-pulse rounded-full border-2 bg-red-500" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="border-border/50 glass-panel w-80 rounded-2xl border p-0 shadow-2xl"
            align="end"
          >
            <div className="border-border/50 bg-background/50 flex items-center justify-between border-b p-4">
              <div>
                <h4 className="text-foreground leading-none font-semibold">Notifications</h4>
                <p className="text-muted-foreground mt-1 text-xs">
                  {unreadCount > 0
                    ? `You have ${unreadCount} unread updates.`
                    : "No new notifications."}
                </p>
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markAsRead()}
                  className="h-auto px-2 py-1 text-xs"
                >
                  Mark all read
                </Button>
              )}
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex min-h-[150px] flex-col items-center justify-center p-4 text-center">
                  <div className="mb-3 rounded-full bg-slate-100 p-3">
                    <Inbox className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium">No new notifications</p>
                  <p className="text-muted-foreground max-w-[180px] text-xs">
                    We&apos;ll notify you when something important arrives.
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-4 transition-colors hover:bg-slate-50 ${!n.read ? "bg-blue-50/50" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className="flex-1 cursor-pointer space-y-1"
                          onClick={() => handleNotificationClick(n)}
                        >
                          <p
                            className={`text-sm leading-none font-medium ${!n.read ? "text-blue-700" : "text-slate-900"}`}
                          >
                            {n.title}
                          </p>
                          <p className="text-muted-foreground line-clamp-2 text-xs">{n.message}</p>
                          <p className="text-[10px] text-slate-400">
                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!n.read && (
                            <span className="h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(n.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
