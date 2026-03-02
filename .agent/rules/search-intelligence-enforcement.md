---
trigger: always_on
glob: "**/*.{ts,tsx,js,jsx,json}"
---

# Code Intelligence & Search Enforcement

To maintain high code quality and perform safe refactors, prioritize structural search and efficient multi-pattern searching.

## 1. Structural Search over Regex
When performing search-and-replace tasks that involve nested structures, function signatures, or object properties:
- **AVOID** complex regular expressions that are prone to failure due to whitespace or nesting.
- **PREFER** `ast-grep` (via `npx @ast-grep/cli` if necessary) to define the specific AST patterns to be modified.
- **NEVER** use generic text replacement for critical Prisma schema configurations or Next.js server actions.

## 2. Efficient Searching Strategy
- Before initiating a large-scale refactor, use multi-pattern search strategies to identify all potentially affected areas.
- For architectural audits (e.g., "Where are we missing transaction safety?"), use structural patterns to find nested `prisma.$transaction` calls or missing user authentication block.

## 3. Tool Usage
- Use `grep_search` (ripgrep) for initial discovery.
- Escalate to `ast-grep` for analysis and transformation.
- If a refactor affects more than 5 files, document the structural pattern used for verification.

## 4. Examples
- **Finding missing transaction safety**:
  Search for `prisma.$OP({ data: { $$$ARGS } })` where `$$$ARGS` does NOT contain audit fields (`createdById`, etc).
- **Finding insecure API routes**:
  Search for `export async function POST` where `getAuthenticatedUser()` is missing.
