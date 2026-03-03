"use client";

import { Badge } from "@/components/ui/badge";
import { Kbd } from "@/components/ui/kbd";

interface TechCardProps {
    version: string;
}

export function TechCard({ version }: TechCardProps) {
    const stack = [
        { label: "Next.js", version: "15", color: "text-foreground" },
        { label: "Prisma", version: "6", color: "text-primary" },
        { label: "Tailwind", version: "4", color: "text-blue-600 dark:text-blue-400" },
        { label: "Auth.js", version: "v5", color: "text-foreground" },
    ];

    return (
        <div className="glass-raised w-[280px] overflow-hidden rounded-2xl shadow-2xl">
            <div className="border-b border-border/60 bg-muted/30 px-4 py-3">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-red-400" />
                        <div className="h-2 w-2 rounded-full bg-amber-400" />
                        <div className="h-2 w-2 rounded-full bg-green-400" />
                    </div>
                    <span className="font-mono text-[9px] text-muted-foreground ml-2">package.json</span>
                </div>
            </div>
            <div className="divide-y divide-border/40 px-4">
                {stack.map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-3">
                        <span className={`font-mono text-[11px] font-bold ${item.color}`}>{item.label}</span>
                        <Kbd className="text-[9px] h-5">{item.version}</Kbd>
                    </div>
                ))}
            </div>
            <div className="border-t border-border/60 bg-muted/20 px-4 py-3 flex items-center justify-between">
                <span className="font-mono text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">Edition</span>
                <Badge variant="outline" className="text-primary border-primary/30 text-[9px] h-5">{version}</Badge>
            </div>
        </div>
    );
}
