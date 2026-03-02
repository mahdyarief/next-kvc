<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-react/lucide/main/icons/shield-check.svg" width="80" height="80" alt="NEXT-KVC Logo" />
  <h1>NEXT-KVC</h1>
  <p><strong>The ULTIMATE Next.js 16 + Prisma 7 Dashboard Starter</strong></p>

  <p>
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-15%20%2F%2016-black?style=for-the-badge&logo=next.js" alt="Next.js" /></a>
    <a href="https://bun.sh"><img src="https://img.shields.io/badge/Bun-1.1%2B-black?style=for-the-badge&logo=bun" alt="Bun" /></a>
    <a href="https://prisma.io"><img src="https://img.shields.io/badge/Prisma-7.4-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" /></a>
    <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" /></a>
  </p>

  <h4>A premium, production-ready application template for high-performance Web experiences.</h4>
</div>

---

## 🌟 Premium Features

### 🛡️ Core Infrastructure
- **Next.js 16 (App Router)**: Native React Server Components (RSC) and Server Actions.
- **Advanced Auth (Auth.js v5)**: Secure session management with **RBAC** (Superadmin/Admin/User) and **API Key** (`nsk_`) support.
- **Prisma 7 Excellence**: Modular schema architecture using the **Prisma Schema Folder** pattern for scalable data modeling.
- **Universal Database**: Dynamic runtime switching between **PostgreSQL** and **SQLite** via `bun run db:config`.

### ⚡ Real-time & Interactivity
- **Socket.IO Integration**: Integrated real-time engine for instant UI updates and system-wide broadcasts.
- **Dashboard Shell**: Ultra-premium, mobile-responsive sidebar navigation with state-of-the-art animations.
- **Global Search & Filter**: Sophisticated client-side search with **Fuse.js** for typo-tolerant filtering.

### 🍱 High Performance
- **Web Optimized**: Lightning-fast Performance (100/100 Lighthouse target) via **Zero-JS Shell** and **TBT** optimizations.

### 📚 Developer Experience (DX)
- **API Documentation**: Automated **Swagger UI** (`/swagger`) and an internal **API Discovery Portal** documenting 80+ endpoints.
- **Audit Compliance**: Enterprise-grade `AuditService` for tracking high-value changes and data diffs.
- **CLI Power-ups**: Specialized scripts for admin setup, database preparation, and automated update checks.

---

## 🏗️ Architecture: FBA-SOLID-SSOT

This project follows an advanced **Feature-Based Architecture (FBA)**, ensuring your codebase remains maintainable as it grows.

- **`src/features/`**: Business logic is grouped by **Feature Domain** (e.g., `auth`, `audit-log`, `dashboard`), not by tech type.
- **API Excellence**: Standardized error handling via `withErrorHandler` and uniform responses via the `api` utility.
- **Single Source of Truth (SSOT)**: Constants, validation schemas, and services live in a single feature folder, preventing duplication across the app.

---

## 🛠️ Tech Stack

- **Runtime**: [Bun v1.1+](https://bun.sh)
- **Framework**: [Next.js v15/16](https://nextjs.org) (App Router)
- **Database**: [Prisma v7](https://prisma.io) & [SQLite](https://sqlite.org) / [PostgreSQL](https://postgresql.org)
- **Security**: [Auth.js v5 (NextAuth)](https://authjs.dev)
- **UI/UX**: [Tailwind CSS 4](https://tailwindcss.com), [Shadcn UI](https://ui.shadcn.com), [Lucide React](https://lucide.dev)
- **Real-time**: [Socket.IO](https://socket.io)

---

## 🏃 Getting Started (High Speed)

### 1. Prerequisites
- [Bun](https://bun.sh) (Highly Recommended) or Node.js 20+.

### 2. Rapid Installation

```bash
# 1. Clone & Enter
git clone https://github.com/kelasvibecoding/next-kvc.git
cd NEXT-KVC

# 2. Install (Bun is life)
bun install

# 3. Environment Setup
cp .env.example .env
# Open .env and customize AUTH_SECRET and DATABASE_URL if needed.

# 4. Database Setup
# Detects DB type and configures Prisma automatically
bun run db:config
bun run db:push

# 5. Create First Admin
# Promotes existing user to SUPERADMIN or creates a new one
bun run add-admin admin@example.com password123
```

### 3. Development Server

```bash
bun dev
```
Explore the UI at `http://localhost:3000` and the API Docs at `http://localhost:3000/docs`.

---

## 📂 Project Blueprint

```text
├── prisma/             # Modular Schemas (prisma/schema/*.prisma)
├── src/
│   ├── app/            # Next.js Routes & API Gateway
│   ├── features/       # Modular Business Logic (FBA)
│   │   ├── audit-log/  # Activity Tracking Service
│   │   ├── auth/       # Security & RBAC Logic
│   │   └── dashboard/  # Layout & Component Logic
│   ├── components/     # Global UI Design System (Shadcn/UI)
│   ├── lib/            # Core Infrastructure (Auth, Prisma, API)
│   ├── server/         # Custom HTTP & Socket.IO initialization
│   └── types/          # Universal Type Definitions
```

---

## 🛡️ API Standards

Every API route built in this project must follow the internal standard:
1. Wrap handlers with `withErrorHandler`.
2. Return data via `api.success()` or `api.error()`.
3. Use co-located Zod schemas for validation.

```typescript
// Example Implementation
export const POST = withErrorHandler(async (req) => {
  const data = await req.json();
  const result = await myService.execute(data);
  return api.success(result, "Action completed successfully");
});
```

---

## 📄 License

This project is licensed under the **MIT License**. Build something amazing.

---
<div align="center">
  <sub>Developed with ❤️ by <b>NEXT-KVC Team</b>. Built for <b>Speed</b>, <b>Scale</b>, and <b>Simplicity</b>.</sub>
</div>
