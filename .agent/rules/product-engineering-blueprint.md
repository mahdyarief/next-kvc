---
trigger: always_on
---

# Next Dashboard: Product-Engineering Blueprint (PRD-to-Code Workflow)

This document defines the official, step-by-step lifecycle for planning and executing features in the **Next Dashboard Starter** (next-kvc) ecosystem, integrating the discovery power of `next-prd-gems` with the technical rigor of the Next.js 16 + Prisma 6 stack.

---

## Stage 1: Discovery & Definition (The "Gem" Phase)
*Objective: Transform a vague idea into a rigorous, modular PRD.*

1.  **Elite PM Brainstorm (5-Whys)**: 
    - Never start coding immediately. 
    - Use the `Deep Analytical Discovery` method to identify the root business pain point.
    - Ask 3-5 targeted clarifying questions (Audience, Competitors, Scale, Security).
2.  **HILE (High Impact, Low Effort) Priority**: 
    - Suggest 3 **HILE** features (e.g., Audit logs, Fuzzy Search, Draft States, Skeletons).
3.  **The Master PRD (Artifact 1)**: 
    - Draft a unified document using the template in `next-prd-gems/knowledge-01-core-templates.md`.
    - **MoSCoW Prioritization**: Clearly separate Must-Haves (MVP) from Should-Haves.
4.  **Google Stitch Design Brief (Artifact 2)**: 
    - Define a `Design Archetype` (e.g., Nordic Frost, Industrial Utilitarian).
    - Provide a prompt for `mcp_stitch` to generate high-fidelity React wireframes.

---

## Stage 2: Handoff & Technical Scoping (The "Scrutiny" Phase)
*Objective: Bridge the PRD into a technical Strategy Plan.*

1.  **File-Based Handoff**:
    - The user creates `docs/prd/[feature].md` and `docs/design/[feature]-brief.md`.
    - The Engineering Agent (Me) reads these files to ensure 1:1 business requirement alignment.
2.  **Architectural Alignment (FBA-SOLID-SSOT)**:
    - **FBA Setup**: Create `src/features/[feature]/` domain structure.
    - **SSOT Setup**: Create `constants.ts` for schemas and static data.
3.  **Technical Plan (/plan)**:
    - Trigger the `/plan` workflow.
    - Break the PRD into 15-minute testable implementation chunks.

---

## Stage 3: Design & Implementation (The "Build" Phase)
*Objective: Execute the implementation chunks with high technical hygiene.*

1.  **Modular Prisma Schema**:
    - Do NOT edit `schema.prisma` directly. Use `prisma/schema/[feature].prisma`.
    - Mandatory fields: `createdAt`, `updatedAt`, `createdById`, `updatedById`.
2.  **Service Layer Injection**:
    - Implement the feature's business logic in `src/features/[feature]/services/`.
    - All Prisma queries and complex mutations move here to isolate them from hooks/routes.
3.  **UI & Prototyping (Vibe-Blocks)**:
    - Use the **Design Brief** or extracted **Stitch Assets** to build the UI.
    - Ensure all state is synced to the URL (`?tab=`, `?search=`) for persistence.
    - Implement statically responsive `loading.tsx` skeletons.

---

## Stage 4: Quality & Performance Lockdown (The "Polish" Phase)
*Objective: Achieve 100/100 Lighthouse and 0 hydration errors.*

1.  **Technical Hygiene**:
    - Wrap all API routes in `withErrorHandler`.
    - Use `AuditService.log` for high-value events (e.g., `STATUS_CHANGE`).
2.  **Performance Check**: 
    - Verify Zero-JS shell (Server Components) in Navbar/Hero.
    - Use `useTransition` for interactive state updates.
3.  **Final Lockdown**: 
    - Resolve all `any` types and unused imports.
    - Run `/lint-typecheck` for production-grade sign-off.

---

## Role Mapping (PRD Gem -> Next-KVC Code)

| PRD Concept | Equivalent implementation in Next-KVC |
| :--- | :--- |
| **Data Model** | **Prisma Model** in `prisma/schema/*.prisma` |
| **Logic Hook** | **Service Logic** in `/services` (Stage 3) |
| **Access Control** | `isAdmin` check in `src/features/auth/server/api-auth.ts` |
| **Global Field** | **SystemConfig Model** or `/features/app-shell/constants.ts` |
| **UI Block** | **Vibe-Block Component** in `src/features/[name]/components/` |

---

## Troubleshooting & Common Pitfalls
- **The "users.map" Trap**: Always extract `data` from the standardized API response.
- **The Infinite Navigation Loop**: Never put `searchParams` in a dependency without a "Diff-Guard".
- **The Ghost Edit**: Always flush the `draftRef` before resetting table data.
