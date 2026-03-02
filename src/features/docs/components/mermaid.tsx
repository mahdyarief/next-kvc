"use client";

import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

export interface MermaidProps {
    chart: string;
}

export function Mermaid({ chart }: MermaidProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.innerHTML = "";
            const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
            mermaid
                .render(id, chart)
                .then(({ svg }) => {
                    if (ref.current) {
                        ref.current.innerHTML = svg;
                    }
                })
                .catch((err: unknown) => {
                    console.error("Mermaid error:", err);
                    if (ref.current) {
                        ref.current.innerHTML = `<div class="text-red-500 text-xs text-center border border-red-200/50 bg-red-50/50 p-4 rounded-lg">Failed to render Mermaid diagram</div>`;
                    }
                });
        }
    }, [chart]);

    return (
        <div className="flex flex-col items-center justify-center py-10">
            <div
                ref={ref}
                className="bg-white p-8 rounded-2xl border border-border/40 shadow-sm transition-all hover:shadow-md cursor-zoom-in overflow-hidden"
            />
            <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                System Architecture Flow
            </p>
        </div>
    );
}
