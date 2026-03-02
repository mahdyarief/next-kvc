---
description: Document a new edge case, bug fix, or architectural pattern into the global agent's knowledge base.
---

# Agent Enrichment Workflow (/enrich)

Use this workflow to continuously improve the AI Agent's capabilities after solving a novel problem, discovering a new edge case, or establishing a new architectural pattern. Since the `.agent` folder is globally symlinked, this ensures the agent never forgets a lesson and can apply it across all future repositories.

## Step 1: Analyze the Lesson Learned
- **Identify the Core Issue:** What was the unique problem, bug, or requirement?
- **Identify the Solution:** What was the exact code, command, or architectural pattern used to solve it?
- **Categorize:** Does this belong in an existing `Rule` (e.g., `security-critical.md`, `backend-robustness.md`), an existing `Skill` (e.g., `payload-cms-development`), or does it require a completely new Rule/Skill?

## Step 2: Extract the Pattern (Generalization)
- Abstract the solution away from the specific repository's business logic.
- Convert the specific variable names into generic, reusable examples (e.g., `collection: 'orders'` instead of `collection: 'pt_xyz_inbound_invoices'`).
- Define the "❌ WRONG" and "✅ CORRECT" patterns to make it easy for the AI to recognize future violations.

## Step 3: Locate the Target Knowledge File
- **Search:** Use the `find_by_name` or `grep_search` tools to find the most relevant `.md` file in `.agent/rules/` or `.agent/skills/`. 
- **Read:** Use the `view_file` tool to read the current contents to ensure you don't duplicate existing knowledge.

## Step 4: Inject the Knowledge
- Use the `multi_replace_file_content` block to append or insert the new pattern chronologically and logically into the chosen `.md` file.
- **CRITICAL SIZE LIMIT**: Before injecting, check the size of the target `.md` file. Markdown rule/skill files **MUST NOT exceed 12,000 characters** to ensure they load fully into context.
- **SPLIT IF NECESSARY**: If adding the new knowledge pushes the file over the 12,000 character limit, do not just blindly append it. Instead, **split the file** into smaller, focused logical domains (e.g., extracting from `fba-solid-ssot.md` to `payload-collections-conventions.md`).
- If creating a *new* rule or skill, use the `write_to_file` tool and follow the `skill-rule-creator` guidelines.
- Format the addition cleanly using Markdown headers (`##`, `###`).

## Step 5: Verify the Global Update
- Confirm to the user that the knowledge has been successfully saved to the `.agent` directory.
- Explain briefly how this new knowledge will prevent the same issue from happening in the future across all symlinked projects!
