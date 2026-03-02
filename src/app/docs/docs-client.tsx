"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Link from "next/link";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Menu, Search, ChevronRight, FileText } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import mermaid from "mermaid";

interface TocItem {
  text: string;
  id: string;
}

interface TocSection {
  title: string;
  id: string;
  items: TocItem[];
}

interface DocFile {
  name: string;
  slug: string;
  path: string;
  category: "reference" | "guide" | "info";
}

interface DocsClientProps {
  content: string;
  toc: TocSection[];
  availableFiles: DocFile[];
  currentFileSlug: string;
}

export function DocsClient({
  content,
  toc,
  availableFiles,
  currentFileSlug,
}: DocsClientProps) {
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "neutral",
      securityLevel: "loose",
      fontFamily: "inherit",
    });
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { filteredToc, autoOpenSections } = React.useMemo(() => {
    if (!debouncedQuery) {
      const initial: Record<string, boolean> = {};
      toc.forEach((section) => (initial[section.id] = true));
      return { filteredToc: toc, autoOpenSections: initial };
    }

    const lowerQuery = debouncedQuery.toLowerCase();
    const filtered = toc
      .map((section) => {
        const titleMatches = section.title.toLowerCase().includes(lowerQuery);
        const matchingItems = section.items.filter((item) =>
          item.text.toLowerCase().includes(lowerQuery)
        );

        if (titleMatches || matchingItems.length > 0) {
          return {
            ...section,
            items: titleMatches ? section.items : matchingItems,
          };
        }
        return null;
      })
      .filter(Boolean) as TocSection[];

    const allOpen: Record<string, boolean> = {};
    filtered.forEach((s) => (allOpen[s.id] = true));
    return { filteredToc: filtered, autoOpenSections: allOpen };
  }, [debouncedQuery, toc]);

  // Merge auto-opened sections with manual toggles
  const [manualOpenSections, setManualOpenSections] = useState<Record<string, boolean>>({});

  const isSectionOpen = (id: string) => {
    if (debouncedQuery) return !!autoOpenSections[id];
    return manualOpenSections[id] !== undefined ? manualOpenSections[id] : !!autoOpenSections[id];
  };

  const toggleSection = (id: string) => {
    setManualOpenSections((prev) => ({
      ...prev,
      [id]: !isSectionOpen(id),
    }));
  };

  const scrollToSection = (id: string, closeMobile = true) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      if (closeMobile) setOpenMobileMenu(false);
    }
  };

  // Memoized Sidebar Item to prevent full list re-renders
  const SidebarItem = React.memo(
    ({
      section,
      isOpen,
      onToggle,
      onScroll,
      isMobile,
    }: {
      section: TocSection;
      isOpen: boolean;
      onToggle: (id: string) => void;
      onScroll: (id: string, mobile: boolean) => void;
      isMobile: boolean;
    }) => (
      <div className="space-y-1">
        <button
          onClick={() =>
            section.items.length > 0 ? onToggle(section.id) : onScroll(section.id, isMobile)
          }
          className="group flex w-full items-center justify-between py-2 text-left font-semibold text-gray-900 transition-colors hover:text-blue-600"
        >
          <span className="truncate pr-2">{section.title}</span>
          {section.items.length > 0 && (
            <ChevronRight
              className={`h-4 w-4 flex-shrink-0 text-gray-400 transition-transform duration-200 group-hover:text-blue-500 ${isOpen ? "rotate-90" : ""}`}
            />
          )}
        </button>

        {isOpen && (
          <div className="ml-2 space-y-1 border-l-2 border-slate-100 pl-2">
            {section.items.map((item) => (
              <button
                key={item.id}
                onClick={() => onScroll(item.id, isMobile)}
                className="block w-full truncate rounded px-2 py-2 text-left text-sm text-gray-500 transition-colors hover:bg-slate-50 hover:text-blue-600"
                title={item.text}
              >
                {item.text}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  );
  SidebarItem.displayName = "SidebarItem";

  // Mermaid Diagram Component
  const Mermaid = ({ chart }: { chart: string }) => {
    const ref = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (ref.current) {
        // Clear previous content
        ref.current.innerHTML = "";
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        mermaid.render(id, chart).then(({ svg }) => {
          if (ref.current) {
            ref.current.innerHTML = svg;
          }
        }).catch((err) => {
          console.error("Mermaid error:", err);
          if (ref.current) {
            ref.current.innerHTML = `<div class="text-red-500 text-xs">Failed to render Mermaid diagram</div>`;
          }
        });
      }
    }, [chart]);

    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div
          ref={ref}
          className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm transition-all hover:shadow-md cursor-zoom-in"
          onClick={() => {
            // Optional: Click to expand/zoom
          }}
        />
        <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">System Flow Diagram</p>
      </div>
    );
  };

  const renderSidebarContent = (isMobile = false) => {
    const referenceFiles = availableFiles.filter((f) => f.category === "reference");
    const guideFiles = availableFiles.filter((f) => f.category === "guide");
    const infoFiles = availableFiles.filter((f) => f.category === "info");

    return (
      <nav className="space-y-6 pb-8">
        {/* Core Reference Section */}
        {referenceFiles.length > 0 && (
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <FileText className="h-3 w-3" />
              Core Reference
            </h3>
            <div className="space-y-1">
              {referenceFiles.map((file) => (
                <Link
                  key={file.slug}
                  href={`/docs?file=${file.slug}`}
                  className={`block w-full rounded-lg px-3 py-2 text-sm font-bold transition-all ${currentFileSlug === file.slug
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  onClick={() => isMobile && setOpenMobileMenu(false)}
                >
                  {file.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Developer Guides Section */}
        {guideFiles.length > 0 && (
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <ChevronRight className="h-3 w-3" />
              Developer Guides
            </h3>
            <div className="space-y-1">
              {guideFiles.map((file) => (
                <Link
                  key={file.slug}
                  href={`/docs?file=${file.slug}`}
                  className={`block w-full rounded-lg px-3 py-2 text-sm font-bold transition-all ${currentFileSlug === file.slug
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  onClick={() => isMobile && setOpenMobileMenu(false)}
                >
                  {file.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Project Info Section */}
        {infoFiles.length > 0 && (
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <Search className="h-3 w-3" />
              Project Info
            </h3>
            <div className="space-y-1">
              {infoFiles.map((file) => (
                <Link
                  key={file.slug}
                  href={`/docs?file=${file.slug}`}
                  className={`block w-full rounded-lg px-3 py-2 text-sm font-bold transition-all ${currentFileSlug === file.slug
                    ? "bg-slate-800 text-white shadow-md shadow-slate-800/20"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  onClick={() => isMobile && setOpenMobileMenu(false)}
                >
                  {file.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="my-6 border-t border-gray-100" />

        {/* TOC Section */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            On This Page
          </h3>
          <div className="space-y-1">
            {filteredToc.length > 0 ? (
              filteredToc.map((section) => (
                <SidebarItem
                  key={section.id}
                  section={section}
                  isOpen={isSectionOpen(section.id)}
                  onToggle={toggleSection}
                  onScroll={scrollToSection}
                  isMobile={isMobile}
                />
              ))
            ) : (
              <p className="py-4 text-center text-sm text-gray-400">No matching sections</p>
            )}
          </div>
        </div>
      </nav>
    );
  };

  return (
    <div className="relative mx-auto flex w-full max-w-7xl flex-1 items-start px-4 sm:px-6 lg:px-8">
      {/* Sidebar (Desktop) */}
      <aside className="scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent sticky top-20 mt-8 hidden h-[calc(100vh-6rem)] w-72 overflow-y-auto border-r border-gray-100 pr-6 lg:block">
        <div className="relative mb-8">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Filter topics..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pr-4 pl-9 text-sm transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      <div className="fixed right-6 bottom-6 z-50 lg:hidden">
        <Sheet open={openMobileMenu} onOpenChange={setOpenMobileMenu}>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="h-14 w-14 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/20 transition-transform hover:scale-105 hover:bg-blue-700 active:scale-95"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex w-[85vw] flex-col p-0 sm:w-[400px]">
            <div className="border-b bg-gray-50/50 p-6">
              <h2 className="text-lg font-bold text-gray-900">Documentation</h2>
              <p className="mt-1 text-xs text-gray-500">Navigate between documents and sections</p>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain p-4">
              <div className="relative mb-6">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search topic..."
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pr-4 pl-9 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {renderSidebarContent(true)}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="min-w-0 flex-1 py-8 lg:pl-12">
        <div className="mb-8 rounded-r-lg border-l-4 border-blue-500 bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0 text-blue-400">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                You are currently viewing: <strong>{availableFiles.find(f => f.slug === currentFileSlug)?.name}</strong>.
                Use the sidebar to switch documents.
              </p>
            </div>
          </div>
        </div>

        <article className="prose prose-slate prose-blue prose-headings:scroll-mt-24 prose-pre:p-0 prose-pre:bg-transparent prose-pre:border-none max-w-none break-words">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              div: ({ node: _node, ...props }: any) => {
                // Check if this is our special footer status div
                const content = React.Children.toArray(props.children).join("");
                if (props.align === "center" && (content.includes("Document Status") || content.includes("Framework Version"))) {
                  // This is likely the footer - let's render it as a premium UI segment
                  // We'll parse the content to find Status and Version
                  const statusMatch = content.match(/Document Status\*\*:\s*([^\s|]+)/i) ||
                    content.match(/Document Status:\s*([^\s|]+)/i);
                  const versionMatch = content.match(/Framework Version\*\*:\s*([^\s|]+)/i) ||
                    content.match(/Framework Version:\s*([^\s|]+)/i);

                  const status = statusMatch ? statusMatch[1] : "Essential";
                  const version = versionMatch ? versionMatch[1] : "1.1.0";

                  // Define status colors
                  const getStatusColor = (s: string) => {
                    const low = s.toLowerCase();
                    if (low.includes("critical")) return "bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
                    if (low.includes("essential")) return "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
                    if (low.includes("reference")) return "bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800";
                    return "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800";
                  };

                  return (
                    <div className="mt-20 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6 border-t pt-10">
                      <div className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold border ${getStatusColor(status)} shadow-sm transition-all hover:scale-105`}>
                        <span className="opacity-70 uppercase tracking-tight">Status:</span>
                        <span>{status}</span>
                      </div>
                      <div className="hidden h-5 w-px bg-slate-200 sm:block" />
                      <div className="flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50/50 px-4 py-1.5 text-xs font-bold text-slate-500 shadow-sm transition-all hover:scale-105">
                        <span className="opacity-70 uppercase tracking-tight">Version:</span>
                        <span>{version}</span>
                      </div>
                    </div>
                  );
                }
                return <div {...props} />;
              },
              h2: ({ node: _node, ...props }) => {
                const id = props.children?.toString().toLowerCase().replace(/[^\w]+/g, "-").replace(/^-+|-+$/g, "") || "";
                return <h2 id={id} {...props} className="mt-12 mb-6 scroll-mt-24 border-b pb-2 text-2xl font-bold" />;
              },
              h3: ({ node: _node, ...props }) => {
                const id = props.children?.toString().toLowerCase().replace(/[^\w]+/g, "-").replace(/^-+|-+$/g, "") || "";
                return <h3 id={id} {...props} className="mt-8 mb-4 scroll-mt-24 text-xl font-semibold" />;
              },
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              code: ({ node: _node, inline, className, children, ...props }: any) => {
                const match = /language-(\w+)/.exec(className || "");
                const isMermaid = match && match[1] === "mermaid";

                if (!inline && isMermaid) {
                  return <Mermaid chart={String(children)} />;
                }

                return !inline && match ? (
                  <div className="my-6 overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
                      <span className="font-mono text-xs text-gray-400 capitalize">{match[1]}</span>
                    </div>
                    <SyntaxHighlighter style={atomOneDark} language={match[1]} PreTag="div" customStyle={{ margin: 0, padding: "1rem", borderRadius: 0, fontSize: "0.9em" }} {...props}>
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code className="rounded border border-gray-200 bg-gray-100 px-1.5 py-0.5 font-mono text-sm break-all text-gray-800" {...props}>
                    {children}
                  </code>
                );
              },
              table: ({ node: _node, ...props }) => (
                <div className="my-6 overflow-x-auto rounded-lg border shadow-sm">
                  <table {...props} className="min-w-full divide-y divide-gray-200" />
                </div>
              ),
              thead: ({ node: _node, ...props }) => <thead {...props} className="bg-gray-50" />,
              th: ({ node: _node, ...props }) => (
                <th {...props} className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase" />
              ),
              td: ({ node: _node, ...props }) => (
                <td {...props} className="px-6 py-4 text-sm whitespace-nowrap text-gray-500" />
              ),
              pre: ({ node: _node, ...props }) => <pre {...props} />,
            }}
          >
            {content}
          </ReactMarkdown>
        </article>

        <footer className="mt-20 border-t pt-12 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} NEXT-KVC. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
