"use client";

import { Shield, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SecuritySummaryProps {
    isSuperAdmin: boolean;
    registrationEnabled: boolean;
}

export function SecuritySummary({
    isSuperAdmin,
    registrationEnabled,
}: SecuritySummaryProps) {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm">
            <div className="px-6 py-5 border-b border-border/40">
                <div className="flex items-center gap-2.5">
                    <div className="rounded-lg bg-primary/10 border border-primary/15 p-1.5 text-primary">
                        <Shield className="h-4 w-4" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-sm">Security</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Access control &amp; permissions
                        </p>
                    </div>
                </div>
            </div>
            <div className="px-6 py-5">
                <ul className="space-y-3">
                    <AccessRow
                        label="SuperAdmin Access"
                        value={isSuperAdmin ? "Enabled" : "Restricted"}
                        active={isSuperAdmin}
                    />
                    <AccessRow
                        label="Registration Gate"
                        value={registrationEnabled ? "Open" : "Closed"}
                        active={registrationEnabled}
                    />
                </ul>
            </div>
        </div>
    );
}

function AccessRow({
    label,
    value,
    active,
}: {
    label: string;
    value: string;
    active: boolean;
}) {
    return (
        <li className="flex items-center justify-between gap-3 rounded-xl bg-muted/30 border border-border/40 px-4 py-3 transition-colors hover:bg-muted/50">
            <span className="text-xs font-medium">{label}</span>
            <div className="flex items-center gap-1.5">
                <span
                    className={cn(
                        "text-[10px] font-semibold uppercase tracking-widest",
                        active ? "text-emerald-500" : "text-red-400"
                    )}
                >
                    {value}
                </span>
                <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
            </div>
        </li>
    );
}
