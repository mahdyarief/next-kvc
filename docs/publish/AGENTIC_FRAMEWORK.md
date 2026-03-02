# 🤖 Agentic Framework (The .agent Folder)

**NEXT-KVC** is not just a dashboard; it is an **Agentic-Ready Codebase**. It is designed to be maintained and expanded by AI agents with high precision, speed, and architectural consistency.

The `.agent/` directory serves as the **"Pre-Frontal Cortex"** of the project. It explicitly defines how an AI agent should think, which skills it should deploy, and which workflows it must follow to deliver production-grade code without technical debt.

---

## � Why this Framework is Critical

Implementing these principles provides measurable business and technical value:

| Benefit | Description |
| :--- | :--- |
| **🚀 Developer Productivity** | Finding where a feature is handled takes seconds. In **FBA**, all logic is co-located. |
| **🛡️ Extreme Reliability** | **SOLID** logic ensures changing one part is unlikely to break another. |
| **🤖 AI-Agent Compatibility** | Prevents "spaghetti code" by providing agents with strict guardrails. |
| **📈 Seamless Scalability** | Complexity remains manageable by encapsulating logic within isolated features. |

---

## �🏗️ The Three Pillars of Agentic Intelligence

The framework is divided into three core pillars that ensure every AI-generated line of code meets industry standards and project-specific requirements.

### 1. 📂 Rules (`.agent/rules/`)
Rules are the **Immutable Laws** of the codebase. They act as automated guardrails that prevent architectural drift.

*   **FBA-SOLID-SSOT**: Enforces Feature-Based Architecture and clean code principles.
*   **Performance Lockdown**: Strict "Zero-JS" rule for the critical rendering path.
*   **Client-Side Robustness**: Prevents infinite re-render loops using `useRef` based tracking.
*   **DOM Nesting Safety**: Prevents hydration errors by enforcing W3C compliance.
*   **UX/UI Guidelines**: Standardized typography (Outfit + Sans) and glassmorphic tokens.

### 2. ⚡ Skills (`.agent/skills/`)
Skills are **Expert Knowledge Modules**. When an agent encounters a specific domain, it "loads" these skills to perform at a senior level.

*   **Vibe Blocks**: 2,000+ pre-designed components to avoid "AI Slop".
*   **Audit-Log Implementation**: Enterprise activity tracking with before/after diffing.
*   **Temporal Data Management**: Algorithms for time-based records and timeline surgery.
*   **Prisma Excellence**: Advanced patterns for modular schemas and transaction safety.

### 3. 🚀 Workflows (`.agent/workflows/`)
Workflows are **Standard Operating Procedures (SOPs)**. They define the exact steps an AI takes to complete a task.

*   **`/plan`**: Evaluates requests against the **HILE (High Impact, Low Effort)** strategy.
*   **`/implement`**: A 4-stage lifecycle: Detection → Planning → Implementation → Verification.
*   **`/diagnose`**: Systematic debugging using **5-Whys Root Cause Analysis**.
*   **`/review`**: Automated compliance audit against FBA and SOLID standards.

---

## 🏗️ Deep Dive: The FBA-SOLID-SSOT Trinity

The core of architectural integrity lies in three interconnected principles:

### 📂 Feature-Based Architecture (FBA)
**Rule: Group code by "Business Domain", not "File Type".**

Instead of global folders, all related logic is co-located in `src/features/[feature-name]/`.
- `components/`: UI specific to this feature.
- `services/`: Business logic and API interaction.
- `hooks/`: Feature-specific React logic.
- `constants.ts`: The static configuration for the feature.

### 🧱 SOLID Principles
**Rule: Write code that is easy to understand, extend, and maintain.**
- **Single Responsibility**: Each function or component does **one thing**.
- **Open/Closed**: Extend via interfaces without modifying existing core logic.
- **Liskov Substitution**: Different implementations must be interchangeable.
- **Interface Segregation**: Only pass the data that is actually needed.
- **Dependency Inversion**: Depend on **abstractions**, not concretions.

### 🔍 Single Source of Truth (SSOT)
**Rule: Data and configuration must exist in exactly ONE place.**
Redundancy causes bugs. We define options once in `constants.ts` and import them across Zod schemas, UI components, and services.

---

<div align="center">
  **Document Status**: Reference | **Framework Version**: 1.1.0
</div>
