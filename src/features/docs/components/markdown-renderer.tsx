"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import mermaid from "mermaid";
import { Mermaid } from "./mermaid";
import { cn } from "@/lib/utils";
import {
    Info,
    Lightbulb,
    AlertCircle,
    AlertTriangle,
    Copy,
    Check
} from "lucide-react";

export interface MarkdownRendererProps {
    content: string;
}

const CodeBlock = ({
    inline,
    className,
    children,
    handleCopy,
    copiedId
}: {
    node?: unknown;
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
    handleCopy: (text: string, id: string) => void;
    copiedId: string | null;
} & React.ComponentPropsWithoutRef<"code">) => {
    const match = /language-(\w+)/.exec(className || "");
    const isMermaid = match && match[1] === "mermaid";
    const language = match ? match[1] : "";

    const codeContent = String(children).replace(/\n$/, "");
    const codeId = React.useId();

    if (!inline && isMermaid) {
        return <Mermaid chart={codeContent} />;
    }

    return !inline && match ? (
        <div className="group relative my-10 overflow-hidden rounded-2xl border border-white/5 bg-[#0d0e12] shadow-2xl transition-all hover:border-white/10">
            <div className="flex items-center justify-between border-b border-white/[0.03] bg-white/[0.02] px-5 py-3.5">
                <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]/80 shadow-[0_0_8px_rgba(255,95,86,0.2)]" />
                        <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]/80 shadow-[0_0_8px_rgba(255,189,46,0.2)]" />
                        <div className="h-2.5 w-2.5 rounded-full bg-[#27c93f]/80 shadow-[0_0_8px_rgba(39,201,63,0.2)]" />
                    </div>
                    <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">
                        {language}
                    </span>
                </div>
                <button
                    onClick={() => handleCopy(codeContent, codeId)}
                    className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-[11px] font-bold text-white/50 transition-all hover:bg-white/10 hover:text-white/90 active:scale-95"
                >
                    {copiedId === codeId ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                        <Copy className="h-3.5 w-3.5" />
                    )}
                    {copiedId === codeId ? "COPIED" : "COPY"}
                </button>
            </div>
            <SyntaxHighlighter
                style={atomOneDark as { [key: string]: React.CSSProperties }}
                language={language}
                PreTag="div"
                customStyle={{
                    margin: 0,
                    padding: "1.75rem",
                    background: "transparent",
                    fontSize: "0.95rem",
                    lineHeight: "1.8",
                    fontFamily: 'JetBrains Mono, "Fira Code", monospace',
                    WebkitFontSmoothing: "antialiased",
                }}
            >
                {codeContent}
            </SyntaxHighlighter>
        </div>
    ) : (
        <code
            className="rounded-md border border-primary/20 bg-primary/5 px-1.5 py-0.5 font-mono text-[13px] font-medium text-primary shadow-sm"
        >
            {children}
        </code>
    );
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    const [copiedId, setCopiedId] = React.useState<string | null>(null);

    React.useEffect(() => {
        mermaid.initialize({
            startOnLoad: true,
            theme: "neutral",
            securityLevel: "loose",
            fontFamily: "inherit",
        });
    }, []);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
                div: ({
                    node: _node,
                    ...props
                }: { node?: unknown } & React.ComponentPropsWithoutRef<"div"> & { align?: string }) => {
                    const contentText = React.Children.toArray(props.children).join("");
                    if (
                        props.align === "center" &&
                        (contentText.includes("Document Status") || contentText.includes("Framework Version"))
                    ) {
                        return null; // Handle status via more premium components elsewhere if needed
                    }
                    return <div {...props} />;
                },
                h1: ({ node: _node, ...props }) => (
                    <div className="mb-12 animate-reveal">
                        <h1
                            className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
                            {...props}
                        />
                        <div className="mt-6 h-1.5 w-24 rounded-full bg-gradient-to-r from-primary via-primary to-amber-300" />
                    </div>
                ),
                h2: ({ node: _node, ...props }) => {
                    const id =
                        props.children
                            ?.toString()
                            .toLowerCase()
                            .replace(/[^\w]+/g, "-")
                            .replace(/^-+|-+$/g, "") || "";
                    return (
                        <h2
                            id={id}
                            {...props}
                            className="font-heading group relative mt-20 mb-8 scroll-mt-24 border-b border-border/60 pb-4 text-3xl font-bold tracking-tight"
                        >
                            <span className="absolute -left-8 hidden text-primary/20 transition-opacity group-hover:block">#</span>
                            {props.children}
                        </h2>
                    );
                },
                h3: ({ node: _node, ...props }) => {
                    const id =
                        props.children
                            ?.toString()
                            .toLowerCase()
                            .replace(/[^\w]+/g, "-")
                            .replace(/^-+|-+$/g, "") || "";
                    return (
                        <h3
                            id={id}
                            {...props}
                            className="font-heading mt-12 mb-5 scroll-mt-24 text-2xl font-bold tracking-tight text-foreground/90"
                        />
                    );
                },
                code: (props) => (
                    <CodeBlock {...props} handleCopy={handleCopy} copiedId={copiedId} />
                ),
                blockquote: ({ node: _node, children, ...props }) => {
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
                },
                table: ({ node: _node, ...props }) => (
                    <div className="my-10 overflow-x-auto rounded-2xl border border-border/40 shadow-sm surface-raised">
                        <table {...props} className="min-w-full divide-y divide-border/20" />
                    </div>
                ),
                thead: ({ node: _node, ...props }) => <thead {...props} className="bg-muted/50" />,
                th: ({ node: _node, ...props }) => (
                    <th
                        {...props}
                        className="px-6 py-4 text-left text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase"
                    />
                ),
                td: ({ node: _node, ...props }) => (
                    <td {...props} className="px-6 py-4 text-sm font-medium text-foreground/70" />
                ),
                ul: ({ node: _node, ...props }) => <ul {...props} className="my-8 space-y-3 list-disc pl-6 marker:text-primary/40" />,
                ol: ({ node: _node, ...props }) => <ol {...props} className="my-8 space-y-3 list-decimal pl-6 marker:text-primary/40" />,
                li: ({ node: _node, ...props }) => <li {...props} className="pl-2" />,
            }}
        >
            {content}
        </ReactMarkdown>
    );
}
