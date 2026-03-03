---
trigger: always_on
glob: "**/*"
description: Enforces the use of Bun as the primary package manager over npm.
---

# Package Manager Guidelines (Bun-First)

This project strictly uses **Bun** as the primary package manager. You MUST use Bun for all package management, script execution, and runtime tasks.

## 1. Core Rule: Bun Over NPM
- **ALWAYS** use `bun install`, `bun add`, `bun remove`, or `bun run` instead of their `npm`, `yarn`, or `pnpm` equivalents.
- **NEVER** use `npm i`, `npm install`, or `npm run` unless explicitly requested by the user or if a specific script/tool is completely incompatible with Bun.
- If you install a package, use `bun add <package>`. For dev dependencies, use `bun add -d <package>`.

## 2. Exceptions
- You may *only* use `npm` if a third-party CLI or global installation specifically requires it and fails with Bun (e.g., some esoteric `npx` edge cases, though `bunx` should be attempted first).
- If you encounter a situation where `bun` fails, you MUST ask the user before falling back to `npm`.

## 3. Execution Commands
- Use `bunx` instead of `npx`. For instance: `bunx prisma generate` or `bunx shadcn@latest add button`.
- Use `bun run dev`, `bun run build`, `bun run lint`, and `bun run typecheck`.

## 4. Verification
- Make sure to avoid generating a `package-lock.json` or `yarn.lock` file. The project relies strictly on `bun.lockb` or `bun.lock`.
