"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { FloatingInput as Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/brand/logo";

const formSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

export function DefaultRegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
      <div className="bg-background relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
        <div className="bg-primary/20 pointer-events-none absolute top-0 left-0 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]" />
        <div className="glass-panel animate-in zoom-in shadow-primary/10 flex max-w-sm flex-col items-center rounded-[2.5rem] p-12 text-center shadow-2xl duration-500">
          <div className="from-primary shadow-primary/30 mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br to-blue-600 shadow-xl">
            <Logo size={40} />
          </div>
          <h2 className="text-foreground mb-3 text-3xl font-black tracking-tight italic">
            Welcome Aboard!
          </h2>
          <p className="text-muted-foreground font-medium">
            Your NEXT-KVC workspace is ready.
            <br />
            Redirecting you shortly...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden py-16">
      {/* Background Orbs - Premium Blue theme */}
      <div className="bg-primary/10 animate-pulse-glow pointer-events-none absolute top-0 left-0 h-[50rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]" />
      <div className="animate-pulse-glow pointer-events-none absolute right-0 bottom-0 h-[40rem] w-[40rem] translate-x-1/3 translate-y-1/3 rounded-full bg-blue-500/10 blur-[120px] delay-1000" />

      <div className="relative z-10 w-full max-w-md p-4">
        <div className="animate-in fade-in slide-in-from-bottom-5 mb-10 flex flex-col items-center text-center duration-700">
          <Logo size={64} className="hover-lift mb-6" />
          <h1 className="text-foreground text-4xl font-black tracking-tight sm:text-5xl">
            Create <span className="text-primary italic">Account</span>
          </h1>
          <p className="text-muted-foreground mt-3 text-lg font-medium">
            Get started with your <span className="text-foreground">NEXT-KVC</span> workspace
          </p>
        </div>

        <div className="glass-panel shadow-3xl shadow-primary/5 animate-in fade-in zoom-in-95 rounded-[2rem] border-white/40 p-10 duration-1000 dark:border-white/5 dark:shadow-black/60">
          {error && (
            <div className="bg-destructive/10 border-destructive/20 text-destructive animate-in shake mb-8 rounded-2xl border p-4 text-center text-sm font-semibold duration-500">
              {error}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Full Name"
                    placeholder="Enter your name"
                    autoComplete="name"
                  />
                )}
              />
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
                    autoComplete="new-password"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <PasswordInput
                    {...field}
                    label="Confirm Password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                )}
              />

              <Button
                type="submit"
                size="lg"
                className="shadow-primary/20 hover:shadow-primary/40 from-primary mt-6 h-14 w-full rounded-2xl bg-gradient-to-r to-blue-600 text-lg font-bold shadow-xl transition-all hover:-translate-y-0.5"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-3 h-6 w-6 animate-spin" /> Finalizing
                    Profile...
                  </>
                ) : (
                  <>
                    Create Workspace <ArrowRight className="ml-3 h-6 w-6" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="text-muted-foreground mt-8 text-center text-xs leading-relaxed font-medium">
            By registering, you agree to our{" "}
            <Link
              href="/terms"
              className="text-primary font-bold transition-all hover:underline"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-primary font-bold transition-all hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </div>
        </div>

        <div className="text-muted-foreground animate-in fade-in mt-10 text-center text-base font-medium delay-500 duration-1000">
          Already part of the community?{" "}
          <Link
            href="/auth/login"
            className="text-primary decoration-primary/20 font-black tracking-tight underline underline-offset-4 transition-colors hover:text-blue-600 hover:decoration-blue-600/40"
          >
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DefaultRegisterPage;
