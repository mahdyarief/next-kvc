"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { FloatingInput as Input } from "@/components/ui/input";
import { PasswordInput, PasswordStrength } from "@/components/ui/password-input";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { ArrowRight, Loader2, Shield, Zap, Bell, CheckCircle2, ShieldCheck, Info } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { registerFormSchema, RegisterFormInput } from "@/features/auth/constants";
import { cn } from "@/lib/utils";

const FEATURES = [
  { icon: Shield, text: "Enterprise-grade security standards" },
  { icon: Zap, text: "High-performance dashboard shell" },
  { icon: Bell, text: "Real-time system notifications" },
];

export function DefaultRegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<RegisterFormInput>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const watchPassword = form.watch("password");

  const passwordStrength = useMemo((): PasswordStrength | undefined => {
    if (!watchPassword) return undefined;
    if (watchPassword.length < 6) return "low";

    let strength = 0;
    if (watchPassword.length >= 8) strength++;
    if (/[A-Z]/.test(watchPassword)) strength++;
    if (/[a-z]/.test(watchPassword)) strength++;
    if (/[0-9]/.test(watchPassword)) strength++;
    if (/[^A-Za-z0-9]/.test(watchPassword)) strength++;

    if (strength <= 2) return "low";
    if (strength <= 4) return "medium";
    return "high";
  }, [watchPassword]);

  async function onSubmit(values: RegisterFormInput) {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to register");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-background flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <div className="bg-mesh-gold fixed inset-0 -z-10" />
        <div className="animate-in zoom-in-95 flex flex-col items-center duration-500">
          <div className="bg-primary/20 mb-8 flex h-20 w-20 items-center justify-center rounded-full ring-8 ring-primary/5">
            <CheckCircle2 className="text-primary h-12 w-12" />
          </div>
          <h2 className="font-outfit mb-3 text-3xl font-bold tracking-tight">
            Account Created!
          </h2>
          <p className="text-muted-foreground text-lg">
            Welcome aboard. Redirecting you to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen font-sans selection:bg-primary/30 selection:text-primary">
      {/* ── Left panel — brand ─────────────────────────── */}
      <div className="bg-zinc-950 relative hidden w-[420px] flex-shrink-0 flex-col justify-between overflow-hidden p-10 lg:flex xl:w-[480px]">
        {/* Obsidian Gold mesh overlay — Premium Depth */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 30% 20%, oklch(0.78 0.15 82 / 0.12) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 70% 80%, oklch(0.65 0.18 260 / 0.08) 0%, transparent 60%)",
          }}
        />

        {/* Top — Logo */}
        <div className="relative z-10 animate-in slide-in-from-top-4 duration-700">
          <Logo size={40} showText={false} />
        </div>

        {/* Mid — Brand statement */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
            <span className="bg-primary/20 border-primary/30 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <ShieldCheck className="h-3 w-3" />
              Secure Registration
            </span>
            <h2 className="font-outfit text-4xl font-bold leading-tight text-white xl:text-5xl">
              Start your journey with{" "}
              <span className="bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent italic">Premium</span>{" "}
              Infrastructure.
            </h2>
          </div>
          <p className="text-white/50 animate-in fade-in slide-in-from-left-4 max-w-sm text-sm leading-relaxed duration-700 delay-200">
            Join the elite community of developers building modern applications
            with the best-in-class Next.js starter kit.
          </p>
          <ul className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-700 delay-300">
            {FEATURES.map(({ icon: Icon, text }, idx) => (
              <li key={text} className="flex items-center gap-3 text-sm text-white/70">
                <div className="bg-primary/20 border-primary/30 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border">
                  <Icon className="text-primary h-4 w-4" />
                </div>
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom — Keyboard hint */}
        <div className="relative z-10 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
          <span className="text-xs text-white/30 italic">Registration is fast via</span>
          <KbdGroup>
            <Kbd className="border-white/20 bg-white/10 text-white/50 font-mono text-[10px] shadow-none">Web Forms</Kbd>
          </KbdGroup>
        </div>
      </div>

      {/* ── Right panel — form ─────────────────────────── */}
      <div className="bg-background flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="bg-mesh-gold fixed inset-0 -z-10 opacity-30 lg:hidden" />

        {/* Mobile logo */}
        <div className="mb-12 lg:hidden">
          <Logo size={40} showText={true} />
        </div>

        <div className="w-full max-w-[400px]">
          {/* Header */}
          <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="font-outfit mb-2 text-3xl font-bold tracking-tight">
              Create an account
            </h1>
            <p className="text-muted-foreground text-sm">
              Enter your details to register your workspace
            </p>
          </div>

          {/* Error state */}
          {error && (
            <div className="bg-destructive/5 border-destructive/20 text-destructive mb-6 flex items-center gap-3 rounded-xl border p-4 text-sm font-medium animate-in slide-in-from-top-2">
              <div className="bg-destructive/10 flex h-6 w-6 items-center justify-center rounded-full">
                <Info className="h-3 w-3" />
              </div>
              {error}
            </div>
          )}

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Input
                      {...field}
                      label="Full Name"
                      placeholder="Enter your name"
                      autoComplete="name"
                      className="transition-all focus:ring-0"
                    />
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Input
                      {...field}
                      label="Email Address"
                      placeholder="your@email.com"
                      type="email"
                      autoComplete="email"
                      className="transition-all focus:ring-0"
                    />
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <PasswordInput
                        {...field}
                        label="Password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        strength={passwordStrength}
                      />
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <PasswordInput
                        {...field}
                        label="Confirm"
                        placeholder="••••••••"
                        autoComplete="new-password"
                      />
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Password Requirements hint */}
              <div className="bg-muted/30 flex flex-col gap-2 rounded-xl p-3 text-[10px] text-muted-foreground transition-all duration-300">
                <div className="flex items-center gap-2">
                  <Info className="h-3 w-3 text-primary opacity-50" />
                  <span className="font-semibold uppercase tracking-wider">Password Requirements</span>
                </div>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-1 pl-5 list-disc">
                  <li className={cn(watchPassword?.length >= 8 && "text-primary/70")}>8+ characters</li>
                  <li className={cn(/[A-Z]/.test(watchPassword || "") && "text-primary/70")}>Uppercase letter</li>
                  <li className={cn(/[a-z]/.test(watchPassword || "") && "text-primary/70")}>Lowercase letter</li>
                  <li className={cn(/[0-9]/.test(watchPassword || "") && "text-primary/70")}>A number</li>
                </ul>
              </div>

              <Button
                type="submit"
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground relative mt-4 h-12 w-full overflow-hidden rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Initializing Workspace…
                  </>
                ) : (
                  <>
                    <span className="z-10 flex items-center gap-2">
                      Create Account
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* Legal / Social */}
          <div className="mt-8 text-center text-[11px] text-muted-foreground leading-relaxed animate-in fade-in duration-1000 delay-300">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline font-semibold decoration-primary/30 underline-offset-4">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline font-semibold decoration-primary/30 underline-offset-4">
              Privacy Policy
            </Link>
            .
          </div>

          {/* Footer links */}
          <div className="mt-10 flex flex-col items-center gap-6 text-sm animate-in fade-in duration-1000 delay-400">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-primary hover:text-primary/80 font-bold underline decoration-primary/30 underline-offset-4 transition-colors"
              >
                Sign In
              </Link>
            </p>
            <Link
              href="/"
              className="group text-muted-foreground hover:text-foreground flex items-center gap-2 text-xs transition-colors"
            >
              <span className="transition-transform group-hover:-translate-x-1">←</span>
              Back home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DefaultRegisterPage;
