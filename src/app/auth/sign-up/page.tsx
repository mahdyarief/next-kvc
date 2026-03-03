"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { FloatingInput as Input } from "@/components/ui/input";
import { PasswordInput, PasswordStrength } from "@/components/ui/password-input";
import { Loader2, Shield, Zap, Bell, CheckCircle2, ShieldCheck, Info, Copy, Check, ShieldAlert, KeyRound } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { registerFormSchema, RegisterFormInput, RECOVERY_CONFIG } from "@/features/auth/constants";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const FEATURES = [
  { icon: Shield, text: "Enterprise-grade recovery standards" },
  { icon: Zap, text: "Self-contained account security" },
  { icon: Bell, text: "Real-time registration sync" },
];

type Step = "IDENTITY" | "RECOVERY_DISPLAY" | "RECOVERY_VERIFY";

export function DefaultSignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("IDENTITY");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Registration State
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [challengeInput, setChallengeInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [tempCredentials, setTempCredentials] = useState<{ email: string; password: string } | null>(null);

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

  async function onIdentitySubmit(values: RegisterFormInput) {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to start registration");

      setRecoveryCodes(result.data.recoveryCodes);
      setTempCredentials({ email: values.email, password: values.password });
      setStep("RECOVERY_DISPLAY");
      toast.success("Identity secured. Now save your recovery codes.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  const handleCopyCodes = () => {
    const text = recoveryCodes.join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("All codes copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  async function onVerifyCode() {
    if (!tempCredentials) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/sign-up/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: tempCredentials.email,
          challengeCode: challengeInput.trim(),
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Verification failed");

      // SUCCESS: Auto Login
      setSuccess(true);
      const signInResult = await signIn("credentials", {
        redirect: false,
        email: tempCredentials.email,
        password: tempCredentials.password,
      });

      if (signInResult?.error) {
        toast.error("Auto-login failed. Please sign in manually.");
        router.push("/auth/sign-in");
      } else {
        toast.success("Account activated! Landing on your dashboard...");
        setTimeout(() => router.push("/dashboard"), 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid recovery code");
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
            Identity Verified!
          </h2>
          <p className="text-muted-foreground text-lg">
            Welcome aboard. Launching your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen font-sans selection:bg-primary/30 selection:text-primary">
      {/* ── Left panel — brand ─────────────────────────── */}
      <div className="bg-zinc-950 relative hidden w-[420px] flex-shrink-0 flex-col justify-between overflow-hidden p-10 lg:flex xl:w-[480px]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 30% 20%, oklch(0.78 0.15 82 / 0.12) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 70% 80%, oklch(0.65 0.18 260 / 0.08) 0%, transparent 60%)",
          }}
        />

        <div className="relative z-10 animate-in slide-in-from-top-4 duration-700">
          <Logo size={40} showText={false} />
        </div>

        <div className="relative z-10 space-y-8">
          <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
            <span className="bg-primary/20 border-primary/30 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <ShieldCheck className="h-3 w-3" />
              {step === "IDENTITY" ? "Identity Security" : "Passcode Encryption"}
            </span>
            <h2 className="font-outfit text-4xl font-bold leading-tight text-white xl:text-5xl">
              {step === "IDENTITY" ? (
                <>Build with <span className="bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent italic">Confidence</span>.</>
              ) : (
                <>Secure your <span className="bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent italic">Recovery</span> Keys.</>
              )}
            </h2>
          </div>
          <p className="text-white/50 animate-in fade-in slide-in-from-left-4 max-w-sm text-sm leading-relaxed duration-700 delay-200">
            {step === "IDENTITY" ?
              "Every account starts with a rock-solid identity layer and enterprise recovery standards." :
              "These codes are your ONLY way to regain access if you forget your password. We don't use email reset for maximum privacy."}
          </p>
          <ul className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-700 delay-300">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-white/70">
                <div className="bg-primary/20 border-primary/30 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border">
                  <Icon className="text-primary h-4 w-4" />
                </div>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
          <span className="text-xs text-white/30 italic">Step {step === "IDENTITY" ? "1/3" : step === "RECOVERY_DISPLAY" ? "2/3" : "3/3"}</span>
          <div className="bg-white/10 h-1 flex-1 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-500"
              style={{ width: step === "IDENTITY" ? "33%" : step === "RECOVERY_DISPLAY" ? "66%" : "100%" }}
            />
          </div>
        </div>
      </div>

      {/* ── Right panel — wizard ───────────────────────── */}
      <div className="bg-background flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="bg-mesh-gold fixed inset-0 -z-10 opacity-30 lg:hidden" />

        <div className="w-full max-w-[440px]">
          {/* STEP 1: IDENTITY */}
          {step === "IDENTITY" && (
            <div className="animate-in fade-in duration-500">
              <div className="mb-10">
                <h1 className="font-outfit mb-2 text-3xl font-bold tracking-tight">Create an account</h1>
                <p className="text-muted-foreground text-sm">Enter your details and secure your workspace</p>
              </div>

              {error && (
                <div className="bg-destructive/5 border-destructive/20 text-destructive mb-6 flex items-center gap-3 rounded-xl border p-4 text-sm font-medium animate-in slide-in-from-top-2">
                  <Info className="h-4 w-4" />
                  {error}
                </div>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onIdentitySubmit)} className="space-y-5">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><Input {...field} label="Full Name" placeholder="Enter your name" autoComplete="name" className="transition-all focus:ring-0" /><FormMessage className="text-[11px]" /></FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><Input {...field} label="Email Address" type="email" placeholder="your@email.com" autoComplete="email" className="transition-all focus:ring-0" /><FormMessage className="text-[11px]" /></FormItem>
                  )} />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField control={form.control} name="password" render={({ field }) => (
                      <FormItem><PasswordInput {...field} label="Password" placeholder="••••••••" autoComplete="new-password" strength={passwordStrength} /><FormMessage className="text-[11px]" /></FormItem>
                    )} />
                    <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                      <FormItem><PasswordInput {...field} label="Confirm" placeholder="••••••••" autoComplete="new-password" /><FormMessage className="text-[11px]" /></FormItem>
                    )} />
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

                  <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground relative mt-4 h-12 w-full overflow-hidden rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Next: Secure My Account"}
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
                  signIn("google", { callbackUrl: "/dashboard" });
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
                    href="/auth/sign-in"
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
          )}

          {/* STEP 2: RECOVERY DISPLAY */}
          {step === "RECOVERY_DISPLAY" && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="mb-8">
                <div className="bg-amber-500/10 text-amber-600 mb-4 flex w-fit items-center gap-2 rounded-lg border border-amber-500/20 px-3 py-1.5 text-xs font-bold">
                  <ShieldAlert className="h-4 w-4" /> CRITICAL STEP
                </div>
                <h1 className="font-outfit mb-2 text-3xl font-bold tracking-tight">Your Recovery Codes</h1>
                <p className="text-muted-foreground text-sm">Save these codes in a password manager. They will NEVER be shown again.</p>
              </div>

              <div className="relative mb-8 rounded-2xl bg-zinc-950 p-6 shadow-xl ring-1 ring-white/10">
                <div className="grid grid-cols-2 gap-4">
                  {recoveryCodes.map((code, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <span className="text-[10px] text-zinc-500 font-mono">CODE #{i + 1}</span>
                      <code className="text-zinc-200 text-sm font-mono tracking-tight">{code}</code>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handleCopyCodes}
                  variant="ghost"
                  className="absolute right-3 top-3 h-8 text-zinc-400 hover:text-white hover:bg-white/5"
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={() => setStep("RECOVERY_VERIFY")}
                  size="lg"
                  className="bg-primary h-12 w-full rounded-xl font-bold"
                >
                  I&apos;ve Secured My Codes
                </Button>
                <p className="text-center text-[11px] text-muted-foreground italic">You will be asked to verify one code on the next step.</p>
              </div>
            </div>
          )}

          {/* STEP 3: RECOVERY VERIFY */}
          {step === "RECOVERY_VERIFY" && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="mb-10">
                <div className="bg-primary/10 text-primary mb-4 flex w-fit items-center gap-2 rounded-lg border border-primary/20 px-3 py-1.5 text-xs font-bold">
                  <KeyRound className="h-4 w-4" /> VERIFICATION
                </div>
                <h1 className="font-outfit mb-2 text-3xl font-bold tracking-tight">Prove your key</h1>
                <p className="text-muted-foreground text-sm">Please paste **Code #{RECOVERY_CONFIG.CHALLENGE_INDEX + 1}** below to complete your registration.</p>
              </div>

              {error && (
                <div className="bg-destructive/5 border-destructive/20 text-destructive mb-6 flex items-center gap-3 rounded-xl border p-4 text-sm font-medium animate-in shake">
                  <ShieldAlert className="h-4 w-4" /> {error}
                </div>
              )}

              <div className="space-y-6">
                <Input
                  label={`Recovery Code #${RECOVERY_CONFIG.CHALLENGE_INDEX + 1}`}
                  placeholder="XXXX-XXXX-XXXX"
                  value={challengeInput}
                  onChange={(e) => setChallengeInput(e.target.value.toUpperCase())}
                  className="font-mono tracking-widest text-lg"
                />

                <div className="flex flex-col gap-3">
                  <Button
                    onClick={onVerifyCode}
                    size="lg"
                    className="bg-primary h-12 w-full rounded-xl font-bold shadow-lg shadow-primary/20"
                    disabled={loading || !challengeInput}
                  >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify & Activate Account"}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setStep("RECOVERY_DISPLAY")}
                    className="text-muted-foreground h-10 w-full text-xs"
                    disabled={loading}
                  >
                    ← Back to codes
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DefaultSignUpPage;
