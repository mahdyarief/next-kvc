"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AgenticBlueprint() {
    return (
        <section className="relative py-24 border-y border-border/40 overflow-hidden">
            <div className="mx-auto max-w-6xl px-6">
                <div className="grid lg:grid-cols-2 gap-12 sm:gap-20 items-center">
                    <div className="order-2 lg:order-1">
                        <div className="glass-raised overflow-hidden rounded-2xl border border-primary/20 shadow-2xl transition-all">
                            <div className="border-b border-white/10 bg-white/5 p-3 flex items-center justify-between">
                                <div className="flex gap-1.5">
                                    <div className="h-2 w-2 rounded-full bg-red-400/80" />
                                    <div className="h-2 w-2 rounded-full bg-amber-400/80" />
                                    <div className="h-2 w-2 rounded-full bg-green-400/80" />
                                </div>
                            </div>
                            <div className="p-5 font-mono text-[11px] leading-relaxed text-slate-400">
                                <p className="text-primary mb-2">{"// Starting Agentic Workflow"}</p>
                                <p>✓ [Plan] Recovery Code implementation</p>
                                <p>✓ [Build] verify/route.ts</p>
                                <p className="animate-pulse">{"_ [Optimize] Mobile Responsive Hero..."}</p>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 text-left">
                        <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/5">Intelligence</Badge>
                        <h2 className="font-outfit mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1]">
                            AI-Native <br className="sm:block hidden" />
                            <span className="text-primary">Engineering.</span>
                        </h2>
                        <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed mb-8">
                            A starter kit designed for pair-programming with AI agents. FBA-SOLID-SSOT architecture ensures high clarity for you and your agent.
                        </p>
                        <Link href="/docs/agent-onboarding">
                            <Button size="lg" className="bg-primary hover:bg-primary/90 h-12 w-full sm:w-auto rounded-xl font-bold">
                                Learn the Blueprint
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
