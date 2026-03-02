# 🔐 Environment Variables Guide

This document provides a comprehensive reference for all configuration options in **NEXT-KVC** (Next Dashboard Starter).

> [!WARNING]
> Never commit your `.env` file to version control (Git). It contains sensitive credentials that could compromise your system.

---

## 🗄️ Database Configuration

| Variable       | Required | Description                                     |
| :------------- | :------- | :---------------------------------------------- |
| `DATABASE_URL` | **Yes**  | Connection string for MySQL, PostgreSQL, or SQLite. |

### 🛰️ Supported Formats:

- **SQLite (Local Dev)**: `file:./local.db`
- **Postgres (Production)**: `postgresql://user:pass@host:5432/db?schema=public`
- **MySQL (Production)**: `mysql://user:pass@host:3306/db`

> [!TIP]
> Use `bun run db:config` to automatically detect your database type from the URL and configure the Prisma schema provider.

---

## 🔐 Auth & Security Protocols

### `AUTH_SECRET`
Used for **Auth.js** (NextAuth v5) session encryption and JWT hashing.
- **Required**: Yes
- **Recommended**: Strong 32-character secret (`openssl rand -base64 32`)

### `BASE_URL`
The base URL where your application is hosted. Essential for internal routing and absolute URL generation.
- **Dev**: `http://localhost:3000`
- **Prod**: `https://dashboard.example.com`

### `NEXTAUTH_URL`
Automatically derived from `BASE_URL`, but can be set manually. Required for Auth.js callback redirects.

### `AUTH_TRUST_HOST`
Set to `true` if your application is sitting behind a reverse-proxy (Nginx, Cloudflare, etc.).

---

## 🚀 Application Parameters

| Variable     | Default | Description                                             |
| :----------- | :------ | :------------------------------------------------------ |
| `NODE_ENV`   | `dev`   | App environment (`development`, `production`, `test`). |
| `PORT`       | `3000`  | Port for the web server and Socket.IO listener.        |
| `TZ`         | `UTC`   | Default system timezone (e.g., `Asia/Jakarta`).         |
| `APP_NAME`   | `NEXT-KVC` | Application display name.                              |

---

## 📦 Storage Configuration

| Variable | Default | Description |
| :------- | :------ | :---------- |
| `STORAGE_PROVIDER` | `local` | `local` for disk storage or `vercel-blob` for cloud storage. |
| `BLOB_READ_WRITE_TOKEN` | - | (Vercel Blob Only) Required token for API interaction. |

---

## 🔌 Flags & Integrations

- **`ENABLE_NOTIFICATIONS`**: Set to `false` to silence system-wide UI alerts.
- **`ENABLE_AUTO_UPDATE_CHECK`**: Periodically checks for new version releases on GitHub.
- **`ENABLE_RATE_LIMITING`**: Protects API endpoints from brute-force/spam.

---

## 📚 Swagger UI Configuration

| Variable                       | Default    | Description                      |
| :----------------------------- | :--------- | :------------------------------- |
| `NEXT_PUBLIC_SWAGGER_ENABLED`  | `true`     | Enable/disable the `/swagger` page. |
| `NEXT_PUBLIC_SWAGGER_USERNAME` | `admin`    | Username for Swagger UI auth.    |
| `NEXT_PUBLIC_SWAGGER_PASSWORD` | `admin123` | Password for Swagger UI auth.    |

---

## 📝 Example Configuration (Copy-Paste Template)

```env
# Essential Setup
NODE_ENV="production"
BASE_URL="https://dashboard.example.com"
DATABASE_URL="postgresql://user:pass@db-host:5432/db?schema=public"

# Security
AUTH_SECRET="your-high-entropy-secret"
AUTH_TRUST_HOST="true"

# Localization
TZ="Asia/Jakarta"
```

---

<div align="center">
  **Document Status**: Critical | **Framework Version**: 1.1.0
</div>
