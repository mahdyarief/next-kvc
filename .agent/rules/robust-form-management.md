---
description: Best practices for building robust, secure, and performant forms
globs: ["src/features/**/components/**/*-form*.tsx", "src/features/**/components/**/use-*-form.ts"]
---

# Robust Form Management

When building forms—especially complex ones with editing, readonly states, and dirty-state tracking—you MUST adhere to the following best practices to guarantee data integrity, excellent UX, and optimization.

## 1. Centralized & Derived State Logic
Always use a single custom hook (`use-something-form.ts`) to manage form state. 
Do NOT create independent states that could contradict each other. Instead, derive "impossible states" out of existence.

```typescript
// ✅ DO: Derive readonly state from underlying truth states
const isClosed = status === 'close';
const isReadonly = (!!id && !isEditing) || isClosed;

// ❌ DON'T: Create independent states that can get out of sync
const [isReadonly, setIsReadonly] = useState(false);
const [isClosed, setIsClosed] = useState(false);
```

## 2. Dirty-State Checking for Update Optimization
Before submitting an update to the server, always check if the user actually changed anything. This saves database load and API calls.
Use `initialDataRef` to capture the baseline state when data is first fetched.

```typescript
// Store the original data baseline
const initialDataRef = React.useRef({
  warehouse: initialOrder.warehouse,
  notes: initialOrder.notes || '',
  // For complex objects/arrays, stringify to easily compare deep equality
  items: JSON.stringify(initialOrder.items),
});

// Compare before submission
if (id && initialDataRef.current) {
  const currentItemsJson = JSON.stringify(items);
  const isDirty =
    warehouse !== initialDataRef.current.warehouse ||
    notes !== initialDataRef.current.notes ||
    currentItemsJson !== initialDataRef.current.items;

  if (!isDirty) {
    toast.info('No changes to save');
    setIsEditing(false);
    return;
  }
}
```

## 3. Revert Data on Cancel (Cancel Edit Mode)
When a user clicks "Edit", makes changes, and then clicks "Cancel", you MUST instantly revert those dirty changes in the UI back to the `initialDataRef` baseline so they do not persist as unsaved/fake values.

```typescript
// ✅ DO: Revert UI state back to baseline when cancelling
const handleEditToggle = useCallback((editing: boolean) => {
  if (!editing && initialDataRef.current) {
    setWarehouse(initialDataRef.current.warehouse);
    setNotes(initialDataRef.current.notes);
    setItems(JSON.parse(initialDataRef.current.items));
  }
  setIsEditing(editing);
}, []);
```

## 4. UI Mutability Protection
If the form should not be edited (e.g., `isReadonly` is true), ensure you pass `disabled={isReadonly}` or `readOnly={isReadonly}` entirely through to ALL nested input fields (Inputs, Textareas, DatePickers, Comboboxes).

```tsx
<Input
  value={orderNumber}
  onChange={(e) => setOrderNumber(e.target.value)}
  readOnly={isReadonly}
  disabled={isReadonly} // ALWAYS disable fields visually to signal immutability 
/>

<Textarea
  value={notes}
  disabled={isReadonly} 
/>
```

## 5. Prevent Future Date Fakery
If a form operates on localized transactional dates (like "Create Order Date" or "Restock Date"), verify if the date should never technically exceed "today".
Use built-in disabled parameters for DatePickers:
```tsx
<DatePicker
  date={date}
  onDateChange={setDate}
  disabled={isReadonly}
  calendarProps={{ disabled: { after: new Date() } }} // Prevent future dates
/>
```
