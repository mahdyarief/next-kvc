import fs from "fs";
import path from "path";
import Link from "next/link";
import { DocsClient } from "./docs-client";

export const metadata = {
  title: "Public Documentation - NEXT-KVC",
  description: "Complete reference for NEXT-KVC Dashboard Starter",
};

// Interface for Nested TOC
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

  // Get all markdown files in docs/
  let availableFiles: DocFile[] = [];
  try {
    const files = fs.readdirSync(docsDir).filter((file) => file.endsWith(".md"));

    // Sort files based on DOC_ORDER
    const sortedFiles = DOC_ORDER.filter(orderedFile =>
      files.includes(orderedFile)
    );

    // Add any files not in DOC_ORDER at the end
    const remainingFiles = files.filter(file => !DOC_ORDER.includes(file));
    const allFiles = [...sortedFiles, ...remainingFiles];

    availableFiles = allFiles.map((file) => {
      // Create a pretty name
      let prettyName = file.replace(".md", "").replace(/_/g, " ");
      // Special case mappings for better UI
      const nameMap: Record<string, string> = {
        "README": "Welcome & Index",
        "ENVIRONMENT VARIABLES": "Environment Setup",
        "PROJECT DOCUMENTATION": "Project Architecture",
        "AGENTIC FRAMEWORK": "Agentic Framework",
        "FEATURE IMPLEMENTATION JOURNEY": "Feature Journey",
        "DEPLOYMENT GUIDE": "Deployment Guide",
        "API DOCUMENTATION": "API Specification",
        "CHANGELOG": "Changelog"
      };

      if (nameMap[prettyName.toUpperCase()]) {
        prettyName = nameMap[prettyName.toUpperCase()];
      }

      return {
        name: prettyName,
        slug: file.replace(".md", "").toLowerCase().replace(/_/g, "-"),
        path: file,
      };
    });
  } catch (err) {
    console.error("Error reading docs directory:", err);
  }

  // Find the requested file
  const requestedFile = availableFiles.find((f) => f.slug === currentFileSlug) || availableFiles[0];
  const filePath = path.join(docsDir, requestedFile?.path || "README.md");

  let content = "";
  try {
    content = fs.readFileSync(filePath, "utf8");
    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    version = `v${packageJson.version}`;
  } catch (err) {
    content = "# Error\n\nCould not load documentation file.";
    console.error("Error loading docs:", err);
  }

  // Nested TOC Generation
  const toc: TocSection[] = [];
  let currentSection: TocSection | null = null;

  content.split("\n").forEach((line) => {
    if (line.startsWith("## ")) {
      // H2 - New Section
      const text = line.replace(/^## /, "").trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w]+/g, "-")
        .replace(/^-+|-+$/g, "");

      // If we have a current section, push it to toc
      if (currentSection) {
        toc.push(currentSection);
      }

      currentSection = {
        title: text,
        id: id,
        items: [],
      };
    } else if (line.startsWith("### ") && currentSection) {
      // H3 - Item in current section
      const text = line.replace(/^### /, "").trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w]+/g, "-")
        .replace(/^-+|-+$/g, "");
      currentSection.items.push({ text, id });
    }
  });

  // Push the last section if exists
  if (currentSection) {
    toc.push(currentSection);
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-white shadow-sm/50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-xl font-extrabold text-transparent">
              NEXT-KVC
            </span>
            <span className="rounded-full border border-blue-200 bg-blue-100 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-blue-700">
              {version}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/swagger"
              className="text-sm font-medium text-gray-500 transition-colors hover:text-blue-600"
            >
              Swagger UI
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-slate-800 hover:shadow-lg"
            >
              Dashboard
            </Link>
          </div>
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
