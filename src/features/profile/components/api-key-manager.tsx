"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Key,
    Copy,
    RotateCcw,
    Trash2,
    Eye,
    EyeOff,
    ShieldCheck,
    AlertTriangle,
    Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ApiKeyManagerProps {
    initialKey: string | null;
}

export function ApiKeyManager({ initialKey }: ApiKeyManagerProps) {
    const [apiKey, setApiKey] = useState<string | null>(initialKey);
    const [showKey, setShowKey] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/user/api-key", { method: "POST" });
            const data = await res.json();
            if (res.ok) {
                setApiKey(data.apiKey);
                setShowKey(true);
                toast.success("New API key generated");
            } else {
                toast.error(data.error || "Failed to generate key");
            }
        } catch {
            toast.error("Error generating key");
        } finally {
            setLoading(false);
        }
    };

    const handleRevoke = async () => {
        if (!confirm("Are you sure? Any applications using this key will lose access.")) return;

        setLoading(true);
        try {
            const res = await fetch("/api/user/api-key", { method: "DELETE" });
            if (res.ok) {
                setApiKey(null);
                toast.success("API key revoked");
            } else {
                toast.error("Failed to revoke key");
            }
        } catch {
            toast.error("Error revoking key");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (!apiKey) return;
        navigator.clipboard.writeText(apiKey);
        toast.success("API key copied to clipboard");
    };

    return (
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm">
            <div className="px-6 py-5 border-b border-border/40">
                <div className="flex items-center gap-2.5">
                    <div className="rounded-lg bg-primary/10 border border-primary/15 p-1.5 text-primary">
                        <Key className="h-4 w-4" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-sm">Personal API Key</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">Authenticate with the system via API</p>
                    </div>
                </div>
            </div>

            <div className="px-6 py-5 space-y-6">
                {apiKey ? (
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">My API Key</Label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Input
                                        type={showKey ? "text" : "password"}
                                        value={apiKey}
                                        readOnly
                                        className="pr-10 font-mono text-xs rounded-xl border-border/60 bg-background/40"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowKey(!showKey)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                                    >
                                        {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                <Button variant="outline" size="icon" onClick={copyToClipboard} className="rounded-xl border-border/60">
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 gap-2 rounded-xl text-xs font-semibold border-border/60"
                                onClick={handleGenerate}
                                disabled={loading}
                            >
                                <RotateCcw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
                                Regenerate Key
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex-1 gap-2 rounded-xl text-xs font-semibold text-red-500 hover:text-red-500 hover:bg-red-500/10"
                                onClick={handleRevoke}
                                disabled={loading}
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Revoke Access
                            </Button>
                        </div>

                        <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                            <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500 flex-shrink-0" />
                            <p className="text-[11px] leading-relaxed text-amber-700/80 dark:text-amber-400/70">
                                Treat your API key as a password. Do not share it or commit it to version control.
                                Anyone with this key can act in the system on your behalf.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                        <div className="rounded-2xl bg-muted/30 border border-dashed border-border/60 p-6">
                            <Key className="h-8 w-8 text-muted-foreground/30" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">No active API key</p>
                            <p className="max-w-[240px] text-xs text-muted-foreground mt-1">
                                Generate an API key to start interacting with the system programmatically.
                            </p>
                        </div>
                        <Button onClick={handleGenerate} disabled={loading} className="gap-2 px-6 rounded-xl">
                            {loading ? <RotateCcw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                            Generate API Key
                        </Button>
                    </div>
                )}

                <div className="border-t border-border/40 pt-5">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Usage Guidelines</span>
                    </div>
                    <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed italic">
                        All API requests must include the <code className="text-foreground font-semibold px-1 bg-muted/50 rounded">x-api-key</code> header.
                        Check the API documentation for available endpoints.
                    </p>
                </div>
            </div>
        </div>
    );
}

function Label({ className, children }: { className?: string; children: React.ReactNode }) {
    return <label className={cn("text-sm font-medium leading-none", className)}>{children}</label>;
}
