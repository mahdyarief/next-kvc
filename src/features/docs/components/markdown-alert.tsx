"use client";

import React from "react";
import { Info, Lightbulb, AlertCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MarkdownAlertProps extends React.ComponentPropsWithoutRef<"blockquote"> {
    node?: unknown;
}

export const MarkdownAlert = ({ children, node: _node, ...props }: MarkdownAlertProps) => {
    // GitHub Alert Parsing Logic
    const childrenArray = React.Children.toArray(children);
    const firstChild = childrenArray[0];
    let alertType: "NOTE" | "TIP" | "IMPORTANT" | "WARNING" | "CAUTION" | null = null;
    let refinedChildren = children;

    if (React.isValidElement(firstChild)) {
        const firstChildProps = firstChild.props as { children?: React.ReactNode };
        if (firstChildProps.children) {
            const firstLine = Array.isArray(firstChildProps.children)
                ? firstChildProps.children[0]
                : firstChildProps.children;

            if (typeof firstLine === 'string') {
                const match = firstLine.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/);
                if (match) {
                    alertType = match[1] as "NOTE" | "TIP" | "IMPORTANT" | "WARNING" | "CAUTION";
                    // Clone the first child to remove the alert marker
                    const remainingText = firstLine.replace(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/, "").trim();
                    const newFirstChild = React.cloneElement(firstChild as React.ReactElement<{ children?: React.ReactNode }>, {
                        children: [remainingText, ...(Array.isArray(firstChildProps.children) ? firstChildProps.children.slice(1) : [])]
                    });
                    refinedChildren = [newFirstChild, ...childrenArray.slice(1)] as unknown as React.ReactNode;
                }
            }
        }
    }

    if (alertType) {
        const config = {
            NOTE: { icon: Info, color: "text-blue-500", bg: "bg-blue-500/5", border: "border-blue-500/30", label: "Note" },
            TIP: { icon: Lightbulb, color: "text-emerald-500", bg: "bg-emerald-500/5", border: "border-emerald-500/30", label: "Tip" },
            IMPORTANT: { icon: AlertCircle, color: "text-primary", bg: "bg-primary/5", border: "border-primary/30", label: "Important" },
            WARNING: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/5", border: "border-amber-500/30", label: "Warning" },
            CAUTION: { icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/5", border: "border-red-500/30", label: "Caution" },
        }[alertType];

        return (
            <div className={cn("my-10 overflow-hidden rounded-2xl border-l-4 p-6 shadow-sm", config.bg, config.border)}>
                <div className={cn("mb-2 flex items-center gap-2 font-bold uppercase tracking-widest text-xs", config.color)}>
                    <config.icon className="h-4 w-4" />
                    {config.label}
                </div>
                <div className="text-muted-foreground/90 leading-relaxed italic last:mb-0">
                    {refinedChildren}
                </div>
            </div>
        );
    }

    return (
        <blockquote
            {...props}
            className="my-10 bg-primary/5 border-primary/20 rounded-r-2xl border-l-4 py-2 px-8 italic text-foreground/80 leading-relaxed shadow-sm"
        >
            {children}
        </blockquote>
    );
};
