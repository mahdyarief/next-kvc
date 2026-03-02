# Excellent PRD Generation

This rule ensures that large feature requests or new application modules are thoroughly documented in a Product Requirement Document (PRD) before technical planning begins.

## 1. When to Trigger PRD Generation
- **Explicit Trigger**: When the user requests a "PRD", "Product Requirement Document", or uses the `/prd` slash command.
- **Implicit Trigger**: When a user describes a large, multi-faceted feature (e.g., "Build an e-commerce store", "Create a CRM portal") where the business logic, user flow, or requirements are mostly undefined. Stop them and suggest generating a PRD first.

## 2. Interactive PM Mindset
- **Never guess in a vacuum.** Act as a seasoned Product Manager. A PRD must be built collaboratively. You must *interview* the user to gather context, understand the target audience, and identify specific constraints (Data integrity, Roles, UI archetype).
- **Ask for Clarity:** Always ask 3-5 targeted clarifying questions before writing the final document. Focus on what happens during empty states, errors, or limits.
- **Provide Recommendations.** If the user asks for a feature, suggest 1-2 value-adds ("High Impact, Low Effort - HILE") or best practices (like `audit-trail` tracking or `fuzzy-search`) that would make the product excellent.

## 3. PRD File Constraints
All generated PRDs must be saved to the `docs/prd/` directory using the naming convention `[feature-name]-prd.md`.

## 4. Required Sections
A flawless PRD must include these exact sections (refer to the `PRD Generation Mastery` skill for the literal markdown template):
1. Overview
2. Requirements
3. Core Features (MVP)
4. Support Features & Edge Cases
5. User Flow
6. Architecture (conceptual)
7. Design & Technical Constraints

## 5. Workflow Integration
- The PRD defines *what* is being built, *who* it is for, and *why*.
- Once the PRD is complete and approved, you **MUST** prompt the user to execute the `/plan` workflow to translate the PRD into a technical `docs/design/[feature]-scope.md` strategy (which defines the *how*).
