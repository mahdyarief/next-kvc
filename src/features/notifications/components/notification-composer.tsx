"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Send,
    RefreshCw,
    Sparkles,
    Link2,
    Users,
    User
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { NOTIFICATION_TYPES, NotificationType } from "../types";

interface NotificationComposerProps {
    onDataChange: (data: {
        title: string;
        message: string;
        type: NotificationType;
        broadcast: boolean;
        targetUserId: string;
        href: string;
    }) => void;
}

export function NotificationComposer({ onDataChange }: NotificationComposerProps) {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [type, setType] = useState<NotificationType>("INFO");
    const [broadcast, setBroadcast] = useState(true);
    const [targetUserId, setTargetUserId] = useState("");
    const [href, setHref] = useState("");
    const [loading, setLoading] = useState(false);

    // Sync back to parent for live preview
    const sync = (updates: Partial<Parameters<typeof onDataChange>[0]>) => {
        onDataChange({
            title,
            message,
            type,
            broadcast,
            targetUserId,
            href,
            ...updates,
        });
    };

    const handleSend = async () => {
        if (!title || !message)
            return toast.error("Title and Message are required");
        if (!broadcast && !targetUserId)
            return toast.error("Target User ID is required for non-broadcast");

        setLoading(true);
        try {
            const res = await fetch("/api/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    message,
                    type,
                    broadcast,
                    targetUserId: broadcast ? undefined : targetUserId,
                    href,
                }),
            });

            if (res.ok) {
                const result = await res.json();
                const count = result.data?.count || 1;
                toast.success(
                    result.message || `Notification dispatched to ${count} recipient(s).`
                );
                setTitle("");
                setMessage("");
                setHref("");
                sync({ title: "", message: "", href: "" });
            } else {
                const result = await res.json();
                toast.error(result.message || "Failed to send notification");
            }
        } catch {
            toast.error("Error sending notification");
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
                        <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-sm">Compose</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">Craft your notification message</p>
                    </div>
                </div>
            </div>

            <div className="px-6 py-5 space-y-5">
                <div className="space-y-2">
                    <FieldLabel>Type</FieldLabel>
                    <div className="flex flex-wrap gap-2">
                        {NOTIFICATION_TYPES.map((t) => {
                            const Icon = t.icon;
                            const isActive = type === t.value;
                            return (
                                <button
                                    key={t.value}
                                    type="button"
                                    onClick={() => {
                                        setType(t.value);
                                        sync({ type: t.value });
                                    }}
                                    className={cn(
                                        "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                                        isActive
                                            ? cn(t.color, "ring-2 ring-offset-2 ring-offset-card ring-current/20")
                                            : "border-border/50 bg-muted/30 text-muted-foreground hover:bg-muted/60"
                                    )}
                                >
                                    <Icon className="h-3 w-3" />
                                    {t.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="space-y-1.5">
                    <FieldLabel>Title</FieldLabel>
                    <Input
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            sync({ title: e.target.value });
                        }}
                        placeholder="e.g. Scheduled Maintenance"
                        className="rounded-xl border-border/60 bg-background/50 transition-all focus-visible:ring-1 focus-visible:ring-primary/50 placeholder:text-muted-foreground/40"
                    />
                </div>

                <div className="space-y-1.5">
                    <FieldLabel>Message</FieldLabel>
                    <Textarea
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value);
                            sync({ message: e.target.value });
                        }}
                        placeholder="Provide clear, concise details…"
                        rows={4}
                        className="resize-none rounded-xl border-border/60 bg-background/50 transition-all focus-visible:ring-1 focus-visible:ring-primary/50 placeholder:text-muted-foreground/40"
                    />
                </div>

                <div className="space-y-1.5">
                    <FieldLabel optional>Action Link</FieldLabel>
                    <div className="relative">
                        <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
                        <Input
                            value={href}
                            onChange={(e) => {
                                setHref(e.target.value);
                                sync({ href: e.target.value });
                            }}
                            placeholder="/dashboard/settings"
                            className="pl-8 rounded-xl border-border/60 bg-background/50 transition-all focus-visible:ring-1 focus-visible:ring-primary/50 placeholder:text-muted-foreground/40"
                        />
                    </div>
                </div>

                <div className="rounded-xl border border-border/50 bg-muted/30 px-4 py-3.5 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                            <div className={cn(
                                "rounded-lg p-1.5 border transition-all",
                                broadcast
                                    ? "bg-primary/10 border-primary/20 text-primary"
                                    : "bg-muted border-border/40 text-muted-foreground"
                            )}>
                                {broadcast ? <Users className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                            </div>
                            <div>
                                <p className="text-sm font-medium">
                                    {broadcast ? "Broadcast to All Users" : "Target Specific User"}
                                </p>
                                <p className="text-[11px] text-muted-foreground">
                                    {broadcast ? "All registered users will receive this" : "Sent to a single user by ID"}
                                </p>
                            </div>
                        </div>
                        <Switch
                            id="broadcast"
                            checked={broadcast}
                            onCheckedChange={(c) => {
                                setBroadcast(c);
                                sync({ broadcast: c });
                            }}
                        />
                    </div>

                    {!broadcast && (
                        <div className="animate-in fade-in slide-in-from-top-2 pt-1 border-t border-border/30 space-y-1.5">
                            <FieldLabel>Target User ID</FieldLabel>
                            <Input
                                value={targetUserId}
                                onChange={(e) => {
                                    setTargetUserId(e.target.value);
                                    sync({ targetUserId: e.target.value });
                                }}
                                placeholder="User ID (cuid)"
                                className="rounded-xl border-border/60 bg-background/50 text-xs font-mono focus-visible:ring-1 focus-visible:ring-primary/50"
                            />
                        </div>
                    )}
                </div>

                <Button
                    className="w-full gap-2 h-11 text-sm font-semibold"
                    onClick={handleSend}
                    disabled={loading}
                >
                    {loading ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                        <Send className="h-4 w-4" />
                    )}
                    {loading ? "Dispatching…" : "Send Notification"}
                </Button>
            </div>
        </div>
    );
}

function FieldLabel({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
    return (
        <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
            {children}
            {optional && (
                <span className="text-[10px] normal-case tracking-normal font-normal text-muted-foreground/50">
                    optional
                </span>
            )}
        </Label>
    );
}
