import fs from "fs";
import path from "path";
import Link from "next/link";
import { DocsClient } from "./docs-client";
import { Logo } from "@/components/brand/logo";

export const metadata = {
  title: "Documentation — NextStarter",
  description: "Advanced Next.js + Prisma Dashboard Starter Documentation",
};

export interface TocItem {
  text: string;
  id: string;
}

export interface TocSection {
  title: string;
  id: string;
  items: TocItem[];
}

export interface DocFile {
  name: string;
  slug: string;
  path: string;
  category: "reference" | "guide" | "info";
}

export default async function PublicDocsPage({
  searchParams,
}: {
  searchParams: Promise<{ file?: string }>;
}) {
  const resolvedParams = await searchParams;
  const DOC_ORDER = [
    "README.md",
    "ENVIRONMENT_VARIABLES.md",
    "ROADMAP.md",
    "PROJECT_DOCUMENTATION.md",
    "AGENTIC_FRAMEWORK.md",
    "FEATURE_IMPLEMENTATION_JOURNEY.md",
    "DEPLOYMENT_GUIDE.md",
    "API_DOCUMENTATION.md",
    "CHANGELOG.md",
  ];

  const currentFileSlug = resolvedParams?.file || "readme";

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
  } catch (err) {
    console.error("Error reading docs directory:", err);
  }

  const requestedFile = availableFiles.find((f) => f.slug === currentFileSlug) || availableFiles[0];
  const filePath = path.join(docsDir, requestedFile?.path || "README.md");

  let content = "";
  try {
    content = fs.readFileSync(filePath, "utf8");
    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    version = `v${packageJson.version}`;
  } catch (err) {
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
    <div className="bg-background relative min-h-screen font-sans">
      <div className="bg-mesh-gold fixed inset-0 -z-10 opacity-30" />

      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 px-4 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Logo size={28} showText={true} />
            </Link>
            <div className="bg-primary/10 text-primary border-primary/20 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-tight">
              {version}
            </div>
          </div>

          <nav className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
            <div className="bg-border/60 h-4 w-px" />
            <Link
              href="https://github.com"
              className="bg-foreground text-background rounded-lg px-3 py-1.5 text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              GitHub
            </Link>
          </nav>
        </div>
      </header>

      <DocsClient
        content={content}
        toc={toc}
        availableFiles={availableFiles}
        currentFileSlug={currentFileSlug}
      />
    </div>
  );
}
