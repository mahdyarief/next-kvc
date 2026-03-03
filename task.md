# Task: Mobile-Friendly Documentation Enhancement

## 📋 Progress Tracking
- [ ] **Chunk 1: Refactor `DocsClient`** - READY TO IMPLEMENT
  - [ ] Add `version` to `DocsClientProps`.
  - [ ] Consolidate mobile headers inside `DocsClient`.
  - [ ] Add secondary navigation links to the mobile `Sheet`.
  - [ ] Improve main content padding on mobile.
  - **Test Instructions**: Check mobile view (375px) to ensure only ONE sticky header is present and the menu drawer works.

- [ ] **Chunk 2: Update Doc Slug Page (`[[...slug]]/page.tsx`)** - WAITING FOR CHUNK 1
  - [ ] Remove the duplicated `<header>` from the server component.
  - [ ] Pass the version and other necessary props to `DocsClient`.
  - **Test Instructions**: Check if the mobile and desktop documentation pages look and feel cleaner.
