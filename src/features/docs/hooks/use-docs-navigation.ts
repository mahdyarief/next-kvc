"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { TocSection } from "../types";

export function useDocsNavigation(toc: TocSection[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { filteredToc, autoOpenSections } = useMemo(() => {
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

  const isSectionOpen = useCallback(
    (id: string) => {
      if (debouncedQuery) return !!autoOpenSections[id];
      return manualOpenSections[id] !== undefined
        ? manualOpenSections[id]
        : !!autoOpenSections[id];
    },
    [autoOpenSections, debouncedQuery, manualOpenSections]
  );

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

  return {
    searchQuery,
    setSearchQuery,
    openMobileMenu,
    setOpenMobileMenu,
    filteredToc,
    isSectionOpen,
    toggleSection,
    scrollToSection,
    debouncedQuery,
  };
}
