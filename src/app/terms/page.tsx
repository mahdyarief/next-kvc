import Link from "next/link";
import { ArrowLeft, ShieldCheck, Scale } from "lucide-react";

export const metadata = {
  title: "Terms of Service | NEXT-KVC",
  description: "Terms of Service and Usage Guidelines for NEXT-KVC.",
};

export default function TermsPage() {
  return (
    <div className="bg-background selection:bg-primary/30 selection:text-primary-foreground relative min-h-screen overflow-hidden py-24">
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed top-0 left-1/4 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-[120px] dark:bg-emerald-500/10" />
      <div className="pointer-events-none fixed right-1/4 bottom-0 -z-10 h-[30rem] w-[30rem] translate-x-1/2 translate-y-1/2 rounded-full bg-blue-500/5 blur-[100px] dark:bg-blue-600/10" />

      <div className="relative z-10 container mx-auto max-w-4xl px-4">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground group mb-8 inline-flex items-center text-sm font-medium transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>

        <div className="glass-panel animate-in fade-in slide-in-from-bottom-8 rounded-3xl p-8 shadow-xl shadow-black/5 duration-700 md:p-12 dark:shadow-black/20">
          <div className="mb-8 flex items-center gap-4">
            <div className="bg-primary/10 rounded-2xl p-3">
              <Scale className="text-primary h-8 w-8" />
            </div>
            <div>
              <h1 className="text-foreground text-3xl font-bold tracking-tight md:text-5xl">
                Terms of Service
              </h1>
              <p className="text-muted-foreground mt-2">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary hover:prose-a:text-primary/80 prose-p:leading-relaxed max-w-none">
            <p className="lead text-muted-foreground mb-8 text-lg">
              Welcome to NEXT-KVC. By accessing or using our Next Application Template, you agree to
              be bound by these Terms. If you do not agree, please do not use the service.
            </p>

            <h2 className="mt-8 flex items-center gap-2 border-b pb-2 text-2xl">
              <ShieldCheck className="h-6 w-6 text-emerald-500" />
              1. Data Security & Responsibility
            </h2>
            <p>
              Security forms the core of our service. As a self-hosted platform, NEXT-KVC ensures
              that your data remains strictly within your own infrastructure.
            </p>
            <ul>
              <li>
                <strong>Your Data is Yours:</strong> We do not track, intercept, or sell your
                WhatsApp messages, contact lists, or session data. Your information is secure and
                not misused.
              </li>
              <li>
                <strong>Safe Usage:</strong> You are responsible for ensuring your hardware and
                server environments are properly secured.
              </li>
              <li>
                <strong>Authentication:</strong> You must safeguard your account credentials. Do not
                share your login details with unauthorized personnel.
              </li>
            </ul>

            <h2 className="mt-8 border-b pb-2 text-2xl">2. Acceptable Use Policy</h2>
            <p>
              When utilizing NEXT-KVC&apos;s API, auto-replies, and broadcasting capabilities, you agree
              to abide by WhatsApp&apos;s official Terms of Service and Anti-Spam policies. You agree not
              to:
            </p>
            <ul>
              <li>
                Send unsolicited &quot;spam&quot; messages or bulk promotional campaigns to users who have not
                explicitly opted-in.
              </li>
              <li>
                Use the platform to distribute malicious software, phishing links, or illegal
                content.
              </li>
              <li>
                Attempt to reverse-engineer the core API or overload the service with excessive
                requests.
              </li>
            </ul>

            <h2 className="mt-8 border-b pb-2 text-2xl">3. Account Integrity</h2>
            <p>
              NEXT-KVC provides tools to manage multiple WhatsApp sessions. It is crucial to monitor
              your active devices. If you suspect unauthorized access to your gateway dashboard,
              immediately change your password and revoke any connected WhatsApp sessions from your
              physical device.
            </p>

            <h2 className="mt-8 border-b pb-2 text-2xl">4. Disclaimers and Limitations</h2>
            <p>
              NEXT-KVC is provided &quot;as is&quot; and without warranties of any kind. We utilize third-party
              libraries (such as Baileys) to connect to WhatsApp web protocols. Changes to
              WhatsApp&apos;s internal systems may occasionally disrupt service. We are not liable for
              any account suspensions or bans imposed by WhatsApp as a result of your usage.
            </p>

            <div className="bg-primary/5 border-primary/10 mt-12 rounded-2xl border p-6">
              <p className="mb-2 font-semibold">Have questions about these terms?</p>
              <p className="text-muted-foreground mb-0 text-sm">
                Please review our <Link href="/docs">Documentation</Link> or reach out to the
                project maintainers for further clarification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
