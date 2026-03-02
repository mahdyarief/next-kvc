"use client";

import React from "react";
import Link from "next/link";
import {
    Layout,
    Sparkles,
    ArrowRight,
    LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/brand/logo";
import { SiteFooter } from "@/components/brand/site-footer";

const VIBE_CATEGORIES = [
    {
        id: "marketing",
        label: "Marketing & Conversion",
        description: "High-performance layouts for landing pages and marketing funnels.",
        count: 1500,
        source: "Relume (rl)",
        link: "https://www.relume.io/react/components",
        items: ["Heroes", "Features", "Pricing", "Testimonials", "CTAs", "Footers", "FAQs"]
    },
    {
        id: "dashboard",
        label: "Dashboard & Apps",
        description: "Complex UI for data-rich applications and internal tools.",
        count: 388,
        source: "Shadcn/Custom (cn)",
        link: "https://www.shadcnblocks.com/blocks/all",
        items: ["Sidebars", "Data Tables", "Stat Cards", "Charts", "Settings", "Navbars"]
    },
    {
        id: "visuals",
        label: "Visual Premium",
        description: "Animation-heavy components with Wow-factor.",
        count: 112,
        source: "Shadcn/Custom (cn)",
        link: "https://www.shadcnblocks.com/blocks/all",
        items: ["Aceternity", "Magic UI", "Background Patterns", "Shader Effects"]
    }
];

export default function VibeBlocksPage() {

    return (
        <div className="bg-background relative min-h-screen font-sans">
            <div className="bg-mesh-gold fixed inset-0 -z-10 opacity-30" />

            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 px-4 backdrop-blur-md">
                <div className="mx-auto flex h-14 max-w-7xl items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="hover:opacity-80 transition-opacity">
                            <Logo size={28} showText={true} />
                        </Link>
                        <div className="bg-amber-500/10 text-amber-600 border-amber-500/20 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-tight">
                            EXCLUSIVE ASSET
                        </div>
                    </div>

                    <nav className="flex items-center gap-3">
                        <Link href="/docs" className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
                            Docs
                        </Link>
                        <div className="bg-border/60 h-4 w-px" />
                        <Link href="/dashboard" className="bg-foreground text-background rounded-lg px-3 py-1.5 text-xs font-semibold hover:opacity-90 transition-opacity">
                            Dashboard
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="mb-24 text-center">
                    <Badge variant="outline" className="mb-6 border-amber-500/20 text-amber-600 bg-amber-500/5 px-4 py-1.5 text-sm font-bold">
                        Vibe Blocks Component Registry
                    </Badge>
                    <h1 className="font-heading mb-6 text-5xl font-extrabold tracking-tight sm:text-7xl">
                        2,000+ Components. <br />
                        <span className="text-gradient">Ready to ship.</span>
                    </h1>
                    <p className="text-muted-foreground mx-auto max-w-2xl text-xl leading-relaxed">
                        The ultimate design-to-code factory. A curated library of production-grade UI blocks from Relume and Shadcn/Custom, optimized for Next.js 15.
                    </p>


                </div>

                {/* Categories Grid */}
                <div className="mb-32 grid gap-8 md:grid-cols-3">
                    {VIBE_CATEGORIES.map((cat) => (
                        <div key={cat.id} className="surface-raised group relative flex flex-col overflow-hidden rounded-3xl border border-border/40 p-8 transition-all hover:border-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/5">
                            <div className="mb-6 flex items-center justify-between">
                                <div className="bg-amber-500/10 text-amber-600 flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/20 shadow-sm transition-transform group-hover:scale-110">
                                    {cat.id === "marketing" ? <Layout className="h-6 w-6" /> : cat.id === "dashboard" ? <LayoutDashboard className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
                                </div>
                                <div className="text-right">
                                    <p className="text-amber-600 font-heading text-2xl font-black">{cat.count}</p>
                                    <p className="text-muted-foreground/40 text-[9px] font-bold uppercase tracking-widest leading-none">Sections</p>
                                </div>
                            </div>

                            <h3 className="font-heading mb-3 text-xl font-bold">{cat.label}</h3>
                            <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                                {cat.description}
                            </p>

                            <div className="mt-auto space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {cat.items.map(item => (
                                        <span key={item} className="bg-muted/50 text-muted-foreground/60 rounded-md border border-border/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between border-t border-border/40 pt-6">
                                    <span className="text-muted-foreground/40 text-[10px] font-bold tracking-widest uppercase">{cat.source}</span>
                                    <Link
                                        href={cat.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:text-primary/80 flex items-center gap-1.5 text-xs font-bold transition-colors"
                                    >
                                        View Registry
                                        <ArrowRight className="h-3 w-3" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* How to use */}
                <section className="surface-raised relative overflow-hidden rounded-[2.5rem] border border-border/40 p-8 sm:p-16">
                    <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="font-heading mb-6 text-3xl font-bold tracking-tight sm:text-5xl leading-tight">
                                Integrated in <br />
                                <span className="text-primary">Your Agent Workspace.</span>
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-lg">
                                Searching for the perfect component shouldn&apos;t be a chore. Run the search script directly in your terminal, or ask the Agent to find the best layout for your needs.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-sm">1</div>
                                    <div>
                                        <h4 className="font-bold text-foreground mb-1">Search the Index</h4>
                                        <p className="text-muted-foreground text-sm">Run <code>python search.py &quot;hero&quot;</code> to find matching components.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-sm">2</div>
                                    <div>
                                        <h4 className="font-bold text-foreground mb-1">Copy and Adapt</h4>
                                        <p className="text-muted-foreground text-sm">Review the source code and adapt the imports to match the project aliases.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-sm">3</div>
                                    <div>
                                        <h4 className="font-bold text-foreground mb-1">Scale with FBA</h4>
                                        <p className="text-muted-foreground text-sm">Place your new components in the appropriate <code>src/features</code> domain.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-raised overflow-hidden rounded-2xl border border-white/10 bg-[#0f1117] shadow-3xl">
                            <div className="border-b border-white/5 bg-white/5 p-4 flex items-center justify-between">
                                <div className="flex gap-1.5">
                                    <div className="h-2 w-2 rounded-full bg-red-400/50" />
                                    <div className="h-2 w-2 rounded-full bg-amber-400/50" />
                                    <div className="h-2 w-2 rounded-full bg-green-400/50" />
                                </div>
                                <span className="font-mono text-[10px] text-white/20">terminal</span>
                            </div>
                            <div className="p-6 font-mono text-[13px] leading-relaxed">
                                <div className="flex items-center gap-3 text-white/40 mb-2">
                                    <span>$ python search.py &quot;pricing table&quot; --source rl</span>
                                </div>
                                <div className="space-y-2 text-primary/80">
                                    <div>Searching Registry... Done.</div>
                                    <div className="text-emerald-400">Found: [pricing-1] [pricing-4] [pricing-table-dark]</div>
                                    <div className="text-white/40 mt-4">Analyzing objective: high-conversion subscription page...</div>
                                    <div className="text-white/40 italic">Result: Recommending [pricing-4] for mobile responsiveness.</div>
                                </div>
                                <div className="mt-8 pt-4 border-t border-white/5">
                                    <div className="text-amber-500 animate-pulse">Ready to copy to src/features/billing...</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 h-64 w-64 bg-amber-500/10 blur-[100px] -z-10" />
                    <div className="absolute bottom-0 left-0 h-64 w-64 bg-primary/10 blur-[100px] -z-10" />
                </section>

                {/* CTA */}
                <div className="mt-32 text-center pb-24">
                    <h2 className="font-heading mb-8 text-3xl font-bold tracking-tight sm:text-4xl">
                        Stop building from scratch. <br />
                        <span className="text-muted-foreground">Start building from the best.</span>
                    </h2>
                    <Link href="/dashboard">
                        <Button size="lg" className="h-14 rounded-2xl px-12 font-bold text-lg shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02]">
                            Explore Dashboard Shell
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </main>

            <SiteFooter />
        </div>
    );
}
