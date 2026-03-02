---
trigger: always_on
glob: "**/*"
---

# FBA-SOLID-SSOT Architecture Enforcement

This rule enforces the trinity of architectural principles: **Feature-Based Architecture (FBA)**, **SOLID Principles**, and **Single Source of Truth (SSOT)**.



## 1. Single Source of Truth (SSOT)

**NEVER** define the same options, configuration, or business logic in multiple places.

#### ❌ FORBIDDEN:
```typescript
// Defining options in Collection AND Frontend separately
{ name: 'status', type: 'select', options: ['draft', 'published'] } // in collection
const statuses = ['draft', 'published'] // duplicated in frontend
```

#### ✅ REQUIRED:
```typescript
// src/features/posts/constants.ts (SSOT)
export const POST_STATUS_OPTIONS = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' }
] as const satisfies readonly Option<PostStatus>[]
export const POST_STATUS_VALUES = extractValues(POST_STATUS_OPTIONS)

// Collection, Frontend, Zod schema all import from here
import { POST_STATUS_OPTIONS } from '@/features/posts/constants'
```

**Business logic must live in ONE place** (`src/features/[name]/services/`):

```typescript
// src/features/posts/services/access.ts
export function canAccessPost(post: Post, user?: User): boolean {
  if (post.type === 'premium') return user?.isPremium ?? false
  return true
}
// Use this in both hooks AND frontend — never duplicate the logic
```

---

## 2. Feature-Based Architecture (FBA)

Group code by **Feature Domain** rather than **File Type**.

### Required Directory Structure:
```
src/features/[feature-name]/
├── components/       # Feature-specific UI
├── services/         # Business logic & API calls
├── utils/            # Helper functions
├── constants.ts      # SSOT for options/config
└── schemas.ts        # Zod validation
```

### Naming Conventions (MANDATORY):
- **Directories**: `kebab-case` — `src/features/user-profile/`
- **Component files**: `kebab-case.tsx` exporting `PascalCase`
- **Hooks**: `kebab-case.ts` exporting `camelCase`
- **Services/Utils**: `kebab-case.ts`
- **FORBIDDEN**: Default exports, `camelCase`/`PascalCase` directories

### Import Paths:
```typescript
// ✅ CORRECT — absolute @/ paths
import { POST_STATUS_OPTIONS } from '@/features/posts/constants'
import { EventCard } from '@/features/events/components/event-card'

// ❌ FORBIDDEN — relative ../../ paths across features
import { POST_STATUS_OPTIONS } from '../../../features/posts/constants'
```

### Global vs Feature:
- **Global** (`src/components/ui/`): Generic Shadcn UI components
- **Feature** (`src/features/[name]/components/`): Domain-specific UI
- **Shared** (`src/utilities/`, `src/hooks/`): Used by 3+ features only

---

## 3. SOLID Principles

### S — Single Responsibility
Each function/class MUST have ONE reason to change.

```typescript
// ❌ FORBIDDEN: God function (5 responsibilities)
async function handleRegistration(data) {
  validate(data); hash(data.password); createUser(data); sendEmail(); log()
}

// ✅ REQUIRED: Each function does one thing
export async function registerUser(data: UserInput): Promise<User> {
  validateUserInput(data)
  const hashedPassword = await hashPassword(data.password)
  const user = await createUser({ ...data, password: hashedPassword })
  await notifyUserRegistration(user)
  return user
}
```



### O — Open/Closed
Extend via interfaces, NOT by modifying existing code.

```typescript
// ✅ Add new payment methods without modifying existing code
interface PaymentProcessor { process(amount: number): Promise<PaymentResult> }
class StripeProcessor implements PaymentProcessor { ... }
class CryptoProcessor implements PaymentProcessor { ... } // NEW — no modification
```

### L — Liskov Substitution
Subtypes must be substitutable for their base types. Switching `StripePaymentProvider` to `PayPalPaymentProvider` shouldn't break calling code.

### I — Interface Segregation
Don't pass entire objects when only a few fields are needed:
```typescript
// ❌ BAD: Passing entire User object for just the avatar
// ✅ GOOD: AvatarProps { url: string }
```

### D — Dependency Inversion
Depend on abstractions, not concretions.

```typescript
// ❌ FORBIDDEN
import { EmailService } from '@/lib/email'
class NotificationService { constructor(private emailService: EmailService) {} }

// ✅ REQUIRED
interface NotificationChannel { send(recipient: string, msg: string): Promise<void> }
class NotificationService { constructor(private channel: NotificationChannel) {} }
// Use custom hooks (useProducts()) not direct fetch() — allows swapping implementations
```

---

## 4. Co-location

Code that changes together MUST live together.

```
src/features/contact/
├── components/
│   └── contact-form.tsx   # Uses contactSchema
└── schemas.ts             # Co-located with form

src/features/posts/
├── components/
│   └── post-editor.tsx    # Uses usePostEditor
└── hooks/
    └── use-post-editor.ts # Co-located with component
```

---



## Enforcement Checklist (Before Committing)

### SSOT:
- [ ] No duplicate option arrays (Frontend + Zod)
- [ ] No duplicate validation or business logic
- [ ] Configuration centralized in `constants.ts`

### FBA:
- [ ] Feature code in `src/features/[feature-name]/`
- [ ] Directories use `kebab-case`, no default exports
- [ ] Imports use `@/features/` absolute paths

### SOLID:
- [ ] Functions have single responsibility
- [ ] New features extend via interfaces (not modifying existing)
- [ ] Dependencies injected (not hardcoded)

---

These rules are **MANDATORY**. For detailed examples, see `.agent/skills/fba-solid-ssot/SKILL.md`.
