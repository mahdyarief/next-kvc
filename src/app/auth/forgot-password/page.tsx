"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { FloatingInput as Input } from "@/components/ui/input";
import { PasswordInput, PasswordStrength } from "@/components/ui/password-input";
import { ShieldCheck, Loader2, KeyRound, ShieldAlert, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { forgetPasswordSchema, ForgetPasswordInput, RECOVERY_CONFIG } from "@/features/auth/constants";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Choose a random recovery code index on mount for this session
    // We initialize with a stable constant to prevent hydration mismatch (SSR-Client mismatch)
    const [challengeIndex, setChallengeIndex] = useState<number>(RECOVERY_CONFIG.CHALLENGE_INDEX);

    const form = useForm<ForgetPasswordInput>({
        resolver: zodResolver(forgetPasswordSchema),
        defaultValues: {
            email: "",
            recoveryCode: "",
            codeIndex: challengeIndex,
            password: "",
            confirmPassword: "",
        },
    });

    // Randomize on mount to prevent predictability while maintaining hydration safety
    useEffect(() => {
        const nextIdx = Math.floor(Math.random() * RECOVERY_CONFIG.CODE_COUNT);
        setChallengeIndex(nextIdx);
        form.setValue("codeIndex", nextIdx);
    }, [form]);

    const watchPassword = form.watch("password");

    const passwordStrength = useMemo((): PasswordStrength | undefined => {
        if (!watchPassword) return undefined;
        if (watchPassword.length < 6) return "low";

        let strength = 0;
        if (watchPassword.length >= 8) strength++;
        if (/[A-Z]/.test(watchPassword)) strength++;
        if (/[0-9]/.test(watchPassword)) strength++;
        if (/[^A-Za-z0-9]/.test(watchPassword)) strength++;

        if (strength <= 2) return "low";
        if (strength <= 4) return "medium";
        return "high";
    }, [watchPassword]);

    async function onSubmit(values: ForgetPasswordInput) {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/auth/reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Reset failed");

            setSuccess(true);
            toast.success("Identity restored! Redirecting to login...");
            setTimeout(() => router.push("/auth/sign-in"), 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="bg-background flex min-h-screen flex-col items-center justify-center p-6 text-center">
                <div className="animate-in zoom-in-95 flex flex-col items-center duration-500">
                    <div className="bg-primary/20 mb-8 flex h-20 w-20 items-center justify-center rounded-full ring-8 ring-primary/5">
                        <CheckCircle2 className="text-primary h-12 w-12" />
                    </div>
                    <h2 className="font-outfit mb-3 text-3xl font-bold tracking-tight">Access Restored</h2>
                    <p className="text-muted-foreground text-lg">Your password has been updated. Please sign in with your new credentials.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen font-sans selection:bg-primary/30 selection:text-primary">
            {/* ── Side panel ────────────────────────────────── */}
            <div className="bg-zinc-950 relative hidden w-[420px] flex-shrink-0 flex-col justify-center overflow-hidden p-10 lg:flex">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
                <div className="relative z-10 space-y-6">
                    <Logo size={40} showText={false} />
                    <h2 className="font-outfit text-4xl font-bold leading-tight text-white italic">Self-Sovereign Identity.</h2>
                    <p className="text-white/40 text-sm leading-relaxed max-w-sm">No email needed. No OTP required. Your recovery codes are your true master key.</p>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                        <ShieldCheck className="text-primary h-8 w-8 mb-4" />
                        <h4 className="text-white font-bold mb-2">Zero-Trust Recovery</h4>
                        <p className="text-white/50 text-[11px] leading-normal">Our system uses Bcrypt-hashed offline codes to verify your identity. This prevents SIM swapping and email hijacking attacks.</p>
                    </div>
                </div>
            </div>

            {/* ── Form panel ────────────────────────────────── */}
            <div className="bg-background flex flex-1 flex-col items-center justify-center px-6 py-12">
                <div className="w-full max-w-[440px]">
                    <div className="mb-10">
                        <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/5">
                            <KeyRound className="mr-2 h-3 w-3" /> RESTORE ACCESS
                        </Badge>
                        <h1 className="font-outfit mb-2 text-3xl font-bold tracking-tight">Retrieve your account</h1>
                        <p className="text-muted-foreground text-sm">Please verify your identity using a recovery code.</p>
                    </div>

                    {error && (
                        <div className="bg-destructive/5 border-destructive/20 text-destructive mb-6 flex items-center gap-3 rounded-xl border p-4 text-sm font-medium animate-in shake">
                            <ShieldAlert className="h-4 w-4" /> {error}
                        </div>
                    )}

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem><Input {...field} label="Account Email" type="email" placeholder="your@email.com" /><FormMessage /></FormItem>
                            )} />

                            <div className="bg-muted/30 border border-muted-foreground/10 rounded-xl p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-primary">Challenge Code</span>
                                    <Badge variant="secondary" className="text-[10px] font-mono">CODE #{challengeIndex + 1}</Badge>
                                </div>
                                <FormField control={form.control} name="recoveryCode" render={({ field }) => (
                                    <FormItem>
                                        <Input
                                            {...field}
                                            placeholder="XXXX-XXXX-XXXX"
                                            className="font-mono tracking-widest text-lg"
                                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                        />
                                        <p className="text-[10px] text-muted-foreground leading-tight italic">
                                            Enter the code at position **{challengeIndex + 1}** from your saved list.
                                        </p>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <FormField control={form.control} name="password" render={({ field }) => (
                                    <FormItem><PasswordInput {...field} label="New Password" placeholder="••••••••" strength={passwordStrength} /><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                                    <FormItem><PasswordInput {...field} label="Confirm" placeholder="••••••••" /><FormMessage /></FormItem>
                                )} />
                            </div>

                            <Button type="submit" size="lg" className="bg-primary h-12 w-full rounded-xl font-bold shadow-lg shadow-primary/20" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify Identity & Update Password"}
                            </Button>

                            <div className="text-center pt-4">
                                <Link href="/auth/sign-in" className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4">
                                    Wait, I remember my password
                                </Link>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
