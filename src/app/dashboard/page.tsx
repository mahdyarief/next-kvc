import { prisma } from "@/lib/prisma";
import { Bell, Users, LayoutDashboard, ShieldCheck, Activity } from "lucide-react";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardView } from "@/features/dashboard/components/dashboard-view";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const userCount = await prisma.user.count();
  const notificationCount = await prisma.notification.count({
    where: { userId: session.user.id }
  });
  const unreadNotifications = await prisma.notification.count({
    where: { userId: session.user.id, read: false }
  });

  const io = (globalThis as unknown as { io: { getOnlineUsers?: () => string[] } }).io;
  const onlineCount = io?.getOnlineUsers?.().length || 1; // Default to 1 (current user) if not initialized

  const stats = [
    {
      title: "Total Users",
      value: userCount,
      icon: Users,
      description: "Active system members",
      color: "text-primary",
      bg: "bg-primary/5",
    },
    {
      title: "Notifications",
      value: notificationCount,
      icon: Bell,
      description: "Total delivered alerts",
      color: "text-primary",
      bg: "bg-primary/5",
    },
    {
      title: "Unread",
      value: unreadNotifications,
      icon: Bell,
      description: "Pending attention",
      color: "text-amber-500",
      bg: "bg-amber-500/5",
    },
    {
      title: "Live Now",
      value: `${onlineCount} Online`,
      icon: Activity,
      description: "Currently active sessions",
      color: "text-emerald-500",
      bg: "bg-emerald-500/5",
    },
  ];

  const quickActions = [
    {
      href: "/dashboard/notifications",
      label: "Send Alert",
      icon: Bell,
      description: "Create and broadcast a notification",
      kbd: "N",
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: ShieldCheck,
      description: "Configure application preferences",
      kbd: ",",
    },
    {
      href: "/dashboard/users",
      label: "Manage Users",
      icon: Users,
      description: "View and manage user accounts",
      kbd: "U",
    },
    {
      href: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
      description: "Return to the main dashboard",
      kbd: "H",
    },
  ];

  return <DashboardView stats={stats} quickActions={quickActions} userName={session.user.name ?? "User"} />;
}
