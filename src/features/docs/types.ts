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

export interface DocsClientProps {
  content: string;
  toc: TocSection[];
  availableFiles: DocFile[];
  currentFileSlug: string;
  version?: string;
}
