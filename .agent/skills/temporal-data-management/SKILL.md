---
name: temporal-data-management
description: Procedures and algorithms for managing time-based record overlapping, timeline surgery, and atomic price/batch synchronization.
---

# Temporal Data Management (Timeline Surgery)

This skill provides the procedural knowledge for managing records with `startDate` and `endDate` where overlapping is forbidden or requires automatic resolution.

## 1. The "Clean Path" Algorithm
When inserting or updating a record that must occupy a specific time range (e.g., a Buying Price), use the "Clean Path" approach to resolve conflicts automatically instead of throwing validation errors.

### Past Conflict (The Truncation)
If an existing record starts **before** the new record's `startDate` but ends **after** (or has no end date):
- Truncate the existing record by setting its `endDate` to exactly 1 second (or 1ms) before the new `startDate`.
- `autoEndDate = new Date(new Date(newStartDate).getTime() - 1000).toISOString()`

### Future Conflict (The Shadowing)
If an existing record starts **at or after** the new record's `startDate`:
- If the new record is intended to be "Present/Active" (infinite `endDate`), the existing future record is considered shadowed and should be **deleted**.
- This ensures the latest user action always "claims" the future timeline.

## 2. Mandatory Transaction Safety
Any operation involving timeline surgery (Multiple updates/deletes) **MUST** be wrapped in a database transaction.

```typescript
const transactionID = await payload.db.beginTransaction()
try {
  const req = { transactionID }
  // 1. Truncate past records
  // 2. Delete future shadowed records
  // 3. Insert/Update new record
  await payload.db.commitTransaction(transactionID)
} catch (error) {
  await payload.db.rollbackTransaction(transactionID)
  throw error
}
```

## 3. "Latest Wins" Master Sync
For "Master Data" fields (e.g., `currentBuyingPrice` on a Product) that denormalize scheduled data:
- Prioritize the record with the absolute latest `startDate`, regardless of whether that date has passed.
- This ensures the UI reflects the user's latest administrative action immediately, even for future scheduled batches.

## 4. UI Safety Rails
If timeline surgery is "destructive" (deletes future records), implement UI rails:
- Restrict `startDate` selection to "Today or Future" (using `calendarProps.disabled.before`) to prevent accidental historical corruption.
- Clearly label start/end inputs to indicate they override existing schedules.
