---
name: Audit Log Implementation
description: Enterprise-grade, high-performance audit log system for Prisma and Next.js. Covers Prisma schema modelling, write strategies using AuditService, and UI display. Use when implementing a full activity/event log for compliance, debugging, or security purposes.
---

# Enterprise Audit Log Implementation (Prisma)

This skill distinguishes between two concepts that work together:

| Layer | File | What it records | Cost |
| :--- | :--- | :--- | :--- |
| **Audit Trail** | `prisma/schema/*.prisma` | WHO created/updated + timestamps | Zero — inline fields |
| **Audit Log** | `audit.prisma` + service | WHAT changed + full diff + IP | Grows over time |

Use this skill when you need the **Audit Log** layer — for compliance, forensic debugging ("who changed the status from open to close and when?"), or activity monitoring.

---

## 1. Architecture Overview

```
                     ┌─────────────────────────────────┐
  Business Action    │  Next.js Server Action / API    │
                     │  e.g. createOrder()             │
                     └──────┬──────────────────────────┘
                            │
               ┌────────────┴────────────┐
               ▼                         ▼
    ┌─────────────────────┐   ┌────────────────────────────┐
    │  Audit Trail        │   │  Audit Log                 │
    │  (automatic via     │   │  (explicit service call)   │
    │   Prisma)           │   │                            │
    │                     │   │  AuditLog Table            │
    │  Order Table        │   │  ├── entityName: 'Order'   │
    │  ├── createdById    │   │  ├── entityId              │
    │  ├── updatedById    │   │  ├── action: 'UPDATE'      │
    │  ├── createdAt      │   │  ├── actorId (user)        │
    │  └── updatedAt      │   │  ├── diff: {...}           │
    └─────────────────────┘   └────────────────────────────┘
```

---

## 2. AuditLog Prisma Schema

**File**: `prisma/schema/audit.prisma`

```prisma
model AuditLog {
  id             String   @id @default(cuid())
  entityName     String   // e.g. "User", "Notification"
  entityId       String
  action         String   // "CREATE", "UPDATE", "DELETE", "LOGIN"
  actorId        String?
  actorLabel     String?  // Denormalized email or name for history
  diff           String?  // JSON stringified diff: { field: [old, new] }
  metadata       String?  // JSON stringified extra context
  ipAddress      String?
  userAgent      String?
  createdAt      DateTime @default(now())

  @@index([entityName, entityId])
  @@index([actorId])
  @@index([createdAt])
}
```

---

## 3. The Audit Log Service

**File**: `src/features/audit-log/services/audit.service.ts`

The service provides a robust way to compute differences and write logs without crashing the main application flow.

```typescript
import { AuditService } from '@/features/audit-log/services/audit.service';

// Inside your Server Action or API Route
await AuditService.log({
  entityName: "Order",
  entityId: order.id,
  action: "UPDATE",
  previousData: existingOrder,
  currentData: updatedOrder,
  watchFields: ["status", "totalAmount"], // Optional: only diff these fields
  request: req, // Optional: NextRequest to extract IP/UserAgent and authenticated user
});
```

---

## 4. Integration Patterns

### 4.1 — Server Action: Status Change

Status changes are high-value events that deserve explicit tracking.

```typescript
'use server'

import { prisma } from "@/lib/prisma"
import { AuditService } from "@/features/audit-log/services/audit.service"
import { getAuthenticatedUser } from "@/features/auth/server/api-auth"

export async function updateOrderStatus(id: string, status: string) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");

  // Snapshot BEFORE the change for the diff
  const existing = await prisma.order.findUnique({
    where: { id },
    select: { status: true }
  });

  if (!existing) throw new Error("Order not found");

  const updated = await prisma.order.update({
    where: { id },
    data: { 
      status,
      updatedById: user.id // Audit Trail updates inline
    }
  });

  // Explicit log action
  await AuditService.log({
    entityName: "Order",
    entityId: id,
    action: "STATUS_CHANGE",
    previousData: { status: existing.status },
    currentData: { status },
  });

  return updated;
}
```

---

## 5. Query Patterns

### 5.1 — Document History (for a specific Order)

```typescript
const history = await prisma.auditLog.findMany({
  where: {
    entityName: "Order",
    entityId: orderId,
  },
  orderBy: {
    createdAt: "desc"
  }
});
```

### 5.2 — Today's Activity: All Actions by a User

```typescript
const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);

const activity = await prisma.auditLog.findMany({
  where: {
    actorId: userId,
    createdAt: {
      gte: startOfDay
    }
  },
  orderBy: {
    createdAt: "desc"
  }
});
```
