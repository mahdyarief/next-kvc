# Strategy Plan: API Documentation Refactoring & Splitting

## 🎯 Objective
Refactor `src/app/dashboard/api-docs/page.tsx` to align with the generic **Next.js Dashboard Starter** architecture by:
1.  Removing redundant WhatsApp-specific documentation (Legacy "WhatsApp Gateway" code).
2.  Replacing it with a concise, current list of actual API endpoints.
3.  Modularizing the code into a feature-based structure in `src/features/api-docs/`.

## 🏗️ Architectural Alignment (FBA-SOLID-SSOT)
- **FBA Alignment**: Logic for the documentation UI and hardcoded endpoint lists will be moved to `src/features/api-docs/`.
- **SOLID Compliance (SRP)**: Separating the data list, type definitions, and the UI layout into discrete modules.
- **Naming & Co-location**: Using `kebab-case.tsx` and co-locating all API documentation assets.
- **Named Exports**: All new components and functions will use named exports.

## 🏗️ Architecture Approach
The new structure will use a central list of endpoints to drive the filterable UI.

### 📝 Options

#### Option A: Clean Slate (Delete and Redirect)
- **Focus**: Just delete this manual page and redirect users to `/swagger`.
- **Reasoning**: Swagger UI is already more robust.
- **Drawback**: The user specifically asked to "review this" and "split code", indicating a preference to maintain a quick-reference style page in the dashboard.

#### Option B: Refactored Quick-Reference (AI Recommendation) ✅
- **Focus**: Keep the filterable table UI but populate it with the *actual* new API endpoints (Users, System, Storage, etc.).
- **Implementation**:
    1. `src/features/api-docs/types.ts`: API endpoint interfaces.
    2. `src/features/api-docs/constants.ts`: The SSOT for currently active API endpoints.
    3. `src/features/api-docs/components/endpoint-table.tsx`: Filterable table for endpoints.
    4. `src/features/api-docs/components/category-filter.tsx`: Filter tabs/pills.
- **Impact**: High. Provides an immediate, readable reference for developers without loading the full Swagger UI.
- **Effort**: Medium.

## 🚀 Implementation Order
1. **Types**: Move `ApiEndpoint` and related types to `src/features/api-docs/types.ts`.
2. **Endpoint Data**: Create `src/features/api-docs/constants.ts` with the new, relevant API endpoint list.
3. **Components**: Build `EndpointTable` and `CategoryFilter` as clean, functional components.
4. **Refactor Client**: Update `src/app/dashboard/api-docs/page.tsx` to use these new components.
5. **Quality Check**: Run lint and typecheck.

## 📊 Success Criteria
- File size of `src/app/dashboard/api-docs/page.tsx` reduced by >80%.
- Documentation accurately reflects current project capabilities (not WhatsApp).
- Responsive, filterable UI maintained.
