---
name: next-dashboard-starter
description: Architectural guidelines for the Next Dashboard Starter template. Includes modular Prisma schema patterns, standardized API handling (withErrorHandler), and Feature-Based Architecture (FBA) for pure Next.js 15/16 + Prisma projects.
---

# Next Dashboard Starter Architecture

This skill defines the "Excellent" architectural standards for the Next Dashboard Starter. It focuses on scalability, real-time capabilities, and standardized communication between frontend and backend.

## 1. Modular Prisma Schema
The database schema is split into multiple files within `prisma/schema/` to improve maintainability.

- **`main.prisma`**: Global config (generator, datasource).
- **`user.prisma`**: Auth and user models.
- **`notification.prisma`**: Notification system.
- **`system.prisma`**: Global application settings.
- **`webhook.prisma`**: External integrations.

**Rules:**
- Add new models to new `.prisma` files in `prisma/schema/`.
- Always run `bun run db:push` or `bunx prisma generate` after schema changes.
- Use `cuid()` (or `uuid()`) for IDs across all models.

## 2. Standardized API Routes
Every API route MUST follow the "Excellent" pattern adapted from industrial-grade backends.

### Use `withErrorHandler`
Import from `@/lib/api-handler`. This higher-order function handles try/catch blocks automatically.

### Use `api` Response Utility
Import from `@/lib/api-response`. This ensures a 100% consistent JSON shape.
```json
{
  "success": boolean,
  "message": string,
  "data": T,
  "meta": any
}
```

### Use Custom Errors
Import from `@/lib/errors`. Throw named errors (`ForbiddenError`, `ValidationError`, etc.) instead of returning manual status codes.

**Excellent Pattern Example:**
```typescript
import { withErrorHandler } from "@/lib/api-handler";
import { api } from "@/lib/api-response";
import { ForbiddenError } from "@/lib/errors";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const user = await getAuthenticatedUser(req);
  if (!user) throw new ForbiddenError();
  
  const data = await prisma.item.findMany();
  return api.success(data, "Items retrieved");
});
```

## 3. Feature-Based Architecture (FBA)
Code is organized by business feature rather than technical type.

```
src/features/[feature-name]/
├── components/       # Feature UI (kebab-case.tsx)
├── services/         # Business logic (non-Next.js specific)
├── hooks/            # Feature-specific React hooks
├── server/           # Server-side specific logic (auth checks, db helpers)
├── constants.ts      # SSOT for feature options
└── schemas.ts        # Zod validation schemas
```

- **Global UI**: Generic Shadcn components live in `src/components/ui`.
- **Global Lib**: Shared infrastructure (Prisma, Auth, API Helpers) lives in `src/lib`.

## 4. Real-time Notifications
The template includes a pre-built Socket.IO setup for notifications.

- **Server-side**: `src/server/index.ts` initializes the Socket.IO server.
- **Client-side**: `src/features/dashboard/components/navbar.tsx` listens for `notification:new` events.

## 5. Technology Stack
- **Next.js 16+**: App Router, Server Components by default.
- **Prisma 6+**: SQLite (default) or PostgreSQL.
- **Tailwind 4**: CSS-first styling.
- **NextAuth 5**: Beta version with middleware and callbacks.

## Enforcement Checklist
- [ ] Schema changes split into modular files?
- [ ] API route uses `withErrorHandler` and `api` utility?
- [ ] New feature created in `src/features/`?
- [ ] Logic co-located (schema + form in feature folder)?
- [ ] `bun run typecheck` passes?
