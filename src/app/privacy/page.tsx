import Link from "next/link";
import { ArrowLeft, Lock, Shield } from "lucide-react";
import { SiteFooter } from "@/components/brand/site-footer";

export const metadata = {
  title: "Privacy Policy | NEXT-KVC",
  description: "Privacy Policy and Data Handling for NEXT-KVC.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-background selection:bg-primary/30 selection:text-primary-foreground relative min-h-screen overflow-hidden py-24">
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed top-0 right-1/4 -z-10 h-[40rem] w-[40rem] translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-[120px] dark:bg-blue-500/10" />
      <div className="pointer-events-none fixed bottom-0 left-1/4 -z-10 h-[30rem] w-[30rem] -translate-x-1/2 translate-y-1/2 rounded-full bg-emerald-500/5 blur-[100px] dark:bg-emerald-600/10" />

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
            <div className="rounded-2xl bg-blue-500/10 p-3">
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
            <div>
              <h1 className="text-foreground text-3xl font-bold tracking-tight md:text-5xl">
                Privacy Policy
              </h1>
              <p className="text-muted-foreground mt-2">
                Effective Date: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary hover:prose-a:text-primary/80 prose-p:leading-relaxed max-w-none">
            <p className="lead text-muted-foreground mb-8 text-lg">
              At NEXT-KVC, we believe that your data is your property. This Privacy Policy details
              the strict boundaries regarding how information is handled when using our open-source,
              self-hosted Dashboard Template.
            </p>

            <h2 className="mt-8 flex items-center gap-2 border-b pb-2 text-2xl">
              <Lock className="h-6 w-6 text-blue-500" />
              1. Zero-Tracking Architecture
            </h2>
            <p>
              Because NEXT-KVC is designed to be <strong>self-hosted</strong>, all core data
              processing occurs exclusively on the hardware where you deploy the application.
            </p>
            <ul>
              <li>
                <strong>No Centralized Telemetry:</strong> The creators of NEXT-KVC do not receive
                telemetry, analytics, or usage reports about your private dashboard data.
              </li>
              <li>
                <strong>Absolute Data Ownership:</strong> Your user data, activity logs, and system
                configurations remain in your own database. We cannot and will not access it.
              </li>
            </ul>

            <h2 className="mt-8 border-b pb-2 text-2xl">2. Data We Process Locally</h2>
            <p>
              When you deploy the template, the application running on your server interacts with:
            </p>
            <ul>
              <li>
                <strong>Authentication Credentials:</strong> Passwords you create for the dashboard
                are securely hashed using Argon2 or bcrypt before being stored in your local database.
              </li>
              <li>
                <strong>User Profiles:</strong> Information such as names and emails used for
                account management are stored strictly within your environment.
              </li>
              <li>
                <strong>Application Logs:</strong> Audit trails and technical logs are generated locally
                to assist you in monitoring system health and security.
              </li>
            </ul>

            <h2 className="mt-8 border-b pb-2 text-2xl">3. Protecting Your Information</h2>
            <p>
              While NEXT-KVC is built with modern security practices, the ultimate safety of your
              data depends on your hosting environment. We strongly recommend:
            </p>
            <ul>
              <li>
                Deploying the application behind a reverse proxy with enforced{" "}
                <strong>SSL/TLS encryption</strong> (HTTPS).
              </li>
              <li>Securing the host server with firewalls and SSH key authentication.</li>
              <li>
                Keeping the underlying operating system and database environment constantly updated.
              </li>
            </ul>

            <h2 className="mt-8 border-b pb-2 text-2xl">4. Third-Party Integrations</h2>
            <p>
              NEXT-KVC may integrate with external services (such as Vercel Blob, UploadThing, or
              external SMTPS) depending on your configuration. When these services are enabled,
              their respective privacy policies will apply to the data transmitted to them.
            </p>

            <div className="mt-12 rounded-2xl border border-blue-500/10 bg-blue-500/5 p-6">
              <p className="mb-2 font-semibold">Need Further Details?</p>
              <p className="text-muted-foreground mb-0 text-sm">
                If you have specific questions about data handling or wish to audit the code, please
                visit our{" "}
                <Link href="https://github.com/kelasvibecoding/next-kvc">GitHub Repository</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter className="mt-12" />
    </div>
  );
}

