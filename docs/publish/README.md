# 📂 Knowledge Base Index

Welcome to the internal documentation portal for **NEXT-KVC** (Next Dashboard Starter). Navigate using the links below to understand the technical architecture, security baseline, and development workflow.

---

## 🌟 Essential Technical Documentation

| Document | Purpose |
| :--- | :--- |
| **[🔐 Environment Variables](./ENVIRONMENT_VARIABLES.md)** | Full REST API configuration and detailed `.env` variable reference guide. |
| **[🏗️ Project Architecture](./PROJECT_DOCUMENTATION.md)** | Deep dive into **FBA Architecture**, **Modular Prisma Schema**, and core backend logic. |
| **[🤖 Agentic Framework](./AGENTIC_FRAMEWORK.md)** | Overview of the **.agent** directory, architectural rules, skills, and slash commands. |
| **[🚀 Feature Journey](./FEATURE_IMPLEMENTATION_JOURNEY.md)** | Step-by-step workflow from Gemini Gem ideation to production code implementation. |
| **[🚢 Deployment Guide](./DEPLOYMENT_GUIDE.md)** | Step-by-step instructions for deploying to **Vercel** and **GitHub**. |
| **[📜 API Specification](./API_DOCUMENTATION.md)** | Detailed reference for every available REST endpoint. |
| **[📝 Changelog](./CHANGELOG.md)** | Detailed history of additions, changes, and versioning. |

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
- **API Keys**: Authenticate programmatically via the `X-API-Key` header with your `nsk_` key.

---

<div align="center">
  **Document Status**: Index | **Framework Version**: 1.1.0
</div>
