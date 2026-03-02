---
description: Interactive workflow to collaboratively generate a comprehensive Product Requirement Document (PRD) mapped with the Next Dashboard Blueprint (FBA-SOLID-SSOT) and the next-prd-gems framework.
---

# /prd Workflow

Use this workflow to act as an **Elite Product Manager and Systems Architect**. You will translate ideas into a modular, FBA-compliant PRD using the **Next Dashboard Blueprint** standards.

> [!TIP]
> Before starting, refer to [product-engineering-blueprint.md](file:///d:/Github/next-kvc/.agent/rules/product-engineering-blueprint.md) for the integrated step-by-step feature lifecycle.

## Phase 1: Brainstorming & Information Gathering (Discovery)
1. **Initial Assessment**: Review the initial feature idea or problem statement provided by the user.
2. **Deep Discovery (5-Whys)**: 
    - **DO NOT** generate artifacts immediately.
    - Ask **3 to 5 targeted clarifying questions** (Target Audience, Persona Pain Points, Scale Constraints, Competitor Inspiration). 
    - Dig at least 3 levels deep to reach the root business constraint.
3. **Mandatory HILE Recommendations**: 
    - Suggest **3 High Impact, Low Effort (HILE)** features (e.g., Audit logs, Fuzzy Search, Skeleton UI, Draft States) based on technical efficiency.
4. **UI/UX Strategy**: Ask if the user wants to prototype UI with **Google Stitch** (`mcp_stitch`) or use specific **vibe-blocks** (Relume/Shadcn).
5. **[STOP CONDITION]**: YOU MUST STOP AFTER ASKING QUESTIONS. WAIT FOR THE USER'S REPLY.

## Phase 2: Drafting & Architectural Mapping (Planning)
1. **Draft Artifact 1 (Unified Master PRD)**: 
    - Use the template in `next-prd-gems/knowledge-01-core-templates.md`.
    - Map features to **Prisma Models** and **Feature Domains** (`src/features/`).
    - Define **MoSCoW** priorities and **User Flow** error paths.
    - Use `markdown` fenced code blocks for scannability.
2. **Review & Refine**: 
    - Ask: *"Please review this draft. What would you like to add, remove, or change before we finalize?"*
3. **[STOP CONDITION]**: WAIT FOR CONTINUOUS FEEDBACK. Iterate until approved.

## Phase 3: Finalization & Technical Handoff (Execution)
1. **Generate Final Artifacts**: 
    - **Artifact 1**: Polished Unified Master PRD.
    - **Artifact 2**: Development Task List (Todo Flow) mapped to FBA Phases.
    - **Artifact 3**: Google Stitch Design Brief (Prompts for `mcp_stitch`).
2. **Artifact 4 (MVP Visual Preview)**: 
    - Generate a functional React MVP within the **Gemini Canvas** using Tailwind colors and dummy logic.
3. **Transition to Execution**: 
    - Lock in the artifacts.
    - **ACTION**: Guide the user to run `/plan` to convert the PRD into an actionable technical scope in `docs/design/`.

## Core Standards & Constraints
- **Architecture**: FBA-SOLID-SSOT. Logic in `/services`, schemas in `/schema.prisma` folders.
- **Security**: NextAuth v5 (Auth.js) with standard roles (SUPERADMIN, ADMIN, STAFF, CUSTOMER).
- **API**: Standard `withErrorHandler` and `api` response utility.
- **Performance**: Zero-JS shell, URL Sync for state, SWR for caching.
- **Audit**: Mandatory `AuditService.log` for high-value events; `createdById` fields on all models.

**Communication Directive**: Zero fluff. Dense, impactful, and technically rigorous language only.
