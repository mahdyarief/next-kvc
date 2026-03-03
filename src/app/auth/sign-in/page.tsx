"use client";

import { useState, Suspense, useEffect } from "react";
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
import { ArrowRight, Loader2, Shield, Zap, Bell, CheckSquare } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { checkCaptchaRequirement } from "@/features/auth/server/captcha.action";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  captchaAnswer: z.string().optional(),
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
  const [captcha, setCaptcha] = useState<{ required: boolean; question?: string; token?: string } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "", captchaAnswer: "" },
  });

  const fetchCaptchaState = async () => {
    try {
      const state = await checkCaptchaRequirement();
      setCaptcha(state);
    } catch {
      // Fail silently
    }
  };

  useEffect(() => {
    fetchCaptchaState();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        captchaToken: captcha?.token || "",
        captchaAnswer: values.captchaAnswer || "",
      });
      if (result?.error) {
        if (result.error === "InvalidCaptcha" || result.code === "InvalidCaptcha") {
          setError("Anti-bot verification failed. Please try again.");
        } else {
          setError("Invalid email or password. Please try again.");
        }
        await fetchCaptchaState();
        form.setValue("captchaAnswer", "");
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
        <div className="relative z-10">
          <Logo size={40} showText={false} />
        </div>

        {/* Mid — Brand statement */}
        <div className="relative z-10 space-y-6">
          <h2 className="font-heading text-3xl font-bold leading-tight text-white xl:text-4xl">
            Your premium{" "}
            <span className="bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">Next.js</span>{" "}
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
                  />
                )}
              />

              {captcha?.required && (
                <div className="animate-in fade-in slide-in-from-top-2 space-y-3 rounded-xl border border-primary/20 bg-primary/5 p-4 data-[state=open]:animate-in">
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <CheckSquare className="h-4 w-4" />
                    Human Verification Required
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Due to multiple failed login attempts from your IP address, please solve this math problem to continue.
                  </p>
                  <FormField
                    control={form.control}
                    name="captchaAnswer"
                    render={({ field }) => (
                      <Input
                        {...field}
                        label={`What is ${captcha.question}?`}
                        placeholder="Answer"
                        type="number"
                        autoComplete="off"
                        required
                      />
                    )}
                  />
                </div>
              )}

              <div className="flex justify-end pt-1 pr-1">
                <Link
                  href="/auth/forgot-password"
                  className="text-primary hover:text-primary/80 text-[11px] font-bold underline decoration-primary/20 underline-offset-4 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>

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

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            type="button"
            className="w-full h-11 rounded-lg font-semibold shadow-sm transition-all"
            disabled={loading}
            onClick={() => {
              setLoading(true);
              signIn("google", { callbackUrl });
            }}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="mr-2 h-5 w-5"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            Google
          </Button>

          {/* Footer links */}
          <div className="mt-6 flex items-center justify-between text-sm">
            <p className="text-muted-foreground">
              No account?{" "}
              <Link
                href="/auth/sign-up"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Sign Up
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
