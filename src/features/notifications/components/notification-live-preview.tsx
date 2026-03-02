"use client";

import {
    Bell,
    Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NOTIFICATION_TYPES, NotificationType } from "../types";

interface NotificationLivePreviewProps {
    data: {
        title: string;
        message: string;
        type: NotificationType;
        broadcast: boolean;
        href: string;
    };
}

export function NotificationLivePreview({ data }: NotificationLivePreviewProps) {
    const activeType = NOTIFICATION_TYPES.find((t) => t.value === data.type) ?? NOTIFICATION_TYPES[0];
    const IconComponent = activeType.icon;

    return (
        <div className="space-y-6">
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <div className="px-6 py-5 border-b border-border/40">
                    <div className="flex items-center gap-2.5">
                        <div className="rounded-lg bg-primary/10 border border-primary/15 p-1.5 text-primary">
                            <Bell className="h-4 w-4" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-sm">Live Preview</h2>
                            <p className="text-xs text-muted-foreground mt-0.5">See how recipients will see it</p>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-5 space-y-4">
                    <div className="relative overflow-hidden rounded-xl border border-border/50 bg-background/60 p-4 transition-all duration-300">
                        <div className={cn(
                            "absolute left-0 top-0 bottom-0 w-0.5",
                            data.type === "INFO" && "bg-blue-500",
                            data.type === "WARNING" && "bg-amber-500",
                            data.type === "SUCCESS" && "bg-emerald-500",
                            data.type === "SYSTEM" && "bg-violet-500",
                        )} />
                        <div className="pl-3 flex items-start gap-3">
                            <div className={cn("flex-shrink-0 rounded-lg p-2 border", activeType.color)}>
                                <IconComponent className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold leading-none truncate">
                                    {data.title || "Notification Title"}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1.5 line-clamp-3 leading-relaxed">
                                    {data.message || "Your notification message content will appear here."}
                                </p>
                                <div className="mt-3 flex items-center justify-between">
                                    <span className="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-widest">
                                        Just now
                                    </span>
                                    <span className={cn(
                                        "text-[10px] font-semibold uppercase tracking-widest",
                                        activeType.color.split(" ").find(c => c.startsWith("text-"))
                                    )}>
                                        {activeType.label}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <MetadataChip label="Audience" value={data.broadcast ? "All Users" : "Single User"} />
                        <MetadataChip label="Type" value={activeType.label} />
                        <MetadataChip label="Link" value={data.href || "None"} />
                        <MetadataChip
                            label="Status"
                            value="Ready"
                            highlight={!!(data.title && data.message)}
                        />
                    </div>
                </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm">
                <div className="px-6 py-5 border-b border-border/40">
                    <div className="flex items-center gap-2.5">
                        <div className="rounded-lg bg-primary/10 border border-primary/15 p-1.5 text-primary">
                            <Info className="h-4 w-4" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-sm">Notification Types</h2>
                            <p className="text-xs text-muted-foreground mt-0.5">Choose the right signal</p>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-5">
                    <ul className="space-y-4">
                        {NOTIFICATION_TYPES.map((t) => {
                            const Icon = t.icon;
                            return (
                                <li key={t.value} className="flex items-start gap-3">
                                    <div className={cn("mt-0.5 flex-shrink-0 rounded-lg p-1.5 border", t.color)}>
                                        <Icon className="h-3.5 w-3.5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold">{t.label}</p>
                                        <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                                            {t.value === "INFO" && "General information, updates, announcements"}
                                            {t.value === "WARNING" && "Important caution, required action needed"}
                                            {t.value === "SUCCESS" && "Positive outcome, completed process"}
                                            {t.value === "SYSTEM" && "Platform-level alerts, configuration changes"}
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
}

function MetadataChip({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div className="rounded-lg border border-border/40 bg-muted/30 px-3 py-2">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-medium">
                {label}
            </p>
            <p className={cn(
                "text-xs font-semibold mt-0.5 truncate",
                highlight ? "text-emerald-500" : "text-foreground"
            )}>
                {value}
            </p>
        </div>
    );
}
