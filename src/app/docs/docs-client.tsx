"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Link from "next/link";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Menu, Search, ChevronRight, FileText, LayoutDashboard, ExternalLink } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import mermaid from "mermaid";
import { cn } from "@/lib/utils";

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
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      if (closeMobile) setOpenMobileMenu(false);
    }
  };

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
      <div className="space-y-0.5">
        <button
          onClick={() =>
            section.items.length > 0 ? onToggle(section.id) : onScroll(section.id, isMobile)
          }
          className="group flex w-full items-center justify-between py-1.5 text-left font-semibold text-foreground transition-colors hover:text-primary"
        >
          <span className="truncate pr-2 text-[13px]">{section.title}</span>
          {section.items.length > 0 && (
            <ChevronRight
              className={cn(
                "h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/40 transition-transform duration-200 group-hover:text-primary",
                isOpen && "rotate-90"
              )}
            />
          )}
        </button>

        {isOpen && (
          <div className="ml-2.5 space-y-0.5 border-l border-border/60 pl-2.5">
            {section.items.map((item) => (
              <button
                key={item.id}
                onClick={() => onScroll(item.id, isMobile)}
                className="block w-full truncate rounded px-2 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:bg-muted/50 hover:text-primary"
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

  const Mermaid = ({ chart }: { chart: string }) => {
    const ref = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (ref.current) {
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
      <div className="flex flex-col items-center justify-center py-10">
        <div
          ref={ref}
          className="bg-white p-8 rounded-2xl border border-border/40 shadow-sm transition-all hover:shadow-md cursor-zoom-in"
        />
        <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">System Architecture Flow</p>
      </div>
    );
  };

  const renderSidebarContent = (isMobile = false) => {
    const categories = [
      { id: "reference", label: "Documentation", icon: FileText },
      { id: "guide", label: "Developer Guides", icon: LayoutDashboard },
      { id: "info", label: "Project Info", icon: ExternalLink },
    ];

    return (
      <nav className="space-y-8 pb-10">
        {categories.map((cat) => {
          const files = availableFiles.filter((f) => f.category === cat.id);
          if (files.length === 0) return null;
          return (
            <div key={cat.id} className="space-y-2">
              <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50">
                <cat.icon className="h-3 w-3" />
                {cat.label}
              </h3>
              <div className="space-y-1">
                {files.map((file) => (
                  <Link
                    key={file.slug}
                    href={`/docs?file=${file.slug}`}
                    className={cn(
                      "block w-full rounded-lg px-3 py-2 text-sm font-medium transition-all",
                      currentFileSlug === file.slug
                        ? "bg-primary/10 text-primary font-semibold ring-1 ring-primary/20"
                        : "text-muted-foreground/70 hover:bg-muted/50 hover:text-foreground"
                    )}
                    onClick={() => isMobile && setOpenMobileMenu(false)}
                  >
                    {file.name}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        <div className="border-t border-border/60 pt-6">
          <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50">
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
              <p className="py-4 text-center text-xs text-muted-foreground/40 italic">No sections found</p>
            )}
          </div>
        </div>
      </nav>
    );
  };

  return (
    <div className="relative mx-auto flex w-full max-w-7xl flex-1 items-start px-4 sm:px-6 lg:px-8">
      {/* Sidebar (Desktop) */}
      <aside className="sticky top-14 mt-8 hidden h-[calc(100vh-3.5rem)] w-64 overflow-y-auto border-r border-border/40 pr-6 lg:block">
        <div className="relative mb-8">
          <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50" />
          <input
            type="text"
            placeholder="Search docs..."
            className="w-full rounded-lg border border-border/60 bg-muted/30 py-2.5 pr-4 pl-9 text-xs transition-all placeholder:text-muted-foreground/40 focus:bg-background focus:ring-2 focus:ring-primary/15 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute top-1/2 right-2.5 -translate-y-1/2 hidden md:block">
            <Kbd className="h-5 px-1.5 opacity-40">⌘K</Kbd>
          </div>
        </div>
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile Sidebar (Floating FAB) */}
      <div className="fixed right-6 bottom-6 z-50 lg:hidden">
        <Sheet open={openMobileMenu} onOpenChange={setOpenMobileMenu}>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="h-12 w-12 rounded-full bg-primary text-white shadow-lg shadow-primary/20 transition-all hover:scale-105"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[85vw] p-0 sm:w-80">
            <div className="border-b border-border/40 bg-muted/10 p-6">
              <h2 className="font-heading text-lg font-bold">Documentation</h2>
            </div>
            <div className="h-[calc(100vh-5rem)] overflow-y-auto px-6 py-6">
              <div className="relative mb-6">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
                <input
                  type="text"
                  placeholder="Filter topics..."
                  className="w-full rounded-lg border border-border/40 bg-muted/30 py-3 pr-4 pl-10 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
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
      <main className="min-w-0 flex-1 py-8 lg:pl-10">
        <article className="prose prose-slate prose-amber prose-headings:font-heading prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-pre:bg-transparent prose-pre:border-none prose-pre:p-0 max-w-none break-words">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              div: ({ node: _node, ...props }: any) => {
                const contentText = React.Children.toArray(props.children).join("");
                if (props.align === "center" && (contentText.includes("Document Status") || contentText.includes("Framework Version"))) {
                  return null; // Handle status via more premium components below
                }
                return <div {...props} />;
              },
              h1: ({ node: _node, ...props }) => (
                <div className="mb-10 animate-fade-in">
                  <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl" {...props} />
                  <div className="mt-4 h-1.5 w-20 rounded-full bg-gradient-to-r from-primary to-amber-300" />
                </div>
              ),
              h2: ({ node: _node, ...props }) => {
                const id = props.children?.toString().toLowerCase().replace(/[^\w]+/g, "-").replace(/^-+|-+$/g, "") || "";
                return (
                  <h2
                    id={id}
                    {...props}
                    className="font-heading mt-16 mb-6 scroll-mt-20 border-b border-border/60 pb-3 text-2xl font-bold tracking-tight"
                  />
                );
              },
              h3: ({ node: _node, ...props }) => {
                const id = props.children?.toString().toLowerCase().replace(/[^\w]+/g, "-").replace(/^-+|-+$/g, "") || "";
                return (
                  <h3
                    id={id}
                    {...props}
                    className="font-heading mt-10 mb-4 scroll-mt-20 text-xl font-bold tracking-tight text-foreground/90"
                  />
                );
              },
              code: ({ node: _node, inline, className, children, ...props }: any) => {
                const match = /language-(\w+)/.exec(className || "");
                const isMermaid = match && match[1] === "mermaid";

                if (!inline && isMermaid) {
                  return <Mermaid chart={String(children)} />;
                }

                return !inline && match ? (
                  <div className="relative my-8 overflow-hidden rounded-xl border border-border/60 bg-[#282c34] shadow-sm ring-1 ring-white/5">
                    <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-white/40">{match[1]}</span>
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
                      style={atomOneDark}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{ margin: 0, padding: "1.25rem", background: "transparent", fontSize: "0.85rem", lineHeight: "1.6" }}
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code className="rounded-md border border-border/40 bg-muted/60 px-1.5 py-0.5 font-mono text-[13px] font-medium text-primary shadow-sm" {...props}>
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
                <th {...props} className="px-6 py-3 text-left text-[11px] font-bold tracking-widest text-muted-foreground uppercase" />
              ),
              td: ({ node: _node, ...props }) => (
                <td {...props} className="px-6 py-4 text-sm font-medium text-muted-foreground" />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </article>

        <footer className="mt-24 border-t border-border/40 pt-12 pb-16">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <p className="text-xs font-medium text-muted-foreground/50">
              © {new Date().getFullYear()} NextStarter. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/terms" className="text-xs font-semibold text-muted-foreground/40 hover:text-primary transition-colors">Terms</Link>
              <Link href="/privacy" className="text-xs font-semibold text-muted-foreground/40 hover:text-primary transition-colors">Privacy</Link>
              <div className="bg-border/60 h-3 w-px" />
              <p className="text-[10px] font-bold tracking-widest text-muted-foreground/30 uppercase">Enterprise Edition</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
