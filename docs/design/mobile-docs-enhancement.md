# Strategy Plan - Mobile-Friendly Documentation Enhancement

🎯 **Objective**: Enhance the mobile user experience for documentation pages (`/docs/[[...slug]]`) by consolidating sticky headers, optimizing layouts, and ensuring consistent feel across all sub-slugs.

## 🏗️ Architectural Alignment (FBA-SOLID-SSOT)

- **FBA**: Consolidate documentation header logic inside `DocsClient` (the feature-specific UI) to provide interactive responsiveness.
- **SOLID (SRP)**: Let `DocsClient` handle its own layout and header state rather than splitting it between a server component and a client component.
- **SSOT**: Shared branding and navigation constants remain the source of truth for links.

## 🏗️ Architecture Approach

### 1. Consolidation of Headers (HILE)
- On mobile, replace the dual-sticky header (Top branding + Docs breadcrumbs) with a single, high-efficiency sticky header.
- On desktop, maintain the standard top header + sidebar layout.

### 2. Header State Management
- Move the mobile documentation header (the `Sheet` trigger and breadcrumbs) into the main header block within `DocsClient`.
- Move secondary navigation links (GitHub, Dashboard) into the mobile menu drawer to save space on small screens.

### 3. Layout Optimization
- Increase content padding on mobile (`px-2` -> `px-6`) to follow modern accessibility standards and visual hierarchy.
- Ensure breadcrumb text truncates cleanly on extremely narrow devices.

## 🚀 Implementation Order

### Chunk 1: Refactor `DocsClient`
- Add `version` to `DocsClientProps`.
- Implement a unifiedHeader in `DocsClient` that is responsive.
- Modify the mobile `Sheet` content to include standard navigation links.

### Chunk 2: Update Doc Slug Page (`[[...slug]]/page.tsx`)
- Remove the duplicated header from the server component.
- Pass `version` to `DocsClient`.

## 🧪 Testing
- Verify `/docs` (index) and `/docs/agentic-framework` (subpage) in mobile view (375px).
- Verify the mobile menu (hamburger) contains both doc list and main nav links.
- Verify content readability on mobile.

## 📊 Success Criteria
- [ ] Only ONE sticky header on mobile.
- [ ] No layout shift or cramped branding.
- [ ] Mobile menu feels complete and unified.
