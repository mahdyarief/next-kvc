# Strategy Plan: Documentation Feature Splitting

## 🎯 Objective
Modularize `src/app/docs/docs-client.tsx` of the `next-kvc` project by extracting logic, types, and sub-components into a dedicated feature directory: `src/features/docs/`. This improves readability, maintainability, and adheres to have Feature-Based Architecture (FBA) and SOLID.

## 🏗️ Architectural Alignment (FBA-SOLID-SSOT)
- **FBA Alignment**: Moved from route-level monolithic client to `src/features/docs/` with modular components.
- **SOLID Compliance (SRP)**: Logic for search, navigation, and rendering is split into focused hooks and components.
- **Naming & Co-location**: Using `kebab-case.tsx` for component files and co-locating types and hooks.
- **Named Exports**: All new components and functions will use named exports.

## 🏗️ Architecture Approach
The `DocsClient` in `src/app/docs/docs-client.tsx` will be refactored into a lean entry point that orchestrates smaller, modular pieces from the `src/features/docs/` directory.

### 📝 Options

#### Option A: HILE (Internal Refactoring)
- **Focus**: Minimum change, just split functions into its own files within the same folder.
- **Benefit**: Quick, low risk.
- **Drawback**: Violates FBA as `src/app/` should ideally only contain routing and layout, not complex shared components.

#### Option B: Comprehensive FBA Modularization (AI Recommendation) ✅
- **Focus**: Clean separation of types, hooks, and UI components in a proper feature domain.
- **Implementation**:
    1. `src/features/docs/types.ts`: Documentation interfaces and types.
    2. `src/features/docs/hooks/use-docs-navigation.ts`: Custom hook for search, debounce, and scroll logic.
    3. `src/features/docs/components/mermaid.tsx`: The Mermaid diagram renderer.
    4. `src/features/docs/components/sidebar-item.tsx`: The recursive sidebar navigation component.
    5. `src/features/docs/components/markdown-renderer.tsx`: The `ReactMarkdown` configuration and styles.
- **Impact**: High. Improved code organization is significant for long-term project health.
- **Effort**: Medium. Involves moving logic and components into multiple files.

## 🚀 Implementation Order
1. **Types**: Move `TocItem`, `TocSection`, and `DocFile` to `src/features/docs/types.ts`.
2. **Components**: Extract `Mermaid`, `SidebarItem`, and the markdown component configuration.
3. **Hook**: Extract search and navigation logic to `use-docs-navigation.ts`.
4. **Refactor Client**: Update `DocsClient` in `src/app/docs/docs-client.tsx` to use the modular feature components.
5. **Quality Check**: Run lint and typecheck to ensure zero regressions.

## 🧪 Testing
- Verify documentation search functionality still works with debounce.
- Verify sidebar items can still toggle and scroll to sections.
- Verify Mermaid diagrams still render correctly.
- Verify all markdown elements (headings, tables, code blocks) still have the custom premium styling.

## 📊 Success Criteria
- `src/app/docs/docs-client.tsx` length reduced by >50%.
- No `any` types or lint warnings.
- Documentation UI remains visually identical and functional.
