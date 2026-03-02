"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RefreshCw, Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { data: authSession } = useSession();
  const isSuperAdmin = (authSession?.user as { role?: string })?.role === "SUPERADMIN";

  const [systemConfig, setSystemConfig] = useState({
    appName: "NEXT-KVC",
    logoUrl: "",
    timezone: "Asia/Jakarta",
    enableRegistration: true,
  });
  const [systemLoading, setSystemLoading] = useState(false);

  useEffect(() => {
    fetch("/api/settings/system")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        if (data.success && data.data) {
          const config = data.data;
          setSystemConfig({
            appName: config.appName || "NEXT-KVC",
            logoUrl: config.logoUrl || "",
            timezone: config.timezone || "Asia/Jakarta",
            enableRegistration:
              config.enableRegistration !== undefined ? config.enableRegistration : true,
          });
        }
      })
      .catch(() => { });
  }, []);

  const handleSaveSystem = async () => {
    setSystemLoading(true);
    try {
      const res = await fetch("/api/settings/system", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(systemConfig),
      });

      if (res.ok) {
        const result = await res.json();
        toast.success(result.message || "System settings updated. Refresh to see changes.");
      } else {
        const result = await res.json();
        toast.error(result.message || "Failed to update system settings");
      }
    } catch {
      toast.error("Error saving system settings");
    } finally {
      setSystemLoading(false);
    }
  };

  const inputClass =
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Global system configuration. Only SuperAdmins can make changes.
          </p>
        </div>
      </div>

      {!isSuperAdmin && (
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="bg-amber-500/10 rounded-xl p-2.5">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
              </div>
              <div>
                <p className="font-heading text-sm font-semibold text-amber-900 dark:text-amber-500">View Only Mode</p>
                <p className="mt-1 text-xs text-amber-800 dark:text-amber-500/80 leading-relaxed">
                  Only Superadmins can modify system settings. You can view current settings but
                  cannot make changes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Configuration (Global) */}
      <Card className="border-primary/20 bg-primary/5 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl">App Configuration</CardTitle>
          <CardDescription>
            Global settings for the application branding and access control.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Application Name</Label>
            <input
              className={inputClass}
              placeholder="NEXT-KVC"
              value={systemConfig.appName}
              onChange={(e) => setSystemConfig((prev) => ({ ...prev, appName: e.target.value }))}
              disabled={!isSuperAdmin}
            />
            <p className="text-muted-foreground text-xs">
              Changes the name in the sidebar and browser title.
            </p>
          </div>

          <div className="grid gap-2">
            <Label>Timezone</Label>
            <select
              className={inputClass}
              value={systemConfig.timezone}
              onChange={(e) => setSystemConfig((prev) => ({ ...prev, timezone: e.target.value }))}
              disabled={!isSuperAdmin}
            >
              <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
              <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
              <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
              <option value="UTC">UTC</option>
            </select>
            <p className="text-muted-foreground text-xs">
              Scheduler will use this timezone to parse local times.
            </p>
          </div>

          <div className="border-border/50 flex items-center justify-between space-x-2 border-t pt-2">
            <Label htmlFor="enable-registration" className="flex flex-col space-y-1">
              <span>Enable User Registration</span>
              <span className="text-muted-foreground text-xs font-normal">
                Allow new users to sign up for accounts. Turn off to keep the platform private.
              </span>
            </Label>
            <Switch
              id="enable-registration"
              checked={systemConfig.enableRegistration}
              onCheckedChange={(c) =>
                setSystemConfig((prev) => ({ ...prev, enableRegistration: c }))
              }
              disabled={!isSuperAdmin}
            />
          </div>

          <div className="pt-2">
            <Button onClick={handleSaveSystem} disabled={systemLoading || !isSuperAdmin}>
              {systemLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Updates */}
      <Card>
        <CardHeader>
          <CardTitle>System Updates</CardTitle>
          <CardDescription>Check for the latest version from GitHub.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full"
            onClick={async () => {
              setSystemLoading(true);
              try {
                const res = await fetch("/api/system/check-updates", { method: "POST" });
                const data = await res.json();
                if (data.success) {
                  toast.success(data.message || "Check complete!");
                } else {
                  toast.error(data.message || "Failed to check updates");
                }
              } catch {
                toast.error("Error checking updates");
              } finally {
                setSystemLoading(false);
              }
            }}
            disabled={systemLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${systemLoading ? "animate-spin" : ""}`} />
            Check for Updates
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
