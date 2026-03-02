# 🤖 Agent Onboarding: The Pre-Frontal Cortex (PFC) Framework

> [!IMPORTANT]
> This page is a summary of the Agentic Framework. For the full, high-fidelity interactive onboarding experience, please visit the **[Rich Agentic Showcase](/docs/agent-onboarding)**.

Welcome to the **Next Dashboard Starter**. Unlike traditional templates, this is a **Living Application Framework** designed to be built in collaboration with an AI Agent.

---

## 🏗️ The Three Cerebral Layers

To build a professional application with this starter, you must understand how to interact with the **Agentic Cortex**:

### 1. The Pre-Frontal Cortex (PFC): Strategic Planning
Before any code is written, you and the Agent must align on the *Structure*. This happens in `docs/design/`.
- **How to use it**: Ask the Agent to `/plan` your feature. 
- **The Result**: A `feature-strategy.md` file that defines the FBA (Feature-Based Architecture) structure before execution.

### 2. Working Memory: The Task Engine
To prevent "hallucinations" and ensure 100% stable code, we use a dynamic `task.md` file at the root.
- **How to use it**: The Agent will break your request into 15-minute implementation "chunks."
- **Verification**: You verify each chunk manually before the Agent moves to the next one. This ensures you are always in control of the progress.

### 3. The Motor Cortex: Governance & Standards
The Agent is hard-coded with **FBA-SOLID-SSOT** standards. 
- **FBA**: All business logic goes into `src/features/[feature-name]`.
- **SOLID**: Each function does exactly one thing, making the app easier to maintain.
- **SSOT**: Constants, types, and logic live in one primary home, never duplicated.

---

## 🛠️ Your First Command

To start building your first feature, simply tell your Agent:

> *"I want to build a new feature: [Feature Name]. Please start the PFC Planning phase and create a strategy doc in /docs/design/."*

---

## 🛡️ Professional Guardrails
- **Modular Prisma**: We don't use single giant schema files. Group your models in `prisma/schema/*.prisma`.
- **Audit Trails**: Every major action is automatically logged via `AuditService.log` for security and accountability.
- **Zero-JS Shell**: Your landing page and core headers stay as Server Components for 100/100 performance.

---

<div align="center">
  **Document Status**: Guide | **Framework Version**: 1.2.0
</div>
