import { auth } from "@/lib/auth";
import { Navbar } from "@/features/dashboard/components/navbar";
import { SidebarProvider } from "@/features/dashboard/components/sidebar-context";
import { SidebarShell } from "@/features/dashboard/components/sidebar-shell";
import { UpdateChecker } from "@/features/dashboard/components/update-checker";
import { prisma } from "@/lib/prisma";
import { Toaster } from "sonner";
import pkg from "../../../package.json";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const systemConfig = await prisma.systemConfig.findUnique({ where: { id: "default" } });
  const appName = systemConfig?.appName || "NextKVC";

  return (
    <SidebarProvider>
      <UpdateChecker />
      <div className="bg-background relative flex h-screen overflow-hidden">
        {/* Subtle ambient background */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="bg-primary/[0.03] absolute -top-[20%] -left-[10%] h-[35rem] w-[35rem] rounded-full blur-[100px]" />
          <div className="absolute -right-[10%] -bottom-[20%] h-[25rem] w-[25rem] rounded-full bg-blue-500/[0.03] blur-[80px]" />
        </div>

        {/* Sidebar */}
        <SidebarShell
          appName={appName}
          userName={session?.user?.name}
          userEmail={session?.user?.email}
          version={pkg.version}
        />

        {/* Main Content */}
        <div className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
          <Navbar appName={appName} />
          <main className="styled-scrollbar flex-1 overflow-auto p-3 sm:p-4 lg:p-6">
            {children}
          </main>
        </div>
        <Toaster />
      </div>
    </SidebarProvider>
  );
}

