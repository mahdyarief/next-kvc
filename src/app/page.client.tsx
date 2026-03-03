"use client";

import { Navbar } from "@/features/landing-page/components/navbar";
import { HeroSection } from "@/features/landing-page/components/hero-section";
import { FeaturesGrid } from "@/features/landing-page/components/features-grid";
import { AgenticBlueprint } from "@/features/landing-page/components/agentic-blueprint";
import { SiteFooter } from "@/components/brand/site-footer";

export function PageClient() {
    const version = "v1.5.0";

    return (
        <div className="selection:bg-primary/20 selection:text-primary-foreground flex min-h-screen flex-col overflow-x-hidden">
            <Navbar />

            <main className="flex-1">
                <HeroSection version={version} />
                <FeaturesGrid />
                <AgenticBlueprint />
            </main>

            <SiteFooter />
        </div>
    );
}
