"use client";

import React, { useMemo } from "react";
import {
    CodeBlock as UI_CodeBlock,
    CodeBlockItem,
    CodeBlockContent,
    CodeBlockCopyButton,
    CodeBlockHeader,
} from "@/components/ui/code-block";
import { Mermaid } from "./mermaid";
import type { BundledLanguage } from "shiki";

interface CodeBlockProps extends React.ComponentPropsWithoutRef<"code"> {
    inline?: boolean;
    node?: unknown;
}

export const CodeBlock = ({
    inline,
    className,
    children,
    node: _node,
    ...props
}: CodeBlockProps) => {
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : "typescript";
    const isMermaid = language === "mermaid";
    const rawCode = String(children).replace(/\n$/, "");

    const codeData = useMemo(() => [{
        language: language,
        filename: "", // We don't have filename in standard markdown usually, but we can detect it if needed
        code: rawCode
    }], [language, rawCode]);

    if (!inline && isMermaid) {
        return <Mermaid chart={rawCode} />;
    }

    if (inline || !match) {
        return (
            <code
                {...props}
                className="rounded-md border border-primary/20 bg-primary/5 px-1.5 py-0.5 font-mono text-[13px] font-medium text-primary shadow-sm"
            >
                {children}
            </code>
        );
    }

    return (
        <div className="dark group relative my-10 overflow-hidden rounded-2xl border border-white/10 bg-[#010101] shadow-2xl transition-all hover:border-white/20">
            <UI_CodeBlock data={codeData} defaultValue={language} className="border-none">
                <CodeBlockHeader className="border-white/[0.03] bg-white/[0.02] px-5 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                            {language}
                        </span>
                    </div>
                    <CodeBlockCopyButton className="h-8 w-8 text-white/40 hover:bg-white/10 hover:text-white/90 transition-all" />
                </CodeBlockHeader>
                <CodeBlockItem value={language} lineNumbers={true} className="p-0 border-none bg-transparent">
                    <CodeBlockContent
                        language={language as BundledLanguage}
                        themes={{
                            light: "github-light",
                            dark: "github-dark",
                        }}
                    >
                        {rawCode}
                    </CodeBlockContent>
                </CodeBlockItem>
            </UI_CodeBlock>
        </div>
    );
};
