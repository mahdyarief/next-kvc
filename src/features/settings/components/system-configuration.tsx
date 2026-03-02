"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Globe, RefreshCw, Save } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface SystemConfig {
    appName: string;
    logoUrl: string;
    timezone: string;
    enableRegistration: boolean;
}

interface SystemConfigurationProps {
    isSuperAdmin: boolean;
    onConfigChange: (config: SystemConfig) => void;
}

export function SystemConfiguration({
    isSuperAdmin,
    onConfigChange,
}: SystemConfigurationProps) {
    const [systemConfig, setSystemConfig] = useState<SystemConfig>({
        appName: "NEXT-KVC",
        logoUrl: "",
        timezone: "Asia/Jakarta",
        enableRegistration: true,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch("/api/settings/system")
            .then((r) => r.json())
            .then((data) => {
                if (data.success && data.data) {
                    const config = data.data;
                    const newConfig = {
                        appName: config.appName || "NEXT-KVC",
                        logoUrl: config.logoUrl || "",
                        timezone: config.timezone || "Asia/Jakarta",
                        enableRegistration:
                            config.enableRegistration !== undefined
                                ? config.enableRegistration
                                : true,
                    };
                    setSystemConfig(newConfig);
                    onConfigChange(newConfig);
                }
            })
            .catch(() => { });
    }, [onConfigChange]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/settings/system", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(systemConfig),
            });

            if (res.ok) {
                const result = await res.json();
                toast.success(result.message || "System settings updated.");
                onConfigChange(systemConfig);
            } else {
                const result = await res.json();
                toast.error(result.message || "Failed to update settings");
            }
        } catch {
            toast.error("Error saving settings");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <div className="px-6 py-5 border-b border-border/40">
                <div className="flex items-center gap-2.5">
                    <div className="rounded-lg bg-primary/10 border border-primary/15 p-1.5 text-primary">
                        <Globe className="h-4 w-4" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-sm">App Configuration</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Branding, identity &amp; access control
                        </p>
                    </div>
                </div>
            </div>
            <div className="px-6 py-5 space-y-5">
                <FieldGroup
                    label="Application Name"
                    hint="Displayed in sidebar and browser title."
                >
                    <input
                        className={fieldClass(!isSuperAdmin)}
                        placeholder="NEXT-KVC"
                        value={systemConfig.appName}
                        onChange={(e) => {
                            const appName = e.target.value;
                            setSystemConfig((prev) => ({ ...prev, appName }));
                        }}
                        disabled={!isSuperAdmin}
                    />
                </FieldGroup>

                <FieldGroup
                    label="Timezone"
                    hint="Used by the scheduler to parse local times."
                >
                    <select
                        className={fieldClass(!isSuperAdmin)}
                        value={systemConfig.timezone}
                        onChange={(e) => {
                            const timezone = e.target.value;
                            setSystemConfig((prev) => ({ ...prev, timezone }));
                        }}
                        disabled={!isSuperAdmin}
                    >
                        <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                        <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                        <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                        <option value="UTC">UTC</option>
                    </select>
                </FieldGroup>

                <div className="rounded-xl border border-border/50 bg-muted/30 px-4 py-3.5 flex items-center justify-between gap-4 transition-all hover:bg-muted/50">
                    <div>
                        <p className="text-sm font-medium">Enable User Registration</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                            Allow new users to sign up. Disable to keep the platform private.
                        </p>
                    </div>
                    <Switch
                        id="enable-registration"
                        checked={systemConfig.enableRegistration}
                        onCheckedChange={(c) => {
                            setSystemConfig((prev) => ({ ...prev, enableRegistration: c }));
                        }}
                        disabled={!isSuperAdmin}
                    />
                </div>

                <Button
                    onClick={handleSave}
                    disabled={loading || !isSuperAdmin}
                    className="w-full gap-2 transition-all active:scale-[0.98]"
                >
                    {loading ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="h-4 w-4" />
                    )}
                    Save Configuration
                </Button>
            </div>
        </div>
    );
}

function FieldGroup({
    label,
    hint,
    children,
}: {
    label: string;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <Label className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
                {label}
            </Label>
            {children}
            {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
        </div>
    );
}

const fieldClass = (disabled: boolean) =>
    cn(
        "flex h-10 w-full rounded-xl border border-input bg-background/50 px-3.5 py-2 text-sm",
        "placeholder:text-muted-foreground/50 transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-0 focus-visible:border-primary/50",
        disabled && "cursor-not-allowed opacity-50"
    );
