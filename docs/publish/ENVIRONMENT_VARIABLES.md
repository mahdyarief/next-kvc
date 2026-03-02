# 🔐 Environment Variables Guide

This document provides a comprehensive reference for the core configuration options in **NEXT-KVC**.

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

---

## 🚀 Application Parameters

| Variable     | Default | Description                                             |
| :----------- | :------ | :------------------------------------------------------ |
| `PORT`       | `3000`  | Port for the web server and Socket.IO listener.        |
| `TZ`         | `UTC`   | Default system timezone (e.g., `Asia/Jakarta`).         |

---

## 📦 Storage Configuration

| Variable | Default | Description |
| :------- | :------ | :---------- |
| `STORAGE_PROVIDER` | `local` | `local`, `vercel-blob`, or `uploadthing`. |
| `MAX_UPLOAD_SIZE_MB` | `5` | Maximum allowed file upload size. |
| `BLOB_READ_WRITE_TOKEN` | - | (Vercel Blob Only) Token for @vercel/blob. |
| `UPLOADTHING_TOKEN` | - | (UploadThing Only) Auth token for UploadThing. |

---

## 📚 Swagger UI Configuration

| Variable                       | Default    | Description                      |
| :----------------------------- | :--------- | :------------------------------- |
| `NEXT_PUBLIC_SWAGGER_USERNAME` | `admin`    | Username for Swagger UI auth.    |
| `NEXT_PUBLIC_SWAGGER_PASSWORD` | `admin123` | Password for Swagger UI auth.    |

---

## 📝 Example Configuration

```env
# Essential Setup
BASE_URL="https://dashboard.example.com"
DATABASE_URL="postgresql://user:pass@db-host:5432/db?schema=public"

# Security
AUTH_SECRET="your-high-entropy-secret"

# Localization
TZ="Asia/Jakarta"
```

---

<div align="center">
  **Document Status**: Cleaned | **Framework Version**: 1.3.0
</div>
