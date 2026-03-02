# Senior Fullstack (Next Dashboard Starter)

Expert toolkit for fullstack development using Next.js 16+, Prisma 6+, and modern React patterns. This architecture is a high-performance refactor of the original Payload-based system.

## Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Database**: Prisma 6+ (SQLite/PostgreSQL)
- **Frontend**: React 19, Tailwind CSS 4.x
- **UI/Components**: Shadcn UI (Radix UI), Lucide React
- **Authentication**: NextAuth v5 (Auth.js)
- **Real-time**: Socket.IO
- **Testing**: Playwright (E2E)
- **Package Manager**: Bun

## Core Principles

### 1. API Excellence
Every API route MUST follow the standardized pattern for robust error handling and consistent responses.
- **Handler**: Wrap all handlers with `withErrorHandler` from `@/lib/api-handler`.
- **Response**: Use the `api` utility from `@/lib/api-response` (e.g., `api.success(data)`).
- **Errors**: Throw custom error classes from `@/lib/errors` instead of manual responses.

### 2. Database Excellence (Modular Schema)
The database schema is organized into logical modules within `prisma/schema/` using the Prisma Schema Folder pattern.
- **Structure**: Group related models into separate `.prisma` files (e.g., `user.prisma`, `notification.prisma`).
- **Generation**: Always run `bunx prisma generate` or `bun run db:push` after changes.

### 3. Feature-Based Architecture (FBA)
Logic is grouped by business domain in `src/features/`.
- **Self-Contained**: Each feature directory should contain its own components, hooks, services, and types.
- **Imports**: Use absolute paths: `import { ... } from '@/features/auth/...'`.

## Project Structure

```
src/
├── app/
│   ├── (frontend)/          # Frontend pages and layouts
│   └── api/                 # API routes (standardized handlers)
├── features/                # Feature modules (FBA)
│   ├── [feature-name]/
│   │   ├── components/      # Feature UI
│   │   ├── services/        # Business logic
│   │   ├── hooks/           # Feature hooks
│   │   ├── constants.ts     # Feature SSOT
│   │   └── schemas.ts       # Zod schemas
├── components/
│   ├── brand/               # Branding components
│   └── ui/                  # Shadcn UI base
├── lib/                     # Infrastructure (Prisma, Auth, API Utils)
└── server/                  # Custom server logic (Socket.IO)

prisma/
└── schema/                  # Modular Prisma models
```

## Best Practices

### Code Quality
- **Named Exports**: Use named exports for all components and hooks.
- **Micro-tasks**: Keep functions under 50 lines and restricted to two distinct sub-tasks.
- **Type Safety**: Strictly typed database operations via Prisma Client.

### Security
- **NextAuth 5**: Use `auth()` for server-side session checks.
- **Access Control**: Perform granular role checks in `src/features/auth/server/api-auth.ts`.
- **API Keys**: Prefix system API keys with `nsk_`.

## Common Commands

```bash
# Development
bun run dev            # Start dev server (with DB config)
bun run typecheck      # Run TypeScript validation

# Database
bun run db:push        # Push schema changes and generate client
bunx prisma studio     # Open database GUI

# Maintenance
bun run lint:fix       # Auto-fix linting issues
bun run format         # Format code with Prettier
```

## Resources
- **Prisma Docs**: [Prisma Documentation](https://www.prisma.io/docs)
- **Next.js Docs**: [Next.js Documentation](https://nextjs.org/docs)
- **Full Architecture**: Refer to `next-dashboard-starter` skill.

