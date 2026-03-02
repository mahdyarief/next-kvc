# 📂 Knowledge Base Index

Welcome to the internal documentation portal for **NEXT-KVC** (Next Dashboard Starter). Navigate using the links below to understand the technical architecture, security baseline, and development workflow.

---

## 🏗️ Technical Reference (Core Knowledge)
*Deep-dive into architecture, configuration, and structural rules.*

| Document | Purpose |
| :--- | :--- |
| **[🏗️ Project Architecture](./PROJECT_DOCUMENTATION.md)** | Overview of **FBA**, **Modular Prisma**, and core backend patterns. |
| **[🤖 Agentic Framework](./AGENTIC_FRAMEWORK.md)** | Rules and skills that govern how AI agents interact with this code. |
| **[🔐 Environment Variables](./ENVIRONMENT_VARIABLES.md)** | Critical config options for local and production environments. |
| **[📜 API Specification](./API_DOCUMENTATION.md)** | Technical reference for every available REST endpoint. |

---

## 🚀 Workflow Guides (Step-by-Step)
*Action-oriented walkthroughs for daily development and deployment.*

| Document | Purpose |
| :--- | :--- |
| **[💎 Feature Journey](./FEATURE_IMPLEMENTATION_JOURNEY.md)** | Step-by-step path from idea to production implementation. |
| **[🚢 Deployment Guide](./DEPLOYMENT_GUIDE.md)** | Walkthrough for pushing to GitHub and launching on Vercel. |
| **[📝 Changelog](./CHANGELOG.md)** | History of project versions and significant updates. |

### 🛠️ External Discovery & Specs
- **[API Discovery Portal](/dashboard/api-docs)**: Internal UI for exploring every available endpoint (requires login).
- **[Swagger UI Spec](/swagger)**: Interactive playground for testing the REST API.

---

## 🏗️ Quick Infrastructure Reference

### 🗄️ Database Setup
The system is built to switch seamlessly between **SQLite** and **PostgreSQL**.
1. Set the `DATABASE_URL` in your `.env`.
2. Run `bun run db:config` to adapt the schema provider.
3. Apply changes with `bun run db:push`.
4. Use `bun run db:studio` for visual inspection of your data.

### 🛡️ Security & Audits
- **Audit Compliance**: All sensitive operations are tracked via the **`AuditLog`** table with JSON diffing.
- **Access Control**: Role-based permissions are enforced globally in `getAuthenticatedUser`.
- **API Keys**: Authenticate programmatically via the `X-API-Key` header with your `kvc` key.

---

<div align="center">
  **Document Status**: Index | **Framework Version**: 1.1.0
</div>
