# 🚀 Vercel Deployment Guide

This guide provides step-by-step instructions for deploying **NEXT-KVC** (Next Dashboard Starter) to **Vercel** with a production-grade database.

---

## 🏗️ Deployment Architecture

When moving from local development to production, the architecture shifts from a local SQLite file to a managed cloud database.

| Component | Local Development | Production (Vercel) |
| :--- | :--- | :--- |
| **Runtime** | Bun / Node.js | Vercel Serverless (Node.js) |
| **Database** | SQLite (`local.db`) | **PostgreSQL** (Vercel Postgres / Supabase) |
| **File Storage** | Local Disk (`public/uploads`) | **Vercel Blob** (Recommended) |
| **WebSockets** | Integrated Socket.IO | Ably / Pusher (or custom dedicated server) |

> [!IMPORTANT]
> Because Vercel functions are stateless and short-lived, the integrated Socket.IO server will **not** maintain long-lived connections in production. For real-time features on Vercel, we recommend integrating an external provider like **Ably** or **Pusher**.

---

## 🛠️ Step 1: Prepare your Codebase

Before pushing to GitHub, ensure your project is clean and production-ready.

1.  **Remove SQLite Artifacts**: Ensure `prisma/local.db` and any `-journal` files are in your `.gitignore`.
2.  **Lint & Typecheck**:
    ```bash
    bun run lint
    bun run typecheck
    ```
3.  **Local Build Test**:
    ```bash
    bun run build
    ```

---

## 📂 Step 2: GitHub Repository Setup

1.  **Create a New Repository**: Go to [github.com/new](https://github.com/new).
2.  **Initialize Git**:
    ```bash
    git init
    git add .
    git commit -m "feat: initial commit for deployment"
    ```
3.  **Push to GitHub**:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    git branch -M main
    git push -u origin main
    ```

---

## 🚀 Step 3: Vercel Project Creation

1.  **Import Project**: Log in to [Vercel](https://vercel.com) and click **"Add New" ⮕ "Project"**.
2.  **Connect GitHub**: Select your repository from the list.
3.  **Project Settings**:
    - **Framework Preset**: Next.js
    - **Root Directory**: `./`
    - **Build Command**: `npm run build`
    - **Install Command**: `bun install` (Vercel automatically detects Bun if `bun.lockb` is present).

---

## 🗄️ Step 4: Configure Database (Vercel Postgres)

1.  **Add Storage**: In your Vercel project dashboard, go to the **"Storage"** tab.
2.  **Create Database**: Select **"Postgres"** and click **"Create"**.
3.  **Connect**: Follow the prompts to connect the database to your current project. This will automatically add the `POSTGRES_URL` and `DATABASE_URL` environment variables.

---

## 📦 Step 5: Configure Storage (Vercel Blob)

1.  **Add Storage**: In your Vercel project dashboard, go to the **"Storage"** tab.
2.  **Create Blob**: Select **"Blob"** and click **"Create"**.
3.  **Connect**: Link the Blob storage to your project. This will automatically inject the `BLOB_READ_WRITE_TOKEN`.
4.  **Set Provider**: Manually add the environment variable `STORAGE_PROVIDER=vercel-blob` to activate the cloud storage service.


---

## 🔐 Step 6: Environment Variables

In your Vercel Project Settings, navigate to **"Environment Variables"** and add the following:

| Variable | Recommended Value |
| :--- | :--- |
| `DATABASE_URL` | (Automatically added by Vercel Postgres) |
| `AUTH_SECRET` | Run `openssl rand -base64 32` to generate a secure secret. |
| `BASE_URL` | Your production URL (e.g., `https://my-dashboard.vercel.app`) |
| `STORAGE_PROVIDER` | `vercel-blob` |
| `BLOB_READ_WRITE_TOKEN` | (Automatically added by Vercel Blob) |
| `NEXT_PUBLIC_APP_NAME` | `NEXT-KVC` |

---

## 🏗️ Step 7: First Deployment & DB Migration

Vercel will automatically trigger a build when you push to `main`. If this is your first time deploying:

1.  **Push the Schema**:
    Once the build finishes, you may need to push your Prisma schema to the new production database if your build script doesn't handle it.
    ```bash
    # Locally, with production DATABASE_URL loaded:
    bunx prisma db push
    ```
2.  **Verify**: Log in to your Vercel URL and check that you can access the `/docs` and `/dashboard` pages.

---

<div align="center">
  **Document Status**: Essential | **Framework Version**: 1.1.0
</div>
