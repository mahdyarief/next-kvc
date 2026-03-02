"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GitBranch, RefreshCw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function SystemUpdates() {
    const [loading, setLoading] = useState(false);

    const handleCheckUpdates = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/system/check-updates", { method: "POST" });
            const data = await res.json();
            if (data.success) {
                toast.success(data.message || "You are on the latest version!");
            } else {
                toast.error(data.message || "Failed to check updates");
            }
        } catch {
            toast.error("Error checking updates");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm">
            <div className="px-6 py-5 border-b border-border/40">
                <div className="flex items-center gap-2.5">
                    <div className="rounded-lg bg-primary/10 border border-primary/15 p-1.5 text-primary">
                        <GitBranch className="h-4 w-4" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-sm">System Updates</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Check for the latest version on GitHub
                        </p>
                    </div>
                </div>
            </div>
            <div className="px-6 py-5 space-y-4">
                <div className="rounded-xl border border-border/50 bg-muted/30 px-4 py-3.5 flex items-center gap-3">
                    <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
                    <div>
                        <p className="text-xs font-medium">Current Build</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                            next-kvc · Next.js 16
                        </p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    className="w-full gap-2 transition-all hover:bg-accent/80 active:scale-[0.98]"
                    onClick={handleCheckUpdates}
                    disabled={loading}
                >
                    <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                    Check for Updates
                </Button>
            </div>
        </div>
    );
}
