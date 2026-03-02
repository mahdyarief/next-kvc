---
name: Audit Trail Implementation
description: Comprehensive procedures for implementing and maintaining automated audit trails (createdBy, updatedBy) in Prisma schemas.
---

# Audit Trail Implementation (Prisma)

This skill tracks **who** created or updated a specific Prisma model entity and **when**. It is strictly for inline tracking, unlike the full `Audit Log` which stores changes over time.

## 1. Schema Definition

Every standard business model MUST include four fields:
1. `createdAt`
2. `updatedAt`
3. `createdById` (optional/nullable)
4. `updatedById` (optional/nullable)

Along with standard Prisma relations to the `User` table.

```prisma
// Example: prisma/schema/order.prisma
model Order {
  id          String   @id @default(cuid())
  
  // Custom business rules
  status      String   @default("OPEN")
  totalValue  Float

  // Standard Audit Trail Fields
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  createdById String?
  updatedById String?

  // Relations
  createdBy   User?    @relation("OrderCreatedBy", fields: [createdById], references: [id])
  updatedBy   User?    @relation("OrderUpdatedBy", fields: [updatedById], references: [id])
}
```

## 2. Server Action Usage

Whenever a document is mutated from Next.js Server Actions or APIs, you must explicitly associate the operation with the authenticated user ID.

```typescript
'use server'

import { prisma } from "@/lib/prisma"
import { getAuthenticatedUser } from "@/features/auth/server/api-auth"

export async function createOrder(data: any) {
  // Always fetch the context from cookies or API headers
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");

  return await prisma.order.create({
    data: {
      ...data,
      createdById: user.id,
      updatedById: user.id, // Usually the creator is also the first updater
    }
  });
}

export async function updateOrder(id: string, data: any) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");

  return await prisma.order.update({
    where: { id },
    data: {
      ...data,
      updatedById: user.id, // Only update the modifier
    }
  });
}
```

## 3. System (Fallback) Authorship

If an automated job or a system webhook updates a record, leave `updatedById` as `null` or create a dedicated "SYSTEM" user constraint.

```typescript
// Cron job execution
await prisma.order.update({
  where: { id },
  data: {
    status: "EXPIRED",
    updatedById: null // system fallback
  }
});
```

## 4. UI Display

Expose the audit trail fields gracefully in the frontend UI (`User {name/email}` via relational queries).

```tsx
import { format } from "date-fns"

export function AuditTrailInfo({ model }: { model: any }) {
  return (
    <div className="text-sm text-gray-500 flex flex-col gap-1">
      {model.createdBy && (
        <span>
          Created by {model.createdBy.email} on {format(new Date(model.createdAt), "dd MMM yyyy")}
        </span>
      )}
      {model.updatedBy && (
        <span>
          Last updated by {model.updatedBy.email} on {format(new Date(model.updatedAt), "dd MMM yyyy")}
        </span>
      )}
    </div>
  )
}
```
