# Task: Split `docs-client.tsx` into Modular Components

## 🎯 Goal
Modularize `src/app/docs/docs-client.tsx` by extracting sub-components, types, and hooks into `src/features/docs/`.

## 🏗️ Architecture Check
- [x] FBA: Logic in `src/features/docs/`
- [x] SOLID: Components have single responsibility
- [x] SSOT: Types and constants extracted to `types.ts`
- [x] Naming: `kebab-case.tsx`, named exports ONLY

## 📋 TODO
- [x] **Chunk 1: Project Setup & Types** - DONE
- [x] **Chunk 2: Sub-Components Extraction** - DONE
- [x] **Chunk 3: Markdown Renderer Extraction** - DONE
- [x] **Chunk 4: Navigation Logic Hook** - DONE
- [x] **Chunk 5: Refactor Client Entry Point** - DONE

---

# Task: Global Search & Shortcut Implementation

## 🎯 Goal
Add a search keyboard shortcut (Cmd+K / Ctrl+K and Ctrl+Alt+K) and a visual indicator (KBD) in the top nav of the dashboard.

## 🏗️ Architecture Check
- [ ] FBA: Logic in `src/features/dashboard/components/`
- [ ] SOLID: Separated search logic into `SearchCommand`
- [ ] Naming: `kebab-case.tsx`, named exports ONLY

## 📋 TODO
- [x] **Chunk 1: SearchCommand Component** - DONE
  - [x] Implement `SearchCommand` with keyboard listener and basic navigation.
- [x] **Chunk 2: Navbar Integration** - DONE
  - [x] Add Search trigger button to `Navbar` and integrate `SearchCommand`.

# Task: Refactor & Split API Documentation

## 🎯 Goal
Clean up legacy WhatsApp remnants from `src/app/dashboard/api-docs/page.tsx` and modularize into `src/features/api-docs/`.

## 🏗️ Architecture Check
- [x] FBA: Logic in `src/features/api-docs/`
- [x] SOLID: Separated data, UI, and types
- [x] SSOT: Endpoint list in `constants.ts`
- [x] Naming: `kebab-case.tsx`, named exports ONLY

## 📋 TODO
- [x] **Step 1: Cleanup & Planning** - DONE
  - [x] Removed 1000+ lines of legacy WhatsApp-specific documentation.
- [x] **Step 2: Modular Implementation** - DONE
  - [x] Created `src/features/api-docs/types.ts`.
  - [x] Created `src/features/api-docs/constants.ts` with current project endpoints.
  - [x] Created `EndpointTable` and `CategoryFilter` components.
- [x] **Step 3: Refactor Page** - DONE
  - [x] Updated `src/app/dashboard/api-docs/page.tsx` to lean shell.
  - [x] Verified lint status.

# Task: Settings & Notifications Premium Redesign

## 🎯 Goal
Upgrade Settings and Notifications pages to a premium, elegant aesthetic and modularize them into `src/features/`.

## 🏗️ Architecture Check
- [x] FBA: Logic in `src/features/settings/` and `src/features/notifications/`
- [x] SOLID: Extracted reusable Composer and Preview components
- [x] Audit: Integrated `AuditService` in the service layer
- [x] Naming: `kebab-case.tsx`, named exports ONLY

## 📋 TODO
- [x] **Chunk 1: Visual Redesign** - DONE
  - [x] Applied glassmorphism and refined visual hierarchy to both pages.
- [x] **Chunk 2: Feature Modularization** - DONE
  - [x] Created `src/features/settings/` and `src/features/notifications/`.
  - [x] Extracted UI components and state management.
- [x] **Chunk 3: Service Layer & Auditing** - DONE
  - [x] Created `SettingsService` and `NotificationService`.
  - [x] Integrated `AuditService.log` for high-value changes.
  - [x] Refactored API routes to use services.

# Task: Dashboard Overview Polish

## 🎯 Goal
Upgrade the main Dashboard Overview to match the "Premium" visual standard.

## 📋 TODO
- [x] **Chunk 1: DashboardView Redesign** - DONE
  - [x] Added `WelcomeHero` with personalized greeting.
  - [x] Refined `StatCard` and `QuickOperation` tiles with glassmorphism + animations.

# Task: Profile Page Implementation

## 🎯 Goal
Implement a premium, modularized Profile page for user management and authentication credentials.

## 🏗️ Architecture Check
- [x] FBA: Logic in `src/features/profile/`
- [x] SOLID: Extracted `ProfileForm` and `ApiKeyManager` components
- [x] Audit: Integrated `AuditService` in the service layer
- [x] Naming: `kebab-case.tsx`, named exports ONLY

## 📋 TODO
- [x] **Chunk 1: UI & Components** - DONE
  - [x] Created `ProfileForm` and `ApiKeyManager` with premium aesthetics.
  - [x] Implemented glassmorphism shell for account metadata.
- [x] **Chunk 2: Feature Logic** - DONE
  - [x] Created `ProfileService` with auditing and secure hashing.
  - [x] Refactored `/api/user` and added API Key endpoints.
- [x] **Chunk 3: Navigation** - DONE
  - [x] Added "My Profile" to sidebar navigation.
