# 🗺️ NEXT-KVC Starter Kit Roadmap

This document tracks the completion progress of **NEXT-KVC** toward being a fully production-ready Next.js Dashboard Starter Kit.

---

## ✅ Already Shipped

| Feature | Description |
| :--- | :--- |
| **Auth (NextAuth v5)** | Secure Credentials provider with JWT sessions |
| **RBAC** | Role-based access: `SUPERADMIN`, `ADMIN`, `CUSTOMER` |
| **API Key Auth** | Per-user `nsk_` prefixed API keys via `x-api-key` header |
| **Dashboard Shell** | Premium sidebar, navbar, mobile nav, real-time clock |
| **Socket.IO** | Real-time bi-directional communication engine |
| **Notifications** | System alerts with real-time delivery + DB persistence |
| **Users CRUD** | List, update, delete with role-gated access |
| **System Settings** | DB-backed config: app name, registration toggle, timezone |
| **Multi-Provider Storage** | `local`, `vercel-blob`, `uploadthing` via unified `StorageService` |
| **Audit Log Engine** | `AuditLog` model + `AuditService` with JSON diff support |
| **API Excellence** | `withErrorHandler`, `api.success/error`, standardized responses |
| **Swagger UI** | Auto-generated API explorer at `/swagger` |
| **API Docs Portal** | Internal markdown-powered documentation at `/docs` |
| **Modular Prisma Schema** | `prisma/schema/*.prisma` folder pattern |
| **Landing Page** | Premium public homepage with hero and feature sections |

---

## 🚀 Planned Features

### Phase 1 — User Self-Service `v1.4`

> **Goal**: Let users manage their own accounts without admin intervention.

- [ ] **Profile Page** — `/dashboard/profile`
  - View and edit display name and avatar
  - Change password (current → new)
  - Show current role, joined date, and last login
- [ ] **Avatar Upload** — wire `StorageService` to the `User.image` field
- [ ] **API Key Management** — display, copy, and regenerate key from the UI

**Estimated effort**: 🟢 Low

---

### Phase 2 — Audit Log UI `v1.5`

> **Goal**: Surface the existing `AuditLog` database records through a premium admin interface.

- [ ] **Audit Log Page** — `/dashboard/audit-log`
  - Filterable table: Entity, Action, Actor, IP Address, Timestamp
  - Diff viewer: before/after value changes rendered as a visual diff
  - Date range filter
  - Export to CSV

**Estimated effort**: 🟡 Medium

---

### Phase 3 — Dark Mode `v1.5`

> **Goal**: Provide a complete light/dark theme experience out of the box.

- [ ] Integrate `next-themes` provider
- [ ] Sun/Moon toggle button in the Navbar
- [ ] Persist preference in `localStorage`
- [ ] Ensure all Shadcn/UI components respect the active theme

**Estimated effort**: 🟢 Low

---

### Phase 4 — Webhook Management `v1.6`

> **Goal**: Provide a full UI for the `Webhook` Prisma model that already exists in the schema.

- [ ] **API Routes**: `GET`, `POST`, `PATCH /[id]`, `DELETE /[id]` at `/api/webhooks`
- [ ] **Webhook Page** — `/dashboard/webhooks`
  - Create form: Name, URL, Secret, Events (multi-select)
  - List view with an enable/disable toggle
  - Delete with confirmation dialog

**Estimated effort**: 🟡 Medium

---

### Phase 5 — Email & Password Reset `v1.7`

> **Goal**: Provide a complete transactional email flow — a foundational feature of any production starter.

- [ ] Email provider integration (Resend or Nodemailer/SMTP)
- [ ] New env vars: `RESEND_API_KEY` or `SMTP_*`
- [ ] Email templates: Welcome, Password Reset
- [ ] **Forgot Password flow**:
  - `/auth/forgot-password` — input email, send reset link
  - `/auth/reset-password?token=...` — set new password
- [ ] Secure token generation with expiry (`PasswordResetToken` model)

**Estimated effort**: 🔴 High

---

### Phase 6 — Rate Limiting `v1.7`

> **Goal**: Wire up the existing `ENABLE_RATE_LIMITING` and `RATE_LIMIT_PER_MINUTE` env vars into actual middleware.

- [ ] Implement lightweight in-memory rate limiter (or `@upstash/ratelimit` for Redis)
- [ ] Apply to `/api/auth/*` and sensitive mutation routes
- [ ] Return `429 Too Many Requests` with `Retry-After` header
- [ ] Respect `ENABLE_RATE_LIMITING` feature flag from `.env`

**Estimated effort**: 🟢 Low

---

### Phase 7 — First-Run Onboarding Wizard `v2.0`

> **Goal**: Replace the CLI-only `bun run add-admin` setup with a web-based first-run experience.

- [ ] Detect zero users in the database on first launch
- [ ] Redirect to `/auth/setup` — a secure, one-time page
- [ ] Setup form: App Name, Admin Email, Password
- [ ] After creation, destroy the setup route and seed `SystemConfig`
- [ ] Illustrated empty states for Users, Notifications, and Audit Log tables

**Estimated effort**: 🔴 High

---

## 📊 Priority Matrix

| # | Feature | Impact | Effort | Target Version |
|---|---|:---:|:---:|:---:|
| 1 | 👤 Profile Page | 🔴 High | 🟢 Low | v1.4 |
| 2 | 🌙 Dark Mode | 🔴 High | 🟢 Low | v1.5 |
| 3 | 📋 Audit Log UI | 🔴 High | 🟡 Medium | v1.5 |
| 4 | 🔗 Webhook UI | 🟡 Medium | 🟡 Medium | v1.6 |
| 5 | 📧 Email / Password Reset | 🔴 High | 🔴 High | v1.7 |
| 6 | 🛡️ Rate Limiting | 🟡 Medium | 🟢 Low | v1.7 |
| 7 | 🧙 Onboarding Wizard | 🟡 Medium | 🔴 High | v2.0 |

---

## 🏷️ Version Targets

| Version | Milestone |
| :--- | :--- |
| `v1.3` | Environment cleanup & API alignment ✅ |
| `v1.4` | User Self-Service (Profile + Avatar + API Key UI) |
| `v1.5` | Audit Log UI + Dark Mode |
| `v1.6` | Webhook Management |
| `v1.7` | Email Integration + Rate Limiting |
| `v2.0` | Onboarding Wizard + Empty States |

---

<div align="center">
  <strong>NEXT-KVC</strong> — Built for Speed, Scale, and Simplicity.
</div>
