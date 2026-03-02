"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Settings2,
  AlertCircle
} from "lucide-react";
import { SystemConfiguration } from "@/features/settings/components/system-configuration";
import { SecuritySummary } from "@/features/settings/components/security-summary";
import { SystemUpdates } from "@/features/settings/components/system-updates";

export default function SettingsPage() {
  const { data: authSession } = useSession();
  const isSuperAdmin = (authSession?.user as { role?: string })?.role === "SUPERADMIN";

  const [currentConfig, setCurrentConfig] = useState({
    enableRegistration: true,
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-primary/10 border border-primary/20 p-3 backdrop-blur-sm">
          <Settings2 className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="font-outfit text-3xl font-bold tracking-tight">
            Settings
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Global system configuration &amp; version management
          </p>
        </div>
      </div>

      {/* Read-only banner */}
      {!isSuperAdmin && (
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/25 bg-amber-500/5 px-5 py-4 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent pointer-events-none" />
          <div className="relative flex items-start gap-3">
            <div className="mt-0.5 flex-shrink-0 rounded-xl bg-amber-500/10 border border-amber-500/20 p-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                View Only Mode
              </p>
              <p className="mt-0.5 text-xs text-amber-700/80 dark:text-amber-400/70 leading-relaxed">
                Only SuperAdmins can modify settings. You can view current
                configuration but cannot save changes.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        {/* App Configuration — wide card */}
        <div className="lg:col-span-3">
          <SystemConfiguration
            isSuperAdmin={isSuperAdmin}
            onConfigChange={setCurrentConfig}
          />
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          <SecuritySummary
            isSuperAdmin={isSuperAdmin}
            registrationEnabled={currentConfig.enableRegistration}
          />
          <SystemUpdates />
        </div>
      </div>
    </div>
  );
}
