"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { TocSection } from "../types";
import { useFuzzySearch } from "@/hooks/use-fuzzy-search";

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

  const tocItems = useMemo(() => {
    return toc.flatMap(section => 
      section.items.map(item => ({
        label: `${section.title}: ${item.text}`,
        value: item.id,
        sectionId: section.id,
        itemText: item.text,
        sectionTitle: section.title
      }))
    );
  }, [toc]);

  const filteredItems = useFuzzySearch(tocItems, debouncedQuery, {
    keys: ['label', 'itemText', 'sectionTitle'],
    threshold: 0.4
  });

  const { filteredToc, autoOpenSections } = useMemo(() => {
    if (!debouncedQuery) {
      const initial: Record<string, boolean> = {};
      toc.forEach((section) => (initial[section.id] = true));
      return { filteredToc: toc, autoOpenSections: initial };
    }

    // Map filtered items back to original structure
    const sectionMap = new Map<string, TocSection>();
    
    filteredItems.forEach(item => {
      if (!sectionMap.has(item.sectionId)) {
        const originalSection = toc.find(s => s.id === item.sectionId);
        if (originalSection) {
          sectionMap.set(item.sectionId, {
            ...originalSection,
            items: []
          });
        }
      }
      const section = sectionMap.get(item.sectionId);
      if (section) {
        const originalItem = toc.find(s => s.id === item.sectionId)?.items.find(i => i.id === item.value);
        if (originalItem) {
          section.items.push(originalItem);
        }
      }
    });

    const filtered = Array.from(sectionMap.values());
    const allOpen: Record<string, boolean> = {};
    filtered.forEach((s) => (allOpen[s.id] = true));
    return { filteredToc: filtered, autoOpenSections: allOpen };
  }, [debouncedQuery, toc, filteredItems]);

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
