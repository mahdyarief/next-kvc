# Continuous Learning (Proactive Enrichment)

To maximize the value of the **Global Agent Setup**, the AI must proactively suggest converting novel bug fixes and architectural discoveries into reusable rules or skills.

## 1. Triggering Events
The AI should immediately propose running the `/enrich` workflow if any of the following occur:
- A difficult, multi-turn debugging session is successfully concluded.
- A "gotcha" or undocumented framework behavior (e.g., Next.js hydration limits, Prisma query bottlenecks) is discovered and bypassed.
- The user requests a new design pattern that isn't currently documented in the `.agent` folder.

## 2. The Proactive Proposal
After confirming a complex fix or implementation, the AI must proactively ask the user:
> *"Since we're using a symlinked Global Agent, should we document this [Bug Fix / Logic Pattern] into the agent's knowledge base so it never makes this mistake again in other projects? If so, just say **/enrich**."*

## 3. The Extraction Format
When extracting knowledge into a rule or skill, ALWAYS use the **Pattern Comparison** format. AI agents learn best by seeing what *not* to do alongside what *to* do:

### ❌ WRONG
```typescript
// The bad pattern that caused the issue, failed, or was slow
```

### ✅ CORRECT
```typescript
// The robust pattern that fixes the issue, performs well, and scales
```

## 4. Strict Generalization & Constraints
- **NEVER** hardcode specific business logic, distinct company names, or highly customized schemas from the current repository into global rules. 
- Generalize the code examples (e.g., use `Posts`, `Orders`, `Users`) so the rule acts as a perfect, universally understandable template for completely different applications in the future.
- **CRITICAL FILE SIZE**: Standard markdown rule/skill files must remain **under 12,000 characters**. If adding new knowledge pushes an existing file over this limit, **split the knowledge** into a new, tightly-scoped file rather than appending it.
