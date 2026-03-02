"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Zap,
    Shield,
    Brain,
    Target,
    ArrowRight,
    Cpu,
    ShieldAlert,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/brand/logo";
import { SiteFooter } from "@/components/brand/site-footer";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const ONBOARDING_STEPS = [
    {
        title: "The PFC: Strategic Planning",
        description: "The Pre-Frontal Cortex (PFC) phase where we architect your vision. We generate detailed Design Docs in /docs/design/ before writing any code.",
        icon: <Brain className="h-6 w-6" />,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20"
    },
    {
        title: "Incremental Execution",
        description: "Multi-step reasoning breaks your goals into 15-minute testable implementation chunks recorded in task.md. Move with precision, not chaos.",
        icon: <Zap className="h-6 w-6" />,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20"
    },
    {
        title: "Governance & Safety",
        description: "Our Agentic Framework enforces FBA-SOLID-SSOT principles automatically. Every PR and byte is audited for production-grade architectural integrity.",
        icon: <Shield className="h-6 w-6" />,
        color: "text-primary",
        bg: "bg-primary/10",
        border: "border-primary/20"
    }
];

const ARCHITECTURE_PILLARS = [
    {
        name: "FBA",
        image: "/FBA.webp",
        label: "Feature-Based Architecture",
        description: "Co-locate logic, components, and schemas within feature domains. Scale without the mess."
    },
    {
        name: "SOLID",
        image: "/SOLID.webp",
        label: "Professional Engineering",
        description: "Rigorous adherence to Single Responsibility, Dependency Inversion, and maintainable patterns."
    },
    {
        name: "SSOT",
        image: "/SSOT.webp",
        label: "Source of Truth",
        description: "Centralized constants, models, and business logic. Zero duplication, zero confusion."
    }
];

const FRAMEWORK_PHASES = [
    {
        title: "The Strategy & Logic Phase",
        image: "/1-the-strategy-logic-phase.webp",
        description: "Defining the core business rules and logical flow before implementation."
    },
    {
        title: "The Architecture Phase",
        image: "/2-the-architecture-phase.webp",
        description: "Structuring the feature domain using FBA and SOLID principles."
    },
    {
        title: "The Interface Phase",
        image: "/3-the-interface-phase.webp",
        description: "Crafting a premium, interactive UI powered by Vibe Blocks."
    },
    {
        title: "The Execution Phase",
        image: "/4-the-execution-phase.webp",
        description: "Automated auditing and iterative testable chunks in task.md."
    }
];

