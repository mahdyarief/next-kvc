# PRD Generation Mastery: Kelas Vibe Coding Elite PM Gem

## 🎯 Overview
This folder contains the complete multi-file instruction set to create your own **Kelas Vibe Coding Elite PM and System Architect** Gem on Google Gemini. This Gem is specifically tuned for the **Next Dashboard Blueprint** (Next.js 16 + Prisma 6 + Tailwind 4) stack.

The logic is split into 4 high-focus files to ensure the AI follows a strict PRD-to-Engineering lifecycle:
1.  **`gemini-instructions.md`**: The behavioral matrix (System Prompt). It defines the **Stage 1: Discovery** interview process and the 4-stage feature journey.
2.  **`knowledge-01-core-templates.md`**: The exact markdown syntax and formatting rules for the Master PRD, Task List, and Google Stitch Design Brief.
3.  **`knowledge-02-architecture-constraints.md`**: The technical truth for the Next/Prisma stack. Ensures requirements map to architectural realities (FBA-SOLID-SSOT, Audit Trails, RBAC).
4.  **`knowledge-03-pm-frameworks.md`**: Advanced PM frameworks like MoSCoW prioritization, 5-Whys Discovery, and HILE (High Impact, Low Effort) strategies.

---

## 🚀 How to Install the Gem on Google Gemini

1.  **Go to Gemini**: Open [gemini.google.com](https://gemini.google.com/).
2.  **Open Gems Manager**: In the left sidebar, click **Gems Manager** (or the **+** button).
3.  **Create New Gem**: Click **Create a Gem**.
4.  **Identity & Role**:
    -   **Name**: `Kelas Vibe Coding Elite PM`
    -   **Description**: `Elite PM & System Architect for the Next Dashboard Blueprint. Handles Stage 1 Discovery, PRD generation, and FBA Task Lists.`
5.  **Instructions (The System Prompt)**:
    -   Open [**`gemini-instructions.md`**](file:///d:/Github/next-kvc/next-prd-gems/gemini-instructions.md).
    -   Copy the entire text and paste it into the **"Instructions"** box.
6.  **Knowledge (The RAG Memory)**:
    -   In the Gem creator, find the **"Knowledge"** section and click **Upload**.
    -   Upload these **4 files** to provide full architectural context:
        -   `next-prd-gems/knowledge-01-core-templates.md`
        -   `next-prd-gems/knowledge-02-architecture-constraints.md`
        -   `next-prd-gems/knowledge-03-pm-frameworks.md`
        -   **`.agent/rules/product-engineering-blueprint.md`** (The core bridge between PRD and Code).
7.  **Click Create/Save**.

---

## 🏎️ How to Use the Integrated Workflow

1.  **Phase 1 (The Gem)**: Open your new Gem and say: *"I want to build a feature for [Your Idea]."*
2.  **Phase 2 (The Discovery)**: Follow the Gem's interview. Approve its HILE recommendations and MoSCoW draft.
3.  **Phase 3 (The Handoff)**: Once the Gem generates the final **Master PRD** and **Task List**, copy them.
4.  **Phase 4 (The Engineering Agent)**: Paste them into your IDE/Engineering Agent chat.
5.  **Phase 5 (Execution)**: Tell the agent: *"Implementing this feature. Follow the standard blueprint."* The agent will run `/plan` and begin the FBA build.

---

## 💡 Blueprint Sync
Every time you update the [**`product-engineering-blueprint.md`**](file:///d:/Github/next-kvc/.agent/rules/product-engineering-blueprint.md) in the codebase, you should re-upload it to the Gem's Knowledge to keep the PM and Engineering logic in perfect sync.
