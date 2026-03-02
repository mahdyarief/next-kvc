"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    User,
    Mail,
    Lock,
    Save,
    RefreshCw,
    Fingerprint
} from "lucide-react";
import { toast } from "sonner";

interface ProfileFormProps {
    initialData: {
        name: string;
        email: string;
        role: string;
    };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
    const [name, setName] = useState(initialData.name);
    const [email, setEmail] = useState(initialData.email);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password && password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        setLoading(true);
        try {
            const res = await fetch("/api/user", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    ...(password && { password }),
                }),
            });

            if (res.ok) {
                toast.success("Profile updated successfully");
                setPassword("");
                setConfirmPassword("");
            } else {
                const error = await res.json();
                toast.error(error.message || "Failed to update profile");
            }
        } catch {
            toast.error("Error updating profile");
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
                        <User className="h-4 w-4" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-sm">Personal Information</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">Manage your public identity and account</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleUpdate} className="px-6 py-5 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Full Name</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="pl-10 rounded-xl border-border/60 bg-background/50 focus-visible:ring-1 focus-visible:ring-primary/50"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                            <Input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                className="pl-10 rounded-xl border-border/60 bg-background/50 focus-visible:ring-1 focus-visible:ring-primary/50"
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl bg-muted/30 border border-border/40 p-4 space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                        <Lock className="h-3.5 w-3.5" />
                        <span className="text-xs font-bold uppercase tracking-widest">Change Password</span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-muted-foreground">New Password</Label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="rounded-xl border-border/60 bg-background/50"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-muted-foreground">Confirm New Password</Label>
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="rounded-xl border-border/60 bg-background/50"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 rounded-full bg-primary/5 border border-primary/10 px-3 py-1">
                        <Fingerprint className="h-3 w-3 text-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80">Role: {initialData.role}</span>
                    </div>

                    <Button disabled={loading} className="gap-2 px-8 rounded-xl ring-offset-background transition-all active:scale-95">
                        {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    );
}