export default function AgentOnboardingPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const GEMINI_URL = "https://gemini.google.com/gem/11Ykz7NZ_1KKqwfCmi99_D4ThrLSymJkp";

    const handleOnboardingClick = () => {
        setIsModalOpen(true);
    };

    const confirmNavigation = () => {
        window.open(GEMINI_URL, "_blank", "noopener,noreferrer");
        setIsModalOpen(false);
    };

    return (
        <div className="bg-background relative min-h-screen font-sans">
            <div className="bg-mesh-primary fixed inset-0 -z-10 opacity-20" />

            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 px-4 backdrop-blur-md">
                <div className="mx-auto flex h-14 max-w-7xl items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="hover:opacity-80 transition-opacity">
                            <Logo size={28} showText={true} />
                        </Link>
                        <div className="bg-primary/10 text-primary border-primary/20 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-tight uppercase">
                            Agentic Framework
                        </div>
                    </div>

                    <nav className="flex items-center gap-3">
                        <Link href="/docs" className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
                            Docs
                        </Link>
                        <div className="bg-border/60 h-4 w-px" />
                        <Link href="/dashboard" className="bg-foreground text-background rounded-lg px-3 py-1.5 text-xs font-semibold hover:opacity-90 transition-opacity">
                            Start Building
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="mb-32 grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <Badge variant="outline" className="mb-6 border-primary/30 text-primary bg-primary/5 px-4 py-1.5 text-sm font-bold">
                            The Intelligent partner
                        </Badge>
                        <h1 className="font-heading mb-6 text-6xl font-extrabold tracking-tight sm:text-7xl leading-[1.05]">
                            Guided by an <br />
                            <span className="text-primary italic">Agentic Cortex.</span>
                        </h1>
                        <p className="text-muted-foreground text-xl leading-relaxed mb-10 max-w-xl">
                            NextKVC isn&apos;t just a template—it&apos;s a <strong>living AI-Native Professional Factory</strong>. Our Framework provides the governance, memory, and reasoning to turn prompts into production success.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <Button
                                size="lg"
                                onClick={handleOnboardingClick}
                                className="h-14 rounded-2xl px-8 font-bold text-lg shadow-2xl shadow-primary/20"
                            >
                                <Target className="mr-2 h-5 w-5" />
                                Start My Onboarding
                            </Button>
                            <Link href="/docs">
                                <Button variant="ghost" size="lg" className="h-14 font-semibold text-lg">
                                    Explore Memory Docs
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="relative">
                        {/* Visual Agent Workspace Mockup */}
                        <div className="glass-raised overflow-hidden rounded-[2rem] border border-primary/20 shadow-3xl transition-all hover:scale-[1.01]">
                            <div className="border-b border-white/10 bg-white/5 p-5 flex items-center justify-between">
                                <div className="flex gap-1.5">
                                    <div className="h-3 w-3 rounded-full bg-red-400" />
                                    <div className="h-3 w-3 rounded-full bg-amber-400" />
                                    <div className="h-3 w-3 rounded-full bg-green-400" />
                                </div>
                                <div className="flex items-center gap-2 text-primary/60 font-mono text-[10px] uppercase tracking-widest">
                                    <Cpu className="h-3 w-3" />
                                    Reasoning Core V2
                                </div>
                            </div>
                            <div className="p-8 font-mono text-[14px] leading-relaxed select-none">
                                <div className="mb-8">
                                    <div className="flex items-center gap-3 text-emerald-400 mb-4 bg-emerald-400/10 w-fit px-3 py-1 rounded-full border border-emerald-400/20">
                                        <span className="text-[10px] font-bold">LATEST KI</span>
                                        <span className="text-xs">architecture-governance.md</span>
                                    </div>
                                    <div className="pl-6 border-l-2 border-emerald-400/30 space-y-4">
                                        <p className="text-emerald-400/90 italic">Successfully retrieved design principles for your request.</p>
                                        <div className="flex items-center gap-2 text-white/40">
                                            <span className="text-blue-400">Thinking:</span> Breaking down &quot;Payment Integration&quot; into 3 chunks...
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                                        <div className="bg-primary/20 text-primary h-6 w-6 shrink-0 flex items-center justify-center rounded-md font-bold text-[10px]">1</div>
                                        <div>
                                            <h4 className="text-white/80 font-bold text-xs uppercase tracking-wider mb-1">Architecture Planning</h4>
                                            <p className="text-white/40 text-[12px]">Generating Strategy Plan in docs/design/payment-flow.md</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.05] opacity-50">
                                        <div className="bg-primary/10 text-primary/60 h-6 w-6 shrink-0 flex items-center justify-center rounded-md font-bold text-[10px]">2</div>
                                        <div>
                                            <h4 className="text-white/40 font-bold text-xs uppercase tracking-wider mb-1">Service Implementation</h4>
                                            <p className="text-white/30 text-[12px]">Creating StripeService in features/payments/services/</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 flex items-center gap-2 text-primary animate-pulse text-xs font-bold uppercase tracking-widest">
                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                    Awaiting instruction for CHUNK 1...
                                </div>
                            </div>
                        </div>

                        {/* Background elements */}
                        <div className="absolute top-0 right-0 h-64 w-64 bg-primary/20 blur-[100px] -z-10" />
                        <div className="absolute bottom-0 left-0 h-64 w-64 bg-blue-500/20 blur-[100px] -z-10" />
                    </div>
                </div>

                {/* Feature Steps */}
                <div className="mb-32 grid gap-8 md:grid-cols-3">
                    {ONBOARDING_STEPS.map((step, i) => (
                        <div key={i} className="surface-raised group relative flex flex-col overflow-hidden rounded-[2rem] border border-border/40 p-10 transition-all hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5">
                            <div className={cn("mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border shadow-sm transition-transform group-hover:scale-110", step.bg, step.color, step.border)}>
                                {step.icon}
                            </div>
                            <h3 className="font-heading mb-4 text-2xl font-bold">{step.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* The Agentic Lifecycle (Images) */}
                <section className="mb-32">
                    <div className="text-center mb-16 px-4">
                        <Badge variant="outline" className="mb-4 border-amber-500/30 text-amber-600 bg-amber-500/5 px-4 py-1.5 text-sm font-bold">Interactive Framework</Badge>
                        <h2 className="font-heading text-4xl font-bold sm:text-6xl tracking-tight mb-6 leading-tight">The Agentic Lifecycle.</h2>
                        <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
                            Four distinct phases of intelligence that guide every feature from concept to a production-grade asset.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {FRAMEWORK_PHASES.map((phase, i) => (
                            <div key={i} className="group relative surface-raised overflow-hidden rounded-[2.5rem] border border-border/40 p-5 transition-all hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5">
                                <button
                                    onClick={() => setSelectedImage(phase.image)}
                                    className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.75rem] bg-muted/30 border border-border/20 mb-6 cursor-zoom-in group/img h-full text-left"
                                >
                                    <Image
                                        src={phase.image}
                                        alt={phase.title}
                                        fill
                                        className="object-cover rounded-[1.75rem] transition-transform duration-500 group-hover/img:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />
                                </button>
                                <div className="px-2">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                                            {i + 1}
                                        </span>
                                        <h3 className="font-heading font-bold text-xl leading-tight">{phase.title}</h3>
                                    </div>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {phase.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Pillars Section */}
                <section className="relative overflow-hidden rounded-[4rem] border border-border/40 bg-muted/5 p-12 sm:p-24 mb-32 group/pillars">
                    {/* Premium Background Effects */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.05),transparent_70%)]" />
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
                    <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />

                    <div className="relative z-10 text-center mb-24">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            The Trinity
                        </div>
                        <h2 className="font-heading text-5xl font-extrabold sm:text-7xl tracking-tighter mb-6 leading-tight">
                            Our Engineering <br />
                            <span className="text-primary italic">Governance.</span>
                        </h2>
                        <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
                            A triple-layered security and logic framework that ensures your application is built on concrete, not sand.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-16 relative z-10">
                        {ARCHITECTURE_PILLARS.map((pillar, idx) => (
                            <div
                                key={pillar.name}
                                className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both"
                                style={{ animationDelay: `${idx * 150}ms` }}
                            >
                                <button
                                    onClick={() => setSelectedImage(pillar.image)}
                                    className="mb-10 relative group/card aspect-video w-full overflow-hidden rounded-[2.5rem] bg-background/40 backdrop-blur-xl border border-white/10 p-8 transition-all hover:scale-[1.05] hover:border-primary/40 hover:shadow-[0_0_50px_-12px_rgba(var(--primary-rgb),0.2)] cursor-zoom-in"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                                    <div className="relative h-full w-full">
                                        <Image
                                            src={pillar.image}
                                            alt={pillar.name}
                                            fill
                                            className="object-contain rounded-2xl drop-shadow-2xl transition-transform duration-700 group-hover/card:scale-110"
                                        />
                                    </div>

                                    {/* Abstract Pillar Label */}
                                    <div className="absolute -bottom-2 -right-2 font-black text-8xl text-primary/5 tracking-tighter select-none transition-all group-hover/card:text-primary/10 group-hover/card:-translate-x-4 group-hover/card:-translate-y-4">
                                        {pillar.name}
                                    </div>

                                    {/* Scanline Effect */}
                                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] group-hover/card:opacity-[0.08] transition-opacity bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.5)_50%)] bg-[length:100%_4px]" />
                                </button>

                                <h4 className="font-heading font-black text-2xl mb-4 tracking-tight group-hover/pillars:text-primary transition-colors duration-500">{pillar.label}</h4>
                                <p className="text-muted-foreground leading-relaxed text-sm font-medium tracking-wide max-w-[280px]">
                                    {pillar.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-24 flex justify-center relative z-10">
                        <Link href="/docs">
                            <Button size="lg" className="rounded-2xl h-14 px-10 font-bold text-lg bg-primary shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                                Read the Technical Whitepaper
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>

                    {/* High-End Background Orbs */}
                    <div className="absolute -top-24 -right-24 h-96 w-96 bg-primary/10 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
                    <div className="absolute -bottom-24 -left-24 h-96 w-96 bg-blue-500/10 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
                </section>

                {/* CTA */}
                <div className="text-center">
                    <h2 className="font-heading mb-10 text-4xl font-bold tracking-tight sm:text-6xl leading-tight">
                        Ready to partner with <br />
                        <span className="text-primary italic text-shadow-glow">Intelligence?</span>
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Button
                            size="lg"
                            onClick={handleOnboardingClick}
                            className="h-16 rounded-[1.25rem] px-12 font-bold text-xl shadow-3xl shadow-primary/30 transition-all hover:scale-[1.05] hover:rotate-1 active:scale-95"
                        >
                            Onboard Me Now
                            <ArrowRight className="ml-2 h-6 w-6" />
                        </Button>
                        <Link href="https://github.com/kelasvibecoding/next-kvc" target="_blank">
                            <Button variant="outline" size="lg" className="h-16 rounded-[1.25rem] px-12 font-bold text-xl border-border/60 hover:bg-muted/50">
                                View Repository
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>

            <SiteFooter />

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md rounded-[2rem] border-primary/20 bg-background/95 backdrop-blur-xl">
                    <DialogHeader>
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 mx-auto">
                            <ShieldAlert className="h-6 w-6" />
                        </div>
                        <DialogTitle className="text-center font-heading text-2xl font-bold">Accessing Agentic Cortex</DialogTitle>
                        <DialogDescription className="text-center text-muted-foreground text-base mt-2">
                            To ensure you have access to the instructions, please make sure you are logged into your Google account. Shared Gemini links require an active session.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
                        <Button
                            variant="outline"
                            className="rounded-xl h-12 flex-1 font-semibold border-primary/20 hover:bg-primary/5"
                            onClick={() => window.open("https://accounts.google.com/", "_blank", "noopener,noreferrer")}
                        >
                            Step 1: Login to Gemini
                        </Button>
                        <Button
                            className="rounded-xl h-12 flex-1 font-bold shadow-lg shadow-primary/20"
                            onClick={confirmNavigation}
                        >
                            Step 2: Open Instructions
                            <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
                <DialogContent className="max-w-[95vw] w-fit border-none bg-transparent p-0 shadow-none outline-none">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Framework Phase Full View</DialogTitle>
                        <DialogDescription>Full screen preview of the framework phase image.</DialogDescription>
                    </DialogHeader>
                    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl h-[85vh] aspect-video max-w-full mx-auto bg-black/5">
                        {selectedImage && (
                            <Image
                                src={selectedImage}
                                alt="Framework Phase Full View"
                                fill
                                className="object-contain rounded-[2rem] shadow-2xl"
                                priority
                            />
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 bg-black/50 text-white rounded-full hover:bg-black/70 border border-white/10"
                            onClick={() => setSelectedImage(null)}
                        >
                            <ArrowRight className="h-5 w-5 rotate-45" />
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
