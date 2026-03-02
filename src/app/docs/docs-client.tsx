"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Menu, Search, FileText, LayoutDashboard, ExternalLink } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";

import { DocsClientProps } from "@/features/docs/types";
import { SidebarItem } from "@/features/docs/components/sidebar-item";
import { MarkdownRenderer } from "@/features/docs/components/markdown-renderer";
import { useDocsNavigation } from "@/features/docs/hooks/use-docs-navigation";
import { SiteFooter } from "@/components/brand/site-footer";
import { useFuzzySearch } from "@/hooks/use-fuzzy-search";

export function DocsClient({
  content,
  toc,
  availableFiles,
  currentFileSlug,
}: DocsClientProps) {
  const {
    searchQuery,
    setSearchQuery,
    openMobileMenu,
    setOpenMobileMenu,
    filteredToc,
    isSectionOpen,
    toggleSection,
    scrollToSection,
  } = useDocsNavigation(toc);

  const fileOptions = useMemo(() =>
    availableFiles.map(f => ({
      label: f.name,
      value: f.slug,
      ...f
    })),
    [availableFiles]
  );

  const filteredDocs = useFuzzySearch(fileOptions, searchQuery, {
    keys: ['label', 'value'],
    threshold: 0.4
  });

  const renderSidebarContent = (isMobile = false) => {
    const categories = [
      { id: "reference", label: "Documentation", icon: FileText },
      { id: "guide", label: "Developer Guides", icon: LayoutDashboard },
      { id: "info", label: "Project Info", icon: ExternalLink },
    ] as const;

    return (
      <nav className="space-y-8 pb-10">
        {categories.map((cat) => {
          const files = filteredDocs.filter((f) => f.category === cat.id);

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
                      "group block w-full rounded-lg px-3 py-2 text-sm font-medium transition-all",
                      currentFileSlug === file.slug
                        ? "bg-primary/10 text-primary font-semibold ring-1 ring-primary/20"
                        : "text-muted-foreground/70 hover:bg-muted/50 hover:text-foreground"
                    )}
                    onClick={() => isMobile && setOpenMobileMenu(false)}
                  >
                    <div className="flex items-center justify-between">
                      {file.name}
                      {currentFileSlug !== file.slug && (
                        <div className="h-1 w-1 rounded-full bg-primary/0 transition-all group-hover:bg-primary/40" />
                      )}
                    </div>
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
              <p className="py-4 text-center text-xs text-muted-foreground/40 italic">
                No sections found
              </p>
            )}
          </div>
        </div>
      </nav>
    );
  };

  return (
    <div className="relative mx-auto flex w-full max-w-screen-2xl flex-1 items-start px-4 sm:px-6 lg:px-8">
      {/* Sidebar (Desktop) */}
      <aside className="sticky top-14 mt-8 hidden h-[calc(100vh-3.5rem)] w-72 overflow-y-auto border-r border-border/40 pr-8 lg:block">
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
      <main className="min-w-0 flex-1 py-12 lg:pl-16">
        <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-outfit prose-headings:tracking-tight prose-p:text-muted-foreground/90 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-code:text-primary prose-code:bg-muted/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none prose-blockquote:my-8 prose-blockquote:border-primary/20 prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-xl prose-pre:p-0 prose-pre:bg-transparent prose-pre:my-0 prose-pre:overflow-visible">
          <MarkdownRenderer content={content} />
        </div>

        <SiteFooter className="mt-24 pt-12 pb-16" maxContentWidth="max-w-none" />
      </main>
    </div>
  );
}
