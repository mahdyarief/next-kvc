# Audit Trail Maintenance

Ensure every business process and database model maintains a robust audit trail to track authorship and modification history natively with Prisma.

## 1. Mandatory Schema Requirements

Every new business-related Prisma model MUST include the automated tracking fields.

### Standard Configuration:
```prisma
model MyCollection {
  id          String   @id @default(cuid())
  // ... business fields
  
  // Mandatory Audit Trail Fields
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  createdById String?
  updatedById String?

  // Standard Relations
  createdBy   User?    @relation("MyCollectionCreatedBy", fields: [createdById], references: [id])
  updatedBy   User?    @relation("MyCollectionUpdatedBy", fields: [updatedById], references: [id])
}
```

## 2. Explicit User Context (Server Actions)

When using Prisma to mutate data inside Server Actions or API Routes, you MUST explicitly capture the user from the current session and attach it to the audit fields.

### Core Rule:
Get the authenticated user using `getAuthenticatedUser()` and pass their ID to `createdById` and `updatedById` during mutations.

#### ❌ WRONG (Audit fields are ignored):
```typescript
await prisma.orders.update({
  where: { id: orderId },
  data: { status: 'shipped' },
})
```

#### ✅ CORRECT (Safe Audit Tracking):
```typescript
import { getAuthenticatedUser } from "@/features/auth/server/api-auth"

// 1. Get user
const user = await getAuthenticatedUser()
if (!user) throw new Error("Unauthorized")

// 2. Pass user ID explicitly
await prisma.orders.update({
  where: { id: orderId },
  data: { 
    status: 'shipped',
    updatedById: user.id // MANDATORY for audit trail
  },
})
```

## 3. Mandatory Audit Logs (High-Value Actions)

For critical business logic (e.g. status changes, deletions, high-value field updates like pricing), you must ALWAYS dispatch a formal Audit Log using the `AuditService`.

```typescript
import { AuditService } from "@/features/audit-log/services/audit.service"

// After database mutation...
await AuditService.log({
  entityName: "Order",
  entityId: orderId,
  action: "STATUS_CHANGE",
  previousData: { status: 'pending' },
  currentData: { status: 'shipped' },
});
```
