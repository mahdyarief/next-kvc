"use client";

import { Shield, LayoutDashboard, Zap, Database, Sparkles } from "lucide-react";
import { FeatureCard } from "./feature-card";

export function FeaturesGrid() {
    return (
        <section id="features" className="relative py-24 sm:py-32">
            <div className="from-border/0 via-border to-border/0 pointer-events-none absolute top-0 left-8 right-8 h-px bg-gradient-to-r" />

            <div className="mx-auto max-w-6xl px-6">
                <div className="mb-16 max-w-xl text-left">
                    <p className="text-primary mb-3 text-xs font-semibold tracking-widest uppercase">The Foundation</p>
                    <h2 className="font-outfit mb-4 text-3xl font-bold tracking-tight sm:text-5xl">
                        Ready for scale. <br />
                        <span className="text-muted-foreground/50 font-light text-2xl sm:text-4xl">Everything you need out of the box.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <FeatureCard
                        className="lg:col-span-2 lg:row-span-2"
                        icon={<Shield className="h-6 w-6" />}
                        tag="Security"
                        title="Secure Identity"
                        description="Integrated Recovery Code system. No email dependencies. Bcrypt-hashed credentials and Auth.js v5 session management."
                        large
                    />
                    <FeatureCard
                        icon={<LayoutDashboard className="h-5 w-5" />}
                        tag="Architecture"
                        title="FBA Pattern"
                        description="Modular features that grow. Logic, schemas, and UI co-located for maximum speed."
                    />
                    <FeatureCard
                        icon={<Zap className="h-5 w-5" />}
                        tag="Performance"
                        title="Zero-JS Shell"
                        description="RSC-driven core for 100/100 Lighthouse scores. CSS-first entrance effects."
                    />
                    <FeatureCard
                        icon={<Database className="h-5 w-5" />}
                        tag="Data"
                        title="Prisma 6"
                        description="Modular schema patterns with auto-generated audit trails on every record."
                    />
                    <FeatureCard
                        icon={<Sparkles className="h-5 w-5" />}
                        tag="Design"
                        title="Vibe Blocks"
                        description="2,000+ premium components from Relume and Shadcn at your fingertips."
                    />
                </div>
            </div>
        </section>
    );
}
