"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { FloatingInput as Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { ArrowRight, Loader2, Shield, Zap, Bell } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const FEATURES = [
  { icon: Shield, text: "Secure Auth.js v5 sessions" },
  { icon: Zap, text: "Blazing fast with Next.js 15" },
  { icon: Bell, text: "Real-time notification system" },
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });
      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        window.location.href = callbackUrl;
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* ── Left panel — brand ─────────────────────────── */}
      <div className="bg-foreground relative hidden w-[420px] flex-shrink-0 flex-col justify-between overflow-hidden p-10 lg:flex xl:w-[480px]">
        {/* Gold mesh overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 30% 20%, oklch(0.65 0.18 72 / 0.18) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 70% 80%, oklch(0.72 0.14 90 / 0.1) 0%, transparent 60%)",
          }}
        />
        {/* Top — Logo */}
        <div className="relative z-10">
          <Logo size={40} showText={false} />
        </div>

        {/* Mid — Brand statement */}
        <div className="relative z-10 space-y-6">
          <h2 className="font-heading text-3xl font-bold leading-tight text-white xl:text-4xl">
            Your premium{" "}
            <span className="text-gradient">Next.js</span>{" "}
            dashboard starter.
          </h2>
          <p className="text-white/50 text-sm leading-relaxed">
            Everything you need to ship a production-grade web application.
            Auth, database, notifications, and a beautiful dashboard — ready on day one.
          </p>
          <ul className="space-y-3">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-white/70">
                <div className="bg-primary/20 border-primary/30 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border">
                  <Icon className="text-primary h-3.5 w-3.5" />
                </div>
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom — Keyboard hint */}
        <div className="relative z-10 flex items-center gap-2">
          <span className="text-xs text-white/30">Submit with</span>
          <KbdGroup>
            <Kbd className="border-white/20 bg-white/10 text-white/60 shadow-none">Enter</Kbd>
          </KbdGroup>
        </div>
      </div>

      {/* ── Right panel — form ─────────────────────────── */}
      <div className="bg-background flex flex-1 flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <div className="mb-8 lg:hidden">
          <Logo size={44} showText={true} />
        </div>

        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading mb-2 text-2xl font-bold tracking-tight">
              Welcome back
            </h1>
            <p className="text-muted-foreground text-sm">
              Sign in to your account to continue
            </p>
          </div>

          {/* Error state */}
          {error && (
            <div className="bg-destructive/10 border-destructive/20 text-destructive mb-6 rounded-lg border p-3 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Email Address"
                    placeholder="your@email.com"
                    type="email"
                    autoComplete="email"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <PasswordInput
                    {...field}
                    label="Password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                )}
              />

              <Button
                type="submit"
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground mt-2 h-11 w-full rounded-lg font-semibold shadow-sm transition-all"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* Footer links */}
          <div className="mt-6 flex items-center justify-between text-sm">
            <p className="text-muted-foreground">
              No account?{" "}
              <Link
                href="/auth/register"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Register
              </Link>
            </p>
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground text-xs transition-colors"
            >
              ← Back home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DefaultLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-background flex min-h-screen items-center justify-center">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

export default DefaultLoginPage;
