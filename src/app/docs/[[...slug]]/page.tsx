import fs from "fs";
import path from "path";
import { DocsClient } from "../docs-client";
import { TocSection, DocFile } from "@/features/docs/types";
import { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
    const resolvedParams = await params;
    const slug = resolvedParams?.slug?.[0] || "readme";
    const prettyName = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    return {
        title: `${prettyName} | Documentation | NextKVC`,
        description: "Advanced Next.js + Prisma Dashboard Starter Documentation",
    };
}

export default async function PublicDocsPage({
    params,
}: {
    params: Promise<{ slug?: string[] }>;
}) {
    const resolvedParams = await params;
    const DOC_ORDER = [
        "README.md",
        "VIBE_BLOCKS_REGISTRY.md",
        "AGENT_ONBOARDING.md",
        "ENVIRONMENT_VARIABLES.md",
        "ROADMAP.md",
        "PROJECT_DOCUMENTATION.md",
        "AGENTIC_FRAMEWORK.md",
        "FEATURE_IMPLEMENTATION_JOURNEY.md",
        "DEPLOYMENT_GUIDE.md",
        "API_DOCUMENTATION.md",
        "CHANGELOG.md",
    ];

    // Resolve the current file slug
    const currentFileSlug = resolvedParams?.slug?.[0] || "readme";

    const docsDir = path.join(process.cwd(), "docs", "publish");
    const packagePath = path.join(process.cwd(), "package.json");
    let version = "v1.0.0";

    let availableFiles: DocFile[] = [];
    try {
        const files = fs.readdirSync(docsDir).filter((file) => file.endsWith(".md"));
        const sortedFiles = DOC_ORDER.filter((orderedFile) => files.includes(orderedFile));
        const remainingFiles = files.filter((file) => !DOC_ORDER.includes(file));
        const allFiles = [...sortedFiles, ...remainingFiles];

        availableFiles = allFiles.map((file) => {
            let prettyName = file.replace(".md", "").replace(/_/g, " ");
            let category: "reference" | "guide" | "info" = "reference";

            const nameMap: Record<string, { name: string; category: "reference" | "guide" | "info" }> = {
                README: { name: "Introduction", category: "reference" },
                "VIBE BLOCKS REGISTRY": { name: "Vibe Blocks Registry", category: "reference" },
                "AGENT ONBOARDING": { name: "Agent Onboarding", category: "guide" },
                "ENVIRONMENT VARIABLES": { name: "Environment Variables", category: "reference" },
                "PROJECT DOCUMENTATION": { name: "Project Architecture", category: "reference" },
                "AGENTIC FRAMEWORK": { name: "Agentic Framework", category: "reference" },
                "FEATURE IMPLEMENTATION JOURNEY": { name: "Feature Implementation", category: "guide" },
                "DEPLOYMENT GUIDE": { name: "Deployment Guide", category: "guide" },
                "API DOCUMENTATION": { name: "API Documentation", category: "reference" },
                ROADMAP: { name: "Roadmap", category: "info" },
                CHANGELOG: { name: "Changelog", category: "info" },
            };

            const mapping = nameMap[prettyName.toUpperCase()];
            if (mapping) {
                prettyName = mapping.name;
                category = mapping.category;
            }

            return {
                name: prettyName,
                slug: file.replace(".md", "").toLowerCase().replace(/_/g, "-"),
                path: file,
                category,
            };
        });
    } catch (_err) {
        console.error("Error reading docs directory:", _err);
    }

    const requestedFile = availableFiles.find((f) => f.slug === currentFileSlug) || availableFiles[0];
    const filePath = path.join(docsDir, requestedFile?.path || "README.md");

    let content = "";
    try {
        content = fs.readFileSync(filePath, "utf8");
        const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
        version = `v${packageJson.version}`;
    } catch (_err) {
        content = "# Error\n\nCould not load documentation file.";
    }

    const toc: TocSection[] = [];
    let currentSection: TocSection | null = null;

    content.split("\n").forEach((line) => {
        if (line.startsWith("## ")) {
            const text = line.replace(/^## /, "").trim();
            const id = text.toLowerCase().replace(/[^\w]+/g, "-").replace(/^-+|-+$/g, "");
            if (currentSection) toc.push(currentSection);
            currentSection = { title: text, id, items: [] };
        } else if (line.startsWith("### ") && currentSection) {
            const text = line.replace(/^### /, "").trim();
            const id = text.toLowerCase().replace(/[^\w]+/g, "-").replace(/^-+|-+$/g, "");
            currentSection.items.push({ text, id });
        }
    });
    if (currentSection) toc.push(currentSection);

    return (
        <DocsClient
            content={content}
            toc={toc}
            availableFiles={availableFiles}
            currentFileSlug={currentFileSlug}
            version={version}
        />
    );
}
