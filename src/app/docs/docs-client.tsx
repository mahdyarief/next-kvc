"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Menu, Search, FileText, LayoutDashboard, ExternalLink, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";

import { DocsClientProps } from "@/features/docs/types";
import { SidebarItem } from "@/features/docs/components/sidebar-item";
import { MarkdownRenderer } from "@/features/docs/components/markdown-renderer";
import { useDocsNavigation } from "@/features/docs/hooks/use-docs-navigation";
import { Logo } from "@/components/brand/logo";
import { SiteFooter } from "@/components/brand/site-footer";
import { useFuzzySearch } from "@/hooks/use-fuzzy-search";

export function DocsClient({
  content,
  toc,
  availableFiles,
  currentFileSlug,
  version = "v1.0.0",
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

  const currentFile = availableFiles.find(f => f.slug === currentFileSlug) || availableFiles[0];

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
                    href={`/docs/${file.slug}`}
                    className={cn(
                      "group block w-full rounded-lg px-3 py-2 text-sm font-medium transition-all text-left",
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
    <div className="bg-background relative min-h-screen font-sans">
      <div className="bg-mesh-gold fixed inset-0 -z-10 opacity-30" />

      {/* Unified Documentation Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 px-4 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Trigger (only on Docs subpages, mobile view) */}
            <div className="flex items-center gap-2 lg:hidden">
              <Sheet open={openMobileMenu} onOpenChange={setOpenMobileMenu}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2 text-muted-foreground hover:bg-primary/5 hover:text-primary transition-colors">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[85vw] p-0 sm:w-80 rounded-r-3xl border-r-primary/20 bg-background/95 backdrop-blur-xl">
                  <SheetTitle className="sr-only">Documentation Navigation</SheetTitle>
                  <SheetDescription className="sr-only">
                    Search and navigate through the documentation.
                  </SheetDescription>
                  <div className="border-b border-border/40 bg-muted/10 p-6 flex items-center justify-between">
                    <Logo size={24} showText={true} />
                    <div className="bg-primary/10 text-primary border-primary/20 rounded-full border px-2 py-0.5 text-[10px] font-bold">
                      {version}
                    </div>
                  </div>
                  <div className="h-[calc(100vh-5rem)] overflow-y-auto px-6 py-6 custom-scrollbar">
                    <div className="relative mb-6">
                      <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
                      <input
                        type="text"
                        placeholder="Filter topics..."
                        className="w-full rounded-xl border border-border/40 bg-muted/30 py-3 pr-4 pl-10 text-sm transition-all focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    {renderSidebarContent(true)}

                    {/* Mobile Secondary Menu */}
                    <div className="mt-8 border-t border-border/40 pt-8 pb-10 space-y-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50">
                        Quick Links
                      </h3>
                      <div className="grid gap-2">
                        <Link
                          href="/dashboard"
                          className="flex items-center justify-between rounded-xl bg-primary/5 px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
                        >
                          <span className="flex items-center gap-2">
                            <LayoutDashboard className="h-4 w-4" />
                            Launch Dashboard
                          </span>
                          <ChevronRight className="h-4 w-4 opacity-40" />
                        </Link>
                        <Link
                          href="https://github.com/kelasvibecoding/next-kvc"
                          target="_blank"
                          className="flex items-center justify-between rounded-xl bg-muted/30 px-4 py-3 text-sm font-semibold transition-colors hover:bg-muted/50"
                        >
                          <span className="flex items-center gap-2 text-foreground">
                            <ExternalLink className="h-4 w-4" />
                            GitHub Repo
                          </span>
                          <ChevronRight className="h-4 w-4 opacity-40" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <div className="h-4 w-px bg-border/40 mx-1" />
            </div>

            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Logo size={24} showText={true} />
            </Link>
            <div className="hidden bg-primary/10 text-primary border-primary/20 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-tight sm:block">
              {version}
            </div>

            {/* Breadcrumb on Mobile Only */}
            <div className="hidden items-center gap-1.5 overflow-hidden text-[11px] font-medium lg:hidden sm:flex ml-1">
              <ChevronRight className="h-3 w-3 text-muted-foreground/40 shrink-0" />
              <span className="truncate text-muted-foreground/80 max-w-[120px]">{currentFile.name}</span>
            </div>
          </div>

          <nav className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors hidden md:block"
            >
              Dashboard
            </Link>
            <div className="bg-border/60 h-4 w-px hidden md:block" />
            <Link
              href="https://github.com/kelasvibecoding/next-kvc"
              target="_blank"
              className="bg-foreground text-background rounded-lg px-3 py-1.5 text-[11px] font-semibold hover:opacity-90 transition-opacity sm:px-4 sm:text-xs"
            >
              GitHub
            </Link>
          </nav>
        </div>
      </header>

      <div className="relative mx-auto flex w-full max-w-screen-2xl flex-1 flex-col lg:flex-row lg:items-start px-4 sm:px-6 lg:px-8">
        {/* Removed redundant Mobile Breadcrumb sticky header */}

        {/* Sidebar (Desktop) */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-72 overflow-y-auto border-r border-border/40 pb-10 pr-8 pt-8 lg:block">
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

        {/* Main Content */}
        <main className="min-w-0 flex-1 py-12 px-0 lg:pl-16">
          <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-outfit prose-headings:tracking-tight prose-headings:break-words prose-p:text-muted-foreground/90 prose-p:leading-relaxed prose-p:break-words prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-code:text-primary prose-code:bg-muted/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none prose-blockquote:my-8 prose-blockquote:border-primary/20 prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-xl prose-pre:p-0 prose-pre:bg-transparent prose-pre:my-0 prose-pre:overflow-hidden text-left break-words">
            <MarkdownRenderer content={content} />
          </div>

          {/* Next/Prev Navigation */}
          <div className="mt-20 flex flex-col gap-4 border-t border-border/40 pt-12 sm:flex-row sm:items-center sm:justify-between">
            {(() => {
              const currentIndex = availableFiles.findIndex((f) => f.slug === currentFileSlug);
              const prevFile = currentIndex > 0 ? availableFiles[currentIndex - 1] : null;
              const nextFile = currentIndex < availableFiles.length - 1 ? availableFiles[currentIndex + 1] : null;

              return (
                <>
                  {prevFile ? (
                    <Link
                      href={`/docs/${prevFile.slug}`}
                      className="group flex flex-col gap-2 rounded-xl border border-border/40 bg-muted/5 p-4 transition-all hover:bg-muted/20 sm:w-1/2"
                    >
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                        <ChevronRight className="h-3 w-3 rotate-180" />
                        Previous
                      </span>
                      <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {prevFile.name}
                      </span>
                    </Link>
                  ) : (
                    <div className="hidden sm:block sm:w-1/2" />
                  )}

                  {nextFile ? (
                    <Link
                      href={`/docs/${nextFile.slug}`}
                      className="group flex flex-col items-end gap-2 rounded-xl border border-border/40 bg-muted/5 p-4 transition-all hover:bg-muted/20 sm:w-1/2"
                    >
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                        Next
                        <ChevronRight className="h-3 w-3" />
                      </span>
                      <span className="text-right text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {nextFile.name}
                      </span>
                    </Link>
                  ) : (
                    <div className="hidden sm:block sm:w-1/2" />
                  )}
                </>
              );
            })()}
          </div>

          <SiteFooter className="mt-24 pt-12 pb-16" maxContentWidth="max-w-none" />
        </main>
      </div>
    </div>
  );
}
