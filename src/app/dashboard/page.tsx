import { prisma } from "@/lib/prisma";
import { Bell, Users, LayoutDashboard, ShieldCheck } from "lucide-react";

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

  const stats = [
    {
      title: "Total Users",
      value: userCount,
      icon: Users,
      description: "Registered in system",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Notifications",
      value: notificationCount,
      icon: Bell,
      description: "Total alerts",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Unread",
      value: unreadNotifications,
      icon: Bell,
      description: "Pending action",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "System Status",
      value: 1, // Static placeholder for "Online"
      icon: ShieldCheck,
      description: "Secure & Online",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
  ];

  const quickActions = [
    {
      href: "/dashboard/notifications",
      label: "Send Alert",
      icon: Bell,
      description: "Notify users",
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: ShieldCheck,
      description: "System config",
    },
    {
      href: "/dashboard/users",
      label: "Manage Users",
      icon: Users,
      description: "User directory",
    },
    {
      href: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
      description: "Back to home",
    },
  ];

  return <DashboardView stats={stats} quickActions={quickActions} />;

}

