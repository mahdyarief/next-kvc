# Strategy Plan: Global Search Shortcut & Navbar KBD

## 🎯 Objective
Implement a global search shortcut (Cmd+K / Ctrl+K) that opens a command palette and add a visual search button with a KBD indicator in the dashboard's top navigation bar.

## 🏗️ Architectural Alignment
- **FBA**: New components live in `src/features/dashboard/components/`.
- **SOLID**: Unified search logic in a dedicated component.
- **SSOT**: Navigation items in the command menu should ideally sync with `SidebarNav` (initial implementation will use a hardcoded set for speed, but can be refactored to share the constant).
- **Naming**: `kebab-case` for files, named exports.

## 🏗️ Architecture Approach

### 1. `SearchCommand` Component
- **Path**: `src/features/dashboard/components/search-command.tsx`
- **Logic**: 
  - Uses Shadcn `CommandDialog`.
  - Implements `useEffect` for `keydown` listener (`Cmd+K`).
  - Provides navigation actions (Dashboard, Users, Settings, API Docs).
  - Provides theme toggling actions.
- **HILE Approach**: Use `CommandDialog` from `cmdk` for immediate production-grade feel.

### 2. `Navbar` Enhancement
- **Path**: `src/features/dashboard/components/navbar.tsx`
- **Changes**:
  - Add `searchOpen` state.
  - Insert a Search trigger button before the theme toggle.
  - Button styling: Bordered/Outline input-like look on desktop, icon only on mobile.
  - Display `Kbd` component inside the button.

## 🚀 Implementation Order
1. **Part 1**: Create `SearchCommand` component.
2. **Part 2**: Integrate `SearchCommand` into `Navbar` and add the trigger button.

## 🧪 Testing
- Verify `Cmd+K` (Mac) or `Ctrl+K` (Windows) opens the dialog.
- Verify clicking the navbar button opens the dialog.
- Verify search actions (navigation) work correctly.
- Verify responsiveness of the search button.

## 📊 Success Criteria
- [ ] Search menu accessible via keyboard shortcut.
- [ ] Navbar displays a professional-looking search trigger with KBD.
- [ ] No hydration errors or re-render loops.
