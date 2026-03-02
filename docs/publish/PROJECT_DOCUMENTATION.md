# 📘 Project Architecture & Documentation

## 🏗️ System Overview
**NEXT-KVC** (Next Dashboard Starter) is a high-performance, developer-first template designed for building complex, scalable dashboard applications. It is powered by **Next.js 16**, **Prisma 7**, and **Bun**.

The architecture prioritizes modularity, type safety, and a "Zero-JS" critical rendering path to achieve industry-leading performance and maintainability.

---

## 🌟 Core Architectural Principles

### 📂 Feature-Based Architecture (FBA)
We reject the traditional "File Type" grouping (e.g., all components in one folder) in favor of **Business Domains**. All logic related to a specific feature lives within `src/features/[feature-name]/`.

| Directory | Purpose |
| :--- | :--- |
| **`components/`** | UI components exclusive to this feature domain. |
| **`services/`** | Business logic, state transitions, and API interactions. |
| **`hooks/`** | Custom React hooks encapsulated for the feature. |
| **`schemas.ts`** | Zod validation logic co-located with the feature. |
| **`constants.ts`** | Single Source of Truth for feature-specific config. |

---

## 🗄️ Database Excellence

### 1. Modular Prisma Schema
To prevent a "God File" schema, we utilize the **Prisma Schema Folder** pattern. Grouped models live in separate `.prisma` files inside `prisma/schema/`.

*   **`user.prisma`**: Authentication, roles, and profiles.
*   **`audit.prisma`**: Enterprise-grade activity logging.
*   **`notification.prisma`**: Real-time system-wide alerts.

### 2. Universal Datasource Transition
The project supports seamless switching between **SQLite** (Local Dev) and **PostgreSQL/MySQL** (Production).
> [!TIP]
> Run `bun run db:config` to automatically detect your database type from the URL and adapt the workspace.

---

## 🔐 Security & API Standards

### 1. Robust Authentication (Auth.js v5)
*   **RBAC (Role-Based Access Control)**: Tiered access for `SUPERADMIN`, `ADMIN`, and `USER`.
*   **API Key Integration**: Support for `nsk_` prefixed keys for external service integrations.

### 2. The Result Pattern
Every API endpoint follows a strict response structure to ensure front-end predictability:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### 3. Enterprise Audit Trails
High-value actions are tracked via the `AuditService`. It captures **Who**, **When**, and **What** (including JSON diffs of before/after states).

---

## ⚡ Real-time Interactivity

### Socket.IO Integration
We use an integrated `Socket.IO` engine to handle bi-directional communication.
- **User Isolation**: Targeted events via `user:${id}` rooms.
- **System Broadcasts**: Instant UI updates for critical system changes.

---

## 📚 Documentation & Discovery

*   **API Discovery Portal**: A custom internal UI for exploring endpoints.
*   **Swagger UI**: Interactive OpenAPI documentation at `/swagger`.
*   **Technical Index**: High-level documentation managed in the `docs/publish` folder.

---

<div align="center">
  **Document Status**: Essential | **Framework Version**: 1.1.0
</div>
