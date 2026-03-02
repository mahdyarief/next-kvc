"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import mermaid from "mermaid";
import { Mermaid } from "./mermaid";

export interface MarkdownRendererProps {
    content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    React.useEffect(() => {
        mermaid.initialize({
            startOnLoad: true,
            theme: "neutral",
            securityLevel: "loose",
            fontFamily: "inherit",
        });
    }, []);

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
                    <div className="mb-10 animate-fade-in">
                        <h1
                            className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl"
                            {...props}
                        />
                        <div className="mt-4 h-1.5 w-20 rounded-full bg-gradient-to-r from-primary to-amber-300" />
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
                            className="font-heading mt-16 mb-6 scroll-mt-20 border-b border-border/60 pb-3 text-2xl font-bold tracking-tight"
                        />
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
                            className="font-heading mt-10 mb-4 scroll-mt-20 text-xl font-bold tracking-tight text-foreground/90"
                        />
                    );
                },
                code: ({
                    node: _node,
                    inline,
                    className,
                    children,
                    ...props
                }: {
                    node?: unknown;
                    inline?: boolean;
                    className?: string;
                    children?: React.ReactNode;
                } & React.ComponentPropsWithoutRef<"code">) => {
                    const match = /language-(\w+)/.exec(className || "");
                    const isMermaid = match && match[1] === "mermaid";

                    if (!inline && isMermaid) {
                        return <Mermaid chart={String(children)} />;
                    }

                    return !inline && match ? (
                        <div className="relative my-8 overflow-hidden rounded-xl border border-border/60 bg-[#282c34] shadow-sm ring-1 ring-white/5">
                            <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2">
                                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-white/40">
                                    {match[1]}
                                </span>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(String(children));
                                    }}
                                    className="text-[10px] font-bold text-white/20 hover:text-white/60 transition-colors"
                                >
                                    COPY
                                </button>
                            </div>
                            <SyntaxHighlighter
                                style={atomOneDark as { [key: string]: React.CSSProperties }}
                                language={match[1]}
                                PreTag="div"
                                customStyle={{
                                    margin: 0,
                                    padding: "1.25rem",
                                    background: "transparent",
                                    fontSize: "0.85rem",
                                    lineHeight: "1.6",
                                }}
                            >
                                {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                        </div>
                    ) : (
                        <code
                            className="rounded-md border border-border/40 bg-muted/60 px-1.5 py-0.5 font-mono text-[13px] font-medium text-primary shadow-sm"
                            {...props}
                        >
                            {children}
                        </code>
                    );
                },
                blockquote: ({ node: _node, ...props }) => (
                    <blockquote
                        {...props}
                        className="bg-primary/5 border-primary/20 rounded-r-xl border-l-4 py-1 px-6 italic text-foreground/80"
                    />
                ),
                table: ({ node: _node, ...props }) => (
                    <div className="my-8 overflow-x-auto rounded-xl border border-border/60 shadow-sm">
                        <table {...props} className="min-w-full divide-y divide-border/60" />
                    </div>
                ),
                thead: ({ node: _node, ...props }) => <thead {...props} className="bg-muted/30" />,
                th: ({ node: _node, ...props }) => (
                    <th
                        {...props}
                        className="px-6 py-3 text-left text-[11px] font-bold tracking-widest text-muted-foreground uppercase"
                    />
                ),
                td: ({ node: _node, ...props }) => (
                    <td {...props} className="px-6 py-4 text-sm font-medium text-muted-foreground" />
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    );
}
