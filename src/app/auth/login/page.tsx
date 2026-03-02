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
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/brand/logo";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
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
        setError("Invalid email or password");
      } else {
        window.location.href = callbackUrl;
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background Orbs - Premium Blue theme */}
      <div className="bg-primary/10 animate-pulse-glow pointer-events-none absolute top-0 left-0 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]" />
      <div className="animate-pulse-glow pointer-events-none absolute right-0 bottom-0 h-[30rem] w-[30rem] translate-x-1/3 translate-y-1/3 rounded-full bg-blue-500/10 blur-[100px] delay-1000" />

      <div className="relative z-10 w-full max-w-md p-4">
        <div className="animate-in fade-in slide-in-from-bottom-5 mb-10 flex flex-col items-center text-center duration-700">
          <Logo size={64} className="hover-lift mb-6" />
          <h1 className="text-foreground text-4xl font-black tracking-tight sm:text-5xl">
            Welcome <span className="text-primary italic">Back</span>
          </h1>
          <p className="text-muted-foreground mt-3 text-lg font-medium">
            Log in to your <span className="text-foreground">NEXT-KVC</span>{" "}
            workspace
          </p>
        </div>

        <div className="glass-panel shadow-3xl shadow-primary/5 animate-in fade-in zoom-in-95 rounded-[2rem] border-white/40 p-10 duration-1000 dark:border-white/5 dark:shadow-black/60">
          {error && (
            <div className="bg-destructive/10 border-destructive/20 text-destructive animate-in shake mb-8 rounded-2xl border p-4 text-center text-sm font-semibold duration-500">
              {error}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    label="Secure Password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                )}
              />

              <Button
                type="submit"
                size="lg"
                className="shadow-primary/20 hover:shadow-primary/40 from-primary mt-4 h-14 w-full rounded-2xl bg-gradient-to-r to-blue-600 text-lg font-bold shadow-xl transition-all hover:-translate-y-0.5"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-3 h-6 w-6 animate-spin" /> Verifying
                    Credentials...
                  </>
                ) : (
                  <>
                    Enter Dashboard <ArrowRight className="ml-3 h-6 w-6" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>

        <div className="text-muted-foreground animate-in fade-in mt-10 text-center text-base delay-500 duration-1000">
          New to NEXT-KVC?{" "}
          <Link
            href="/auth/register"
            className="text-primary decoration-primary/20 font-black underline underline-offset-4 transition-colors hover:text-blue-600 hover:decoration-blue-600/40"
          >
            Create an Account
          </Link>
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
          <div className="relative">
            <Loader2 className="text-primary h-12 w-12 animate-spin" />
            <div className="bg-primary/20 absolute inset-0 animate-pulse blur-xl" />
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

export default DefaultLoginPage;
