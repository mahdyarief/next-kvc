"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import mermaid from "mermaid";

import { CodeBlock } from "./code-block";
import { MarkdownAlert } from "./markdown-alert";

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
                        return null;
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
                    <CodeBlock {...props} />
                ),
                blockquote: (props) => (
                    <MarkdownAlert {...props} />
                ),
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
                img: ({ node: _node, ...props }) => (
                    <div className="my-12 overflow-hidden rounded-[2rem] border border-border/40 shadow-2xl transition-all hover:scale-[1.01] hover:border-primary/20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            {...props}
                            className="h-auto w-full object-cover"
                            loading="lazy"
                            alt={props.alt || "Documentation Image"}
                        />
                    </div>
                ),
                a: ({ node: _node, href, ...props }) => {
                    const isInternalDoc = href?.endsWith(".md");
                    if (isInternalDoc) {
                        const slug = href
                            ?.replace(/^\.\//, "")
                            .replace(/\.md$/, "")
                            .toLowerCase()
                            .replace(/_/g, "-");
                        return <Link href={`/docs/${slug}`} {...props} />;
                    }

                    const isExternal = href?.startsWith("http");
                    return (
                        <a
                            href={href}
                            target={isExternal ? "_blank" : undefined}
                            rel={isExternal ? "noopener noreferrer" : undefined}
                            {...props}
                        />
                    );
                },
                ul: ({ node: _node, ...props }) => <ul {...props} className="my-8 space-y-3 list-disc pl-6 marker:text-primary/40" />,
                ol: ({ node: _node, ...props }) => <ol {...props} className="my-8 space-y-3 list-decimal pl-6 marker:text-primary/40" />,
                li: ({ node: _node, ...props }) => <li {...props} className="pl-2" />,
            }}
        >
            {content}
        </ReactMarkdown>
    );
}
