"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ApiEndpoint, HttpMethod } from "../types";

const METHOD_COLORS: Record<HttpMethod, string> = {
    GET: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    POST: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    PUT: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    PATCH: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    DELETE: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
};

const AUTH_COLORS: Record<string, string> = {
    SUPERADMIN: "bg-rose-600/10 text-rose-600 border-rose-600/20",
    ADMIN: "bg-amber-600/10 text-amber-600 border-amber-600/20",
    STAFF: "bg-blue-600/10 text-blue-600 border-blue-600/20",
    USER: "bg-emerald-600/10 text-emerald-600 border-emerald-600/20",
    PUBLIC: "bg-slate-500/10 text-slate-600 border-slate-500/20",
};

export interface EndpointTableProps {
    endpoints: ApiEndpoint[];
}

export function EndpointTable({ endpoints }: EndpointTableProps) {
    if (endpoints.length === 0) {
        return (
            <div className="py-20 text-center">
                <p className="text-muted-foreground italic">No endpoints found matching your criteria.</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-border/40 bg-card/30 backdrop-blur-sm shadow-sm">
            <div className="w-full overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-border/40 bg-muted/40 font-semibold text-foreground/80">
                        <tr>
                            <th className="px-5 py-4 w-28">Method</th>
                            <th className="px-5 py-4 min-w-[200px]">Path</th>
                            <th className="px-5 py-4 min-w-[300px]">Description</th>
                            <th className="px-5 py-4 w-40">Auth Level</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {endpoints.map((ep, idx) => (
                            <tr key={`${idx}-${ep.path}`} className="transition-colors hover:bg-primary/[0.02]">
                                <td className="px-5 py-5 align-top">
                                    <Badge variant="outline" className={cn("font-bold text-[10px]", METHOD_COLORS[ep.method])}>
                                        {ep.method}
                                    </Badge>
                                </td>
                                <td className="px-5 py-5 align-top">
                                    <div className="font-mono text-[13px] font-semibold text-foreground/90">{ep.path}</div>
                                    <div className="mt-1.5 text-xs text-muted-foreground/80 font-mono tracking-tight">{ep.params}</div>
                                </td>
                                <td className="px-5 py-5 align-top">
                                    <div className="text-foreground/80 leading-relaxed font-medium">{ep.description}</div>
                                    <div className="mt-1 text-[11px] text-muted-foreground/60 uppercase font-bold tracking-widest">{ep.category}</div>
                                </td>
                                <td className="px-5 py-5 align-top">
                                    {ep.auth && (
                                        <Badge variant="outline" className={cn("text-[9px] font-extrabold uppercase", AUTH_COLORS[ep.auth] || "bg-slate-100 text-slate-600")}>
                                            {ep.auth}
                                        </Badge>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
