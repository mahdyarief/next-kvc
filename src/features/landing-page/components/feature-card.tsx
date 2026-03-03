"use client";

import { cn } from "@/lib/utils";

interface FeatureCardProps {
    icon: React.ReactNode;
    tag: string;
    title: string;
    description: string;
    large?: boolean;
    className?: string;
}

export function FeatureCard({ icon, tag, title, description, large, className }: FeatureCardProps) {
    return (
        <div className={cn(
            "glass-raised group relative overflow-hidden p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5",
            large ? "flex flex-col justify-between" : "",
            className
        )}>
            <div className="from-primary/0 to-primary/[0.04] pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative z-10">
                <div className="mb-4 flex items-center justify-between">
                    <div className="bg-primary/5 text-primary border-primary/20 inline-flex rounded-xl border p-2.5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {icon}
                    </div>
                    <span className="text-muted-foreground/30 font-mono text-[9px] font-bold tracking-widest uppercase">{tag}</span>
                </div>
                <h3 className={cn(
                    "font-outfit text-foreground font-bold tracking-tight",
                    large ? "mb-3 text-2xl sm:text-3xl" : "mb-2 text-lg"
                )}>{title}</h3>
                <p className={cn(
                    "text-muted-foreground/80 leading-relaxed",
                    large ? "text-lg" : "text-sm"
                )}>{description}</p>
            </div>
        </div>
    );
}
