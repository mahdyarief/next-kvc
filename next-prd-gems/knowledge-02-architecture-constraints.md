# Software Architecture & Prisma/Next.js Constraints

The objective of a PRD (Product Requirement Document) in the **Next Dashboard Blueprint** ecosystem is not just to describe features, but to rigorously map them against a strictly-typed, high-performance tech stack (Next.js 16 + Prisma 6).

When you define requirements in Phase 1 (Discovery) or Phase 2 (Drafting), you must ensure they comply with the following architectural truths.

### 1. FBA-SOLID-SSOT Architecture (Feature Based Architecture)
All tasks and scopes generated must respect the project's strict folder structure:
- **SSOT**: Constants, Zod schemas, and base configs must live exactly once in `src/features/[name]/constants.ts`.
- **FBA**: All business logic (Services), Hooks, and UI Components live logically grouped under `src/features/[feature-name]/`. 
- **Modular Prisma**: No single schema file. Every feature has its own `prisma/schema/[feature].prisma` file.

### 2. Database & Data Integrity (Prisma 6)
- **Data Integrity (Audit Trails)**: Every model must include `createdAt`, `updatedAt`, `createdById`, and `updatedById` fields. Assume this is required for every feature.
- **Audit Logging**: Use `AuditService.log` for high-value changes (status updates, deletions). PRDs must define what actions should be audited.
- **Scale / Timeouts**: Transactions timeout if uncontrolled. The PRD must define expected data volume (100 rows vs 10M rows) to ensure proper indexing.

### 3. Next.js 16 (App Router) Constraints
The ecosystem relies heavily on Server Components and optimized rendering.
- **Zero-JS Shell Priority**: Critical UI elements like sidebars, navbars, and heroes must remain Server Components. Do not suggest heavy JS interaction models inside the App Shell.
- **URL Synchronization**: Any state that should survive a page refresh (Tabs, Search, Pagination) must be synced natively to the URL (`?tab=dashboard`).
- **Server Pre-hydration**: Prevent "Loading Spinner Flash" by pre-fetching critical initial data on the Server and passing it to client-leaf components.

### 4. Vibe-Blocks & Styling
- The project uses a curated set of components called **vibe-blocks** (based on Relume and Shadcn UI) inside Tailwind 4.
- Always suggest using **Google Stitch** to rapid-prototype UI if the user is struggling to define the layout.

### 5. Multilingual & Local Context
- **Global Metadata**: All labels must follow the brand standards in the app-shell constants.
- **Data Localization**: Features displaying time/date or currency must explicitly define local formats (e.g., `id-ID`, `IDR`).
- **Universal Search**: Use `fuse.js` (Fuzzy Search) for searchable dropdowns to handle typos and improve UX.

### 6. Security (Auth.js v5)
- **Role-Based Access Control (RBAC)**: Define exactly who (SUPERADMIN, ADMIN, STAFF, CUSTOMER) can `read`, `create`, `update`, and `delete`.
- **API Excellence**: Every new API route must use `withErrorHandler` and the standardized `api` response utility.
- **Dashboard Restrictions**: The `CUSTOMER` role is strictly forbidden from accessing the `/dashboard` segment.

Make sure your Task List Artifact clearly separates responsibilities (Backend, Frontend, Integration) to minimize deployment blockers.
