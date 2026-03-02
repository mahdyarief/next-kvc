---
trigger: always_on
---

# Architecture Standards: Next Dashboard Starter

This project has been refactored from a WhatsApp Gateway to a generic **Next.js Dashboard Starter**. 

> [!IMPORTANT]
> It is a pure Next.js 16 + Prisma 6 + Tailwind 4 application.

## 1. Directory Structure (FBA)
- **Business Logic**: MUST live in `src/features/[feature-name]/`.
- **Global UI**: Shadcn components in `src/components/ui/`.
- **Infrastructure**: Prisma and authentication in `src/lib/`.

## 2. API Excellence
Every new API Route (`route.ts`) MUST:
1.  Wrap the handler with `withErrorHandler` from `@/lib/api-handler`.
2.  Use the `api` response utility from `@/lib/api-response` (e.g., `api.success()`, `api.error()`).
3.  Throw custom errors from `@/lib/errors` instead of manual `NextResponse` error objects.

## 3. Database Excellence (Modular Schema)
- DO NOT use a single `schema.prisma` file.
- Use the **Prisma Schema Folder** pattern: `prisma/schema/*.prisma`.
- Group related models into separate files (e.g., `user.prisma`, `notification.prisma`).

## 4. Coding Style
- **Naming**: `kebab-case` for all files and directories.
- **Exports**: Named exports ONLY. No default exports.
- **Micro-tasks**: Keep functions small (< 50 lines). Split if they do more than two distinct sub-tasks.

## 5. Security
- Use **NextAuth v5 (Auth.js)** for authentication.
- Access checks (e.g., `isAdmin`) should be performed in `src/features/auth/server/api-auth.ts`.
- Standardized API key prefix is `nsk_`.

## 6. Audit Trail & Logging (SSOT)
Every new business model MUST include:
1.  Standard audit fields: `createdAt`, `updatedAt`, `createdById`, `updatedById`.
2.  Relations to the `User` model for `createdBy` and `updatedBy`.

Use `AuditService` from `@/features/audit-log/services/audit.service` for:
1.  **High-value changes**: Record *what* changed via the `diff` feature.
2.  **Explicit Actions**: Use descriptive actions like `STATUS_CHANGE` instead of generic `UPDATE`.
3.  **Non-blocking**: Audit logs should not block the main transaction; use try/catch or fire-and-forget patterns.

## 7. Routing & Middleware (Proxy Pattern)
This project uses a custom **Proxy Pattern** for middleware:
1.  **Centralized Logic**: Routing, redirects, and authentication checks are managed in `src/proxy.ts`.
2.  **Auth Policy**:
    -   **Public Routes**: Home, `/auth/*`, `/terms`, `/privacy`, and API routes (unless explicitly protected) are open.
    -   **Protected Routes**: Only the `/dashboard` segment and its children require an authenticated session.
3.  **Convenience Redirects**: Roots like `/login` and `/register` are redirected to their respective auth routes via the proxy.