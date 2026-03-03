"use client";

import Link from "next/link";
import { ArrowRight, BookText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Badge } from "@/components/ui/badge";
import { TechCard } from "./tech-card";

interface HeroSectionProps {
    version: string;
}

export function HeroSection({ version }: HeroSectionProps) {
    return (
        <section className="relative flex min-h-[92vh] items-center pt-32 pb-24 lg:pt-44 lg:pb-36">
            <div className="from-primary/0 via-primary/30 to-primary/0 pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r" />

            <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
                <div className="grid items-center gap-16 lg:grid-cols-[1fr_auto]">
                    <div className="max-w-2xl text-left">
                        <div className="mb-8 inline-flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-700">
                            <Badge
                                variant="outline"
                                className="border-primary/30 text-primary bg-primary/5 gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold"
                            >
                                <span className="bg-primary h-1.5 w-1.5 rounded-full" />
                                {version} — Now live
                            </Badge>
                        </div>

                        <h1 className="font-outfit mb-6 text-[clamp(2.5rem,8vw,5.5rem)] font-bold leading-[1.05] tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 text-foreground">
                            Build your next <br className="hidden sm:block" />
                            <span className="text-gradient">big thing</span> <br />
                            <span className="text-muted-foreground/60 font-light">faster than ever.</span>
                        </h1>

                        <p className="text-muted-foreground mb-10 max-w-xl text-lg leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 sm:text-xl">
                            A premium, production-ready starter featuring{" "}
                            <span className="text-foreground font-medium">Next.js 15</span>,{" "}
                            <span className="text-foreground font-medium">Prisma ORM</span>,{" "}
                            <span className="text-foreground font-medium">Auth.js v5</span>, and a
                            fully-crafted dashboard shell.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-3 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                            <Link href="/dashboard" className="w-full sm:w-auto">
                                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground group h-12 w-full rounded-xl px-8 font-bold shadow-lg transition-all">
                                    Enter Dashboard
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                </Button>
                            </Link>
                            <Link href="/docs" className="w-full sm:w-auto">
                                <Button variant="outline" size="lg" className="h-12 w-full rounded-xl px-8 font-semibold transition-all">
                                    <BookText className="mr-2 h-4 w-4" />
                                    Read Docs
                                </Button>
                            </Link>
                        </div>

                        <div className="mt-10 flex items-center gap-2 animate-in fade-in duration-1000 delay-500">
                            <span className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold">Standard DX →</span>
                            <KbdGroup>
                                <Kbd className="text-[10px]">npx</Kbd>
                                <Kbd className="text-[10px]">next-kvc</Kbd>
                            </KbdGroup>
                        </div>
                    </div>

                    <div className="hidden lg:block animate-in fade-in slide-in-from-right-8 duration-1000 delay-400">
                        <TechCard version={version} />
                    </div>
                </div>
            </div>
        </section>
    );
}
